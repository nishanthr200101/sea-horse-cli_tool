import React from 'react';
import './App.css'; // Ensure to import the CSS file

const App = () => {
  return (
    <div className="welcome-container">
      <h1 className="welcome-message">
        <p className="highlight">React JS</p>
        <p className="small-text">powered by</p>
        <p className="small-text" id="target-element">SEA HORSE</p>
      </h1>
    </div>
  );
};

export default App;