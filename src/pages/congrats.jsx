import React, { useState, useEffect } from 'react';
import { Sparkles, Trophy, Star, CheckCircle } from 'lucide-react';

const Congratulations = () => {
  const [confetti, setConfetti] = useState([]);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
    
    // Generate confetti pieces
    const pieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2,
      color: ['#fbbf24', '#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981'][Math.floor(Math.random() * 6)]
    }));
    setConfetti(pieces);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Confetti */}
      {confetti.map(piece => (
        <div
          key={piece.id}
          className="absolute top-0 w-2 h-2 rounded-full opacity-80"
          style={{
            left: `${piece.left}%`,
            backgroundColor: piece.color,
            animation: `fall ${piece.duration}s linear ${piece.delay}s infinite`
          }}
        />
      ))}

      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
          }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
      `}</style>

      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12 relative z-10">
        {/* Trophy Icon */}
        <div 
          className="flex justify-center mb-6"
          style={{
            animation: animate ? 'scaleIn 0.6s ease-out' : 'none'
          }}
        >
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-6 shadow-lg">
            <Trophy className="w-16 h-16 text-white" />
          </div>
        </div>

        {/* Main Heading */}
        <h1 
          className="text-5xl md:text-6xl font-bold text-center mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
          style={{
            animation: animate ? 'slideUp 0.6s ease-out 0.2s both' : 'none'
          }}
        >
          Congratulations!
        </h1>

        {/* Sparkles */}
        <div 
          className="flex justify-center gap-4 mb-6"
          style={{
            animation: animate ? 'slideUp 0.6s ease-out 0.3s both' : 'none'
          }}
        >
          <Sparkles className="w-8 h-8 text-yellow-500" />
          <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
          <Sparkles className="w-8 h-8 text-yellow-500" />
        </div>

        {/* Subheading */}
        <p 
          className="text-xl md:text-2xl text-gray-700 text-center mb-8"
          style={{
            animation: animate ? 'slideUp 0.6s ease-out 0.4s both' : 'none'
          }}
        >
          You've successfully completed all your activities!
        </p>

        {/* Achievement List */}
        <div 
          className="space-y-4 mb-8"
          style={{
            animation: animate ? 'slideUp 0.6s ease-out 0.5s both' : 'none'
          }}
        >
          <div className="flex items-center gap-3 bg-green-50 p-4 rounded-xl">
            <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
            <span className="text-gray-700">All activities completed</span>
          </div>
          <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-xl">
            <CheckCircle className="w-6 h-6 text-blue-500 flex-shrink-0" />
            <span className="text-gray-700">Learning objectives achieved</span>
          </div>
          <div className="flex items-center gap-3 bg-purple-50 p-4 rounded-xl">
            <CheckCircle className="w-6 h-6 text-purple-500 flex-shrink-0" />
            <span className="text-gray-700">Great effort demonstrated</span>
          </div>
        </div>

        {/* CTA Button */}
        <div 
          className="flex justify-center"
          style={{
            animation: animate ? 'slideUp 0.6s ease-out 0.6s both, pulse 2s ease-in-out 1s infinite' : 'none'
          }}
        >
       </div>

        {/* Footer Message */}
        <p 
          className="text-center text-gray-500 mt-8 text-sm"
          style={{
            animation: animate ? 'slideUp 0.6s ease-out 0.7s both' : 'none'
          }}
        >
          You're doing amazing! Keep learning and growing! 📚✨
        </p>
      </div>
    </div>
  );
};

export default Congratulations;