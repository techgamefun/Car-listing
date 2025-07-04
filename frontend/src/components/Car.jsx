import Image from "next/image";
import { Heart, Share2, Phone, MessageCircle } from "lucide-react";
import ImageGallery from "./ImageGallery"; // New Client Component for image carousel

export default function Car({ carData }) {
  // JSON-LD structured data
  const jsonLd = carData
    ? {
        "@context": "https://schema.org",
        "@type": "Car",
        name: `${carData.brand} ${carData.model}`,
        brand: {
          "@type": "Brand",
          name: carData.brand,
        },
        model: carData.model,
        vehicleModelDate: carData.year,
        color: carData.color,
        offers: {
          "@type": "Offer",
          priceCurrency: "INR",
          price: carData.price,
          availability:
            carData.status === "available"
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
        },
        image: carData.images?.map((img) => img.url) || [],
        description: `${carData.brand} ${carData.model} ${carData.year} in ${carData.color} color`,
        vehicleConfiguration: "Used Car",
        url: `https://yourdomain.com/car/${carData._id}`, // Replace with your actual domain and dynamic ID if needed
      }
    : null;

  const images = carData.images || [];

  return (
    <>
      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-gradient-to-br from-gray-900 via-blue-900 to-black md:min-h-screen md:min-w-screen">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Image Section - Now handled by ImageGallery Client Component */}
          <ImageGallery
            images={images}
            carBrand={carData.brand}
            carModel={carData.model}
          />

          {/* Details Section */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-100 mb-2">
                {carData.brand} {carData.model}
              </h1>
              <p className="text-lg text-gray-300">{carData.year}</p>
            </div>

            {/* Price and Status */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-3xl sm:text-4xl font-bold text-blue-600">
                  ₹{carData.price?.toLocaleString()}
                </p>
                <p className="text-sm text-gray-400 mt-1">*Ex-showroom price</p>
              </div>
              <span
                className={`inline-block px-4 py-2 text-sm font-medium rounded-full ${
                  carData.status === "available"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {carData.status === "available" ? "Available" : "Not Available"}
              </span>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-3">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2">
                <Phone className="w-5 h-5" />
                Call Now
              </button>
              <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center gap-2">
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </button>
            </div>

            {/* Secondary Actions */}
            <div className="flex gap-3">
              <button className="flex-1 border border-gray-300 text-gray-400 font-medium py-3 px-6 rounded-lg hover:bg-gray-50 transition duration-200 flex items-center justify-center gap-2">
                <Heart className="w-5 h-5" />
                Save
              </button>
              <button className="flex-1 border border-gray-300 text-gray-400 font-medium py-3 px-6 rounded-lg hover:bg-gray-50 transition duration-200 flex items-center justify-center gap-2">
                <Share2 className="w-5 h-5" />
                Share
              </button>
            </div>

            {/* Car Details */}
            <div className="bg-gray-100 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Car Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Brand</p>
                  <p className="font-medium text-gray-800">{carData.brand}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Model</p>
                  <p className="font-medium text-gray-800">{carData.model}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Year</p>
                  <p className="font-medium text-gray-800">{carData.year}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Color</p>
                  <p className="font-medium text-gray-800">{carData.color}</p>
                </div>
                {carData.mileage && (
                  <div>
                    <p className="text-sm text-gray-500">Mileage</p>
                    <p className="font-medium text-gray-800">
                      {carData.mileage} km
                    </p>
                  </div>
                )}
                {carData.fuelType && (
                  <div>
                    <p className="text-sm text-gray-500">Fuel Type</p>
                    <p className="font-medium text-gray-800">
                      {carData.fuelType}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Additional Information */}
            {carData.description && (
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {carData.description}
                </p>
              </div>
            )}

            {/* Features */}
            {carData.features && carData.features.length > 0 && (
              <div className="bg-white border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Features
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {carData.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
