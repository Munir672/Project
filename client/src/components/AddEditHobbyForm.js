import React, { useState, useEffect } from 'react';

const AddEditHobbyForm = ({ userId, hobby, onSave }) => {
  const [name, setName] = useState(hobby ? hobby.name : '');
  const [description, setDescription] = useState(hobby ? hobby.description : '');
  const [progress, setProgress] = useState(hobby ? hobby.progress : '');
  

  const handleSave = async () => {
    const hobbyData = { name, description, userId };
  
    console.log('Saving hobby with data:', hobbyData); // Debugging message
  
    if (!userId) {
      console.error('User ID is missing!'); // Debugging message if userId is not present
    }
  
    try {
      let response;
  
      if (hobby) {
        console.log('Updating existing hobby with ID:', hobby._id); // Debugging message
        response = await fetch(`/api/hobbies/${hobby._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(hobbyData),
        });
      } else {
        console.log('Adding new hobby'); // Debugging message
        console.log('hobbyData being sent:', hobbyData); // Check the hobby data before sending

        response = await fetch('/api/hobbies', {
  
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(hobbyData),
        });
      }
  
      if (response.ok) {
        console.log('Hobby saved successfully'); // Debugging message
        onSave();
      } else {
        console.error('Failed to save hobby, response:', response); // Debugging message
      }
    } catch (error) {
      console.error('Error saving hobby:', error); // Debugging message
    }
  };
  

  useEffect(() => {
    console.log('Component mounted or hobby prop changed:', hobby); // Debugging message
  }, [hobby]);

  return (
    <div className="form-modal">
      <h2>{hobby ? 'Update Hobby' : 'Add Hobby'}</h2>
      <form>
        <div>
          <label htmlFor="name">Hobby Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              console.log('Name field changed to:', e.target.value); // Debugging message
            }}
            className="form-field"
            placeholder="Enter hobby name"
          />
        </div>
        <div>
          <label htmlFor="description">Hobby Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              console.log('Description field changed to:', e.target.value); // Debugging message
            }}
            className="form-field"
            placeholder="Describe your hobby"
          />
        </div>
        <div>
          <label htmlFor="progress">Hobby Progress</label>
          <input
            type="text"
            id="progress"
            value={progress}
            onChange={(e) => {
              setProgress(e.target.value);
              console.log('Progress field changed to:', e.target.value); // Debugging message
            }}
            className="form-field"
            placeholder="Progress in your hobby"
          />
        </div>
        <button type="button" onClick={handleSave} className="form-btn">
          {hobby ? 'Update Hobby' : 'Add Hobby'}
        </button>
      </form>
    </div>
  );
};

export default AddEditHobbyForm;
