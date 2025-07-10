import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { priceService } from "@/services/api/priceService";
import Chart from "react-apexcharts";

const MarketPrices = () => {
  const [priceData, setPriceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("all");
  const [timeRange, setTimeRange] = useState("30");

  const cropTypes = [
    { value: "all", label: "All Crops" },
    { value: "Corn", label: "Corn" },
    { value: "Soybeans", label: "Soybeans" },
    { value: "Wheat", label: "Wheat" },
    { value: "Cotton", label: "Cotton" },
    { value: "Rice", label: "Rice" },
    { value: "Barley", label: "Barley" }
  ];

  const timeRanges = [
    { value: "7", label: "7 Days" },
    { value: "30", label: "30 Days" },
    { value: "90", label: "90 Days" },
    { value: "365", label: "1 Year" },
    { value: "all", label: "All Time" }
  ];

  const loadPriceData = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await priceService.getPriceHistory(selectedCrop, timeRange);
      setPriceData(data);
    } catch (err) {
      setError("Failed to load price data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPriceData();
  }, [selectedCrop, timeRange]);

  const getChartOptions = () => ({
    chart: {
      type: 'line',
      height: 400,
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true
        }
      },
      background: 'transparent'
    },
    colors: ['#2D5016', '#7CB342', '#FF6F00', '#4CAF50', '#29B6F6', '#FFA726'],
    stroke: {
      curve: 'smooth',
      width: 3
    },
    grid: {
      borderColor: '#e0e0e0',
      strokeDashArray: 4
    },
    xaxis: {
      type: 'datetime',
      labels: {
        style: {
          colors: '#666'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Price ($)',
        style: {
          color: '#666'
        }
      },
      labels: {
        style: {
          colors: '#666'
        },
        formatter: (value) => `$${value.toFixed(2)}`
      }
    },
    tooltip: {
      shared: true,
      intersect: false,
      theme: 'light',
      y: {
        formatter: (value) => `$${value.toFixed(2)}`
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'center'
    },
    responsive: [{
      breakpoint: 768,
      options: {
        chart: {
          height: 300
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  });

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadPriceData} />;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Market Prices</h1>
          <p className="text-gray-600">Track crop price trends and market analysis</p>
        </div>
        <Button variant="outline">
          <ApperIcon name="Download" size={20} className="mr-2" />
          Export Data
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Crop Type
          </label>
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border-2 border-surface bg-surface focus:border-primary focus:outline-none"
          >
            {cropTypes.map((crop) => (
              <option key={crop.value} value={crop.value}>
                {crop.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time Range
          </label>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border-2 border-surface bg-surface focus:border-primary focus:outline-none"
          >
            {timeRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Price Chart */}
      <Card className="p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Price Trends</h2>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <ApperIcon name="TrendingUp" size={16} />
            <span>Historical Price Data</span>
          </div>
        </div>
        
        {priceData.length > 0 ? (
          <Chart
            options={getChartOptions()}
            series={priceData}
            type="line"
            height={400}
          />
        ) : (
          <div className="text-center py-12">
            <ApperIcon name="BarChart3" size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No price data available for selected filters</p>
          </div>
        )}
      </Card>

      {/* Price Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {priceData.map((crop, index) => {
          const latestPrice = crop.data[crop.data.length - 1];
          const previousPrice = crop.data[crop.data.length - 2];
          const priceChange = latestPrice && previousPrice ? 
            ((latestPrice.y - previousPrice.y) / previousPrice.y * 100) : 0;
          
          return (
            <Card key={crop.name} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">{crop.name}</h3>
                <ApperIcon name="Seedling" size={20} className="text-secondary" />
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-gray-800">
                  ${latestPrice ? latestPrice.y.toFixed(2) : '0.00'}
                </div>
                <div className={`flex items-center text-sm ${
                  priceChange >= 0 ? 'text-success' : 'text-error'
                }`}>
                  <ApperIcon 
                    name={priceChange >= 0 ? "TrendingUp" : "TrendingDown"} 
                    size={16} 
                    className="mr-1" 
                  />
                  <span>{Math.abs(priceChange).toFixed(2)}%</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default MarketPrices;