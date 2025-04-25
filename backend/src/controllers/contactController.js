import Contact from "../models/Contact.js";
import HttpError from "../utils/HttpError.js";

export const createContact = async (req, res) => {
  const contact = await Contact.create(req.body);

  res.status(201).json({
    success: true,
    message: "Message sent successfully! We'll get back to you soon.",
    contact,
  });
};

export const getAllContacts = async (req, res) => {
  const contacts = await Contact.findAll({
    order: [["createdAt", "DESC"]],
  });

  res.json({
    success: true,
    message: "Contacts fetched successfully",
    contacts,
  });
};

export const updateContactStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const contact = await Contact.findByPk(id);
  if (!contact) {
    throw new HttpError(404, "Contact message not found");
  }

  contact.status = status;
  await contact.save();

  res.json({
    success: true,
    message: "Contact status updated successfully",
    contact,
  });
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;

  const contact = await Contact.findByPk(id);
  if (!contact) {
    throw new HttpError(404, "Contact message not found");
  }

  await contact.destroy();

  res.json({
    success: true,
    message: "Contact deleted successfully",
  });
};
