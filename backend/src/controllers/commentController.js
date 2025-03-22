import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import HttpError from "../utils/HttpError.js";

export const createComment = async (req, res, _next) => {
  const { postId } = req.params;
  const { parentId, comment } = req.body;
  const { user, file } = req;

  const post = await Post.findByPk(postId);
  if (!post) throw new HttpError(404, `Post with id #${postId} not found.`);

  if (parentId) {
    const parentComment = await Comment.findByPk(parentId);
    if (!parentComment) throw new HttpError(404, `Parent comment not found.`);
  }

  const newComment = await Comment.create({
    comment,
    image: file ? file.path : null,
    postId,
    userId: user.id,
    parentId: parentId || null,
  });

  res.status(201).json({
    success: true,
    message: "Comment added successfully",
    comment: {
      id: newComment.id,
      comment,
      image: file ? file.path : null,
      parentId: parentId || null,
      createdAt: newComment.createdAt,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
      },
      replies: [],
    },
  });
};

export const getAllComment = async (req, res, _next) => {
  const { postId } = req.params;

  const post = await Post.findByPk(postId);
  if (!post) throw new HttpError(404, `Post with id #${postId} not found.`);

  // Fetch all comments without nesting
  const comments = await Comment.findAll({
    where: { postId },
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "firstName", "lastName", "image"],
      },
    ],
    order: [["createdAt", "ASC"]],
  });

  const commentMap = {};
  const rootComments = [];

  comments.forEach((comment) => {
    commentMap[comment.id] = { ...comment.toJSON(), replies: [] };
  });

  comments.forEach((comment) => {
    if (comment.parentId) {
      commentMap[comment.parentId]?.replies.push(commentMap[comment.id]);
    } else {
      rootComments.push(commentMap[comment.id]);
    }
  });

  res.status(200).json({
    success: true,
    message: "Comments fetched successfully",
    comments: rootComments,
  });
};

export const getCommentById = async (req, res, _next) => {
  const { commentId } = req.params;

  const comment = await Comment.findByPk(commentId, {
    include: [
      { model: User, attributes: ["id", "firstName", "lastName", "image"] },
      {
        model: Comment,
        as: "replies",
        include: {
          model: User,
          attributes: ["id", "firstName", "lastName", "image"],
        },
      },
    ],
  });

  if (!comment)
    throw new HttpError(404, `Comment with id #${commentId} not found.`);

  res.status(200).json({
    success: true,
    message: "Comment fetched successfully",
    comment,
  });
};

export const updateComment = async (req, res, _next) => {
  const { commentId } = req.params;
  const { comment } = req.body;
  const { user } = req;

  const existingComment = await Comment.findByPk(commentId);
  if (!existingComment)
    throw new HttpError(404, `Comment with id #${commentId} not found.`);

  if (existingComment.userId !== user.id)
    throw new HttpError(
      403,
      "Unauthorized: You can only edit your own comments."
    );

  existingComment.comment = comment;
  await existingComment.save();

  res.status(200).json({
    success: true,
    message: "Comment updated successfully",
    comment,
  });
};

export const deleteComment = async (req, res, _next) => {
  const { commentId } = req.params;
  const { user } = req;

  const comment = await Comment.findByPk(commentId);
  if (!comment)
    throw new HttpError(404, `Comment with id #${commentId} not found.`);

  if (comment.userId !== user.id)
    throw new HttpError(
      403,
      "Unauthorized: You can only delete your own comments."
    );

  await comment.destroy();

  res.status(200).json({
    success: true,
    message: "Comment deleted successfully",
  });
};
