import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-indigo-600">✉️ CollabMail</Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-gray-700 hover:text-indigo-600 font-medium">Features</a>
            <a href="#templates" className="text-gray-700 hover:text-indigo-600 font-medium">Templates</a>
            {user ? (
              <>
                <Link to="/profile" className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 font-medium">
                  <User className="w-4 h-4" />
                  Profile
                </Link>
                <Button onClick={handleSignOut} variant="outline" className="flex items-center gap-2">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline">Sign In</Button>
                </Link>
                <Link to="/signup">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </div>
          
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-3 space-y-3">
            <a href="#features" className="block text-gray-700">Features</a>
            <a href="#templates" className="block text-gray-700">Templates</a>
            {user ? (
              <>
                <Link to="/profile" className="block text-gray-700">Profile</Link>
                <button onClick={handleSignOut} className="w-full text-left text-gray-700">Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-gray-700">Sign In</Link>
                <Link to="/signup">
                  <button className="w-full bg-indigo-600 text-white px-6 py-2 rounded-lg">Get Started</button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
