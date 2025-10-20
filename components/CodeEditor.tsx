import React, { useState, useEffect } from 'react';

interface CodeEditorProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ value, onValueChange }) => {
  const [lineCount, setLineCount] = useState(1);

  useEffect(() => {
    const lines = value.split('\n').length;
    setLineCount(lines);
  }, [value]);

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-md flex flex-grow w-full font-mono text-sm">
      <div className="line-numbers bg-gray-800 text-gray-500 p-3 text-right select-none rounded-l-md">
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      <textarea
        id="code-editor"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className="flex-grow bg-transparent p-3 text-gray-200 resize-none focus:outline-none w-full"
        spellCheck="false"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
      />
    </div>
  );
};
