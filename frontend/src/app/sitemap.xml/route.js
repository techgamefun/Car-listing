// app/sitemap.xml/route.ts
import { NextResponse } from "next/server";
import API from "@/util/axios"; // your existing Axios instance

export async function GET() {
  const baseUrl = "https://car-listing-next-js.vercel.app/"; // 🔁 Replace with your domain

  let carUrls = "";

  try {
    const res = await API.get("/cars"); // assuming this returns all cars
    const cars = res.data.cars;

    carUrls = cars
      .map((car) => {
        const slug = `${car.brand}-${car.model}-${car._id}`;
        return `
          <url>
            <loc>${baseUrl}/cars/${slug}</loc>
            <lastmod>${new Date(
              car.updatedAt || car.createdAt
            ).toISOString()}</lastmod>
          </url>
        `;
      })
      .join("");
  } catch (e) {
    console.error("Sitemap error:", e);
  }

  const staticUrls = `
    <url>
      <loc>${baseUrl}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
    </url>
    <url>
      <loc>${baseUrl}/about</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
    </url>
  `;

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${staticUrls}
    ${carUrls}
  </urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
