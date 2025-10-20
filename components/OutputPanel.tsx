import React from 'react';
import { SparklesIcon } from './Icons';

interface OutputPanelProps {
  response: string;
  isLoading: boolean;
  error: string | null;
}

// A simple component to render markdown-like text
const SimpleMarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    const parts = content.split(/(```python[\s\S]*?```|```[\s\S]*?```)/g);

    return (
        <div>
            {parts.map((part, index) => {
                if (part.startsWith('```python')) {
                    const code = part.replace(/```python\n?|```/g, '');
                    return (
                        <div key={index} className="bg-gray-900 rounded-md my-4">
                            <div className="bg-gray-700 px-4 py-2 rounded-t-md text-sm text-gray-300 font-semibold">Python</div>
                            <pre className="p-4 overflow-x-auto"><code className="language-python text-sm">{code}</code></pre>
                        </div>
                    );
                } else if (part.startsWith('```')) {
                    const code = part.replace(/```\n?|```/g, '');
                     return (
                        <div key={index} className="bg-gray-900 rounded-md my-4">
                            <pre className="p-4 overflow-x-auto"><code className="text-sm">{code}</code></pre>
                        </div>
                    );
                }

                // Render basic markdown elements
                return part.split('\n').map((line, lineIndex) => {
                    if (line.startsWith('# ')) return <h1 key={`${index}-${lineIndex}`} className="text-3xl font-bold my-4">{line.substring(2)}</h1>;
                    if (line.startsWith('## ')) return <h2 key={`${index}-${lineIndex}`} className="text-2xl font-bold my-3">{line.substring(3)}</h2>;
                    if (line.startsWith('### ')) return <h3 key={`${index}-${lineIndex}`} className="text-xl font-bold my-2">{line.substring(4)}</h3>;
                    if (line.startsWith('* ')) return <li key={`${index}-${lineIndex}`} className="ml-6 list-disc">{line.substring(2)}</li>;
                    return <p key={`${index}-${lineIndex}`} className="my-1">{line}</p>;
                });
            })}
        </div>
    );
};


export const OutputPanel: React.FC<OutputPanelProps> = ({ response, isLoading, error }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 h-full flex flex-col">
      <h2 className="text-2xl font-bold text-cyan-400 mb-4">Output</h2>
      <div className="bg-gray-900 rounded-md p-4 flex-grow overflow-y-auto border border-gray-700">
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <SparklesIcon className="w-12 h-12 animate-pulse text-cyan-500" />
            <p className="mt-4 text-lg">Gemini is thinking...</p>
          </div>
        )}
        {error && (
          <div className="flex flex-col items-center justify-center h-full text-red-400">
            <p className="font-bold">Error</p>
            <p className="mt-2 text-center">{error}</p>
          </div>
        )}
        {!isLoading && !error && !response && (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <p>The analysis or generated code will appear here.</p>
            </div>
        )}
        {response && <SimpleMarkdownRenderer content={response} />}
      </div>
    </div>
  );
};
