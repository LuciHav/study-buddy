import { Op } from "sequelize";
import Post from "../models/Post.js";
import Tutor from "../models/Tutor.js";
import User from "../models/User.js";

export const search = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.json({
      success: true,
      results: [],
    });
  }

  // Search posts
  const posts = await Post.findAll({
    where: {
      [Op.or]: [
        { title: { [Op.like]: `%${query}%` } },
        { description: { [Op.like]: `%${query}%` } },
        { subject: { [Op.like]: `%${query}%` } },
      ],
    },
    limit: 3,
    order: [["createdAt", "DESC"]],
  });

  // Search tutors
  const tutors = await Tutor.findAll({
    include: [
      {
        model: User,
        as: "user",
        attributes: ["firstName", "lastName", "image"],
        where: {
          [Op.or]: [
            { firstName: { [Op.like]: `%${query}%` } },
            { lastName: { [Op.like]: `%${query}%` } },
          ],
        },
      },
    ],
    limit: 3,
  });

  const formattedResults = [
    ...posts.map((post) => ({
      id: post.id,
      type: "post",
      title: post.title,
      description: post.description?.substring(0, 100) + "...",
      image: post.image,
    })),
    ...tutors.map((tutor) => ({
      id: tutor.id,
      type: "tutor",
      title: `${tutor.user.firstName} ${tutor.user.lastName}`,
      description: tutor.bio?.substring(0, 100) + "...",
      image: tutor.user.image,
    })),
  ];

  res.json({
    success: true,
    results: formattedResults,
  });
};
