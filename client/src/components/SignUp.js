import React, { useState } from "react";

const SignUp = ({ closeModal }) => { //passing closeModal as param to the component
  // State to manage form inputs
  const [username, setUsername] = useState(""); //username
  const [email, setEmail] = useState(""); //email
  const [errorMessage, setErrorMessage] = useState(""); //errormessage
  const [successMessage, setSuccessMessage] = useState(""); //successMessage

  // Handle form submission
  const handleSubmit = async (e) => { //
    e.preventDefault(); // Prevent the default form submission

    // Create user data object
    const userData = { username, email }; //by default they are empty

    try {
      // Send the POST request to the backend
      const response = await fetch("/api/signup", {  //use fetch with post method to send data to back, use await to wait
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Tell the server to expect JSON
        },
        body: JSON.stringify(userData), // Convert the user data to JSON string
      });

      const data = await response.json(); // have the response as json in an object named data
      console.log(data) // debugging purpose

      if (response.ok) {// If signup is successful

        setSuccessMessage("User signed up successfully!"); //success message
        setErrorMessage(""); // Clear any error message
      } else {
        // If there is an error
        setSuccessMessage(""); // Clear any success message
        setErrorMessage(data.message || "Signup failed. Please try again."); //set the error message to one that we got from back or the default
        console.error("Signup failed:", data.message || "Signup failed. Please try again.");
      }
    } catch (error) { //for any random error
      setErrorMessage("Error during signup. Please try again.");
      setSuccessMessage(""); // Clear any success message
      console.error("Error during signup:", error);
    }
  };

  return (
    <div className="auth-container">
      <div className="form-card">
        <h2>Sign Up</h2>
        
        {/* Display success or error messages if one has a value */}
        {successMessage && <p className="success-message">{successMessage}</p>} 
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {/* Signup Form on submit it calles handlesubmit fucniton */}
        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            type="text"
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)} // Update state when user types something else
          />
          <label>Email</label>
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Update state
          />
          <button className="btn signup-btn" type="submit"> 
            Sign Up
          </button>
        </form>

      </div>
    </div>
  );
};

export default SignUp;
