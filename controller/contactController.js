import contactModel from "../model/contactModel.js";

export const createcontact = async (req, res) => {
  try {
    const { name, phone, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email and message are required",
      });
    }

    const contact = await contactModel.create({
      name: name.trim(),
      phone: phone?.trim() || "",
      email: email.trim().toLowerCase(),
      subject: subject?.trim() || "",
      message: message.trim(),
      status: "new",
    });

    return res.status(201).json({
      success: true,
      message: "Your message has been sent successfully",
      contact,
    });
  } catch (error) {
    console.error("Create contact error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to send your message",
    });
  }
};

export const getContacts = async (req, res) => {
  try {
    const contacts = await contactModel.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      contacts,
    });
  } catch (error) {
    console.error("Get contacts error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch contact messages",
    });
  }
};

export const markContactAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await contactModel.findByIdAndUpdate(
      id,
      { status: "read" },
      { new: true },
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Contact message marked as read",
      contact,
    });
  } catch (error) {
    console.error("Mark contact as read error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update contact message",
    });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    const contact = await contactModel.findByIdAndDelete(id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Contact message deleted successfully",
    });
  } catch (error) {
    console.error("Delete contact error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete contact message",
    });
  }
};
