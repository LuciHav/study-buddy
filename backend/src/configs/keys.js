export default {
  app: {
    environment: process.env.NODE_ENV,
  },
  server: {
    port: process.env.PORT,
  },
  frontend: {
    url: process.env.FRONTEND_URL,
  },
  database: {
    databaseName: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    host: process.env.MYSQL_HOST,
  },
  admin: {
    firstName: process.env.ADMIN_FIRST_NAME,
    lastName: process.env.ADMIN_LAST_NAME,
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
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
