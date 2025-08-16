import React, { useState } from "react";
import type { DemoProps, User } from "../../types";
import CodeBlock from "../CodeBlock";

// Mock database with more realistic data
const mockUsers: User[] = [
  {
    id: 101,
    username: "alice_w",
    role: "user",
    email: "alice@example.com",
    profile:
      "Personal profile of Alice. Private data: DOB 05/15/1990, SSN ***-**-****",
    address: "123 Main St, Anytown",
    paymentMethods: ["VISA **** 4242"],
  },
  {
    id: 202,
    username: "bob_smith",
    role: "user",
    email: "bob@example.com",
    profile:
      "Bob's private profile. Medical ID: XK-789456, Insurance: BlueCross",
    address: "456 Oak Ave, Somewhere",
    paymentMethods: ["MC **** 5555", "AMEX **** 9999"],
  },
  {
    id: 303,
    username: "admin_jane",
    role: "admin",
    email: "jane@company.com",
    profile: "System Administrator. Employee ID: ADM-789, Access Level: 5",
    address: "789 Admin Blvd, HQ",
    paymentMethods: ["CORP **** 0000"],
  },
  {
    id: 404,
    username: "service_account",
    role: "system",
    email: "service@internal",
    profile: "Internal service account. API key: SK-*****-789-XYZ",
    address: "",
    paymentMethods: [],
  },
];

// Current user session
const currentUserSession = { userId: 101, role: "user" };

// Common IDOR attack patterns
const attackPatterns = [
  { id: "101", description: "Your own profile (authorized)" },
  { id: "202", description: "Another user's profile" },
  { id: "303", description: "Admin profile" },
  { id: "404", description: "System account" },
  { id: "999", description: "Non-existent ID" },
  { id: "101%27+OR+%271%27%3D%271", description: "SQL injection attempt" },
];

const IdorDemo: React.FC<DemoProps> = ({ onExploit }) => {
  const [isSecureMode, setIsSecureMode] = useState(false);
  const [profileId, setProfileId] = useState(
    currentUserSession.userId.toString()
  );
  const [retrievedProfile, setRetrievedProfile] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [showTutorial, setShowTutorial] = useState(true);
  const [attackHistory, setAttackHistory] = useState<string[]>([]);

  const handleFetchProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setRetrievedProfile(null);

    const targetId = parseInt(profileId, 10);
    const targetProfile = mockUsers.find((u) => u.id === targetId);
    let isExploit = false;

    if (!targetProfile && !isNaN(targetId)) {
      setError("Error: Profile not found");
      onExploit(false);
      return;
    }

    if (isSecureMode) {
      // SECURE: Check authorization
      if (
        targetProfile &&
        (targetProfile.id === currentUserSession.userId ||
          currentUserSession.role === "admin")
      ) {
        setRetrievedProfile(targetProfile);
      } else {
        setError("Access Denied: You are not authorized to view this profile");
        isExploit = true; // Track failed attempts in secure mode
      }
    } else {
      // INSECURE: Directly fetch whatever ID is provided
      if (targetProfile) {
        setRetrievedProfile(targetProfile);
        isExploit = targetProfile.id !== currentUserSession.userId;
      }
    }

    if (isExploit) {
      setAttackHistory((prev) => [...prev, profileId]);
    }
    onExploit(isExploit);
  };

  const handleAttackPatternClick = (id: string) => {
    setProfileId(id);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header with mode toggle */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-cyber-accent mb-1">
            IDOR Vulnerability Demo
          </h2>
          <p className="text-cyber-text-secondary">
            Learn how Insecure Direct Object Reference works by experimenting
            with different profile IDs
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

      {/* Current session info */}
      <div className="bg-cyber-surface/50 border border-cyber-secondary/30 rounded-lg p-3 mb-4">
        <p className="text-sm">
          <strong>Logged in as:</strong> {currentUserSession.userId} (
          {mockUsers.find((u) => u.id === currentUserSession.userId)?.username})
          |<strong> Role:</strong> {currentUserSession.role}
        </p>
      </div>

      {/* Tutorial Section */}
      {showTutorial && (
        <div className="bg-cyber-surface/50 border border-cyber-accent/30 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-cyber-accent mb-2">
            What is IDOR?
          </h3>
          <p className="text-cyber-text-secondary mb-3">
            Insecure Direct Object Reference (IDOR) occurs when an application
            provides direct access to objects based on user-supplied input
            without proper authorization checks. Attackers can manipulate
            references to access unauthorized data.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black/30 p-3 rounded-lg">
              <h4 className="font-bold text-cyber-error mb-1">The Problem:</h4>
              <p className="text-sm">
                When applications expose internal object references (like
                database IDs) and don't verify if the current user has
                permission to access the requested object.
              </p>
            </div>
            <div className="bg-black/30 p-3 rounded-lg">
              <h4 className="font-bold text-cyber-success mb-1">
                The Solution:
              </h4>
              <p className="text-sm">
                Implement proper access controls that verify a user's
                permissions for each requested object. Use indirect references
                or access control lists (ACLs) instead of direct database IDs.
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
              Profile Viewer
            </h3>

            {/* Attack Patterns */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-cyber-text-secondary mb-2">
                Try these example IDs:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {attackPatterns.map((pattern, index) => (
                  <button
                    key={index}
                    onClick={() => handleAttackPatternClick(pattern.id)}
                    className={`bg-black/40 hover:bg-cyber-secondary/30 p-2 rounded text-xs text-left transition-colors ${
                      pattern.id === currentUserSession.userId.toString()
                        ? "border border-cyber-primary"
                        : ""
                    }`}
                    title={pattern.description}
                  >
                    <div className="font-bold">{pattern.id}</div>
                    <div className="truncate">{pattern.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Profile Lookup Form */}
            <form onSubmit={handleFetchProfile} className="space-y-4">
              <div>
                <label
                  htmlFor="profileId"
                  className="block text-sm font-bold text-cyber-text-secondary mb-2"
                >
                  {isSecureMode
                    ? "Try to access profiles (protected):"
                    : "Try to access profiles (vulnerable):"}
                </label>
                <input
                  id="profileId"
                  type="text"
                  value={profileId}
                  onChange={(e) => setProfileId(e.target.value)}
                  placeholder="Enter profile ID..."
                  className="w-full bg-cyber-surface border border-cyber-secondary/30 rounded-md p-2 focus:ring-2 focus:ring-cyber-primary focus:outline-none transition-all font-mono text-sm"
                />
              </div>
              <button
                type="submit"
                className="bg-cyber-secondary hover:bg-cyber-accent text-white font-bold py-2 px-4 rounded-md transition-all shadow-glow-accent"
              >
                Fetch Profile
              </button>
            </form>
          </div>

          {/* Results Section */}
          {(retrievedProfile || error) && (
            <div className="mt-6 bg-cyber-surface/50 border border-cyber-secondary/30 rounded-lg p-5">
              <h4 className="font-bold text-cyber-text-primary mb-3">
                {error ? "Access Error" : "Profile Data"}
              </h4>
              {error ? (
                <div
                  className={`p-4 rounded-md ${
                    error.includes("Access Denied")
                      ? "bg-cyber-error/20 text-cyber-error"
                      : "bg-cyber-warning/20 text-cyber-warning"
                  }`}
                >
                  {error}
                </div>
              ) : (
                retrievedProfile && (
                  <div className="space-y-3">
                    <div className="p-3 bg-black/20 rounded-md border-l-4 border-cyber-primary">
                      <p>
                        <strong>ID:</strong> {retrievedProfile.id}
                      </p>
                      <p>
                        <strong>Username:</strong> {retrievedProfile.username}
                      </p>
                      <p>
                        <strong>Role:</strong> {retrievedProfile.role}
                      </p>
                    </div>
                    <div className="p-3 bg-black/20 rounded-md">
                      <p>
                        <strong>Profile:</strong> {retrievedProfile.profile}
                      </p>
                    </div>
                    <div className="p-3 bg-black/20 rounded-md">
                      <p>
                        <strong>Email:</strong> {retrievedProfile.email}
                      </p>
                      <p>
                        <strong>Address:</strong>{" "}
                        {retrievedProfile.address || "Not available"}
                      </p>
                    </div>
                    {retrievedProfile.paymentMethods?.length > 0 && (
                      <div className="p-3 bg-black/20 rounded-md">
                        <p>
                          <strong>Payment Methods:</strong>
                        </p>
                        <ul className="list-disc list-inside">
                          {retrievedProfile.paymentMethods.map((method, i) => (
                            <li key={i}>{method}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>
          )}

          {/* Attack History */}
          {attackHistory.length > 0 && (
            <div className="mt-6 bg-cyber-surface/50 border border-cyber-secondary/30 rounded-lg p-5">
              <h4 className="font-bold text-cyber-error mb-3">
                Access Attempts
              </h4>
              <div className="space-y-2">
                {attackHistory.map((attempt, index) => (
                  <div
                    key={index}
                    className="p-2 bg-black/30 rounded text-xs font-mono"
                  >
                    Attempted access to ID: {attempt}
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
                  In secure mode, the application checks if the current user has
                  permission to access the requested profile before returning
                  any data. This prevents unauthorized access even if the user
                  tries different IDs.
                </p>
                <CodeBlock language="javascript">
                  {`// SECURE: Authorization check
router.get('/profile/:id', authenticate, (req, res) => {
  const profileId = parseInt(req.params.id);
  const userId = req.user.id;
  const userRole = req.user.role;

  // First get the profile
  const profile = database.getProfile(profileId);
  
  if (!profile) {
    return res.status(404).send('Profile not found');
  }

  // Check if user owns the profile or is admin
  if (profile.id === userId || userRole === 'admin') {
    return res.json(profile);
  } else {
    return res.status(403).send('Unauthorized');
  }
});`}
                </CodeBlock>
                <div className="mt-4 p-3 bg-cyber-success/10 border border-cyber-success/30 rounded-md">
                  <h4 className="font-bold text-cyber-success mb-1">
                    Why This Works
                  </h4>
                  <p className="text-sm">
                    The server validates the user's permissions for each
                    request, ensuring they can only access data they're
                    authorized to see, regardless of what IDs they try.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-cyber-text-secondary mb-4">
                  In vulnerable mode, the application blindly trusts the profile
                  ID provided by the user and returns the corresponding data
                  without any authorization checks. This allows attackers to
                  access any profile by simply changing the ID.
                </p>
                <CodeBlock language="javascript">
                  {`// INSECURE: No authorization check
router.get('/profile/:id', (req, res) => {
  const profileId = parseInt(req.params.id);
  
  // Directly fetch and return the profile
  const profile = database.getProfile(profileId);
  
  if (profile) {
    return res.json(profile);
  } else {
    return res.status(404).send('Profile not found');
  }
});`}
                </CodeBlock>
                <div className="mt-4 p-3 bg-cyber-error/10 border border-cyber-error/30 rounded-md">
                  <h4 className="font-bold text-cyber-error mb-1">
                    Why This Is Dangerous
                  </h4>
                  <p className="text-sm">
                    The application exposes all data to anyone who can guess or
                    discover valid IDs. This can lead to massive data breaches
                    as attackers systematically try different IDs.
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
                  Implement proper access controls for every object access
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-cyber-success mr-2">✓</span>
                <span className="text-sm">
                  Use indirect object references instead of direct database IDs
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-cyber-success mr-2">✓</span>
                <span className="text-sm">
                  Implement role-based access control (RBAC) systems
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-cyber-success mr-2">✓</span>
                <span className="text-sm">
                  Log and monitor access to sensitive data
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-cyber-success mr-2">✓</span>
                <span className="text-sm">
                  Use UUIDs or other non-sequential identifiers
                </span>
              </li>
            </ul>

            <div className="mt-4 p-3 bg-cyber-secondary/10 border border-cyber-secondary/30 rounded-md">
              <h4 className="font-bold text-cyber-accent mb-1">
                Real-World Impact
              </h4>
              <p className="text-sm">
                IDOR vulnerabilities have been responsible for major data
                breaches, including:
                <ul className="list-disc list-inside mt-1">
                  <li>Facebook's 2018 breach exposing 50M accounts</li>
                  <li>Uber's 2016 breach affecting 57M users</li>
                  <li>
                    Many healthcare data breaches exposing sensitive medical
                    records
                  </li>
                </ul>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdorDemo;
