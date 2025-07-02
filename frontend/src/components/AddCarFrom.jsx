"use client";

import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import API from "@/util/axios";

export default function AddCarFrom({}) {
  // Single state to manage both files and their display URLs
  const [imageFiles, setImageFiles] = useState([]);
  const [submitting, isSubmitting] = useState(false);
  const inputImageRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
  } = useForm();

  const handleShowImage = (e) => {
    const files = Array.from(e.target.files);

    // Create objects that contain both the file and its URL for display
    const newImageFiles = files.map((file) => ({
      id: crypto.randomUUID(),
      file: file, // Store the actual file object
      url: URL.createObjectURL(file), // URL for display
    }));

    const updatedFiles = [...imageFiles, ...newImageFiles];
    setImageFiles(updatedFiles);

    // Update the form field with actual File objects
    const fileObjects = updatedFiles.map((item) => item.file);
    setValue("images", fileObjects);

    // Clear any validation errors since we now have files
    if (fileObjects.length > 0) {
      clearErrors("images");
    }

    // Reset the input so same files can be selected again if needed
    e.target.value = null;
  };

  const handleDelete = (idToDelete) => {
    // Clean up the URL to prevent memory leaks
    const imageToDelete = imageFiles.find((img) => img.id === idToDelete);
    if (imageToDelete) {
      URL.revokeObjectURL(imageToDelete.url);
    }

    const updatedFiles = imageFiles.filter((img) => img.id !== idToDelete);
    setImageFiles(updatedFiles);

    // Update form field with remaining files
    const fileObjects = updatedFiles.map((item) => item.file);
    setValue("images", fileObjects.length > 0 ? fileObjects : null);

    // Reset input if no files remain
    if (updatedFiles.length === 0 && inputImageRef.current) {
      inputImageRef.current.value = null;
    }
  };

  const onSubmit = async (data) => {
    isSubmitting(true);
    const formData = new FormData();

    formData.append("brand", data.brand);
    formData.append("model", data.model);
    formData.append("color", data.color);
    formData.append("year", data.year);
    formData.append("vin", data.vin);
    formData.append("price", data.price);
    formData.append("status", data.status);

    // Add images to FormData - this will now work correctly
    if (data.images && data.images.length > 0) {
      for (let i = 0; i < data.images.length; i++) {
        formData.append("images", data.images[i]);
      }
    }

    try {
      const response = await API.post("/cars", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Upload success:", response.data);
      isSubmitting(false);
    } catch (error) {
      console.log(error);
      isSubmitting(false);
    }
  };

  // Cleanup URLs when component unmounts to prevent memory leaks
  React.useEffect(() => {
    return () => {
      imageFiles.forEach((image) => {
        URL.revokeObjectURL(image.url);
      });
    };
  }, []);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid md:grid-cols-2 gap-2 p-4 bg-gray-100 h-full"
    >
      {submitting && (
        <div className="fixed inset-0 bg-white bg-opacity-75 z-50 flex items-center justify-center">
          <div className="text-center">
            <svg
              className="animate-spin h-8 w-8 text-red-600 mx-auto mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              ></path>
            </svg>
            <p className="text-gray-700 font-semibold text-lg">
              Uploading car details...
            </p>
          </div>
        </div>
      )}

      <div className="col-span-1 flex flex-col gap-2">
        <div className="h-full w-full rounded-md border-1 border-gray-300 p-2 flex flex-col gap-1 bg-white">
          <label>Brand</label>
          <input
            type="text"
            className="border border-gray-300 rounded-md p-1"
            {...register("brand", { required: "Brand is required" })}
          />
          {errors.brand && (
            <span className="text-red-500 text-sm">{errors.brand.message}</span>
          )}
        </div>

        <div className="h-full w-full rounded-md border-1 border-gray-300 p-2 flex flex-col gap-1 bg-white">
          <label>Model</label>
          <input
            type="text"
            className="border border-gray-300 rounded-md p-1"
            {...register("model", { required: "Model is required" })}
          />
          {errors.model && (
            <span className="text-red-500 text-sm">{errors.model.message}</span>
          )}
        </div>

        <div className="h-full w-full rounded-md border-1 border-gray-300 p-2 flex flex-col gap-1 bg-white">
          <label>Color</label>
          <input
            type="text"
            className="border border-gray-300 rounded-md p-1"
            {...register("color", { required: "Color is required" })}
          />
          {errors.color && (
            <span className="text-red-500 text-sm">{errors.color.message}</span>
          )}
        </div>

        <div className="h-full w-full rounded-md border-1 border-gray-300 p-2 flex flex-col gap-1 bg-white">
          <label>Year</label>
          <select
            {...register("year", { required: "Year is required" })}
            className="w-full p-1 border border-gray-300 rounded"
          >
            <option value="">Select year</option>
            {Array.from({ length: 40 }, (_, i) => {
              const year = new Date().getFullYear() - i;
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
          {errors.year && (
            <span className="text-red-500 text-sm">{errors.year.message}</span>
          )}
        </div>

        <div className="h-full w-full rounded-md border-1 border-gray-300 p-2 flex flex-col gap-1 bg-white">
          <label>VIN</label>
          <input
            type="text"
            className="border border-gray-300 rounded-md p-1"
            {...register("vin", { required: "VIN is required" })}
          />
          {errors.vin && (
            <span className="text-red-500 text-sm">{errors.vin.message}</span>
          )}
        </div>

        <div className="h-full w-full rounded-md border-1 border-gray-300 p-2 flex flex-col gap-1 bg-white">
          <label>Price</label>
          <input
            type="number"
            step="0.01"
            className="border border-gray-300 rounded-md p-1"
            {...register("price", {
              required: "Price is required",
              min: { value: 0, message: "Price must be positive" },
            })}
          />
          {errors.price && (
            <span className="text-red-500 text-sm">{errors.price.message}</span>
          )}
        </div>

        <div className="h-full w-full rounded-md border-1 border-gray-300 p-2 flex flex-col gap-1 bg-white">
          <label>Status</label>
          <select
            className="w-full p-1 border border-gray-300 rounded"
            {...register("status", { required: "Status is required" })}
          >
            <option value="">Select status</option>
            <option value="available">Available</option>
            <option value="sold">Sold</option>
            <option value="reserved">Reserved</option>
          </select>
          {errors.status && (
            <span className="text-red-500 text-sm">
              {errors.status.message}
            </span>
          )}
        </div>
      </div>
      <div className="col-span-1 flex flex-col gap-2 justify-between">
        <div className="w-full border border-gray-300 bg-white p-2 rounded-md">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-2">
            {imageFiles.map((image) => (
              <div
                key={image.id}
                className="group relative w-full h-32 rounded-md border border-gray-300 overflow-hidden"
              >
                <Image
                  alt={`Car image ${image.id}`}
                  src={image.url}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleDelete(image.id)}
                  className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="w-full h-32 rounded-md bg-gray-200 border border-gray-300 flex items-center justify-center">
            <label className="cursor-pointer h-full w-full flex items-center justify-center text-center">
              <span>Click to upload images</span>
              <input
                ref={inputImageRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleShowImage}
              />
            </label>
          </div>

          {errors.images && (
            <span className="text-red-500 text-sm block mt-2">
              {errors.images.message}
            </span>
          )}
        </div>

        <div className="flex justify-end p-4">
          <button
            type="submit"
            className="bg-red-600 py-2 px-4 rounded-md text-white cursor-pointer hover:bg-red-700 transition-colors"
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  );
}
