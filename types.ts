// types.ts
export enum VulnerabilityType {
  XSS = "XSS",
  SQLI = "SQLI",
  CSRF = "CSRF",
  BROKEN_AUTH = "BROKEN_AUTH",
  INSECURE_DESERIALIZATION = "INSECURE_DESERIALIZATION",
  DIR_TRAVERSAL = "DIR_TRAVERSAL",
  IDOR = "IDOR",
  FILE_UPLOAD = "FILE_UPLOAD",
  PHISHING = "PHISHING",
}

export interface Vulnerability {
  id: VulnerabilityType;
  name: string;
  description: string;
}

export interface DemoProps {
  onExploit: (success: boolean) => void;
}

export interface User {
  id: number;
  username: string;
  role: "user" | "admin" | "system" | "manager" | "tester";
  profile: string;
  email?: string;
  address?: string;
  paymentMethods?: string[];
  lastLogin?: string;
}

export interface FileSystem {
  [path: string]: string;
}

export interface Session {
  userId: number;
  role: "user" | "admin" | "system" | "manager" | "tester";
}

export interface AttackPattern {
  id: string;
  description: string;
}
