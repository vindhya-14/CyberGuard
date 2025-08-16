import React, { useState } from "react";
import type { DemoProps } from "../../types";
import CodeBlock from "../CodeBlock";

const XssDemo: React.FC<DemoProps> = ({ onExploit }) => {
  const [isSecureMode, setIsSecureMode] = useState(false);
  const [comment, setComment] = useState("");
  const [submittedComment, setSubmittedComment] = useState("");
  const [exploitSuccess, setExploitSuccess] = useState<boolean | null>(null);
  const [showTutorial, setShowTutorial] = useState(true);
  const [attackHistory, setAttackHistory] = useState<string[]>([]);

  // Common XSS payload examples
  const payloadExamples = [
    `<script>alert('XSS Attack!')</script>`,
    `<img src="x" onerror="alert('Hacked!')" />`,
    `<a href="javascript:alert('Clickjacking')">Free Gift!</a>`,
    `<svg/onload=alert('SVG XSS')>`,
    `<iframe src="javascript:alert('IFrame Attack')"></iframe>`,
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedComment(comment);

    // Check for potential XSS patterns
    const isExploited = /<script|onerror|javascript:|<svg|onload|iframe/i.test(
      comment
    );
    setExploitSuccess(isExploited);
    onExploit(isSecureMode ? false : isExploited);

    // Add to attack history if it was an exploit attempt
    if (isExploited) {
      setAttackHistory((prev) => [...prev, comment]);
    }
  };

  const handlePayloadClick = (payload: string) => {
    setComment(payload);
  };

  const renderComment = () => {
    if (isSecureMode) {
      // Secure rendering - treat as text
      return <span>{submittedComment}</span>;
    } else {
      // Insecure rendering - render as HTML
      return <span dangerouslySetInnerHTML={{ __html: submittedComment }} />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header with mode toggle */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-cyber-accent mb-1">
            Cross-Site Scripting (XSS) Demo
          </h2>
          <p className="text-cyber-text-secondary">
            Learn how XSS attacks work by experimenting with different payloads
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowTutorial(!showTutorial)}
            className="px-3 py-1 bg-cyber-secondary/30 hover:bg-cyber-secondary/50 rounded-md text-sm transition-colors"
          >
            {showTutorial ? "Hide Tutorial" : "Show Tutorial"}
          </button>
          <div className="flex rounded-lg p-1 bg-black/20">
            <button
              onClick={() => setIsSecureMode(false)}
              className={`px-4 py-1 rounded-md text-sm transition-colors ${
                !isSecureMode
                  ? "bg-cyber-error text-white"
                  : "text-cyber-text-secondary"
              }`}
            >
              Attack Mode
            </button>
            <button
              onClick={() => setIsSecureMode(true)}
              className={`px-4 py-1 rounded-md text-sm transition-colors ${
                isSecureMode
                  ? "bg-cyber-success text-white"
                  : "text-cyber-text-secondary"
              }`}
            >
              Defense Mode
            </button>
          </div>
        </div>
      </div>

      {/* Tutorial Section */}
      {showTutorial && (
        <div className="bg-cyber-surface/50 border border-cyber-accent/30 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-cyber-accent mb-2">
            What is XSS?
          </h3>
          <p className="text-cyber-text-secondary mb-3">
            Cross-Site Scripting (XSS) is a security vulnerability that allows
            attackers to inject malicious scripts into web pages viewed by other
            users. These scripts can steal cookies, deface websites, or redirect
            users to malicious sites.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black/30 p-3 rounded-lg">
              <h4 className="font-bold text-cyber-error mb-1">The Problem:</h4>
              <p className="text-sm">
                When websites render user input as HTML without proper
                sanitization, browsers can't distinguish between legitimate
                content and malicious scripts.
              </p>
            </div>
            <div className="bg-black/30 p-3 rounded-lg">
              <h4 className="font-bold text-cyber-success mb-1">
                The Solution:
              </h4>
              <p className="text-sm">
                Always sanitize user input and render it as text by default.
                Only use HTML rendering when absolutely necessary and with
                proper safeguards.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Interactive Demo Section */}
        <div>
          <div className="bg-cyber-surface/50 border border-cyber-secondary/30 rounded-lg p-5">
            <h3 className="text-xl font-semibold text-cyber-accent mb-3">
              Try It Yourself
            </h3>

            {/* Payload Examples */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-cyber-text-secondary mb-2">
                Try these example payloads:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {payloadExamples.map((payload, index) => (
                  <button
                    key={index}
                    onClick={() => handlePayloadClick(payload)}
                    className="bg-black/40 hover:bg-cyber-secondary/30 p-2 rounded text-xs font-mono text-left truncate transition-colors"
                    title={payload}
                  >
                    {payload.length > 30
                      ? `${payload.substring(0, 30)}...`
                      : payload}
                  </button>
                ))}
              </div>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="comment"
                  className="block text-sm font-bold text-cyber-text-secondary mb-2"
                >
                  {isSecureMode
                    ? "Try to attack (safe mode):"
                    : "Try to attack (vulnerable mode):"}
                </label>
                <textarea
                  id="comment"
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Enter your malicious payload here..."
                  className="w-full bg-cyber-surface border border-cyber-secondary/30 rounded-md p-2 focus:ring-2 focus:ring-cyber-primary focus:outline-none transition-all font-mono text-sm"
                />
              </div>
              <button
                type="submit"
                className="bg-cyber-secondary hover:bg-cyber-accent text-white font-bold py-2 px-4 rounded-md transition-all shadow-glow-accent"
              >
                Submit Payload
              </button>
            </form>
          </div>

          {/* Results Section */}
          {submittedComment && (
            <div className="mt-6 bg-cyber-surface/50 border border-cyber-secondary/30 rounded-lg p-5">
              <h4 className="font-bold text-cyber-text-primary mb-3">
                Simulated Comment Section
              </h4>
              <div className="p-4 border border-dashed border-cyber-secondary/40 rounded-md bg-black/20 min-h-20">
                <p className="text-cyber-text-secondary">
                  <strong>Visitor:</strong> {renderComment()}
                </p>
              </div>

              {exploitSuccess !== null && (
                <div
                  className={`mt-4 p-3 rounded-md text-sm font-semibold ${
                    isSecureMode || !exploitSuccess
                      ? "bg-cyber-success/20 text-cyber-success"
                      : "bg-cyber-error/20 text-cyber-error"
                  }`}
                >
                  {isSecureMode
                    ? "✅ Safe! Defense mode prevented the attack by rendering as text."
                    : exploitSuccess
                    ? "☠️ Success! The malicious script executed because the site is vulnerable."
                    : "⚠️ No malicious script detected in this input."}
                </div>
              )}
            </div>
          )}

          {/* Attack History */}
          {attackHistory.length > 0 && (
            <div className="mt-6 bg-cyber-surface/50 border border-cyber-secondary/30 rounded-lg p-5">
              <h4 className="font-bold text-cyber-text-primary mb-3">
                Successful Attacks
              </h4>
              <div className="space-y-2">
                {attackHistory.map((attack, index) => (
                  <div
                    key={index}
                    className="p-2 bg-black/30 rounded text-xs font-mono"
                  >
                    {attack}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Educational Content */}
        <div>
          <div className="bg-cyber-surface/50 border border-cyber-secondary/30 rounded-lg p-5 mb-6">
            <h3 className="text-xl font-semibold text-cyber-accent mb-3">
              {isSecureMode
                ? "🛡️ Secure Implementation"
                : "☠️ Vulnerable Implementation"}
            </h3>

            {isSecureMode ? (
              <div>
                <p className="text-sm text-cyber-text-secondary mb-4">
                  In secure mode, we treat all user input as plain text. React
                  automatically escapes content rendered within JSX, converting
                  dangerous characters to their HTML entity equivalents.
                </p>
                <CodeBlock language="jsx">
                  {`// SAFE: Render content as text
// React escapes content by default
function Comment({ text }) {
  return <p>{text}</p>;
}

// Usage:
<Comment text={userInput} />`}
                </CodeBlock>
                <div className="mt-4 p-3 bg-cyber-success/10 border border-cyber-success/30 rounded-md">
                  <h4 className="font-bold text-cyber-success mb-1">
                    Why This Works
                  </h4>
                  <p className="text-sm">
                    React converts {"<script>"} to {"&lt;script&gt;"} which
                    browsers display as text rather than executing as code.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-cyber-text-secondary mb-4">
                  In vulnerable mode, we use dangerouslySetInnerHTML to bypass
                  React's built-in protections. This tells React to inject raw
                  HTML exactly as provided by the user.
                </p>
                <CodeBlock language="jsx">
                  {`// UNSAFE: Renders raw HTML from user input
function Comment({ html }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

// Usage:
<Comment html={userInput} />`}
                </CodeBlock>
                <div className="mt-4 p-3 bg-cyber-error/10 border border-cyber-error/30 rounded-md">
                  <h4 className="font-bold text-cyber-error mb-1">
                    Why This Is Dangerous
                  </h4>
                  <p className="text-sm">
                    The browser receives and executes any JavaScript in the
                    HTML, leading to potential account hijacking, data theft, or
                    malware distribution.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Best Practices */}
          <div className="bg-cyber-surface/50 border border-cyber-secondary/30 rounded-lg p-5">
            <h3 className="text-xl font-semibold text-cyber-accent mb-3">
              Best Practices
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-cyber-success mr-2">✓</span>
                <span className="text-sm">
                  Always render user input as text by default
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-cyber-success mr-2">✓</span>
                <span className="text-sm">
                  Use{" "}
                  <code className="bg-black/30 px-1 rounded">
                    dangerouslySetInnerHTML
                  </code>{" "}
                  only when absolutely necessary
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-cyber-success mr-2">✓</span>
                <span className="text-sm">
                  Sanitize HTML with libraries like DOMPurify before rendering
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-cyber-success mr-2">✓</span>
                <span className="text-sm">
                  Use Content Security Policy (CSP) headers as an additional
                  defense layer
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-cyber-success mr-2">✓</span>
                <span className="text-sm">
                  Implement proper cookie security (HttpOnly, Secure flags)
                </span>
              </li>
            </ul>

            <div className="mt-4 p-3 bg-cyber-secondary/10 border border-cyber-secondary/30 rounded-md">
              <h4 className="font-bold text-cyber-accent mb-1">
                Real-World Impact
              </h4>
              <p className="text-sm">
                XSS vulnerabilities have been used to steal millions of user
                credentials, hijack sessions, and spread malware. Major
                companies like Google, Facebook, and Twitter have all dealt with
                XSS issues.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default XssDemo;
