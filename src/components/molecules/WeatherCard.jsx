import React from "react";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const WeatherCard = ({ data }) => {
  const getWeatherIcon = (condition) => {
    const iconMap = {
      sunny: "Sun",
      cloudy: "Cloud", 
      rainy: "CloudRain",
      stormy: "CloudLightning",
      snowy: "Snowflake"
    };
    return iconMap[condition?.toLowerCase()] || "Sun";
  };

  if (!data) {
    return (
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-center">
          <ApperIcon name="CloudOff" size={48} className="text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Weather data unavailable</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Current Weather</h3>
          <p className="text-sm text-gray-600 capitalize">{data.conditions}</p>
        </div>
        <ApperIcon 
          name={getWeatherIcon(data.conditions)} 
          size={48} 
          className="text-blue-600" 
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-800">{data.temperature}°F</p>
          <p className="text-sm text-gray-600">Temperature</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-800">{data.humidity}%</p>
          <p className="text-sm text-gray-600">Humidity</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-800">{data.windSpeed}</p>
          <p className="text-sm text-gray-600">Wind (mph)</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-800">{data.precipitation}"</p>
          <p className="text-sm text-gray-600">Precipitation</p>
        </div>
      </div>
    </Card>
  );
};

export default WeatherCard;