import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { tasksService } from "@/services/api/tasksService";
import { format, isToday, isTomorrow, isPast } from "date-fns";

const TasksList = ({ limit }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await tasksService.getAll();
      const sortedTasks = data.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      setTasks(limit ? sortedTasks.slice(0, limit) : sortedTasks);
    } catch (err) {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [limit]);

  const getPriorityVariant = (priority) => {
    const variants = {
      high: "error",
      medium: "warning",
      low: "info"
    };
    return variants[priority] || "default";
  };

  const getStatusVariant = (status) => {
    const variants = {
      completed: "success",
      "in-progress": "warning",
      pending: "info"
    };
    return variants[status] || "default";
  };

  const getDueDateText = (dueDate) => {
    const date = new Date(dueDate);
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    if (isPast(date)) return "Overdue";
    return format(date, "MMM d");
  };

  const getDueDateColor = (dueDate) => {
    const date = new Date(dueDate);
    if (isPast(date) && !isToday(date)) return "text-error";
    if (isToday(date)) return "text-warning";
    return "text-gray-600";
  };

  if (loading) return <Loading type="table" />;
  if (error) return <Error message={error} onRetry={loadTasks} />;
  if (tasks.length === 0) return (
    <Empty 
      title="No Tasks Scheduled" 
      description="Create your first task to start organizing farm activities and operations."
      actionLabel="Add Task"
      icon="CheckSquare"
    />
  );

  return (
    <Card className="overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Farm Tasks</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {tasks.map((task) => (
          <div key={task.Id} className="p-4 hover:bg-gray-50 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-medium text-gray-800">{task.title}</h4>
                  <Badge variant={getPriorityVariant(task.priority)}>
                    {task.priority}
                  </Badge>
                  <Badge variant={getStatusVariant(task.status)}>
                    {task.status}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                  <div className="flex items-center">
                    <ApperIcon name="Calendar" size={14} className={`mr-1 ${getDueDateColor(task.dueDate)}`} />
                    <span className={getDueDateColor(task.dueDate)}>{getDueDateText(task.dueDate)}</span>
                  </div>
                  <div className="flex items-center">
                    <ApperIcon name="User" size={14} className="mr-1" />
                    <span>{task.assignedTo}</span>
                  </div>
                  {task.fieldId && (
                    <div className="flex items-center">
                      <ApperIcon name="Map" size={14} className="mr-1" />
                      <span>Field {task.fieldId}</span>
                    </div>
                  )}
                </div>

                {task.description && (
                  <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                )}
              </div>

              <div className="flex items-center space-x-2 ml-4">
                {task.status !== "completed" && (
                  <Button variant="outline" size="sm">
                    <ApperIcon name="Check" size={16} className="mr-1" />
                    Complete
                  </Button>
                )}
                <Button variant="ghost" size="sm">
                  <ApperIcon name="Edit" size={16} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TasksList;