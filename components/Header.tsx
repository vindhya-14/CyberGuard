import React from "react";

interface HeaderProps {
  securityTip: string;
  health: number;
  onHealthChange?: (newHealth: number) => void; // Optional callback for health changes
  className?: string; // Additional className for customization
}

const HealthBar: React.FC<{
  health: number;
  showLabel?: boolean;
}> = ({ health, showLabel = false }) => {
  const getHealthColor = () => {
    if (health > 70) return "bg-cyber-success";
    if (health > 30) return "bg-yellow-500";
    return "bg-cyber-error";
  };

  const getHealthStatus = () => {
    if (health > 70) return "Secure";
    if (health > 30) return "Vulnerable";
    return "Critical";
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-xs mb-1">
          <span className="text-cyber-text-secondary">System Health</span>
          <span
            className={`font-medium ${getHealthColor().replace(
              "bg-",
              "text-"
            )}`}
          >
            {getHealthStatus()} ({health}%)
          </span>
        </div>
      )}
      <div className="w-full bg-cyber-surface rounded-full h-2.5">
        <div
          className={`${getHealthColor()} h-2.5 rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${Math.max(0, Math.min(100, health))}%` }} // Clamp between 0-100
          role="progressbar"
          aria-valuenow={health}
          aria-valuemin={0}
          aria-valuemax={100}
        ></div>
      </div>
    </div>
  );
};

const Header: React.FC<HeaderProps> = ({
  securityTip,
  health,
  onHealthChange,
  className = "",
}) => {
  const handleHealthClick = () => {
    if (onHealthChange) {
      // Simulate a small random health fluctuation when clicked
      const change = Math.floor(Math.random() * 10) - 4; // -4 to +5
      onHealthChange(Math.max(0, Math.min(100, health + change)));
    }
  };

  return (
    <header
      className={`bg-cyber-surface/50 backdrop-blur-sm border-b border-cyber-secondary/20 p-4 shadow-lg sticky top-0 z-50 ${className}`}
    >
      <div className="container mx-auto flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-3 min-w-[200px]">
          <span className="text-4xl">🛡️</span>
          <div>
            <h1 className="text-2xl font-bold text-cyber-primary">
              CyberGuard
            </h1>
            <p className="text-sm text-cyber-text-secondary">
              Interactive Security Simulator
            </p>
          </div>
        </div>

        <div className="flex-grow max-w-md px-4 text-center">
          <p className="text-xs text-cyber-text-secondary mb-1">
            AI Security Tip of the Day
          </p>
          <p
            className="text-sm italic text-cyber-primary/90"
            title="Refresh page for a new tip"
          >
            "{securityTip}"
          </p>
        </div>

        <div className="min-w-[200px]">
          <div
            onClick={handleHealthClick}
            className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
            title={
              onHealthChange
                ? "Click to test system fluctuation"
                : "System Health Status"
            }
          >
            <HealthBar health={health} showLabel />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
