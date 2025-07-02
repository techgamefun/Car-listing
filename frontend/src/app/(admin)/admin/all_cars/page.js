"use client";

import { useEffect, useState } from "react";
import API from "@/util/axios";
import Image from "next/image";

export default function AllCarsPage() {
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await API.get("/cars");

        if (response.status === 200) {
          setCars(response.data.cars);
          console.log(response.data.cars[0].images[0].url);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchCars();
  }, []);

  const handleDelete = async (carId) => {
    try {
      const response = await API.delete(`/cars/${carId}`);
      if (response.status === 200) {
        setCars(cars.filter((car) => car._id !== carId));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="w-full py-2 bg-gray-100">
      <div className="flex flex-col gap-2">
        {/* Desktop Header - Hidden on mobile */}
        <div className="hidden md:block border-b sticky top-0 bg-gray-100 border-gray-400 z-10 w-full">
          <div className="grid grid-cols-[80px_1fr_1fr_120px_80px_100px_140px] gap-4 p-2 items-center">
            <div>Photo</div>
            <div>Brand</div>
            <div>Model</div>
            <div>Price</div>
            <div>Year</div>
            <div>Color</div>
            <div>Actions</div>
          </div>
        </div>

        {/* Car List */}
        {cars?.map((car) => (
          <div key={car?._id} className="mx-2">
            {/* Desktop Layout */}
            <div className="hidden text-gray-900 md:grid grid-cols-[80px_1fr_1fr_120px_80px_100px_140px] gap-4 rounded-md overflow-hidden p-2 items-center border bg-gray-50 border-gray-300">
              <div className="relative h-20 w-20 rounded-md overflow-hidden">
                <Image
                  src={car?.images[0]?.url}
                  alt={`${car?.brand} ${car?.model}`}
                  fill
                  className="object-cover"
                  priority
                  sizes="80px"
                />
              </div>
              <div className="font-medium">{car?.brand}</div>
              <div>{car?.model}</div>
              <div className="font-semibold">
                ₹ {car?.price.toLocaleString("en-IN")}
              </div>
              <div>{car?.year}</div>
              <div>{car?.color}</div>
              <div className="flex gap-2 text-white text-sm">
                <button className="cursor-pointer bg-blue-500 hover:bg-blue-600 py-1 px-2 rounded-lg">
                  Edit
                </button>
                <button
                  className="cursor-pointer bg-red-500 hover:bg-red-600 py-1 px-2 rounded-lg"
                  onClick={() => handleDelete(car._id)}
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden bg-gray-50 border border-gray-300 rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                  <Image
                    src={car?.images[0]?.url}
                    alt={`${car?.brand} ${car?.model}`}
                    fill
                    className="object-cover"
                    priority
                    sizes="64px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg text-gray-900 truncate">
                    {car?.brand} {car?.model}
                  </h3>
                  <p className="text-lg font-bold text-blue-600">
                    ₹ {car?.price.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Year:</span>
                  <span className="ml-2 text-gray-900">{car?.year}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Color:</span>
                  <span className="ml-2 text-gray-900">{car?.color}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button className="cursor-pointer flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium">
                  Edit
                </button>
                <button
                  className="cursor-pointer flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg text-sm font-medium"
                  onClick={() => handleDelete(car._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
