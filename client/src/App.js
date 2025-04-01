import React, { useState } from "react";
import Home from "./components/Home";
import LogIn from "./components/LogIn";
import SignUp from "./components/SignUp";
import Footer from "./components/Footer";
import Dashboard from "./components/Dashboard"; // Import Dashboard component

const App = () => {
  const [showForm, setShowForm] = useState("login"); // 'null' means no form is shown initially
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track if user is logged in
  const [userInfo, setUserInfo] = useState(null); // Store logged in user's info

  // Toggle between login and signup forms
  const toggleForm = (formType) => {
    setShowForm(formType); // Set to "login" or "signup" based on the button clicked
  };

  // Close the modal and return to home page view
  const closeModal = () => {
    setShowForm(null); // Close the form
  };

  // Handle login action and set the user as logged in
  const handleLogin = (user) => {
    setIsLoggedIn(true);
    setUserInfo(user); // Save user information after login
    setShowForm(null); // Hide login/signup form
    console.log("User logged in:", user);
  };

  // Handle logout action and reset the logged-in state
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserInfo(null); // Clear user info when logged out
    console.log("User logged out");
  };

  return (
    <div>
      {/* Show home page if user is not logged in */}
      {!isLoggedIn ? (
        <div>
          <Home toggleForm={toggleForm} />
          {showForm === "login" && <LogIn closeModal={closeModal} onLogin={handleLogin} />}
          {showForm === "signup" && <SignUp closeModal={closeModal} />}
        </div>
      ) : (
        // Show the dashboard page if the user is logged in
        <Dashboard user={userInfo} onLogout={handleLogout} />
      )}
      
      <Footer />
    </div>
  );
};

export default App;
