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

    for (const file of req.files) {
      const result = await CloudinaryHelper.uploadSingle(file.buffer);
      images.push({ url: result.secure_url, publicId: result.public_id });
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

    res.status(200).json(newCar);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const allCars = async (req, res, next) => {
  try {
    // 1. Extract pagination & sorting query params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortOrder = req.query.sort === "asc" ? 1 : -1; // asc or desc

    const skip = (page - 1) * limit;

    // 2. Fetch cars with pagination and sorting
    const cars = await Car.find()
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(limit);

    // 3. Get total count for frontend pagination info
    const totalCars = await Car.countDocuments();

    // 4. Send response
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
  } catch (error) {}
};

export const editCar = async (req, res, next) => {
  try {
  } catch (error) {}
};

export const deleteCar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const response = await Car.findByIdAndDelete(id);

    res.status(200).json({ message: "deleted successfully" });
  } catch (error) {}
};
