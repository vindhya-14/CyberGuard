import React, { useState } from "react";
import type { DemoProps, User } from "../../types";
import CodeBlock from "../CodeBlock";

// Mock database with more realistic data
const mockUsers: User[] = [
  {
    id: 1,
    username: "admin",
    role: "admin",
    email: "admin@company.com",
    profile: "System administrator with full privileges",
    lastLogin: "2023-05-15T14:30:00Z",
  },
  {
    id: 2,
    username: "jane_doe",
    role: "manager",
    email: "jane@company.com",
    profile: "Marketing department manager",
    lastLogin: "2023-05-14T09:15:00Z",
  },
  {
    id: 3,
    username: "john_smith",
    role: "user",
    email: "john@company.com",
    profile: "Sales representative",
    lastLogin: "2023-05-12T16:45:00Z",
  },
  {
    id: 4,
    username: "test_user",
    role: "tester",
    email: "test@company.com",
    profile: "QA tester account",
    lastLogin: "2023-04-28T11:20:00Z",
  },
];

// Common SQL injection payload patterns for detection
const payloadPatterns = ["OR '1'='1", "UNION SELECT", "DROP TABLE", "--"];

const payloadExamples = [
  "' OR '1'='1",
  "admin' --",
  "' UNION SELECT * FROM users --",
  "'; DROP TABLE users --",
  "' OR username LIKE '%",
];

const SqlInjectionDemo: React.FC<DemoProps> = ({ onExploit }) => {
  const [isSecureMode, setIsSecureMode] = useState(false);
  const [username, setUsername] = useState("");
  const [foundUsers, setFoundUsers] = useState<User[] | null>(null);
  const [query, setQuery] = useState("");
  const [showTutorial, setShowTutorial] = useState(true);
  const [attackHistory, setAttackHistory] = useState<string[]>([]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    let results: User[] = [];
    let generatedQuery = "";

    // Detect if input contains common SQLi patterns
    const isExploitAttempt = payloadPatterns.some((pattern) =>
      username.includes(pattern)
    );

    if (isSecureMode) {
      // SECURE: Simulate parameterized query
      generatedQuery = `SELECT * FROM users WHERE username = ?; -- Parameters: ['${username}']`;
      results = mockUsers.filter((u) => u.username === username);
    } else {
      // INSECURE: Simulate string concatenation vulnerability
      generatedQuery = `SELECT * FROM users WHERE username = '${username}';`;

      // Simulate common SQLi effects for educational demo
      if (username === "' OR '1'='1" || username.includes("OR '1'='1")) {
        results = mockUsers; // Classic SQLi returns all users
      } else if (username.includes("admin' --")) {
        results = mockUsers.filter((u) => u.username === "admin"); // Comment bypass
      } else if (username.includes("UNION SELECT")) {
        results = [...mockUsers, ...mockUsers]; // Simulate UNION attack
      } else {
        results = mockUsers.filter((u) => u.username === username);
      }
    }

    setQuery(generatedQuery);
    setFoundUsers(results);

    // Flag exploit success only if insecure mode, exploit detected, and results are suspiciously large
    const exploitSuccess =
      !isSecureMode && isExploitAttempt && results.length > 1;
    onExploit(exploitSuccess);

    if (exploitSuccess) {
      setAttackHistory((prev) => [...prev, generatedQuery]);
    }
  };

  const handlePayloadClick = (payload: string) => {
    setUsername(payload);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header with mode toggle */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-cyber-accent mb-1">
            SQL Injection Demo
          </h2>
          <p className="text-cyber-text-secondary">
            Learn how SQL injection works by experimenting with different
            payloads
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
            What is SQL Injection?
          </h3>
          <p className="text-cyber-text-secondary mb-3">
            SQL injection is a code injection technique that might destroy your
            database. It is one of the most common web hacking techniques. It
            occurs when user input is improperly sanitized before being used in
            SQL queries.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black/30 p-3 rounded-lg">
              <h4 className="font-bold text-cyber-error mb-1">The Problem:</h4>
              <p className="text-sm">
                When applications build SQL queries by concatenating user input
                directly into the query string, attackers can craft inputs that
                modify the query's structure and behavior.
              </p>
            </div>
            <div className="bg-black/30 p-3 rounded-lg">
              <h4 className="font-bold text-cyber-success mb-1">
                The Solution:
              </h4>
              <p className="text-sm">
                Use parameterized queries (prepared statements) which separate
                SQL code from data. This ensures user input is always treated as
                data, never as executable code.
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

            {/* Search Form */}
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-bold text-cyber-text-secondary mb-2"
                >
                  {isSecureMode
                    ? "Try to attack (safe mode):"
                    : "Try to attack (vulnerable mode):"}
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username or payload..."
                  className="w-full bg-cyber-surface border border-cyber-secondary/30 rounded-md p-2 focus:ring-2 focus:ring-cyber-primary focus:outline-none transition-all font-mono text-sm"
                />
              </div>
              <button
                type="submit"
                className="bg-cyber-secondary hover:bg-cyber-accent text-white font-bold py-2 px-4 rounded-md transition-all shadow-glow-accent"
              >
                Execute Query
              </button>
            </form>
          </div>

          {/* Results Section */}
          {query && (
            <div className="mt-6 bg-cyber-surface/50 border border-cyber-secondary/30 rounded-lg p-5">
              <h4 className="font-bold text-cyber-text-primary mb-3">
                Simulated SQL Query
              </h4>
              <CodeBlock language="sql">{query}</CodeBlock>

              {foundUsers && (
                <div className="mt-4">
                  <h4 className="font-bold mb-2">Query Results:</h4>
                  {foundUsers.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-black/20">
                        <thead>
                          <tr className="border-b border-cyber-secondary/30">
                            <th className="px-4 py-2 text-left">ID</th>
                            <th className="px-4 py-2 text-left">Username</th>
                            <th className="px-4 py-2 text-left">Role</th>
                            <th className="px-4 py-2 text-left">Email</th>
                          </tr>
                        </thead>
                        <tbody>
                          {foundUsers.map((user) => (
                            <tr
                              key={user.id}
                              className="border-b border-cyber-secondary/10"
                            >
                              <td className="px-4 py-2">{user.id}</td>
                              <td className="px-4 py-2">{user.username}</td>
                              <td className="px-4 py-2">{user.role}</td>
                              <td className="px-4 py-2">{user.email}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-cyber-text-secondary italic p-4 bg-black/20 rounded">
                      No records found
                    </div>
                  )}
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
                  In secure mode, we use parameterized queries which separate
                  SQL code from data. The database knows exactly which parts are
                  commands and which are data values.
                </p>
                <CodeBlock language="javascript">
                  {`// SAFE: Using parameterized queries
const query = 'SELECT * FROM users WHERE username = ?';
db.execute(query, [username], (error, results) => {
  // Process results
});

// Equivalent in different languages:
// PHP: $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
// Python: cursor.execute("SELECT * FROM users WHERE username = %s", (username,))`}
                </CodeBlock>
                <div className="mt-4 p-3 bg-cyber-success/10 border border-cyber-success/30 rounded-md">
                  <h4 className="font-bold text-cyber-success mb-1">
                    Why This Works
                  </h4>
                  <p className="text-sm">
                    The database driver handles the parameter separately from
                    the SQL command, ensuring user input is always treated as
                    data, never as executable code.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-cyber-text-secondary mb-4">
                  In vulnerable mode, the application concatenates user input
                  directly into the SQL query string. This allows attackers to
                  "break out" of the intended query structure.
                </p>
                <CodeBlock language="javascript">
                  {`// UNSAFE: String concatenation
const query = "SELECT * FROM users WHERE username = '" + username + "'";
db.query(query, (error, results) => {
  // Vulnerable to injection
});

// What happens when username is "' OR '1'='1":
// SELECT * FROM users WHERE username = '' OR '1'='1'`}
                </CodeBlock>
                <div className="mt-4 p-3 bg-cyber-error/10 border border-cyber-error/30 rounded-md">
                  <h4 className="font-bold text-cyber-error mb-1">
                    Why This Is Dangerous
                  </h4>
                  <p className="text-sm">
                    The database interprets the malicious input as part of the
                    SQL command, potentially allowing data theft, modification,
                    or even database deletion.
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
                  Always use parameterized queries/prepared statements
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-cyber-success mr-2">✓</span>
                <span className="text-sm">
                  Use ORMs that handle parameterization automatically
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-cyber-success mr-2">✓</span>
                <span className="text-sm">
                  Implement the principle of least privilege for database
                  accounts
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-cyber-success mr-2">✓</span>
                <span className="text-sm">
                  Validate and sanitize all user input
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-cyber-success mr-2">✓</span>
                <span className="text-sm">
                  Use stored procedures with parameters
                </span>
              </li>
            </ul>

            <div className="mt-4 p-3 bg-cyber-secondary/10 border border-cyber-secondary/30 rounded-md">
              <h4 className="font-bold text-cyber-accent mb-1">
                Real-World Impact
              </h4>
              <p className="text-sm">
                SQL injection has been responsible for some of the largest data
                breaches in history, including the 2011 Sony Pictures hack (77
                million accounts compromised) and the 2009 Heartland Payment
                Systems breach (134 million credit cards exposed).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SqlInjectionDemo;
