"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import API from "@/util/axios";

export default function AddCarForm({ car, setShowForm }) {
  const {
    _id = "",
    brand = "",
    model = "",
    color = "",
    year = "",
    vin = "",
    price = "",
    status = "",
    images = [],
  } = car || {};

  // State for managing all image operations
  const [existingImages, setExistingImages] = useState(images); // Images from database
  const [newImages, setNewImages] = useState([]); // Newly uploaded images
  const [imagesToDelete, setImagesToDelete] = useState([]); // Images to delete from database
  const [submitting, isSubmitting] = useState(false);
  const inputImageRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
  } = useForm();

  // Initialize existing images when component mounts or car changes
  useEffect(() => {
    if (_id && images.length > 0) {
      setExistingImages(images);
    }
  }, [_id, images]);

  const handleShowImage = (e) => {
    const files = Array.from(e.target.files);

    // Create objects that contain both the file and its URL for display
    const newImageFiles = files.map((file) => ({
      id: crypto.randomUUID(),
      file: file, // Store the actual file object
      url: URL.createObjectURL(file), // URL for display
    }));

    const updatedNewImages = [...newImages, ...newImageFiles];
    setNewImages(updatedNewImages);

    // Update the form field with actual File objects
    const fileObjects = updatedNewImages.map((item) => item.file);
    setValue("images", fileObjects);

    // Clear any validation errors since we now have files
    if (fileObjects.length > 0 || existingImages.length > 0) {
      clearErrors("images");
    }

    // Reset the input so same files can be selected again if needed
    e.target.value = null;
  };

  const handleDeleteExistingImage = (imageId) => {
    // Find the image to delete
    const imageToDelete = existingImages.find((img) => img._id === imageId);
    if (imageToDelete) {
      // Add to delete list
      setImagesToDelete((prev) => [...prev, imageToDelete]);
      // Remove from existing images
      setExistingImages((prev) => prev.filter((img) => img._id !== imageId));
    }
  };

  const handleDeleteNewImage = (imageId) => {
    // Find and revoke URL to prevent memory leaks
    const imageToDelete = newImages.find((img) => img.id === imageId);
    if (imageToDelete) {
      URL.revokeObjectURL(imageToDelete.url);
    }

    const updatedNewImages = newImages.filter((img) => img.id !== imageId);
    setNewImages(updatedNewImages);

    // Update form field with remaining files
    const fileObjects = updatedNewImages.map((item) => item.file);
    setValue("images", fileObjects.length > 0 ? fileObjects : null);

    // Reset input if no files remain
    if (updatedNewImages.length === 0 && inputImageRef.current) {
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

    // Add images to delete (serialize as JSON)
    if (imagesToDelete.length > 0) {
      formData.append("imagesToDelete", JSON.stringify(imagesToDelete));
    }

    // Add new images to FormData
    if (data.images && data.images.length > 0) {
      for (let i = 0; i < data.images.length; i++) {
        formData.append("images", data.images[i]);
      }
    }

    try {
      let response;

      if (!_id) {
        response = await API.post("/cars", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        response = await API.put(`/cars/${_id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      console.log("Upload success:", response.data);
      isSubmitting(false);
      setShowForm(false);
    } catch (error) {
      console.log(error);
      isSubmitting(false);
    }
  };

  // Cleanup URLs when component unmounts to prevent memory leaks
  useEffect(() => {
    return () => {
      newImages.forEach((image) => {
        URL.revokeObjectURL(image.url);
      });
    };
  }, [newImages]);

  // Check if we have any images (existing or new)
  const hasImages = existingImages.length > 0 || newImages.length > 0;

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
              {_id ? "Updating car details..." : "Uploading car details..."}
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
            defaultValue={_id ? brand : ""}
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
            defaultValue={_id ? model : ""}
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
            defaultValue={_id ? color : ""}
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
            defaultValue={_id ? year : ""}
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
            defaultValue={_id ? vin : ""}
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
            defaultValue={_id ? price : ""}
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
            defaultValue={_id ? status : ""}
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-2">
            {/* Existing Images */}
            {existingImages.map((image) => (
              <div
                key={image._id}
                className="group relative w-full h-32 rounded-md border border-gray-300 overflow-hidden"
              >
                <Image
                  alt={`Existing car image ${image._id}`}
                  src={image.url}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteExistingImage(image._id)}
                  className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  ✕
                </button>
                <div className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-1 py-0.5 rounded">
                  Existing
                </div>
              </div>
            ))}

            {/* New Images */}
            {newImages.map((image) => (
              <div
                key={image.id}
                className="group relative w-full h-32 rounded-md border border-gray-300 overflow-hidden"
              >
                <Image
                  alt={`New car image ${image.id}`}
                  src={image.url}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteNewImage(image.id)}
                  className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  ✕
                </button>
                <div className="absolute bottom-1 left-1 bg-green-600 text-white text-xs px-1 py-0.5 rounded">
                  New
                </div>
              </div>
            ))}
          </div>

          {/* Images to be deleted notification */}
          {imagesToDelete.length > 0 && (
            <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {imagesToDelete.length} image(s) will be deleted on save
            </div>
          )}

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

          {!hasImages && (
            <span className="text-red-500 text-sm block mt-2">
              At least one image is required
            </span>
          )}
        </div>

        {_id ? (
          <div className="flex justify-end p-4 gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="bg-green-500 py-2 px-4 rounded-md text-white cursor-pointer hover:bg-green-700 transition-colors disabled:bg-gray-400"
            >
              {submitting ? "Updating..." : "Update"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="bg-red-500 py-2 px-4 rounded-md text-white cursor-pointer hover:bg-red-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex justify-end p-4">
            <button
              type="submit"
              disabled={submitting}
              className="bg-red-500 py-2 px-4 rounded-md text-white cursor-pointer hover:bg-red-700 transition-colors disabled:bg-gray-400"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        )}
      </div>
    </form>
  );
}
