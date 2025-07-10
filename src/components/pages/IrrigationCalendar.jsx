import React, { useState, useEffect } from "react";
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth } from "date-fns";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { irrigationService } from "@/services/api/irrigationService";
import { weatherService } from "@/services/api/weatherService";
import { fieldsService } from "@/services/api/fieldsService";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";

const IrrigationCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [irrigationEvents, setIrrigationEvents] = useState([]);
  const [weatherData, setWeatherData] = useState([]);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  
  const [scheduleForm, setScheduleForm] = useState({
    fieldId: '',
    time: '06:00',
    duration: 30,
    waterAmount: 15,
    type: 'automatic',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, [currentDate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [events, weather, fieldsData] = await Promise.all([
        irrigationService.getAll(),
        weatherService.getForecast(7),
        fieldsService.getAll()
      ]);
      
      setIrrigationEvents(events);
      setWeatherData(weather);
      setFields(fieldsData);
    } catch (err) {
      setError('Failed to load irrigation data');
      toast.error('Failed to load irrigation data');
    } finally {
      setLoading(false);
    }
  };

  const handleDateClick = async (date) => {
    setSelectedDate(date);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    if (fields.length > 0) {
      try {
        const recs = await irrigationService.getRecommendations(dateStr, fields[0].Id);
        setRecommendations(recs);
      } catch (err) {
        console.error('Failed to load recommendations:', err);
      }
    }
  };

  const handleScheduleIrrigation = () => {
    if (!selectedDate) return;
    setShowScheduleModal(true);
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate || !scheduleForm.fieldId) {
      toast.error('Please select a field');
      return;
    }

    try {
      const selectedField = fields.find(f => f.Id === parseInt(scheduleForm.fieldId));
      const newEvent = {
        ...scheduleForm,
        fieldId: parseInt(scheduleForm.fieldId),
        fieldName: selectedField?.name || 'Unknown Field',
        date: format(selectedDate, 'yyyy-MM-dd'),
        duration: parseInt(scheduleForm.duration),
        waterAmount: parseInt(scheduleForm.waterAmount),
        soilMoisture: recommendations?.soilMoisture || 50,
        weatherCondition: getWeatherForDate(selectedDate)?.conditions || 'unknown',
        temperature: getWeatherForDate(selectedDate)?.temperature || 75
      };

      await irrigationService.create(newEvent);
      await loadData();
      setShowScheduleModal(false);
      setScheduleForm({
        fieldId: '',
        time: '06:00',
        duration: 30,
        waterAmount: 15,
        type: 'automatic',
        notes: ''
      });
      toast.success('Irrigation scheduled successfully');
    } catch (err) {
      toast.error('Failed to schedule irrigation');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!confirm('Are you sure you want to delete this irrigation event?')) return;

    try {
      await irrigationService.delete(eventId);
      await loadData();
      toast.success('Irrigation event deleted successfully');
    } catch (err) {
      toast.error('Failed to delete irrigation event');
    }
  };

  const getEventsForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return irrigationEvents.filter(event => event.date === dateStr);
  };

  const getWeatherForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return weatherData.find(w => w.date === dateStr);
  };

  const getWeatherIcon = (condition) => {
    const iconMap = {
      sunny: "Sun",
      cloudy: "Cloud",
      rainy: "CloudRain",
      stormy: "CloudLightning",
      snowy: "Snowflake"
    };
    return iconMap[condition] || "Cloud";
  };

  const getSoilMoistureColor = (moisture) => {
    if (moisture < 30) return "text-error";
    if (moisture > 70) return "text-info";
    return "text-success";
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-gray-600';
    }
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Irrigation Calendar</h1>
          <p className="text-gray-600">
            Schedule and manage irrigation based on weather forecasts and soil conditions
            {!selectedDate && (
              <span className="block text-sm text-primary font-semibold mt-2 animate-pulse">
                👆 Click any date on the calendar to schedule irrigation
              </span>
            )}
            {selectedDate && (
              <span className="block text-sm text-success font-semibold mt-2">
                ✅ {format(selectedDate, 'EEEE, MMMM d')} selected - ready to schedule!
              </span>
            )}
          </p>
        </div>
        <div className="flex space-x-3 mt-4 md:mt-0">
          <Button variant="outline" onClick={() => setCurrentDate(new Date())}>
            <ApperIcon name="Calendar" size={20} className="mr-2" />
            Today
          </Button>
          <Button 
            variant="primary" 
            onClick={handleScheduleIrrigation} 
            disabled={!selectedDate}
            className={cn(
              "relative transition-all duration-300 transform",
              !selectedDate && "opacity-30 cursor-not-allowed grayscale",
              selectedDate && "hover:shadow-xl hover:scale-105 animate-pulse shadow-lg ring-2 ring-primary/20"
            )}
            title={!selectedDate ? "Please select a date on the calendar first" : `Schedule irrigation for ${selectedDate ? format(selectedDate, 'MMMM d') : ''}`}
          >
            <ApperIcon name="Plus" size={20} className="mr-2" />
            Schedule Irrigation
            {selectedDate && (
              <span className="ml-2 text-xs bg-white/30 px-2 py-1 rounded font-semibold border border-white/20">
                {format(selectedDate, 'MMM d')}
              </span>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(addDays(currentDate, -30))}
                >
                  <ApperIcon name="ChevronLeft" size={16} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentDate(addDays(currentDate, 30))}
                >
                  <ApperIcon name="ChevronRight" size={16} />
                </Button>
              </div>
            </div>

            {/* Days of week */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map(day => {
                const events = getEventsForDate(day);
                const weather = getWeatherForDate(day);
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const isToday = isSameDay(day, new Date());

                return (
                  <div
                    key={day.toISOString()}
                    onClick={() => handleDateClick(day)}
                    className={cn(
                      "min-h-[80px] p-2 border border-gray-200 cursor-pointer hover:bg-primary/5 transition-colors",
                      isSelected && "bg-primary/10 border-primary",
                      isToday && "bg-accent/10",
                      !isSameMonth(day, currentDate) && "text-gray-400 bg-gray-50"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={cn("text-sm font-medium", isToday && "text-accent")}>
                        {format(day, 'd')}
                      </span>
                      {weather && (
                        <ApperIcon 
                          name={getWeatherIcon(weather.conditions)} 
                          size={12} 
                          className="text-gray-500" 
                        />
                      )}
                    </div>
                    
                    {events.length > 0 && (
                      <div className="space-y-1">
                        {events.slice(0, 2).map(event => (
                          <div
                            key={event.Id}
                            className={cn(
                              "text-xs p-1 rounded truncate",
                              event.status === 'completed' ? "bg-success/20 text-success" :
                              event.status === 'scheduled' ? "bg-primary/20 text-primary" :
                              "bg-gray-200 text-gray-600"
                            )}
                          >
                            {event.time} - {event.fieldName}
                          </div>
                        ))}
                        {events.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{events.length - 2} more
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Selected Date Info */}
          {selectedDate && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {format(selectedDate, 'EEEE, MMMM d')}
              </h3>
              
              {/* Weather Info */}
              {(() => {
                const weather = getWeatherForDate(selectedDate);
                return weather ? (
                  <div className="mb-4">
                    <div className="flex items-center space-x-3 mb-2">
                      <ApperIcon name={getWeatherIcon(weather.conditions)} size={20} className="text-primary" />
                      <span className="font-medium capitalize">{weather.conditions}</span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>Temperature: {weather.temperature}°F</div>
                      <div>Precipitation: {weather.precipitation}"</div>
                      <div>Humidity: {weather.humidity}%</div>
                    </div>
                  </div>
                ) : (
                  <div className="mb-4 text-sm text-gray-500">No weather data available</div>
                );
              })()}

              {/* Recommendations */}
              {recommendations && (
                <div className="mb-4 p-3 bg-surface rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <ApperIcon 
                      name={recommendations.recommended ? "CheckCircle" : "AlertCircle"} 
                      size={16} 
                      className={recommendations.recommended ? "text-success" : "text-warning"}
                    />
                    <span className="font-medium text-sm">
                      Irrigation {recommendations.recommended ? 'Recommended' : 'Not Recommended'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>Best Time: {recommendations.bestTime}</div>
                    <div>Duration: {recommendations.duration} minutes</div>
                    <div>Water: {recommendations.waterAmount} gallons</div>
                    <div className={`${getSoilMoistureColor(recommendations.soilMoisture)}`}>
                      Soil Moisture: {recommendations.soilMoisture}%
                    </div>
                    <div className={`${getPriorityColor(recommendations.priority)}`}>
                      Priority: {recommendations.priority}
                    </div>
                    <div className="text-xs italic mt-2">{recommendations.reason}</div>
                  </div>
                </div>
              )}

              {/* Scheduled Events */}
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Scheduled Events</h4>
                {(() => {
                  const events = getEventsForDate(selectedDate);
                  return events.length > 0 ? (
                    <div className="space-y-2">
                      {events.map(event => (
                        <div key={event.Id} className="p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-sm">{event.fieldName}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteEvent(event.Id)}
                              className="text-error hover:text-error p-1"
                            >
                              <ApperIcon name="Trash2" size={14} />
                            </Button>
                          </div>
                          <div className="text-xs text-gray-600 space-y-1">
                            <div>Time: {event.time}</div>
                            <div>Duration: {event.duration} minutes</div>
                            <div>Water: {event.waterAmount} gallons</div>
                            <div className={`${getSoilMoistureColor(event.soilMoisture)}`}>
                              Soil: {event.soilMoisture}%
                            </div>
                            {event.notes && <div className="italic">{event.notes}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No events scheduled</p>
                  );
                })()}
              </div>
            </Card>
          )}

          {/* Legend */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Legend</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-primary/20 rounded"></div>
                <span>Scheduled</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-success/20 rounded"></div>
                <span>Completed</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-accent/20 rounded"></div>
                <span>Today</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">
                Schedule Irrigation for {selectedDate && format(selectedDate, 'MMMM d')}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowScheduleModal(false)}
                className="p-1"
              >
                <ApperIcon name="X" size={20} />
              </Button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Field</label>
                <select
                  value={scheduleForm.fieldId}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, fieldId: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  <option value="">Select a field</option>
                  {fields.map(field => (
                    <option key={field.Id} value={field.Id}>{field.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <Input
                    type="time"
                    value={scheduleForm.time}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
                  <Input
                    type="number"
                    value={scheduleForm.duration}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, duration: e.target.value })}
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Water (gallons)</label>
                  <Input
                    type="number"
                    value={scheduleForm.waterAmount}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, waterAmount: e.target.value })}
                    min="1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={scheduleForm.type}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, type: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="automatic">Automatic</option>
                    <option value="manual">Manual</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                <textarea
                  value={scheduleForm.notes}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, notes: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows="3"
                  placeholder="Add any additional notes..."
                />
              </div>

              {recommendations && (
                <div className="p-3 bg-surface rounded-lg">
                  <div className="text-sm font-medium text-gray-800 mb-1">AI Recommendation</div>
                  <div className="text-xs text-gray-600">
                    {recommendations.reason}
                  </div>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowScheduleModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="flex-1">
                  Schedule
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default IrrigationCalendar;