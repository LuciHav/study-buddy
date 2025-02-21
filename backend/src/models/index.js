import Post from "./Post.js";
import User from "./User.js";

User.hasMany(Post, { foreignKey: "userId" });
Post.belongsTo(User, { foreignKey: "userId" });
