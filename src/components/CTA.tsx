import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function CTA() {
  const { user } = useAuth();

  return (
    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
          Ready to Transform Your Email Workflow?
        </h2>
        <p className="text-xl text-indigo-100 mb-8">
          Join thousands of teams collaborating smarter, not harder.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {user ? (
            <a href="#editor" className="bg-white text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg">
              Start Collaborating
            </a>
          ) : (
            <Link to="/signup" className="bg-white text-indigo-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg">
              Start Free Trial
            </Link>
          )}
          <button className="bg-indigo-700 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-800 transition-all border-2 border-white/20">
            Schedule Demo
          </button>
        </div>
        <p className="text-indigo-200 mt-6 text-sm">
          No credit card required • 14-day free trial • Cancel anytime
        </p>
      </div>
    </div>
  );
}
