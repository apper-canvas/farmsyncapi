import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { weatherService } from "@/services/api/weatherService";
import { format, addDays } from "date-fns";

const WeatherForecast = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadWeather = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await weatherService.getAll();
      setCurrentWeather(data[0]);
      setWeatherData(data.slice(0, 7));
    } catch (err) {
      setError("Failed to load weather data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWeather();
  }, []);

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

  const getTemperatureColor = (temp) => {
    if (temp >= 80) return "text-red-600";
    if (temp >= 60) return "text-orange-600";
    if (temp >= 40) return "text-blue-600";
    return "text-blue-800";
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadWeather} />;

  return (
    <div className="space-y-6">
      {/* Current Weather */}
      {currentWeather && (
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Current Weather</h2>
              <p className="text-gray-600 capitalize">{currentWeather.conditions}</p>
              <p className="text-sm text-gray-500">{format(new Date(), "EEEE, MMMM d")}</p>
            </div>
            <div className="text-right">
              <ApperIcon 
                name={getWeatherIcon(currentWeather.conditions)} 
                size={64} 
                className="text-blue-600 mb-2" 
              />
              <p className={`text-4xl font-bold ${getTemperatureColor(currentWeather.temperature)}`}>
                {currentWeather.temperature}°F
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white bg-opacity-50 rounded-lg">
              <ApperIcon name="Droplets" size={24} className="text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Humidity</p>
              <p className="text-xl font-semibold text-gray-800">{currentWeather.humidity}%</p>
            </div>
            <div className="text-center p-4 bg-white bg-opacity-50 rounded-lg">
              <ApperIcon name="Wind" size={24} className="text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Wind Speed</p>
              <p className="text-xl font-semibold text-gray-800">{currentWeather.windSpeed} mph</p>
            </div>
            <div className="text-center p-4 bg-white bg-opacity-50 rounded-lg">
              <ApperIcon name="CloudRain" size={24} className="text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Precipitation</p>
              <p className="text-xl font-semibold text-gray-800">{currentWeather.precipitation}"</p>
            </div>
            <div className="text-center p-4 bg-white bg-opacity-50 rounded-lg">
              <ApperIcon name="Thermometer" size={24} className="text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Feels Like</p>
              <p className="text-xl font-semibold text-gray-800">{currentWeather.temperature + 2}°F</p>
            </div>
          </div>
        </Card>
      )}

      {/* 7-Day Forecast */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">7-Day Forecast</h3>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {weatherData.map((day, index) => {
            const date = addDays(new Date(), index);
            return (
              <div key={index} className="text-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <p className="text-sm font-medium text-gray-600 mb-2">
                  {index === 0 ? "Today" : format(date, "EEE")}
                </p>
                <ApperIcon 
                  name={getWeatherIcon(day.conditions)} 
                  size={32} 
                  className="text-blue-600 mx-auto mb-2" 
                />
                <p className="text-xs text-gray-500 capitalize mb-2">{day.conditions}</p>
                <p className={`text-lg font-semibold ${getTemperatureColor(day.temperature)}`}>
                  {day.temperature}°
                </p>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-center text-xs text-gray-500">
                    <ApperIcon name="Droplets" size={12} className="mr-1" />
                    {day.precipitation}"
                  </div>
                  <div className="flex items-center justify-center text-xs text-gray-500">
                    <ApperIcon name="Wind" size={12} className="mr-1" />
                    {day.windSpeed}mph
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Agricultural Insights */}
      <Card className="p-6 bg-gradient-to-br from-secondary/10 to-secondary/5">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Agricultural Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded-lg">
            <div className="flex items-center mb-2">
              <ApperIcon name="Droplets" size={20} className="text-blue-600 mr-2" />
              <h4 className="font-medium text-gray-800">Irrigation Recommendation</h4>
            </div>
            <p className="text-sm text-gray-600">
              {currentWeather?.precipitation > 0.5 
                ? "Rainfall expected - delay irrigation" 
                : "Consider irrigation for crops"}
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg">
            <div className="flex items-center mb-2">
              <ApperIcon name="Seedling" size={20} className="text-secondary mr-2" />
              <h4 className="font-medium text-gray-800">Planting Conditions</h4>
            </div>
            <p className="text-sm text-gray-600">
              {currentWeather?.temperature >= 50 && currentWeather?.temperature <= 85
                ? "Good conditions for planting"
                : "Monitor temperature for optimal planting"}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WeatherForecast;