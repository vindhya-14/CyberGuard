
import React, { useState, useEffect } from 'react';
import type { Vulnerability } from './types';
import { VulnerabilityType } from './types';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import VulnerabilityCard from './components/VulnerabilityCard';
import XssDemo from './components/demos/XssDemo';
import SqlInjectionDemo from './components/demos/SqlInjectionDemo';
import DirectoryTraversalDemo from './components/demos/DirectoryTraversalDemo';
import IdorDemo from './components/demos/IdorDemo';
import { getSecurityTip } from './services/geminiService';

const vulnerabilities: Vulnerability[] = [
  { id: VulnerabilityType.XSS, name: 'Cross-Site Scripting (XSS)', description: 'Injecting malicious scripts into trusted websites.' },
  { id: VulnerabilityType.SQLI, name: 'SQL Injection', description: 'Inserting malicious SQL queries via user input.' },
  { id: VulnerabilityType.DIR_TRAVERSAL, name: 'Directory Traversal', description: 'Accessing files and directories outside the web root.' },
  { id: VulnerabilityType.IDOR, name: 'Insecure Direct Object Reference', description: 'Accessing unauthorized data by changing object references.' },
];

const App: React.FC = () => {
  const [selectedVulnerability, setSelectedVulnerability] = useState<Vulnerability>(vulnerabilities[0]);
  const [securityTip, setSecurityTip] = useState<string>('Loading security tip...');
  const [health, setHealth] = useState(100);

  useEffect(() => {
    const fetchTip = async () => {
      try {
        const tip = await getSecurityTip();
        setSecurityTip(tip);
      } catch (error) {
        console.error('Failed to fetch security tip:', error);
        setSecurityTip('Could not load a security tip. Stay vigilant!');
      }
    };
    fetchTip();
  }, []);

  const handleVulnerabilitySelect = (vulnerability: Vulnerability) => {
    setSelectedVulnerability(vulnerability);
  };

  const onExploit = (success: boolean) => {
    if (success) {
      setHealth(prev => Math.max(0, prev - 10));
    } else {
      setHealth(prev => Math.min(100, prev + 5));
    }
  };

  const renderVulnerabilityDemo = () => {
    switch (selectedVulnerability.id) {
      case VulnerabilityType.XSS:
        return <XssDemo onExploit={onExploit} />;
      case VulnerabilityType.SQLI:
        return <SqlInjectionDemo onExploit={onExploit} />;
      case VulnerabilityType.DIR_TRAVERSAL:
        return <DirectoryTraversalDemo onExploit={onExploit} />;
      case VulnerabilityType.IDOR:
        return <IdorDemo onExploit={onExploit} />;
      default:
        return <div className="text-cyber-text-secondary">Select a vulnerability to begin.</div>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-cyber-bg">
      <Header securityTip={securityTip} health={health} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          vulnerabilities={vulnerabilities}
          selectedVulnerability={selectedVulnerability}
          onSelect={handleVulnerabilitySelect}
        />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <VulnerabilityCard vulnerability={selectedVulnerability}>
            {renderVulnerabilityDemo()}
          </VulnerabilityCard>
        </main>
      </div>
    </div>
  );
};

export default App;
