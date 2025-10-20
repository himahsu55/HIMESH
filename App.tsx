import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { CodeEditor } from './components/CodeEditor';
import { OutputPanel } from './components/OutputPanel';
import { TabButton } from './components/TabButton';
import { runCodeQuery } from './services/geminiService';
import type { AppMode } from './types';
import { CodeBracketIcon, SparklesIcon } from './components/Icons';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('explain');
  const [prompt, setPrompt] = useState<string>('Explain this Python code and suggest improvements.');
  const [pythonCode, setPythonCode] = useState<string>('def factorial(n):\n    if n == 0:\n        return 1\n    else:\n        return n * factorial(n-1)\n\nprint(factorial(5))');
  const [apiResponse, setApiResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showOutputPanel, setShowOutputPanel] = useState<boolean>(false);

  const handleSubmit = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setApiResponse('');
    setShowOutputPanel(true);

    try {
      const result = await runCodeQuery(mode, prompt, pythonCode);
      setApiResponse(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(`An error occurred: ${err.message}`);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [mode, prompt, pythonCode]);

  const handleModeChange = (newMode: AppMode) => {
    setMode(newMode);
    if (newMode === 'generate') {
      setPrompt('Create a Python script that uses the requests library to fetch data from a JSON API and prints the title of the first post.');
      setPythonCode('');
    } else {
      setPrompt('Explain this Python code and suggest improvements.');
      setPythonCode('def factorial(n):\n    if n == 0:\n        return 1\n    else:\n        return n * factorial(n-1)\n\nprint(factorial(5))');
    }
    setShowOutputPanel(false);
    setApiResponse('');
    setError(null);
  };

  return (
    <div className="bg-gray-900 min-h-screen font-sans text-gray-200 flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col md:flex-row p-4 gap-4">
        {/* Input Panel */}
        <div className={`flex flex-col w-full ${showOutputPanel ? 'md:w-1/2' : 'md:w-full'} transition-all duration-500 ease-in-out`}>
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 flex-grow flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-cyan-400">Input</h2>
              <div className="flex space-x-2 bg-gray-700 p-1 rounded-lg">
                <TabButton
                  isActive={mode === 'explain'}
                  onClick={() => handleModeChange('explain')}
                >
                  <CodeBracketIcon className="w-5 h-5 mr-2"/>
                  Explain Code
                </TabButton>
                <TabButton
                  isActive={mode === 'generate'}
                  onClick={() => handleModeChange('generate')}
                >
                  <SparklesIcon className="w-5 h-5 mr-2" />
                  Generate Code
                </TabButton>
              </div>
            </div>
            
            <div className="flex flex-col space-y-4 flex-grow">
              <div>
                <label htmlFor="prompt" className="block text-sm font-medium text-gray-400 mb-2">
                  {mode === 'explain' ? 'Your Request' : 'Describe the code you want'}
                </label>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={3}
                  className="w-full bg-gray-900 border border-gray-700 rounded-md p-3 text-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                  placeholder={mode === 'explain' ? 'e.g., Explain this code...' : 'e.g., Write a function to...'}
                />
              </div>

              {mode === 'explain' && (
                 <div className="flex flex-col flex-grow">
                    <label htmlFor="code-editor" className="block text-sm font-medium text-gray-400 mb-2">
                    Python Code
                    </label>
                    <CodeEditor
                        value={pythonCode}
                        onValueChange={setPythonCode}
                    />
                </div>
              )}
              
              <div className="pt-2">
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 disabled:scale-100"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="w-5 h-5 mr-2"/>
                      {mode === 'generate' ? 'Generate' : 'Analyze'} Code
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Output Panel */}
        <div className={`w-full ${showOutputPanel ? 'md:w-1/2' : 'hidden'} transition-all duration-500 ease-in-out`}>
          <OutputPanel
            response={apiResponse}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
