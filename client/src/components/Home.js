import React from "react";


const Home = ({ toggleForm }) => {
    return (
        <div className="home-container">

            <header className="home-header">
                <h1>Welcome to HobbyApp!</h1>
                <p>Discover endless possibilities with us. Let’s bring your ideas to life!</p>
            </header>

            {/* Only show buttons if no form is being shown */}
            <div className="button-container">
                <button className="btn login-btn" onClick={() => toggleForm("login")}>Log In</button>
                <button className="btn signup-btn" onClick={() => toggleForm("signup")}>Sign Up</button>
            </div>
            
        </div>
    );
};

export default Home;
