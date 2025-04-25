import User from "./User.js";
import Post from "./Post.js";
import Comment from "./Comment.js";
import Report from "./Report.js";
import Reaction from "./Reaction.js";
import Booking from "./Booking.js";
import Tutor from "./Tutor.js";
import Message from "./Message.js";

User.hasMany(Post, { foreignKey: "userId" });
Post.belongsTo(User, { foreignKey: "userId" });

User.hasOne(Tutor, {foreignKey: "userId", as: "tutorProfile", onDelete: "CASCADE"});
Tutor.belongsTo(User, {foreignKey: "userId", as: "user"});

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

Booking.belongsTo(User, { foreignKey: "userId", as: "user" });
Booking.belongsTo(User, { foreignKey: "tutorId", as: "tutor" });
User.hasMany(Booking, { foreignKey: "userId", as: "userBookings" });
User.hasMany(Booking, { foreignKey: "tutorId", as: "tutorBookings" });

User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
User.hasMany(Message, { foreignKey: 'receiverId', as: 'receivedMessages' });

Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });