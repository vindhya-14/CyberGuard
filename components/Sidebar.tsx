
import React from 'react';
import type { Vulnerability } from '../types';

interface SidebarProps {
  vulnerabilities: Vulnerability[];
  selectedVulnerability: Vulnerability;
  onSelect: (vulnerability: Vulnerability) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ vulnerabilities, selectedVulnerability, onSelect }) => {
  return (
    <aside className="w-64 bg-cyber-surface p-4 border-r border-cyber-secondary/20 flex-shrink-0 overflow-y-auto">
      <h2 className="text-lg font-bold text-cyber-secondary mb-4">Vulnerabilities</h2>
      <nav>
        <ul>
          {vulnerabilities.map((vuln) => (
            <li key={vuln.id} className="mb-2">
              <button
                onClick={() => onSelect(vuln)}
                className={`w-full text-left px-4 py-2 rounded-md transition-all duration-200 ${
                  selectedVulnerability.id === vuln.id
                    ? 'bg-cyber-primary/20 text-cyber-primary shadow-glow-primary'
                    : 'text-cyber-text-secondary hover:bg-cyber-secondary/10 hover:text-cyber-text-primary'
                }`}
              >
                {vuln.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
