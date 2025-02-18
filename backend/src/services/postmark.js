import postmark from "postmark";
import keys from "../configs/keys.js";

const client = new postmark.ServerClient(keys.email.postmark);

const sendEmailWithTemplate = async (receiverEmail, template, data) => {
  const templateData = {
    welcome: {
      product_name: "Study Buddy",
      name: data.firstName,
      verification_code: data.verificationCode,
      company_name: "Study Buddy",
      company_address: "Itahari, Nepal",
    },
    "password-reset": {
      product_name: "Study Buddy",
      name: data.firstName,
      action_url: `${keys.frontend.url}/reset-password?verificationCode=${data.verificationCode}`,
      support_url: `${keys.frontend.url}/contact-us`,
      company_name: "Study Buddy",
      company_address: "Itahari, Nepal",
    },
  };

  const templateModel = templateData[template];

  if (!templateModel) {
    console.error(`Template ${template} not found in dynamic data.`);
    return;
  }

  try {
    const response = await client.sendEmailWithTemplate({
      From: `${keys.email.senderName} <${keys.email.senderAddress}>`,
      To: receiverEmail,
      TemplateAlias: template,
      TemplateModel: templateModel,
    });

    console.log("📧 Email sent successfully: ", response);
  } catch (error) {
    console.error(`Error sending email with template ${template}: `, error);
  }
};

export default sendEmailWithTemplate;
