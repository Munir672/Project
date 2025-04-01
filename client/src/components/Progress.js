import React, { useState, useEffect } from "react";

const Progress = ({ hobby, onClose }) => {
  const [progress, setProgress] = useState(hobby ? hobby.progress : 0); // Initialize progress state
  const [loading, setLoading] = useState(false); // Loading state to manage UI during save

  useEffect(() => {
    if (hobby) {
      setProgress(hobby.progress); // Update progress when hobby is selected
    }
  }, [hobby]);

  const handleProgressChange = (event) => {
    const value = event.target.value;
    setProgress(value); // Update progress when user changes the input
  };

  const handleSaveProgress = async () => {
    if (!hobby) return;

    setLoading(true); // Show loading state while saving
    try {
      const response = await fetch(`/api/hobbies/${hobby._id}/progress`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ progress }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Progress saved successfully:", data);
        onClose(); // Close the modal after saving progress
      } else {
        console.error("Failed to save progress");
      }
    } catch (error) {
      console.error("Error saving progress:", error);
    } finally {
      setLoading(false); // Hide loading state after save attempt
    }
  };

  return (
    <div className="progress-modal">
      <div className="progress-modal-content">
        <h3>Track Progress for {hobby ? hobby.name : "Unknown Hobby"}</h3>

        <label htmlFor="progress">Progress:</label>
        <input
          type="number"
          id="progress"
          name="progress"
          value={progress}
          min="0"
          max="100"
          onChange={handleProgressChange}
        />

        <div className="progress-modal-actions">
          <button onClick={onClose} disabled={loading}>Cancel</button>
          <button onClick={handleSaveProgress} disabled={loading}>
            {loading ? "Saving..." : "Save Progress"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Progress;
