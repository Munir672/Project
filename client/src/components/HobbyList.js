import React, { useState, useEffect } from 'react';

const HobbyList = ({ userId }) => {
  const [hobbies, setHobbies] = useState([]);

  useEffect(() => {
    const fetchHobbies = async () => {
      try {
        // Using the Fetch API
        const response = await fetch(`/api/hobbies/${userId}`);

        // Check if the response is successful (status code 200-299)
        if (!response.ok) {
          throw new Error('Failed to fetch hobbies');
        }

        const data = await response.json();
        setHobbies(data.hobbies);
      } catch (error) {
        console.error('Error fetching hobbies:', error);
      }
    };

    fetchHobbies();
  }, [userId]);

  return (
    <div>
      <h2>Your Hobbies</h2>
      <ul>
        {hobbies.map((hobby) => (
          <li key={hobby._id}>
            <h3>{hobby.name}</h3>
            <p>{hobby.description}</p>
            <p>{hobby.progress}</p>
            {/* Add buttons to edit and delete */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HobbyList;
