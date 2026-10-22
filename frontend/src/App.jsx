import React, { useState } from "react";
import LandingPage from "./components/LandingPage";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import "./App.css";

export default function App() {
  const [page, setPage] = useState("landing");

  function handleAccountCreated() {
    setPage("dashboard");
  }

  if (page === "dashboard") {
    return <Dashboard />;
  }

  if (page === "signup") {
    return (
      <Signup
        onBack={() => setPage("landing")}
        onSignIn={() =>
          window.alert("Sign-in authentication is not configured yet.")
        }
        onAccountCreated={handleAccountCreated}
      />
    );
  }

  return (
    <LandingPage
      onGetStarted={() => setPage("signup")}
    />
  );
}
