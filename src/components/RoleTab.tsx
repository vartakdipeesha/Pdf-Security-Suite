
import React from 'react';
import { Users, Shield, Eye, Settings, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

interface RoleTabProps {
  currentRole: string;
  setCurrentRole: (role: string) => void;
}

const RoleTab = ({ currentRole, setCurrentRole }: RoleTabProps) => {
  const roles = [
    {
      id: 'Admin',
      name: 'Administrator',
      icon: Shield,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/30',
      permissions: [
        'Full system access',
        'Encrypt PDF files',
        'Crack password-protected PDFs',
        'View all security logs',
        'Export log data',
        'Manage user roles',
        'System configuration'
      ],
      description: 'Complete control over all system functions and security operations.'
    },
    {
      id: 'Viewer',
      name: 'Viewer',
      icon: Eye,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/30',
      permissions: [
        'View dashboard statistics',
        'View security logs',
        'Access system reports',
        'Monitor file status'
      ],
      description: 'Read-only access to system information and monitoring capabilities.',
      restrictions: [
        'Cannot encrypt files',
        'Cannot crack passwords',
        'Cannot export data',
        'Cannot modify settings'
      ]
    }
  ];

  const handleRoleChange = (newRole: string) => {
    setCurrentRole(newRole);
    toast({
      title: "Role Changed",
      description: `You are now logged in as: ${newRole}`,
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 border border-slate-700/50">
        <div className="text-center mb-8">
          <Users className="w-16 h-16 mx-auto text-purple-400 mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">Role Management</h2>
          <p className="text-slate-300">Configure user access levels and permissions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {roles.map((role) => {
            const Icon = role.icon;
            const isCurrentRole = currentRole === role.id;

            return (
              <div
                key={role.id}
                className={`relative rounded-2xl p-6 border transition-all duration-300 hover:scale-105 ${
                  isCurrentRole 
                    ? `${role.bgColor} ${role.borderColor} ring-2 ring-offset-2 ring-offset-slate-900 ring-blue-500/50` 
                    : 'bg-slate-700/30 border-slate-600/50 hover:bg-slate-700/50'
                }`}
              >
                {isCurrentRole && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-2">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                )}

                <div className="flex items-center space-x-3 mb-4">
                  <Icon className={`w-8 h-8 ${role.color}`} />
                  <div>
                    <h3 className="text-xl font-bold text-white">{role.name}</h3>
                    <p className="text-slate-300 text-sm">{role.description}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-white font-medium mb-3 flex items-center">
                      <Settings className="w-4 h-4 mr-2 text-green-400" />
                      Permissions
                    </h4>
                    <ul className="space-y-2">
                      {role.permissions.map((permission, index) => (
                        <li key={index} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span className="text-slate-300">{permission}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {role.restrictions && (
                    <div>
                      <h4 className="text-white font-medium mb-3 flex items-center">
                        <Shield className="w-4 h-4 mr-2 text-red-400" />
                        Restrictions
                      </h4>
                      <ul className="space-y-2">
                        {role.restrictions.map((restriction, index) => (
                          <li key={index} className="flex items-center space-x-2 text-sm">
                            <div className="w-4 h-4 rounded-full border-2 border-red-400"></div>
                            <span className="text-slate-400">{restriction}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <Button
                    onClick={() => handleRoleChange(role.id)}
                    disabled={isCurrentRole}
                    className={`w-full mt-6 ${
                      isCurrentRole
                        ? 'bg-green-500/50 text-green-200 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white'
                    }`}
                  >
                    {isCurrentRole ? 'Current Role' : `Switch to ${role.name}`}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Current Role Status */}
        <div className="mt-8 bg-slate-700/30 rounded-xl p-6 border border-slate-600/50">
          <h3 className="text-white text-lg font-medium mb-4">Current Session</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <Shield className="w-6 h-6 text-blue-400" />
              <div>
                <p className="text-slate-300 text-sm">Active Role</p>
                <p className="text-white font-medium">{currentRole}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Users className="w-6 h-6 text-green-400" />
              <div>
                <p className="text-slate-300 text-sm">Session Status</p>
                <p className="text-green-400 font-medium">Active</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Settings className="w-6 h-6 text-purple-400" />
              <div>
                <p className="text-slate-300 text-sm">Access Level</p>
                <p className="text-purple-400 font-medium">
                  {currentRole === 'Admin' ? 'Full Access' : 'Read Only'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleTab;
