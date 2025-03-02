import User from "./User.js";
import Post from "./Post.js";
import Comment from "./Comment.js";

User.hasMany(Post, { foreignKey: "userId" });
Post.belongsTo(User, { foreignKey: "userId" });

Comment.belongsTo(User, { foreignKey: "userId", as: "user" });
Comment.belongsTo(Post, { foreignKey: "postId", as: "post" });
Comment.belongsTo(Comment, { foreignKey: "parentId", as: "parentComment" });
Comment.hasMany(Comment, { foreignKey: "parentId", as: "replies" });
