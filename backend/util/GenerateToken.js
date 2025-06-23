import jwt from "jsonwebtoken";

export const generateTokens = (userID) => {
  // Validate environment variables
  if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
    throw new Error("Missing JWT secret keys");
  }

  try {
    const accessToken = jwt.sign(
      { id: userID },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { id: userID },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
    );

    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error("Failed to generate tokens: " + err.message);
  }
};
