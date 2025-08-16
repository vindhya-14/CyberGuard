import React, { useState } from "react";
import type { DemoProps } from "../../types";
import CodeBlock from "../CodeBlock";

// Mock file system with more realistic structure
const mockFileSystem: Record<string, string> = {
  "public/images/cat.jpg": "Binary content of cat.jpg",
  "public/images/dog.png": "Binary content of dog.png",
  "public/index.html":
    "<!DOCTYPE html>\n<html>\n<head>\n<title>Homepage</title>\n</head>\n<body>\n<h1>Welcome</h1>\n</body>\n</html>",
  "public/css/style.css": "body { font-family: Arial; color: #333; }",
  "public/js/app.js": 'console.log("App loaded");',
  "/etc/passwd":
    "root:x:0:0:root:/root:/bin/bash\nbin:x:1:1:bin:/bin:/sbin/nologin\ndaemon:x:2:2:daemon:/sbin:/sbin/nologin",
  "/etc/shadow":
    "root:$6$salt$hash:19131:0:99999:7:::\nbin:*:17834:0:99999:7:::",
  "/var/log/nginx/access.log":
    '127.0.0.1 - - [15/May/2023] "GET / HTTP/1.1" 200 612\n192.168.1.1 - - [15/May/2023] "GET /images/cat.jpg HTTP/1.1" 200 12543',
  "/var/log/auth.log":
    "May 15 09:10:01 server CRON[1234]: pam_unix(cron:session): session opened for user root\nMay 15 09:10:01 server CRON[1234]: pam_unix(cron:session): session closed for user root",
  "config/database.yml":
    "production:\n  adapter: postgresql\n  host: localhost\n  database: app_prod\n  username: app_user\n  password: s3cr3tp@ssw0rd",
};

// Common directory traversal payloads
const payloadExamples = [
  "../../etc/passwd",
  "%2e%2e%2fetc%2fpasswd", // URL encoded
  "....//....//etc/passwd", // Double dot slash
  "public/../../../etc/shadow",
  "images/../../../../var/log/nginx/access.log",
  "..\\..\\..\\windows\\win.ini", // Windows style
];

const DirectoryTraversalDemo: React.FC<DemoProps> = ({ onExploit }) => {
  const [isSecureMode, setIsSecureMode] = useState(false);
  const [filename, setFilename] = useState("public/images/cat.jpg");
  const [fileContent, setFileContent] = useState("");
  const [error, setError] = useState("");
  const [showTutorial, setShowTutorial] = useState(true);
  const [attackHistory, setAttackHistory] = useState<string[]>([]);

  const handleFetchFile = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFileContent("");
    let isExploit = false;

    if (isSecureMode) {
      // SECURE: Validate and normalize the path
      try {
        const safeBasePath = "public/";
        const requestedPath = new URL(`file:///${safeBasePath}${filename}`)
          .pathname;
        const normalizedPath = requestedPath
          .replace(/\/+/g, "/")
          .replace(/\/$/, "");

        // Check if path is within allowed directory
        if (normalizedPath.startsWith(`/${safeBasePath}`)) {
          const finalPath = normalizedPath.substring(1);
          if (mockFileSystem[finalPath]) {
            setFileContent(mockFileSystem[finalPath]);
          } else {
            setError("Error: File not found in public directory");
          }
        } else {
          setError("Error: Access denied - path traversal attempt detected");
          isExploit = true;
        }
      } catch (err) {
        setError("Error: Invalid path format");
      }
    } else {
      // INSECURE: Directly use the user input
      const requestedPath = filename;
      if (mockFileSystem[requestedPath]) {
        setFileContent(mockFileSystem[requestedPath]);
        isExploit =
          requestedPath.includes("..") ||
          requestedPath.startsWith("/") ||
          requestedPath.includes("%2e%2e") ||
          requestedPath.includes("..\\");
      } else {
        setError("Error: File not found");
      }
    }

    if (isExploit) {
      setAttackHistory((prev) => [...prev, filename]);
    }
    onExploit(isExploit);
  };

  const handlePayloadClick = (payload: string) => {
    setFilename(payload);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header with mode toggle */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-cyber-accent mb-1">
            Directory Traversal Demo
          </h2>
          <p className="text-cyber-text-secondary">
            Learn how path traversal attacks work by experimenting with
            different payloads
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
            What is Directory Traversal?
          </h3>
          <p className="text-cyber-text-secondary mb-3">
            Directory traversal (or path traversal) is a vulnerability that
            allows attackers to access files and directories outside of the web
            root folder by manipulating file paths with special sequences like
            `../` or encoded characters.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black/30 p-3 rounded-lg">
              <h4 className="font-bold text-cyber-error mb-1">The Problem:</h4>
              <p className="text-sm">
                When applications use user input to construct file paths without
                proper validation, attackers can navigate outside the intended
                directory to access sensitive system files.
              </p>
            </div>
            <div className="bg-black/30 p-3 rounded-lg">
              <h4 className="font-bold text-cyber-success mb-1">
                The Solution:
              </h4>
              <p className="text-sm">
                Always validate and normalize file paths, ensuring they remain
                within the intended directory. Use allowlists of permitted files
                when possible.
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
              File Viewer
            </h3>
            <p className="text-sm text-cyber-text-secondary mb-4">
              Try to access files. The server should only serve files from the
              `public/` directory.
            </p>

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

            {/* File Access Form */}
            <form onSubmit={handleFetchFile} className="space-y-4">
              <div>
                <label
                  htmlFor="filename"
                  className="block text-sm font-bold text-cyber-text-secondary mb-2"
                >
                  {isSecureMode
                    ? "Try to attack (safe mode):"
                    : "Try to attack (vulnerable mode):"}
                </label>
                <input
                  id="filename"
                  type="text"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  placeholder="Enter file path..."
                  className="w-full bg-cyber-surface border border-cyber-secondary/30 rounded-md p-2 focus:ring-2 focus:ring-cyber-primary focus:outline-none transition-all font-mono text-sm"
                />
              </div>
              <button
                type="submit"
                className="bg-cyber-secondary hover:bg-cyber-accent text-white font-bold py-2 px-4 rounded-md transition-all shadow-glow-accent"
              >
                View File
              </button>
            </form>
          </div>

          {/* Results Section */}
          {(fileContent || error) && (
            <div className="mt-6 bg-cyber-surface/50 border border-cyber-secondary/30 rounded-lg p-5">
              <h4 className="font-bold text-cyber-text-primary mb-3">
                {error ? "Error" : "File Content"}
              </h4>
              {error ? (
                <div
                  className={`p-4 rounded-md ${
                    error.includes("Access denied")
                      ? "bg-cyber-error/20 text-cyber-error"
                      : "bg-cyber-warning/20 text-cyber-warning"
                  }`}
                >
                  {error}
                </div>
              ) : (
                <div className="relative">
                  <CodeBlock language="text">{fileContent}</CodeBlock>
                  <div className="absolute top-2 right-2 bg-black/70 text-xs px-2 py-1 rounded text-cyber-text-secondary">
                    {fileContent.length} bytes
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Attack History */}
          {attackHistory.length > 0 && (
            <div className="mt-6 bg-cyber-surface/50 border border-cyber-secondary/30 rounded-lg p-5">
              <h4 className="font-bold text-cyber-error mb-3">
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
                  In secure mode, the application validates the file path to
                  ensure it stays within the allowed directory. It normalizes
                  the path and checks for traversal attempts before accessing
                  any files.
                </p>
                <CodeBlock language="javascript">
                  {`// SECURE: Path validation
const path = require('path');

function getSafePath(userInput) {
  const safeDir = path.resolve('/var/www/public');
  const requestedPath = path.join(safeDir, userInput);
  const normalizedPath = path.normalize(requestedPath);

  // Ensure the final path is within the safe directory
  if (!normalizedPath.startsWith(safeDir)) {
    throw new Error('Path traversal attempt detected');
  }
  
  return normalizedPath;
}`}
                </CodeBlock>
                <div className="mt-4 p-3 bg-cyber-success/10 border border-cyber-success/30 rounded-md">
                  <h4 className="font-bold text-cyber-success mb-1">
                    Why This Works
                  </h4>
                  <p className="text-sm">
                    The path is normalized and checked to ensure it doesn't
                    escape the allowed directory, blocking any attempts with
                    `../` or similar sequences.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-cyber-text-secondary mb-4">
                  In vulnerable mode, the application directly uses user input
                  to construct file paths without validation, allowing attackers
                  to navigate outside the intended directory.
                </p>
                <CodeBlock language="javascript">
                  {`// UNSAFE: Direct path concatenation
app.get('/file', (req, res) => {
  const filePath = '/var/www/public/' + req.query.filename;
  fs.readFile(filePath, (err, data) => {
    res.send(data);
  });
});

// Vulnerable to:
// GET /file?filename=../../etc/passwd`}
                </CodeBlock>
                <div className="mt-4 p-3 bg-cyber-error/10 border border-cyber-error/30 rounded-md">
                  <h4 className="font-bold text-cyber-error mb-1">
                    Why This Is Dangerous
                  </h4>
                  <p className="text-sm">
                    The application blindly trusts user input, allowing access
                    to sensitive system files like password files, configuration
                    files, or application logs.
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
                  Always validate and normalize user-supplied file paths
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-cyber-success mr-2">✓</span>
                <span className="text-sm">
                  Use allowlists of permitted files when possible
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-cyber-success mr-2">✓</span>
                <span className="text-sm">
                  Run web servers with least privilege (don't run as root)
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-cyber-success mr-2">✓</span>
                <span className="text-sm">
                  Use chroot jails or containerization to limit filesystem
                  access
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-cyber-success mr-2">✓</span>
                <span className="text-sm">
                  Implement proper error handling that doesn't reveal filesystem
                  structure
                </span>
              </li>
            </ul>

            <div className="mt-4 p-3 bg-cyber-secondary/10 border border-cyber-secondary/30 rounded-md">
              <h4 className="font-bold text-cyber-accent mb-1">
                Real-World Impact
              </h4>
              <p className="text-sm">
                Directory traversal vulnerabilities have been used in major
                attacks, including the 2017 Equifax breach that exposed 147
                million records. Many CMS platforms have had directory traversal
                vulnerabilities that allowed attackers to access configuration
                files with database credentials.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectoryTraversalDemo;
