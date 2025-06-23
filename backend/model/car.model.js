import mongoose, { Schema } from "mongoose";

const carSchema = new Schema(
  {
    brand: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      minlength: 1,
    },
    model: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      minlength: 1,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

const Car = mongoose.model("Car", carSchema);

export default Car;
