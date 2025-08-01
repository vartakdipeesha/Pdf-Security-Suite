
import React, { useState } from 'react';
import { Lock, AlertTriangle, Eye, EyeOff, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

interface EncryptTabProps {
  currentRole: string;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  password: string;
  setPassword: (password: string) => void;
}

const EncryptTab = ({ currentRole, selectedFile, setSelectedFile, password, setPassword }: EncryptTabProps) => {
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setDownloadUrl(null);
    } else {
      toast({ title: 'Invalid File', description: 'Please select a valid PDF file.', variant: 'destructive' });
    }
  };

  const handleEncrypt = async () => {
    if (!selectedFile || !password.trim()) {
      toast({ title: 'Missing Fields', description: 'Please provide both PDF file and password.', variant: 'destructive' });
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('password', password);

    setIsEncrypting(true);
    setDownloadUrl(null);

    try {
      const response = await fetch('http://localhost:5000/encrypt-pdf', {
        method: 'POST',
        body: formData,
      });
      setIsEncrypting(false);

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        setDownloadUrl(url);

        toast({ title: 'Encryption Successful', description: `${selectedFile.name} was encrypted.` });
        setSelectedFile(null);
        setPassword('');
      } else {
        const error = await response.json();
        toast({ title: 'Encryption Failed', description: error.message || 'Something went wrong.', variant: 'destructive' });
      }
    } catch {
      setIsEncrypting(false);
      toast({ title: 'Server Error', description: 'Could not reach backend server.', variant: 'destructive' });
    }
  };

  const generatePassword = () => {
    const random = Math.random().toString(36).slice(-10);
    setPassword(random);
  };

  return (
        <div className="max-w-4xl mx-auto">
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 border border-slate-700/50">
        <div className="text-center mb-8">
          <Lock className="w-16 h-16 mx-auto text-purple-400 mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">PDF Encryption</h2>
          <p className="text-slate-300">Secure your PDF files with AES-256 encryption</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <Label htmlFor="encrypt-file-upload" className="text-white text-lg font-medium mb-4 block">
                Choose PDF File
              </Label>
              <div className="relative">
                <input
                  id="encrypt-file-upload"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <label
                  htmlFor="encrypt-file-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-600 rounded-xl cursor-pointer hover:border-purple-400 transition-colors bg-slate-700/30 hover:bg-slate-700/50"
                >
                 
                  <p className="text-slate-300">Click to select PDF file</p>
                  <p className="text-slate-500 text-sm">Max size: 100MB</p>
                </label>
              </div>

              {selectedFile && (
                <div className="mt-4 p-4 bg-purple-500/20 border border-purple-500/30 rounded-lg">
                  <div className="text-purple-300 font-medium">{selectedFile.name}</div>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="password" className="text-white text-lg font-medium mb-4 block">
                Encryption Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter a strong password"
                  className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>
              <Button onClick={generatePassword} className="mt-2 w-full bg-slate-700 text-white hover:bg-slate-600">
                Generate Strong Password
              </Button>
            </div>

            
            {downloadUrl && (
              <a href={downloadUrl} download="encrypted_file.pdf" className="w-full block mt-4">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  <Download className="w-5 h-5 mr-2" /> Download Encrypted PDF
                </Button>
              </a>
            )}
          </div>

          <div className="space-y-6">
   
            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-3">
                <AlertTriangle className="w-6 h-6 text-yellow-400" />
                <h3 className="text-yellow-300 text-lg font-medium">Security Notice</h3>
              </div>
              <ul className="text-yellow-200 text-sm space-y-2">
                <li>• Store your password securely</li>
                <li>• Use strong, unique passwords</li>
                <li>• Keep encrypted files backed up</li>
                <li>• Password recovery is not possible</li>
              </ul>
            </div>
            <Button
              onClick={handleEncrypt}
              disabled={!selectedFile || !password || isEncrypting}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white font-medium py-3 text-lg"
            >
              {isEncrypting ? 'Encrypting...' : 'Encrypt PDF'}
            </Button>

          </div>
          
        </div>
        
      </div>
    </div>
  );
};

export default EncryptTab;
 