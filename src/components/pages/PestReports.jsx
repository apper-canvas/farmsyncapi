import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { pestReportsService } from "@/services/api/pestReportsService";
import { fieldsService } from "@/services/api/fieldsService";
import { format } from "date-fns";

const PestReports = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fieldId = searchParams.get("fieldId");
  
  const [reports, setReports] = useState([]);
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [formData, setFormData] = useState({
    fieldId: fieldId ? parseInt(fieldId) : "",
    issueType: "",
    pestName: "",
    severity: "",
    location: "",
    description: "",
    images: [],
    dateReported: new Date().toISOString().split('T')[0]
  });
  const [submitting, setSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [reportsData, fieldsData] = await Promise.all([
        pestReportsService.getAll(),
        fieldsService.getAll()
      ]);
      setReports(reportsData);
      setFields(fieldsData);
    } catch (err) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024
    );
    
    if (validFiles.length !== files.length) {
      toast.warning("Some files were skipped. Only images under 5MB are allowed.");
    }
    
    setImageFiles(prev => [...prev, ...validFiles]);
    
    // Create preview URLs
    const newImageUrls = validFiles.map(file => URL.createObjectURL(file));
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImageUrls]
    }));
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fieldId || !formData.issueType || !formData.pestName || !formData.severity) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);
      const reportData = {
        ...formData,
        fieldId: parseInt(formData.fieldId)
      };

      if (editingReport) {
        await pestReportsService.update(editingReport.Id, reportData);
        toast.success("Report updated successfully");
      } else {
        await pestReportsService.create(reportData);
        toast.success("Report submitted successfully");
      }

      await loadData();
      resetForm();
    } catch (err) {
      toast.error("Failed to submit report");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (report) => {
    setEditingReport(report);
    setFormData({
      fieldId: report.fieldId,
      issueType: report.issueType,
      pestName: report.pestName,
      severity: report.severity,
      location: report.location,
      description: report.description,
      images: report.images,
      dateReported: report.dateReported
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this report?")) return;
    
    try {
      await pestReportsService.delete(id);
      toast.success("Report deleted successfully");
      await loadData();
    } catch (err) {
      toast.error("Failed to delete report");
    }
  };

  const resetForm = () => {
    setFormData({
      fieldId: fieldId ? parseInt(fieldId) : "",
      issueType: "",
      pestName: "",
      severity: "",
      location: "",
      description: "",
      images: [],
      dateReported: new Date().toISOString().split('T')[0]
    });
    setImageFiles([]);
    setEditingReport(null);
    setShowForm(false);
  };

  const getFieldName = (fieldId) => {
    const field = fields.find(f => f.Id === fieldId);
    return field ? field.name : "Unknown Field";
  };

  const getSeverityVariant = (severity) => {
    const variants = {
      low: "success",
      medium: "warning", 
      high: "error",
      critical: "error"
    };
    return variants[severity] || "default";
  };

  const getIssueTypeIcon = (type) => {
    return type === "pest" ? "Bug" : "Leaf";
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Pest & Disease Reports</h1>
          <p className="text-gray-600">Monitor and manage crop health issues</p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <Button 
            variant="outline" 
            onClick={() => navigate("/fields")}
          >
            <ApperIcon name="ArrowLeft" size={20} className="mr-2" />
            Back to Fields
          </Button>
          <Button 
            variant="primary"
            onClick={() => setShowForm(true)}
          >
            <ApperIcon name="Plus" size={20} className="mr-2" />
            New Report
          </Button>
        </div>
      </div>

      {/* Report Form */}
      {showForm && (
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {editingReport ? "Edit Report" : "New Pest/Disease Report"}
            </h2>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={resetForm}
            >
              <ApperIcon name="X" size={20} />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Field *" required>
                <select
                  name="fieldId"
                  value={formData.fieldId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-surface bg-surface focus:border-primary focus:outline-none"
                  required
                >
                  <option value="">Select Field</option>
                  {fields.map(field => (
                    <option key={field.Id} value={field.Id}>
                      {field.name} - {field.cropType}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Issue Type *" required>
                <select
                  name="issueType"
                  value={formData.issueType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-surface bg-surface focus:border-primary focus:outline-none"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="pest">Pest</option>
                  <option value="disease">Disease</option>
                </select>
              </FormField>

              <FormField label="Pest/Disease Name *" required>
                <Input
                  name="pestName"
                  value={formData.pestName}
                  onChange={handleInputChange}
                  placeholder="e.g., Aphids, Leaf Blight, etc."
                  required
                />
              </FormField>

              <FormField label="Severity Level *" required>
                <select
                  name="severity"
                  value={formData.severity}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-surface bg-surface focus:border-primary focus:outline-none"
                  required
                >
                  <option value="">Select Severity</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </FormField>

              <FormField label="Location">
                <Input
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Specific area within field"
                />
              </FormField>

              <FormField label="Date Reported *" required>
                <Input
                  type="date"
                  name="dateReported"
                  value={formData.dateReported}
                  onChange={handleInputChange}
                  required
                />
              </FormField>
            </div>

            <FormField label="Description">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the issue, symptoms, and any observations..."
                rows={4}
                className="w-full px-4 py-3 rounded-lg border-2 border-surface bg-surface focus:border-primary focus:outline-none resize-none"
              />
            </FormField>

            <FormField label="Images">
              <div className="space-y-4">
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white hover:file:bg-primary/90"
                />
                <p className="text-sm text-gray-500">
                  Upload images of the affected crops (Max 5MB per image)
                </p>
                
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border-2 border-surface"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-error text-white rounded-full p-1 hover:bg-error/80"
                        >
                          <ApperIcon name="X" size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </FormField>

            <div className="flex gap-4 pt-4">
              <Button 
                type="submit" 
                variant="primary"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <ApperIcon name="Loader2" size={20} className="mr-2 animate-spin" />
                    {editingReport ? "Updating..." : "Submitting..."}
                  </>
                ) : (
                  <>
                    <ApperIcon name="Save" size={20} className="mr-2" />
                    {editingReport ? "Update Report" : "Submit Report"}
                  </>
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={resetForm}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Reports List */}
      {reports.length === 0 ? (
        <Empty 
          title="No Reports Yet" 
          description="Start by reporting your first pest or disease issue to track crop health."
          actionLabel="Create Report"
          icon="Bug"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {reports.map((report) => (
            <Card key={report.Id} className="p-6 hover:shadow-xl">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <ApperIcon 
                    name={getIssueTypeIcon(report.issueType)} 
                    size={20} 
                    className="text-secondary" 
                  />
                  <h3 className="text-lg font-semibold text-gray-800">{report.pestName}</h3>
                </div>
                <Badge variant={getSeverityVariant(report.severity)}>
                  {report.severity}
                </Badge>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <ApperIcon name="Map" size={16} className="mr-2 text-info" />
                  <span>{getFieldName(report.fieldId)}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">
                  <ApperIcon name="Calendar" size={16} className="mr-2 text-accent" />
                  <span>{format(new Date(report.dateReported), 'MMM d, yyyy')}</span>
                </div>

                {report.location && (
                  <div className="flex items-center text-sm text-gray-600">
                    <ApperIcon name="MapPin" size={16} className="mr-2 text-warning" />
                    <span>{report.location}</span>
                  </div>
                )}

                <div className="flex items-center text-sm text-gray-600">
                  <ApperIcon name="Tag" size={16} className="mr-2 text-primary" />
                  <span className="capitalize">{report.issueType}</span>
                </div>
              </div>

              {report.description && (
                <div className="p-3 bg-gray-50 rounded-lg mb-4">
                  <p className="text-sm text-gray-700">{report.description}</p>
                </div>
              )}

              {report.images.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    <ApperIcon name="Image" size={16} className="inline mr-1" />
                    {report.images.length} image{report.images.length !== 1 ? 's' : ''}
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {report.images.slice(0, 3).map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Report ${index + 1}`}
                        className="w-full h-16 object-cover rounded border-2 border-surface"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => handleEdit(report)}
                >
                  <ApperIcon name="Edit" size={16} className="mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleDelete(report.Id)}
                  className="text-error hover:bg-error/10"
                >
                  <ApperIcon name="Trash2" size={16} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PestReports;