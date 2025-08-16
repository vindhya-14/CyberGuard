
import React from 'react';
import type { ReactNode } from 'react';

interface CodeBlockProps {
  children: ReactNode;
  language: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ children, language }) => {
  return (
    <div className="bg-black/50 rounded-md my-4">
      <div className="text-xs text-cyber-secondary px-4 py-2 bg-black/30 rounded-t-md font-mono">
        {language}
      </div>
      <pre className="p-4 text-sm text-cyber-text-primary overflow-x-auto font-mono">
        <code>{children}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
