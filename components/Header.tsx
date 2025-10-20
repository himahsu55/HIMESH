import React from 'react';
import { LogoIcon } from './Icons';

export const Header: React.FC = () => {
    
    const handleUpgradeClick = () => {
        alert("Payment processing is a critical feature of our Pro plan! This is a demo of where it would be integrated.");
    };

    return (
        <header className="bg-gray-800/50 backdrop-blur-sm shadow-lg p-4 flex justify-between items-center border-b border-gray-700 sticky top-0 z-10">
            <div className="flex items-center space-x-3">
                <LogoIcon className="w-10 h-10 text-cyan-400"/>
                <h1 className="text-xl md:text-2xl font-bold text-white">
                    Gemini Python Code Assistant
                </h1>
            </div>
            <button 
                onClick={handleUpgradeClick}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
            >
                Upgrade to Pro
            </button>
        </header>
    );
};
