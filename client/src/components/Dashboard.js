import React, { useState, useEffect } from "react";
import HobbyList from "./HobbyList";
import AddEditHobbyForm from "./AddEditHobbyForm";
import ProgressModal from "./Progress";

const Dashboard = ({ user, onLogout }) => {
  const [hobbies, setHobbies] = useState([]);
  const [selectedHobby, setSelectedHobby] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);

  // Function to load hobbies from the backend
  const loadHobbyList = async () => {
    if (!user || !user._id) {
      console.error("User not available or missing _id");
      return;
    }

    try {
      console.log("Fetching hobbies for userId:", user._id);
      const response = await fetch(`/api/hobbies/${user._id}`);

      if (response.ok) {
        const data = await response.json();
        console.log("Fetched hobbies:", JSON.stringify(data.hobbies, null, 2));
        setHobbies(data.hobbies || []);
      } else {
        console.error("Failed to fetch hobbies");
      }
    } catch (error) {
      console.error("Error fetching hobbies:", error);
    }
  };

  // Load hobbies when the component mounts
  useEffect(() => {
    loadHobbyList();
  }, [user._id]);

  const handleSaveHobby = async (hobby) => {
    console.log("Attempting to save hobby:", hobby);
    if (!hobby || !hobby.name) {
      console.error("Hobby data is missing or incomplete:", hobby);
      return;
    }

    try {
      const method = selectedHobby ? "PUT" : "POST";
      const url = selectedHobby ? `/api/hobbies/${selectedHobby._id}` : "/api/hobbies";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: hobby.name,
          description: hobby.description,
          progress: hobby.progress,
          userId: user._id,
        }),
      });

      if (response.ok) {
        const hobbydata = await response.json();
        const hobby = hobbydata.data;
        console.log("Hobby saved successfully:", JSON.stringify(hobby, null, 2));

        // Update the hobbies state after saving the hobby
        setHobbies((prevHobbies) => {
          if (selectedHobby) {
            return prevHobbies.map((h) => (h._id === selectedHobby._id ? hobby : h));
          } else {
            return [...prevHobbies, hobby];
          }
        });

        // Close the form and refetch hobbies
        setShowForm(false);

        // Refetch the hobbies list to reflect changes
        loadHobbyList();

        setSelectedHobby(null);
      } else {
        console.error("Failed to save hobby");
      }
    } catch (error) {
      console.error("Error saving hobby:", error);
    }
  };

  const handleDeleteHobby = async (hobbyId) => {
    try {
      const response = await fetch(`/api/hobbies/${hobbyId}`, { method: "DELETE" });

      if (!response.ok) {
        throw new Error("Failed to delete hobby");
      }

      // Remove the deleted hobby from the list
      setHobbies((prevHobbies) => prevHobbies.filter((hobby) => hobby._id !== hobbyId));
    } catch (error) {
      console.error("Error deleting hobby:", error);
    }
  };

  const handleSelectHobby = (hobby) => {
    console.log("Selected Hobby:", hobby);
    setSelectedHobby(hobby);
    setShowForm(true);
  };

  const toggleProgressModal = () => {
    console.log("Toggling progress modal. Current state:", showProgressModal);
    setShowProgressModal(!showProgressModal);
  };

  return (
    <div className="dashboard-container">
      <h2>Welcome {user.username}!</h2>
      <p>Email: {user.email}</p>

      <div className="dashboard-content">
        <button onClick={() => setShowForm(true)} className="btn add-hobby-btn">
          Add Hobby
        </button>

        <h3>Your Hobbies</h3>
        <p>Note: There is a bug, for seeing your changes you need to logout and login again.</p>

        <HobbyList
          hobbies={hobbies}
          onSelectHobby={handleSelectHobby}
          onTrackProgress={toggleProgressModal}
          onDeleteHobby={handleDeleteHobby}
        />
      </div>

      {showForm && (
        <AddEditHobbyForm
          hobby={selectedHobby}
          onSave={handleSaveHobby}
          userId={user._id}
          onClose={() => setShowForm(false)}
        />
      )}

      {showProgressModal && <ProgressModal hobby={selectedHobby} onClose={toggleProgressModal} />}

      <button onClick={onLogout} className="btn logout-btn">
        Log Out
      </button>
    </div>
  );
};

export default Dashboard;
