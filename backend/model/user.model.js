import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: [true, "Please enter your first name"],
    maxlength: [30, "First name cannot exceed 30 characters"],
    minlength: [1, "firstName must be at least 1 character"],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, "Please enter your last name"],
    maxlength: [30, "Last name cannot exceed 30 characters"],
    minlength: [1, "lastName must be at least 1 character"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    validate: {
      validator: function (v) {
        return validator.isEmail(v);
      },
      message: "Please enter a valid email address",
    },
    lowercase: true,
    trim: true,
    index: true,
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [8, "Password must be at least 8 characters"],
    select: false,
  },

  refreshTokens: [
    {
      token: { type: String, required: true },
      issuedAt: { type: Date, default: Date.now },
      expiresAt: { type: Date },
      deviceInfo: { type: String }, // Optional: e.g., "Chrome on Windows"
    },
  ],
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
