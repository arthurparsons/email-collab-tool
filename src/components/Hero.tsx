import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useDocument } from '@/contexts/DocumentContext';


export default function Hero() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { createDocument } = useDocument();

  const handleStartCollaborating = async () => {
    const id = await createDocument();
    if (id) navigate(`/editor/${id}`);
  };

  return (
    <div className="relative bg-gradient-to-br from-[#1a2332] via-[#2d3748] to-[#4f46e5] text-white overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <img 
          src="https://d64gsuwffb70l.cloudfront.net/68dc70a8d59600cc4055697b_1759277272661_2e365519.webp" 
          alt="" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="text-center">
          <h1 className="text-5xl lg:text-7xl font-bold mb-6 animate-fade-in">
            Email, <span className="text-indigo-400">Reimagined</span>
          </h1>
          <p className="text-xl lg:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Collaborate on emails in real-time, just like Google Docs. Write together, edit together, send together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <button onClick={handleStartCollaborating} className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg">
                Start Collaborating
              </button>

            ) : (
              <Link to="/signup" className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105 shadow-lg">
                Get Started Free
              </Link>
            )}
            <button className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all backdrop-blur-sm border border-white/20">
              Watch Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
