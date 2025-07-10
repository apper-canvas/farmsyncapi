import React from "react";
import WeatherForecast from "@/components/organisms/WeatherForecast";

const Weather = () => {
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Weather Center</h1>
        <p className="text-gray-600">Monitor weather conditions and agricultural forecasts</p>
      </div>

      {/* Weather Content */}
      <WeatherForecast />
    </div>
  );
};

export default Weather;