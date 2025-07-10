import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import StatCard from "@/components/molecules/StatCard";
import WeatherCard from "@/components/molecules/WeatherCard";
import FieldGrid from "@/components/organisms/FieldGrid";
import TasksList from "@/components/organisms/TasksList";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { fieldsService } from "@/services/api/fieldsService";
import { tasksService } from "@/services/api/tasksService";
import { weatherService } from "@/services/api/weatherService";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalFields: 0,
    activeFields: 0,
    pendingTasks: 0,
    completedTasks: 0,
    totalAcreage: 0
  });
  const [currentWeather, setCurrentWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleQuickAction = (actionType, route) => {
    toast.info(`Navigating to ${actionType}...`);
    navigate(route);
  };
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [fields, tasks, weather] = await Promise.all([
          fieldsService.getAll(),
          tasksService.getAll(),
          weatherService.getAll()
        ]);

        const activeFields = fields.filter(f => f.status !== "harvested");
        const pendingTasks = tasks.filter(t => t.status === "pending");
        const completedTasks = tasks.filter(t => t.status === "completed");
        const totalAcreage = fields.reduce((sum, field) => sum + field.acres, 0);

        setStats({
          totalFields: fields.length,
          activeFields: activeFields.length,
          pendingTasks: pendingTasks.length,
          completedTasks: completedTasks.length,
          totalAcreage
        });

        setCurrentWeather(weather[0]);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Farm Dashboard</h1>
          <p className="text-gray-600">Monitor your farm operations and track progress</p>
        </div>
        <div className="flex space-x-3 mt-4 md:mt-0">
          <Button variant="outline">
            <ApperIcon name="Download" size={20} className="mr-2" />
            Export Report
          </Button>
          <Button variant="primary">
            <ApperIcon name="Plus" size={20} className="mr-2" />
            Quick Add
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Fields"
          value={stats.totalFields}
          icon="Map"
          trend="up"
          trendValue="+2 this month"
          gradient
        />
        <StatCard
          title="Active Crops"
          value={stats.activeFields}
          icon="Seedling"
          trend="up"
          trendValue={`${stats.totalAcreage} acres`}
          gradient
        />
        <StatCard
          title="Pending Tasks"
          value={stats.pendingTasks}
          icon="Clock"
          trend={stats.pendingTasks > 5 ? "up" : "down"}
          trendValue={stats.pendingTasks > 5 ? "High volume" : "On track"}
          gradient
        />
        <StatCard
          title="Completed"
          value={stats.completedTasks}
          icon="CheckCircle"
          trend="up"
          trendValue="This week"
          gradient
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Weather Card */}
        <div className="lg:col-span-1">
          <WeatherCard data={currentWeather} />
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-br from-surface to-white rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex-col"
                onClick={() => handleQuickAction("Add Field", "/fields")}
              >
                <ApperIcon name="Map" size={24} className="mb-2 text-primary" />
                <span className="text-sm">Add Field</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col"
                onClick={() => handleQuickAction("New Task", "/tasks")}
              >
                <ApperIcon name="CheckSquare" size={24} className="mb-2 text-primary" />
                <span className="text-sm">New Task</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col"
                onClick={() => handleQuickAction("Add Inventory", "/inventory")}
              >
                <ApperIcon name="Package" size={24} className="mb-2 text-primary" />
                <span className="text-sm">Add Inventory</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex-col"
                onClick={() => handleQuickAction("Irrigation", "/irrigation")}
              >
                <ApperIcon name="Calendar" size={24} className="mb-2 text-primary" />
                <span className="text-sm">Irrigation</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Fields */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Recent Fields</h2>
          <Button variant="ghost">
            <span className="mr-2">View All</span>
            <ApperIcon name="ArrowRight" size={16} />
          </Button>
        </div>
        <FieldGrid limit={6} />
      </div>

      {/* Upcoming Tasks */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Upcoming Tasks</h2>
          <Button variant="ghost">
            <span className="mr-2">View All</span>
            <ApperIcon name="ArrowRight" size={16} />
          </Button>
        </div>
        <TasksList limit={5} />
      </div>
    </div>
  );
};

export default Dashboard;