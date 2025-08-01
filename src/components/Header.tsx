
import React from 'react';
import { Shield, User } from 'lucide-react';

interface HeaderProps {
  currentRole: string;
}

const Header = ({ currentRole }: HeaderProps) => {
  return (
    <header className="bg-slate-900/80 backdrop-blur-lg border-b border-slate-700/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="w-8 h-8 text-blue-500" />
            <div>
              <h2 className="text-xl font-bold text-white">PDF Security Suite</h2>
           
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 bg-slate-800/50 px-4 py-2 rounded-lg">
              <User className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-300">Current Role:</span>
              <span className={`text-sm font-medium ${
                currentRole === 'Admin' ? 'text-green-400' : 'text-yellow-400'
              }`}>
                {currentRole}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
