import cloudinary from "../config/cloudinary.js";
import Car from "../model/car.model.js";
import CloudinaryHelper from "../util/CloudinaryHelper.js";

export const createCar = async (req, res, next) => {
  console.log(req.body);
  try {
    const { brand, model, color, year, vin, price, status } = req.body;

    if (!brand || !model || !price || !year || !vin) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const images = [];

    // Upload images to Cloudinary
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await CloudinaryHelper.uploadSingle(file.buffer);
        images.push({ url: result.secure_url, publicId: result.public_id });
      }
    }

    const newCar = new Car({
      brand,
      model,
      images,
      color,
      year,
      vin,
      price,
      status,
    });

    await newCar.save();
    res.status(201).json({ message: "Car created successfully", car: newCar });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const allCars = async (req, res, next) => {
  try {
    // Extract pagination & sorting query params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortOrder = req.query.sort === "asc" ? 1 : -1;
    const skip = (page - 1) * limit;

    // Fetch cars with pagination and sorting
    const cars = await Car.find()
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(limit);

    // Get total count for frontend pagination info
    const totalCars = await Car.countDocuments();

    return res.status(200).json({
      success: true,
      page,
      limit,
      totalPages: Math.ceil(totalCars / limit),
      totalCars,
      cars,
    });
  } catch (error) {
    console.error("Error fetching cars:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch cars",
    });
  }
};

export const getCarByid = async (req, res, next) => {
  try {
    const { id } = req.params;
    const car = await Car.findById(id);

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    res.status(200).json({ success: true, car });
  } catch (error) {
    console.error("Error fetching car:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCar = async (req, res, next) => {
  try {
    const { brand, model, color, year, vin, price, status, imagesToDelete } =
      req.body;
    const { id } = req.params;

    // Find the existing car
    const existingCar = await Car.findById(id);
    if (!existingCar) {
      return res.status(404).json({ message: "Car not found" });
    }

    // Start with existing images
    let updatedImages = [...existingCar.images];

    // Handle image deletions
    if (imagesToDelete) {
      let imagesToDeleteArray = [];

      // Parse imagesToDelete if it's a string
      if (typeof imagesToDelete === "string") {
        try {
          imagesToDeleteArray = JSON.parse(imagesToDelete);
        } catch (e) {
          console.error("Failed to parse imagesToDelete:", e);
          return res
            .status(400)
            .json({ message: "Invalid imagesToDelete format" });
        }
      } else if (Array.isArray(imagesToDelete)) {
        imagesToDeleteArray = imagesToDelete;
      }

      // Delete images from Cloudinary and remove from array
      for (const imageToDelete of imagesToDeleteArray) {
        // Delete from Cloudinary
        if (imageToDelete.publicId) {
          await CloudinaryHelper.deleteFile(imageToDelete.publicId);
        }

        // Remove from images array
        updatedImages = updatedImages.filter(
          (img) => img._id.toString() !== imageToDelete._id
        );
      }
    }

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await CloudinaryHelper.uploadSingle(file.buffer);
        updatedImages.push({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    }

    // Update the car with new data
    const updatedCar = await Car.findByIdAndUpdate(
      id,
      {
        brand,
        model,
        color,
        year,
        vin,
        price,
        status,
        images: updatedImages,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Car updated successfully",
      car: updatedCar,
    });
  } catch (error) {
    console.error("Error updating car:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteCar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const car = await Car.findById(id);

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    // Delete all images from Cloudinary
    await Promise.all(
      car.images.map((img) => CloudinaryHelper.deleteFile(img.publicId))
    );

    // Delete the car document
    await Car.findByIdAndDelete(id);

    res.status(200).json({ message: "Car deleted successfully" });
  } catch (error) {
    console.error("Error deleting car:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
