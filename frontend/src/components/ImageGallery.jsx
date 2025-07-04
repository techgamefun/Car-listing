"use client"; // This component needs client-side interactivity

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ImageGallery({ images, carBrand, carModel }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const currentImage = images[selectedImageIndex];

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="relative bg-gray-100 rounded-lg overflow-hidden">
        <div className="relative h-80 sm:h-96 lg:h-[500px]">
          {currentImage ? (
            <Image
              src={currentImage.url}
              alt={`${carBrand} ${carModel} - Image ${selectedImageIndex + 1}`}
              fill
              className="object-cover"
              priority={selectedImageIndex === 0}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-500">No image available</span>
            </div>
          )}
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all duration-200"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all duration-200"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
            {selectedImageIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Selector */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((img, index) => (
            <button
              key={img._id}
              onClick={() => setSelectedImageIndex(index)}
              className={`flex-shrink-0 relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                index === selectedImageIndex
                  ? "border-blue-500 opacity-100"
                  : "border-gray-200 opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={img.url}
                alt={`${carBrand} ${carModel} thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
