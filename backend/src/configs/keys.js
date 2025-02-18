export default {
  app: {
    environment: process.env.NODE_ENV,
  },
  server: {
    port: process.env.PORT,
  },
  frontend: {
    url: process.env.FRONTEND_URL
  },
  database: {
    databaseName: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    host: process.env.MYSQL_HOST,
  },
  email: {
    postmark: process.env.POSTMARK_API_KEY,
    senderName: process.env.EMAIL_SENDER_NAME,
    senderAddress: process.env.EMAIL_SENDER_ADDRESS,
  },
  jwt: {
    secret: process.env.JWT_SECRET_KEY,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
};
