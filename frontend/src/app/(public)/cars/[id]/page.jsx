import API from "@/util/axios"; // Import API
import Car from "../../../../components/Car"; // Import the Car Server Component

// We don't need "use client" here anymore, as this will be a Server Component

export default async function CarPage({ params }) {
  const { id } = params;
  const carId = id.split("-").pop(); // Extract the actual ID from the slug

  let carData = null;
  let loading = true;
  let error = null;

  try {
    const response = await API.get(`/cars/${carId}`);
    carData = response.data.car;
  } catch (err) {
    console.error("Failed to fetch car:", err);
    error = err.message;
  } finally {
    loading = false; // Mark loading as false after fetch attempt
  }

  // Loading state (SSR friendly, rendered on server before sending)
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="space-y-4">
            <div className="bg-gray-200 rounded-lg h-80 sm:h-96 lg:h-[500px] animate-pulse"></div>
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-lg animate-pulse"
                ></div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state (SSR friendly, rendered on server before sending)
  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-red-800 mb-2">Error</h1>
          <p className="text-red-600">
            Failed to load car details. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  // No data state (SSR friendly, rendered on server before sending)
  if (!carData) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-yellow-800 mb-2">Not Found</h1>
          <p className="text-yellow-600">Car not found.</p>
        </div>
      </div>
    );
  }

  return <Car carData={carData} />;
}
  