import fs from "fs/promises";
import path from "path";

export const deleteFile = async (filePath) => {
  const resolvedFilePath = path.resolve(filePath);
  try {
    await fs.access(resolvedFilePath);
    await fs.unlink(resolvedFilePath);
    console.log(`File deleted at ${resolvedFilePath}`);
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log(`File does not exist at ${resolvedFilePath}`);
    } else {
      console.error(`Error deleting file at ${resolvedFilePath}:`, err);
    }
  }
};

export const generateRandomCode = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result.toUpperCase();
};
