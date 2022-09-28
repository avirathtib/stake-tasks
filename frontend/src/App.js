import React, { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import StakeForm from "./components/StakeForm";
import ConfirmStake from "./components/ConfirmStake";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// import Stake from "../../artifacts/contracts/Stake.sol";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<StakeForm />} />
          <Route path="/stake-confirm/:stakeId" element={<ConfirmStake />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
