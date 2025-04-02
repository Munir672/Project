import React from 'react';

const HobbyList = ({ hobbies = [], onSelectHobby, onTrackProgress, onDeleteHobby }) => {
  if (!Array.isArray(hobbies)) return <p>Loading...</p>; // Prevents errors

  if (hobbies.length === 0) return <p>No hobbies found.</p>;

  return (
    <div>
      <h2>Your Hobbies</h2>
      <ul>
        {hobbies.map((hobby) => 
          hobby ? ( // Check if hobby is not undefined
            <li key={hobby._id}>
              <div className="hobby-container">
                <h3>{hobby.name}</h3>
                <p>{hobby.description}</p>
                <button onClick={() => onSelectHobby(hobby)}>Edit</button>
                <button onClick={() => onTrackProgress(hobby)}>Track Progress</button>
                <button onClick={() => onDeleteHobby(hobby._id)}>Delete</button>
              </div>
            </li>
          ) : null
        )}
      </ul>
    </div>
  );
};

export default HobbyList;
