export const ROLES = {
  USER: "user",
  TUTOR: "tutor",
  ADMIN: "admin",
};

export const EMAIL_TEMPLATES = {
  WELCOME: "welcome",
  PASSWORD_RESET: "password-reset",
};

export const SUBJECTS = {
  MATHEMATICS: "Mathematics",
  PHYSICS: "Physics",
  CHEMISTRY: "Chemistry",
  BIOLOGY: "Biology",
  COMPUTER_SCIENCE: "Computer Science",
  HISTORY: "History",
  GEOGRAPHY: "Geography",
  ENGLISH: "English",
  LITERATURE: "Literature",
  ECONOMICS: "Economics",
  POLITICAL_SCIENCE: "Political Science",
  SOCIOLOGY: "Sociology",
  PSYCHOLOGY: "Psychology",
  PHILOSOPHY: "Philosophy",
  OTHER: "Other",
};

export const REPORT_STATUS = {
  PENDING: "pending",
  REVIEWED: "reviewed",
  RESOLVED: "resolved",
};

export const BOOKING_STATUS = {
  REQUESTED: "requested",   // Initial state
  APPROVED: "approved",     // Tutor approved
  REJECTED: "rejected",     // Tutor rejected
  PENDING: "pending",       // Payment initiated
  CONFIRMED: "confirmed",   // Payment confirmed
  CANCELLED: "cancelled",   // Booking cancelled
};
