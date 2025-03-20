import Reaction from "../models/Reaction.js";

export const updateReaction = async (req, res) => {
  const { postId } = req.params;
  const { userReaction } = req.body;
  const { user } = req;

  let reaction = await Reaction.findOne({ where: { postId, userId: user.id } });

  if (!reaction) {
    // If reaction doesn't exist, create a new one
    reaction = await Reaction.create({ userId: user.id, postId, reaction: userReaction });
    return res.status(201).json({
      success: true,
      message: "Reaction added successfully",
      reaction,
    });
  }

  if (reaction.reaction === userReaction) {
    // If reaction exists and is the same as userReaction, remove it
    await reaction.destroy();
    return res.status(200).json({
      success: true,
      message: "Reaction removed successfully",
    });
  }

  // If reaction exists and is different, update it
  reaction.reaction = userReaction;
  await reaction.save();
  return res.status(200).json({
    success: true,
    message: "Reaction updated successfully",
    reaction,
  });
};
