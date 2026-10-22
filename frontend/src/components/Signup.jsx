import React, { useState } from "react";
import "./Signup.css";

export default function Signup({ onSignIn, onBack, onAccountCreated }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    accepted: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function update(event) {
    const { name, value, checked, type } = event.target;
    setForm((old) => ({
      ...old,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function submit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (form.name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (form.password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }
    if (!form.accepted) {
      setError("Please accept the Terms of Service and Privacy Policy.");
      return;
    }

    setSuccess(
      "Form validated successfully. Connect an authentication service to create your account."
    );
  }

  return (
    <main className="signup-page">
      <header className="signup-topbar">
        <button className="signup-brand" onClick={onBack} type="button">
          <span className="signup-brand-star">✦</span>
          <span>AgentFlow <b>AI</b></span>
        </button>
        <button className="signup-back" onClick={onBack} type="button">
          ← Back to home
        </button>
      </header>

      <section className="signup-layout">
        <div className="signup-intro">
          <span className="signup-eyebrow">✧ Multi-Agent AI Research Assistant</span>
          <h1>
            Research Smarter
            <br />
            <span>with AI Agents.</span>
          </h1>
          <p className="signup-intro-text">
            Create your account to start exploring the power of multiple AI
            agents for research, document analysis and evidence-based insights.
          </p>

          <div className="signup-benefits">
            <article>
              <span className="signup-benefit-icon purple">▤</span>
              <div>
                <h3>Upload &amp; Analyze</h3>
                <p>Upload documents and get instant summaries</p>
              </div>
            </article>
            <article>
              <span className="signup-benefit-icon blue">♧</span>
              <div>
                <h3>Multi-Agent Collaboration</h3>
                <p>Research, analyze, write and verify using AI agents</p>
              </div>
            </article>
            <article>
              <span className="signup-benefit-icon violet">▥</span>
              <div>
                <h3>Data-Driven Insights</h3>
                <p>Get reliable and well-structured answers</p>
              </div>
            </article>
            <article>
              <span className="signup-benefit-icon red">♢</span>
              <div>
                <h3>Secure &amp; Private</h3>
                <p>Your data stays local when using local models</p>
              </div>
            </article>
          </div>

          <blockquote className="signup-quote">
            <span>“</span>
            <p>One question. Multiple AI agents.<br />Verified insights.</p>
          </blockquote>
        </div>

        <section className="signup-card">
          <div className="signup-card-heading">
            <h2>Create Your Account</h2>
            <p>Join AgentFlow AI and start your research journey</p>
          </div>

          <div className="signup-socials">
            <button type="button" onClick={() => setError("Google sign-in is not configured yet.")}>
              <span className="google-mark">G</span> Continue with Google
            </button>
            <button type="button" onClick={() => setError("GitHub sign-in is not configured yet.")}>
              <span className="github-mark">●</span> Continue with GitHub
            </button>
          </div>

          <div className="signup-divider"><span>or</span></div>

          <form onSubmit={submit} noValidate>
            <label htmlFor="signup-name">Full Name</label>
            <input
              id="signup-name"
              name="name"
              autoComplete="name"
              placeholder="Enter your full name"
              value={form.name}
              onChange={update}
              required
            />

            <label htmlFor="signup-email">Email Address</label>
            <input
              id="signup-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email address"
              value={form.email}
              onChange={update}
              required
            />

            <label htmlFor="signup-password">Password</label>
            <input
              id="signup-password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="Create a password (minimum 8 characters)"
              value={form.password}
              onChange={update}
              required
            />

            <label htmlFor="signup-confirm">Confirm Password</label>
            <input
              id="signup-confirm"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Confirm your password"
              value={form.confirmPassword}
              onChange={update}
              required
            />

            <label className="signup-terms">
              <input
                name="accepted"
                type="checkbox"
                checked={form.accepted}
                onChange={update}
              />
              <span>
                I agree to the <a href="#terms" onClick={(e) => e.preventDefault()}>Terms of Service</a>
                {" "}and{" "}
                <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
              </span>
            </label>

            {error && <p className="signup-message signup-error" role="alert">{error}</p>}
            {success && <p className="signup-message signup-success" role="status">{success}</p>}

            <button className="signup-submit" type="submit">
              Create Account <span>→</span>
            </button>
          </form>

          <p className="signup-signin">
            Already have an account?
            <button type="button" onClick={onSignIn}>Sign In</button>
          </p>
        </section>
      </section>
    </main>
  );
}

