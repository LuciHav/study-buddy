import Post from "../models/Post.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";
import Reaction from "../models/Reaction.js";
import { deleteFile } from "../utils/helpers.js";
import HttpError from "../utils/HttpError.js";

export const createPost = async (req, res) => {
  const { body, user, file } = req;

  const post = await Post.create({
    ...body,
    image: file ? file.path : null,
    userId: user.id,
  });

  res.status(201).json({
    success: true,
    message: "Post created successfully",
    post,
  });
};

export const getAllPosts = async (req, res) => {
  const { user } = req;
  const posts = await Post.findAll({
    include: [{ model: User, attributes: ["firstName", "lastName", "image"] }],
  });

  // Check if the user has reacted on each post
  const postsWithDetails = await Promise.all(
    posts.map(async (post) => {
      const reaction = await Reaction.findOne({
        where: { userId: user.id, postId: post.id },
      });

      const totalLikes = await Reaction.count({
        where: { postId: post.id, reaction: true }, // Count only likes
      });

      const totalDislikes = await Reaction.count({
        where: { postId: post.id, reaction: false }, // Count only dislikes
      });

      const totalComments = await Comment.count({
        where: { postId: post.id },
      });

      return {
        ...post.toJSON(),
        reaction: reaction ? reaction.reaction : null,
        totalLikes,
        totalDislikes,
        totalComments,
      };
    })
  );

  res.status(200).json({
    success: true,
    message: "Posts retrieved successfully",
    posts: postsWithDetails,
  });
};

export const getPostById = async (req, res) => {
  const { id } = req.params;
  const { user } = req;

  const post = await Post.findByPk(id, {
    include: [{ model: User, attributes: ["firstName", "lastName", "image"] }],
  });

  if (!post) {
    throw new HttpError(404, "Post not found");
  }

  // Check if the user has reacted on the post
  const reaction = await Reaction.findOne({
    where: { userId: user.id, postId: id },
  });

  // Get total reactions, dislike, and comments
  const totalLikes = await Reaction.count({
    where: { postId: id, reaction: true },
  });

  const totalDislikes = await Reaction.count({
    where: { postId: id, reaction: false },
  });

  const totalComments = await Comment.count({
    where: { postId: id },
  });

  res.status(200).json({
    success: true,
    message: "Post retrieved successfully",
    post: {
      ...post.toJSON(),
      reaction: reaction ? reaction.reaction : null,
      totalLikes,
      totalDislikes,
      totalComments,
    },
  });
};

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, description, image, subject } = req.body;

  const post = await Post.findByPk(id);

  if (!post) {
    throw new HttpError(404, "Post not found");
  }

  post.title = title || post.title;
  post.description = description || post.description;
  post.image = image || post.image;
  post.subject = subject || post.subject;

  await post.save();

  res.status(200).json({
    success: true,
    message: "Post updated successfully",
    post,
  });
};

export const deletePost = async (req, res) => {
  const { id } = req.params;

  const post = await Post.findByPk(id);

  if (!post) {
    throw new HttpError(404, "Post not found");
  }

  await post.destroy();
  post.image && (await deleteFile(post.image));

  res.status(200).json({
    success: true,
    message: "Post deleted successfully",
  });
};
