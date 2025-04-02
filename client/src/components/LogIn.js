import React, { useState } from "react"; // Import React and useState

const LogIn = ({ closeModal, onLogin }) => {
  const [username, setUsername] = useState(""); // username state
  const [email, setEmail] = useState(""); // email state
  const [errorMessage, setErrorMessage] = useState(""); // error message state
  const [successMessage, setSuccessMessage] = useState(""); // success message state

  // Handle form submission for login
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload on form submission

    const userData = { username, email }; // user data object

    try {
      const response = await fetch("/api/login", {
        method: "POST", // Send data with POST method
        headers: {
          "Content-Type": "application/json", // Send JSON data
        },
        body: JSON.stringify(userData), // Convert user data to JSON string format
      });

      const data = await response.json(); // Parse the server response into JSON

      if (response.ok) { // If login is successful
        onLogin(data.user); // Trigger the onLogin function passed from App.js
        setSuccessMessage("Login successful!");
        setErrorMessage(""); // Clear any previous error
      } else {
        setSuccessMessage("");
        setErrorMessage(data.message || "Login failed. Please try again.");
      }
    } catch (error) { // Catch any unexpected errors
      setErrorMessage("Error during login. Please try again.");
      setSuccessMessage("");
      console.error("Error during login:", error); // Log error
    }
  };

  return (
    <div className="auth-container">
      <div className="form-card">
        <h2>Log In</h2>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            type="text"
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)} // Update username state
          />
          <label>Email</label>
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Update email state
          />
          <button className="btn login-btn" type="submit"> 
            Log In
          </button>
        </form>

    
      </div>
    </div>
  );
};

export default LogIn;
