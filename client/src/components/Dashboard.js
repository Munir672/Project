import React, { useState, useEffect } from "react"; //importing useState and useEffect
import HobbyList from "./HobbyList"; //import HobbyList component to display
import AddEditHobbyForm from "./AddEditHobbyForm"; //import AddEditHobby to be able to add and edit
import ProgressModal from "./Progress"; //import progressModal to add progress to the existing

const Dashboard = ({ user, onLogout }) => { // getting the user and onLogout from parent
  const [hobbies, setHobbies] = useState([]);  // List of hobbies
  const [selectedHobby, setSelectedHobby] = useState(null);  // Hobby selected for editing
  const [showForm, setShowForm] = useState(false);  // Whether to show the add/edit form
  const [showProgressModal, setShowProgressModal] = useState(false); // Whether to show the progress modal

  // Fetch hobbies when the component mounts or user.id changes
  useEffect(() => {
    if (!user || !user._id) { //if there is no user or no userID, return
      console.error('User not available or missing _id');
      return;
    }

    const fetchHobbies = async () => {
      console.log(`Fetching hobbies for userId: ${user._id}`);
      try {
        const response = await fetch(`/api/hobbies/${user._id}`);//using the user id to fetch that user's hobby
        if (response.ok) { //if response is good
          const data = await response.json(); // put the servers response to data 
          setHobbies(data.hobbies); //take the hobbies from data and put it in setHobbies
        } else {
          console.error('Failed to fetch hobbies'); 
        }
      } catch (error) {
        console.error('Error fetching hobbies:', error);
      }
    };

    fetchHobbies();
  }, [user._id]); //if we have userId or it changes

  // Handle adding or editing a hobby
  const handleSaveHobby = async (hobby) => {
    console.log('Saving hobby data:', hobby); // Debugging message
    try {
      const method = selectedHobby ? 'PUT' : 'POST'; //if the selected hobby is true the method is put if not its post
      const url = selectedHobby 
        ? `/api/hobbies/${selectedHobby._id}` //if selectedHobby = true / url is this
        : `/api/hobbies`; //if not this

      const response = await fetch(url, { //now we fetch from that url variable
        method: method, //method variable
        headers: {
          'Content-Type': 'application/json', //format is going to be json
        },
        body: JSON.stringify({ //convert to json format
          name: hobby.name,
          description: hobby.description,
          progress: hobby.progress,
          userId: user._id, // Ensure the userId is passed correctly
        }),
      });

      if (response.ok) {
        const data = await response.json(); //convert the response to json
        console.log('Hobby saved successfully:', data); //debug message
        if (selectedHobby) { //if a hobby is selected
          setHobbies(hobbies => hobbies.map(h => h._id === selectedHobby._id ? data.hobby : h));//going through hobbies if a hobby is matched we replace that with new one

        } else {
          setHobbies([...hobbies, data.hobby]);// else add the hobby to the array of the hobbies
        }
        setShowForm(false); // Close the form after saving
        setSelectedHobby(null); // Reset selected hobby
      } else {
        console.error('Failed to save hobby');
      }
    } catch (error) {
      console.error('Error saving hobby:', error);
    }
  };

  // Handle selecting a hobby for editing or progress tracking
  const handleSelectHobby = (hobby) => {
    setSelectedHobby(hobby);
    setShowForm(true); // Show form to edit hobby
  };

  // Toggle progress modal
  const toggleProgressModal = () => {
    setShowProgressModal(!showProgressModal); //not show progress modal
  };

  return (
    <div className="dashboard-container">
      <h2>Welcome to your Dashboard, {user.username}!</h2>
      <p>Email: {user.email}</p>

      <div className="dashboard-content">
        <h3>Your Hobbies</h3>
        <button onClick={() => setShowForm(true)} className="btn add-hobby-btn">Add Hobby</button>
        
        <HobbyList 
          hobbies={hobbies} 
          onSelectHobby={handleSelectHobby} //Passing param
          onTrackProgress={toggleProgressModal}
        />
      </div>

      {showForm && (
        <AddEditHobbyForm 
          hobby={selectedHobby} 
          onSave={handleSaveHobby} //passing param
          userId={user._id}
          onClose={() => setShowForm(false)} 
        />
      )}

      {showProgressModal && (
        <ProgressModal 
          hobby={selectedHobby} 
          onClose={toggleProgressModal}
        />
      )}

      <button onClick={onLogout} className="btn logout-btn">
        Log Out
      </button>
    </div>
  );
};

export default Dashboard;
