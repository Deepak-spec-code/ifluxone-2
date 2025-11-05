
import React from 'react';
import CosmicAnimation from './components/CosmicAnimation';
import Chatbot from './components/Chatbot';

const App: React.FC = () => {

  const textShadowStyle: React.CSSProperties = {
    textShadow: `
        0 0 10px rgba(224, 76, 226, 0.8),
        0 0 20px rgba(224, 76, 226, 0.6),
        0 0 35px rgba(168, 85, 247, 0.4),
        0 0 50px rgba(126, 34, 206, 0.3)
    `
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black font-sans">
      <CosmicAnimation />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none [perspective:1000px]">
        <div 
          style={textShadowStyle}
          className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-purple-600 to-fuchsia-500 animate-emerge-from-depth"
        >
            iFLUXONE
        </div>
      </div>
      <Chatbot />
    </main>
  );
};

export default App;
