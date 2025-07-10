import React, { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { fieldsService } from "@/services/api/fieldsService";
import { formatDistanceToNow, differenceInDays } from "date-fns";

const FieldGrid = ({ limit }) => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadFields = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fieldsService.getAll();
      setFields(limit ? data.slice(0, limit) : data);
    } catch (err) {
      setError("Failed to load fields");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFields();
  }, [limit]);

  const getStatusVariant = (status) => {
    const variants = {
      planted: "planted",
      growing: "growing", 
      ready: "ready",
      harvested: "success"
    };
    return variants[status] || "default";
  };

  const getDaysToHarvest = (expectedHarvest) => {
    return differenceInDays(new Date(expectedHarvest), new Date());
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadFields} />;
  if (fields.length === 0) return (
    <Empty 
      title="No Fields Yet" 
      description="Start by adding your first field to track crops and manage farming operations."
      actionLabel="Add Field"
      icon="Map"
    />
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {fields.map((field) => (
        <Card key={field.Id} className="p-6 hover:shadow-xl">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">{field.name}</h3>
              <p className="text-sm text-gray-600">{field.acres} acres</p>
            </div>
            <Badge variant={getStatusVariant(field.status)}>
              {field.status}
            </Badge>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-center text-sm text-gray-600">
              <ApperIcon name="Seedling" size={16} className="mr-2 text-secondary" />
              <span className="font-medium">{field.cropType}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <ApperIcon name="Calendar" size={16} className="mr-2 text-info" />
              <span>Planted {formatDistanceToNow(new Date(field.plantingDate))} ago</span>
            </div>

            {field.status !== "harvested" && (
              <div className="flex items-center text-sm text-gray-600">
                <ApperIcon name="Clock" size={16} className="mr-2 text-accent" />
                <span>
                  {getDaysToHarvest(field.expectedHarvest) > 0 
                    ? `${getDaysToHarvest(field.expectedHarvest)} days to harvest`
                    : "Ready for harvest"
                  }
                </span>
              </div>
            )}
          </div>

          {field.notes && (
            <div className="p-3 bg-gray-50 rounded-lg mb-4">
              <p className="text-sm text-gray-700">{field.notes}</p>
            </div>
          )}

<div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex-1">
              <ApperIcon name="Eye" size={16} className="mr-1" />
              View
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.location.href = `/pest-reports?fieldId=${field.Id}`}
            >
              <ApperIcon name="Bug" size={16} className="mr-1" />
              Report Issue
            </Button>
            <Button variant="ghost" size="sm">
              <ApperIcon name="Edit" size={16} />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default FieldGrid;