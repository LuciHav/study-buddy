import Post from "../models/Post.js";
import User from "../models/User.js";
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
  const posts = await Post.findAll({
    include: [{ model: User, attributes: ["firstName", "lastName", "image"] }],
  });

  res.status(200).json({
    success: true,
    message: "Posts retrieved successfully",
    posts,
  });
};

export const getPostById = async (req, res) => {
  const { id } = req.params;

  const post = await Post.findByPk(id);

  if (!post) {
    throw new HttpError(404, "Post not found");
  }

  res.status(200).json({
    success: true,
    message: "Post retrieved successfully",
    post,
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

  res.status(200).json({
    success: true,
    message: "Post deleted successfully",
  });
};
