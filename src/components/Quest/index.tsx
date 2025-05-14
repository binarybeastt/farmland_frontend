"use client";

import React, { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { createQuest } from "../../services/quest";
import { QuestData, QuestRequirements } from "../../types/quest";
import { useRouter } from "next/navigation";
import { getRandomQuestImage } from "../../utils/questImages";
import "./style.css";

export const QuestCreation: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  // Initialize with harvest requirements by default
  const initialHarvestRequirements: QuestRequirements = {
    requirement_type: 'quantity',
    target_kg: 1,
    crop_type: ""
  };

  // Initialize with storage/transport requirements
  const initialConditionsRequirements: QuestRequirements = {
    requirement_type: 'conditions',
    target_temperature: 15.0,
    temperature_tolerance: 2.0,
    target_humidity: 60.0,
    humidity_tolerance: 5.0
  };

  const [formData, setFormData] = useState<QuestData>({
    title: "",
    description: "",
    quest_type: "harvest",
    points_reward: 1,
    requirements: initialHarvestRequirements,
    active: true,
    expires_at: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
  });

  // Update requirements when quest type changes
  useEffect(() => {
    if (formData.quest_type === 'harvest') {
      setFormData(prev => ({
        ...prev,
        requirements: initialHarvestRequirements
      }));
    } else if (formData.quest_type === 'storage' || formData.quest_type === 'transport') {
      setFormData(prev => ({
        ...prev,
        requirements: initialConditionsRequirements
      }));
    }
  }, [formData.quest_type]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "active") {
      setFormData(prev => ({
        ...prev,
        active: (e.target as HTMLInputElement).checked
      }));
    } else if (name.startsWith("requirements.")) {
      const requirementField = name.split(".")[1];
      const numValue = [
        "target_kg", 
        "min_quality_rating", 
        "max_loss_percentage", 
        "harvest_count",
        "target_temperature",
        "temperature_tolerance",
        "target_humidity",
        "humidity_tolerance"
      ].includes(requirementField)
        ? Number(value)
        : value;
      
      setFormData(prev => ({
        ...prev,
        requirements: {
          ...prev.requirements,
          [requirementField]: numValue
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === "points_reward" ? Number(value) : value
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setSuccess(false);

    try {
      // Format data for API and add a random image
      const formattedData = {
        ...formData,
        // Ensure the date is properly formatted - some backends expect specific formats
        expires_at: new Date(formData.expires_at).toISOString().split('.')[0] + 'Z',
        // Add a random image from our collection
        image: getRandomQuestImage()
      };
      
      console.log("Sending quest data:", formattedData);
      
      await createQuest(formattedData);
      setSuccess(true);
      
      // Reset form after successful submission
      if (formData.quest_type === 'harvest') {
        setFormData({
          title: "",
          description: "",
          quest_type: "harvest",
          points_reward: 1,
          requirements: initialHarvestRequirements,
          active: true,
          expires_at: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
        });
      } else {
        setFormData({
          title: "",
          description: "",
          quest_type: "storage",
          points_reward: 1,
          requirements: initialConditionsRequirements,
          active: true,
          expires_at: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
        });
      }
    } catch (err: any) {
      console.error("Quest creation error:", err);
      setError(err.message || "Failed to create quest. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Render requirement fields based on quest type
  const renderRequirementFields = () => {
    if (formData.quest_type === 'harvest') {
      return (
        <>
          <div className="form-group">
            <label className="form-label">Target KG</label>
            <input
              type="number"
              name="requirements.target_kg"
              className="form-input"
              min="1"
              step="0.1"
              value={formData.requirements.target_kg}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Crop Type</label>
            <input
              type="text"
              name="requirements.crop_type"
              className="form-input"
              placeholder="Enter crop type"
              value={formData.requirements.crop_type}
              onChange={handleChange}
              required
            />
          </div>
        </>
      );
    } else if (formData.quest_type === 'storage' || formData.quest_type === 'transport') {
      return (
        <>
          <div className="form-group">
            <label className="form-label">Target Temperature (°C)</label>
            <input
              type="number"
              name="requirements.target_temperature"
              className="form-input"
              step="0.1"
              value={formData.requirements.target_temperature}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Temperature Tolerance (±°C)</label>
            <input
              type="number"
              name="requirements.temperature_tolerance"
              className="form-input"
              min="0.1"
              step="0.1"
              value={formData.requirements.temperature_tolerance}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Target Humidity (%)</label>
            <input
              type="number"
              name="requirements.target_humidity"
              className="form-input"
              min="0"
              max="100"
              step="0.1"
              value={formData.requirements.target_humidity}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Humidity Tolerance (±%)</label>
            <input
              type="number"
              name="requirements.humidity_tolerance"
              className="form-input"
              min="0.1"
              max="50"
              step="0.1"
              value={formData.requirements.humidity_tolerance}
              onChange={handleChange}
              required
            />
          </div>
        </>
      );
    }
  };

  return (
    <div className="quest-creation">
      <div className="frame-wrapper">
        <div className="frame">
          <div className="header">
            <div className="title-section">
              <div className="title">Create New Quest</div>
              <p className="subtitle">
                Create quests for farmers to complete and earn rewards
              </p>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">Quest created successfully!</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  name="title"
                  className="form-input"
                  placeholder="Enter quest title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  className="form-input form-textarea"
                  placeholder="Enter quest description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Quest Type</label>
                <select
                  name="quest_type"
                  className="form-input"
                  value={formData.quest_type}
                  onChange={handleChange}
                  required
                >
                  <option value="harvest">Harvest</option>
                  <option value="storage">Storage</option>
                  <option value="transport">Transport</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Points Reward</label>
                <input
                  type="number"
                  name="points_reward"
                  className="form-input"
                  min="1"
                  value={formData.points_reward}
                  onChange={handleChange}
                  required
                />
              </div>

              {renderRequirementFields()}

              <div className="form-group">
                <label className="form-label">Expiry Date</label>
                <input
                  type="date"
                  name="expires_at"
                  className="form-input"
                  value={formData.expires_at}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    name="active"
                    checked={formData.active}
                    onChange={handleChange}
                  />
                  <span className="checkmark"></span>
                  Active
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Quest"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}; 