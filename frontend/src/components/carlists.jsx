"use client";

import { useEffect, useState } from "react";
import API from "@/util/axios";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CarList() {
  const [cars, setCars] = useState([]);
  const router = useRouter();

  const handleClick = (id) => {
    router.push(`/cars/${id.replace(/\s+/g, "-")}`);
  };

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await API.get("/cars");

        if (response.status === 200) {
          setCars(response.data.cars);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchCars();
  }, []);

  return (
    <div className="grid md:grid-cols-4 grid-cols-1 h-full w-full gap-2 p-2">
      {cars?.map((car) => (
        <div
          className="w-full max-w-sm rounded overflow-hidden shadow-lg flex flex-col justify-between"
          key={car._id}
        >
          <div className="relative w-full h-64 sm:h-60 md:h-56 lg:h-64 xl:h-72 overflow-hidden">
            <Image
              src={car.images[0].url}
              alt="Car image"
              fill
              className="object-cover"
            />
          </div>

          <div className="px-6 py-5 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800">{`${car.brand} ${car.model}`}</h2>
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  car.status === "available"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {car.status}
              </span>
            </div>

            <p className="text-gray-500 text-sm italic">{`Year • ${car.year}`}</p>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex flex-col">
                <span className="text-gray-400">Color</span>
                <span className="font-medium text-gray-800">{car.color}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-400">Price</span>
                <span className="font-semibold text-blue-600">{`₹${car.price.toLocaleString()}`}</span>
              </div>
            </div>

            <button
              onClick={() => {
                handleClick(`${car.brand}-${car.model}-${car._id}`);
              }}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium py-2 rounded-sm transition duration-200 ease-in-out shadow"
            >
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
