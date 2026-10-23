import React, { useState } from "react";
import LandingPage from "./components/LandingPage";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import "./App.css";

export default function App() {
  const [page, setPage] = useState("landing");

  if (page === "dashboard") {
    return <Dashboard />;
  }

  if (page === "signup") {
    return (
      <Signup
        onBack={() => setPage("landing")}
        onSignIn={() => window.alert("Sign-in is not configured yet.")}
        onAccountCreated={() => setPage("dashboard")}
      />
    );
  }

  return (
    <LandingPage
      onGetStarted={() => setPage("signup")}
    />
  );
}
