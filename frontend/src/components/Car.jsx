"use client";

import { useEffect } from "react";
import API from "@/util/axios";

export default function Car({ id }) {
  useEffect(() => {
    const fetchCar = async () => {
      try {
        const response = await API.get(`/cars/${id}`);
        console.log(response.data);
      } catch (error) {
        console.error("Failed to fetch car:", error);
      }
    };

    fetchCar();
  }, [id]);
  return <h1>I am a car {id}</h1>;
}
