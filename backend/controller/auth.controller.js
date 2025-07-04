import User from "../model/user.model.js";
import { generateTokens } from "../util/GenerateToken.js";

export const register = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    // Basic check for missing fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    //Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use." });
    }

    const newUser = new User({ firstName, lastName, email, password });
    await newUser.save();

    const { accessToken, refreshToken } = generateTokens(newUser._id);

    newUser.refreshTokens.push({ token: refreshToken });
    await newUser.save();

    return res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // HTTPS only in production
        sameSite: "None", // Or "Lax" depending on your use case
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(200)
      .json({
        message: "Login successful",
        user: {
          id: newUser._id,
          email: newUser.email,
          fullName: newUser.fullName,
        },
        accessToken, // still sent in response
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }

  try {
    const existingUser = await User.findOne({ email }).select("+password");

    if (!existingUser) {
      return res.status(404).json({ message: "User is not registered" });
    }

    const isPasswordCorrect = await existingUser.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(404).json({ message: "Incorrect password" });
    }

    const { accessToken, refreshToken } = generateTokens(existingUser._id);

    existingUser.refreshTokens.push({ token: refreshToken });
    await existingUser.save();

    return res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .cookie("token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
        maxAge: 15 * 60 * 1000, // 15 minutes, for example
      })
      .status(200)
      .json({
        message: "Login successful",
        user: {
          id: existingUser._id,
          email: existingUser.email,
          fullName: existingUser.fullName,
        },
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong." });
  }
};
