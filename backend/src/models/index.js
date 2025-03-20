import User from "./User.js";
import Post from "./Post.js";
import Comment from "./Comment.js";
import Report from "./Report.js";
import Reaction from "./Reaction.js";

User.hasMany(Post, { foreignKey: "userId" });
Post.belongsTo(User, { foreignKey: "userId" });

Comment.belongsTo(User, { foreignKey: "userId", as: "user" });
Comment.belongsTo(Post, { foreignKey: "postId", as: "post", onDelete: "CASCADE" });
Post.hasMany(Comment, { foreignKey: "postId", as: "comments", onDelete: "CASCADE" });
Comment.belongsTo(Comment, { foreignKey: "parentId", as: "parentComment" });
Comment.hasMany(Comment, { foreignKey: "parentId", as: "replies" });

User.hasMany(Report, { foreignKey: "userId", as: "reports" });
Report.belongsTo(User, { foreignKey: "userId", as: "user" });

Post.hasMany(Report, { foreignKey: "postId", as: "reports" });
Report.belongsTo(Post, { foreignKey: "postId", as: "post" });

User.hasMany(Reaction, { foreignKey: "userId", as: "reactions" });
Reaction.belongsTo(User, { foreignKey: "userId", as: "user" });

Post.hasMany(Reaction, { foreignKey: "postId", as: "reactions" });
Reaction.belongsTo(Post, { foreignKey: "postId", as: "post" });