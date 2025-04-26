import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";
import keys from "../configs/keys.js";
import { EMAIL_TEMPLATE_SUBJECTS } from "../constants/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
  host: keys.email.host,
  port: keys.email.port,
  secure: keys.email.port === 465,
  auth: {
    user: keys.email.user,
    pass: keys.email.password,
  },
});

const sendEmailWithTemplate = async (receiverEmail, template, data) => {
  try {
    const templatePath = path.join(
      __dirname,
      "..",
      "templates",
      "emails",
      `${template}.ejs`
    );

    // Render EJS template
    const htmlContent = await ejs.renderFile(templatePath, {
      ...data,
      product_name: "Study Buddy",
      company_name: "Study Buddy",
      company_address: "Itahari, Nepal",
      frontend_url: keys.frontend.url,
    });

    const emailConfig = {
      from: {
        name: keys.email.senderName,
        address: keys.email.senderAddress,
      },
      to: receiverEmail,
      subject:
        EMAIL_TEMPLATE_SUBJECTS[template] ||
        `Study Buddy - ${template.charAt(0).toUpperCase() + template.slice(1)}`,
      html: htmlContent,
    };

    const info = await transporter.sendMail(emailConfig);
    console.log(`Email sent successfully: ${info.messageId}`);

    return info;
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw new Error("Failed to send email. Please try again later.");
  }
};

export default sendEmailWithTemplate;
