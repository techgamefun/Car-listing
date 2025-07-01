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
    images: {
      type: [
        {
          url: String, // Full Cloudinary URL
          publicId: String, // Cloudinary public_id
          order: Number, // Display order
        },
      ],
      default: [],
      validate: {
        validator: function (arr) {
          return arr.length <= 10;
        },
        message: "Cannot have more than 10 images",
      },
    },
    color: String,
    year: {
      type: Number,
      required: true,
      min: 1886, // First car ever made (validation)
      max: new Date().getFullYear() + 1, // Allow next year models
    },
    vin: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      validate: {
        validator: function (v) {
          return /^[A-HJ-NPR-Z0-9]{17}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid VIN`,
      },
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "sold", "reserved"],
      default: "available",
    },
  },
  { timestamps: true }
);

const Car = mongoose.model("Car", carSchema);

export default Car;
