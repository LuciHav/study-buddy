import { deleteFile } from "../utils/helpers.js";

const validate = (schema) => async (req, res, next) => {
  try {
    req.body = await schema.parseAsync(req.body);
    console.log("validated Body: ", req.body);

    next();
  } catch (error) {
    console.log(error);

    const files = req.file ? [req.file] : req.files || [];
    await Promise.all(files.map(({ path }) => deleteFile(path)));

    res.status(400).json({
      success: false,
      message: error.errors?.[0]?.message || "Validation error occurred.",
      errors: error.errors?.map((err) => err.message),
    });
  }
};

export default validate;
