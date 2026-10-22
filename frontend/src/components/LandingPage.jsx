import React from "react";
import "./LandingPage.css";

const agents = [
  { icon: "⌕", name: "Research Agent", desc: "Searches information" },
  { icon: "▤", name: "Document Agent", desc: "Analyzes uploaded documents" },
  { icon: "▥", name: "Analysis Agent", desc: "Finds insights and patterns" },
  { icon: "✎", name: "Writer Agent", desc: "Creates structured reports" },
  { icon: "✓", name: "Verifier Agent", desc: "Checks facts and validates" },
];

const features = [
  {
    icon: "▤",
    name: "Document Intelligence",
    desc: "Upload PDFs and get summaries, key insights and answers.",
    color: "purple",
  },
  {
    icon: "♧",
    name: "Multi-Agent Collaboration",
    desc: "Research, analyze, write and verify using specialized AI agents.",
    color: "blue",
  },
  {
    icon: "▥",
    name: "AI + ML Analysis",
    desc: "Use trained ML models for data analysis and predictions.",
    color: "violet",
  },
  {
    icon: "♢",
    name: "Verified Results",
    desc: "Get evidence-based answers with source references.",
    color: "red",
  },
];

export default function LandingPage({ onGetStarted }) {
  const start = () => {
    if (onGetStarted) onGetStarted();
    else window.location.href = "/app";
  };

  return (
    <main className="af-landing">
      <header className="af-nav">
        <a className="af-brand" href="#home">
          <span className="af-brand-icon">✦</span>
          <span>AgentFlow <b>AI</b></span>
        </a>

        <nav className="af-nav-links">
          <a className="active" href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#how-it-works">How it Works</a>
          <a href="#agents">Agents</a>
          <a href="#use-cases">Use Cases</a>
          <a href="#about">About</a>
        </nav>

        <button className="af-button af-button-primary af-nav-cta" onClick={start}>
          Get Started <span>→</span>
        </button>
      </header>

      <section className="af-hero" id="home">
        <div className="af-hero-copy">
          <span className="af-eyebrow">
            <span>♧</span> Multi-Agent AI Research Assistant
          </span>

          <h1>
            One Question.
            <br />
            <span className="af-gradient-text">Multiple AI Agents.</span>
            <br />
            Verified Insights.
          </h1>

          <p className="af-hero-description">
            Upload documents, ask research questions, and let multiple
            AI agents collaborate to give you accurate, well-structured
            and evidence-based answers.
          </p>

          <div className="af-hero-actions">
            <button className="af-button af-button-primary af-start" onClick={start}>
              Get Started Free <span>→</span>
            </button>
            <a className="af-button af-button-outline" href="#how-it-works">
              <span className="af-play">▶</span> Watch Demo
            </a>
          </div>

          <div className="af-trust-row">
            <span><b>♢</b> Local &amp; Secure</span>
            <span><b>♧</b> Multi-Agent System</span>
            <span><b>▤</b> Document Analysis</span>
            <span><b>✓</b> Evidence-based Answers</span>
          </div>
        </div>

        <div className="af-preview-wrap">
          <div className="af-preview">
            <aside className="af-preview-sidebar">
              <div className="af-preview-brand"><span>✦</span> AgentFlow <b>AI</b></div>
              <div className="af-preview-menu selected">◉ <span>Chat</span></div>
              <div className="af-preview-menu">▤ <span>Upload Document</span></div>
              <div className="af-preview-menu">◷ <span>Recent Research</span></div>
              <div className="af-preview-menu">♧ <span>Agents</span></div>
              <div className="af-preview-menu">⚙ <span>Settings</span></div>
            </aside>

            <div className="af-preview-main">
              <div className="af-preview-top">
                <span>🌐 English⌄</span>
                <span className="af-avatar">M</span>
                <span>Manasa⌄</span>
              </div>

              <div className="af-preview-welcome">
                <span className="af-mini-spark">✦</span>
                <h3>Hello, 👋</h3>
                <h2>Ask Anything. Discover More</h2>
                <p>
                  Upload documents or ask a research question.
                  Multiple AI agents will work together to give you the best answers.
                </p>
              </div>

              <div className="af-preview-input">
                <span>Ask a question or upload a document...</span>
                <div className="af-preview-input-bottom">
                  <span>♧ Attach File (PDF, etc.)</span>
                  <span>◎ Web Search</span>
                  <button aria-label="Send example question" onClick={start}>➤</button>
                </div>
              </div>

              <div className="af-example-box">
                <b>Example Questions</b>
                <div className="af-example-grid">
                  <span>▤ <small>Summarize this research paper</small></span>
                  <span>⌕ <small>Find latest research on climate change</small></span>
                  <span>▥ <small>Analyze this dataset</small></span>
                  <span>☷ <small>Compare these two papers</small></span>
                </div>
              </div>
            </div>

            <aside className="af-preview-right">
              <h4>AI Agents</h4>
              {agents.map((agent, i) => (
                <div className="af-agent-mini" key={agent.name}>
                  <span className={`af-agent-icon tone-${i}`}>{agent.icon}</span>
                  <div><b>{agent.name}</b><small>{agent.desc}</small></div>
                </div>
              ))}

              <div className="af-recent">
                <h4>Recent Research <a href="#how-it-works">View All</a></h4>
                <p>▤ <span>Impact of AI on Agriculture<small>2 hours ago</small></span></p>
                <p>▤ <span>Smart Farming Techniques<small>1 day ago</small></span></p>
                <p>▤ <span>Crop Yield Prediction<small>3 days ago</small></span></p>
              </div>
            </aside>
          </div>

          <div className="af-powered">
            <span className="af-powered-icon">♧</span>
            <span>Powered by <b>Ollama, LangGraph,</b><br /> TensorFlow and more</span>
          </div>
          <span className="af-decoration">╱╲</span>
        </div>
      </section>

      <section className="af-features" id="features">
        <div className="af-section-heading">
          <span>KEY FEATURES</span>
          <h2>Everything You Need for Smarter Research</h2>
          <p>
            A simple and powerful platform that combines multiple AI agents,
            document analysis<br className="af-desktop-break" />
            and machine learning to give you reliable insights.
          </p>
        </div>

        <div className="af-feature-grid">
          {features.map((feature) => (
            <article className="af-feature-card" key={feature.name}>
              <div className={`af-feature-icon ${feature.color}`}>{feature.icon}</div>
              <div>
                <h3>{feature.name}</h3>
                <p>{feature.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="af-how" id="how-it-works">
        <div className="af-section-heading">
          <span>HOW IT WORKS</span>
        </div>

        <div className="af-steps">
          <article className="af-step">
            <div className="af-step-icon">▤</div>
            <span className="af-step-number">1</span>
            <div><h3>Upload or Ask</h3><p>Upload a document or type your research question.</p></div>
          </article>
          <span className="af-step-arrow">→</span>
          <article className="af-step">
            <div className="af-step-icon blue">⌕</div>
            <span className="af-step-number">2</span>
            <div><h3>Research &amp; Analyze</h3><p>Multiple AI agents work together to find insights.</p></div>
          </article>
          <span className="af-step-arrow">→</span>
          <article className="af-step">
            <div className="af-step-icon">▤</div>
            <span className="af-step-number">3</span>
            <div><h3>Get Verified Answer</h3><p>Receive a structured report with sources and key findings.</p></div>
          </article>
        </div>
      </section>

      <footer className="af-footer" id="about">
        <a className="af-brand" href="#home"><span className="af-brand-icon">✦</span><span>AgentFlow <b>AI</b></span></a>
        <span>Research smarter. Discover more.</span>
      </footer>
    </main>
  );
}
