import React, { useState } from "react";
import Home from "./components/Home";
import { BrowserRouter as Router } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <div className="App">
        <Home />
      </div>
    </Router>
  );
};

export default App;
