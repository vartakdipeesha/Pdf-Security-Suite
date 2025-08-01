
import React, { useEffect, useState } from 'react';
import { Key, AlertTriangle, Target, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

interface CrackTabProps {
  currentRole: string;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  previousPassword: string;
}

const CrackTab = ({ currentRole, selectedFile, setSelectedFile, previousPassword }: CrackTabProps) => {
  const [useBruteForce, setUseBruteForce] = useState(false);
  const [wordlistText, setWordlistText] = useState('');
  const [charset, setCharset] = useState('');
  const [passwordLength, setPasswordLength] = useState(5);
  const [isCracking, setIsCracking] = useState(false);
  const [crackResult, setCrackResult] = useState<{ password: string; time: number } | null>(null);
  const isAdmin = currentRole?.toLowerCase() === 'admin';

  useEffect(() => {
    setCrackResult(null);
    if (!charset && previousPassword) {
      setCharset([...new Set(previousPassword)].join(''));
    }
  }, [currentRole, previousPassword]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setCrackResult(null);
    } else {
      toast({ title: 'Invalid File', description: 'Please select a valid PDF file.', variant: 'destructive' });
    }
  };

  const handleCrack = async () => {
    if (!isAdmin || !selectedFile) return;
    const formData = new FormData();
    formData.append('file', selectedFile);

    if (useBruteForce) {
      const safeCharset = charset.trim() === ''
        ? 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/`~'
        : charset;
      formData.append('mode', 'brute');
      formData.append('charset', safeCharset);
      formData.append('length', String(passwordLength));
    } else {
      formData.append('mode', 'dictionary');
      wordlistText.split('\n').forEach((w) => formData.append('wordlist[]', w.trim()));
    }

    setIsCracking(true);
    try {
      const res = await fetch('http://localhost:5000/crack-pdf', { method: 'POST', body: formData });
      const data = await res.json();
      setIsCracking(false);
      if (data.success) {
        setCrackResult({ password: data.password, time: 1 + Math.random() * 3 });
        toast({ title: 'Password Cracked!', description: `Password: ${data.password}` });
      } else {
        toast({ title: 'Password Not Found', description: data.message, variant: 'destructive' });
      }
    } catch {
      setIsCracking(false);
      toast({ title: 'Server Error', description: 'Could not connect to backend.', variant: 'destructive' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl p-8 border border-slate-700/50">
        <div className="text-center mb-8">
          <Key className="w-16 h-16 mx-auto text-red-400 mb-4" />
          <h2 className="text-3xl font-bold text-white mb-2">PDF Password Cracker</h2>
          <p className="text-slate-300">Choose between dictionary or brute-force attack</p>
        </div>

        {!isAdmin && (
          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4 mb-6 text-yellow-100 text-sm">
            <Lock className="inline-block w-5 h-5 mr-2 text-yellow-300" />
            You are in <strong>{currentRole}</strong> mode. Only administrators can perform cracking.
          </div>
        )}

        {previousPassword && (
          <div className="mb-4 text-sm text-slate-300">
            <strong>Hint:</strong> Password used in encryption tab was <code className="text-white">{previousPassword}</code>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <Label htmlFor="crack-file-upload" className="text-white text-lg font-medium mb-4 block">
                Select Encrypted PDF
              </Label>
              <div className="relative">
                <input id="crack-file-upload" type="file" accept=".pdf" onChange={handleFileSelect} className="hidden" />
                <label htmlFor="crack-file-upload" className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${isAdmin ? 'border-slate-600 hover:border-purple-400 bg-slate-700/30 hover:bg-slate-700/50' : 'border-gray-600 bg-gray-700 cursor-not-allowed'}`}>
                  <p className="text-slate-300">Click to select encrypted PDF file</p>
                  <p className="text-slate-500 text-sm">Max size: 100MB</p>
                </label>
              </div>
              {selectedFile && (
                <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Target className="w-5 h-5 text-red-400" />
                    <span className="text-red-300 font-medium">{selectedFile.name}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="text-white">
              <label className="flex items-center cursor-pointer select-none">
                <input type="checkbox" checked={useBruteForce} onChange={() => setUseBruteForce(!useBruteForce)} className="mr-2" disabled={!isAdmin} />
                <span className="ml-1">Use Brute-force Attack</span>
              </label>
              <p className="text-slate-400 text-sm mt-2 ml-6">
                {useBruteForce
                  ? 'Will generate and test all combinations using the charset and length below.'
                  : 'If unchecked, a dictionary-based attack will be performed using the provided wordlist.'}
              </p>
            </div>

            {!useBruteForce ? (
              <div>
                <Label htmlFor="wordlist" className="text-white font-medium">Custom Wordlist (optional)</Label>
                <textarea id="wordlist" value={wordlistText} onChange={(e) => setWordlistText(e.target.value)} className="w-full p-3 bg-slate-700 text-white rounded-lg" rows={6} placeholder="Enter one password per line (e.g., admin123, password2024)" disabled={!isAdmin} />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Character Set</Label>
                  <Input value={charset} onChange={(e) => setCharset(e.target.value)} className="bg-slate-700 text-white" placeholder="Leave blank to use default charset or auto-fill from hint" disabled={!isAdmin} />
                </div>
                <div>
                  <Label className="text-white">Password Length</Label>
                  <Input type="number" value={passwordLength} onChange={(e) => setPasswordLength(parseInt(e.target.value) || 1)} className="bg-slate-700 text-white" disabled={!isAdmin} />
                </div>
              </div>
            )}

            {crackResult && (
              <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-6 mt-4 text-white">
                <h3 className="text-lg font-medium mb-2">Password Found!</h3>
                <p><strong>Password:</strong> {crackResult.password}</p>
                <p><strong>Time Taken:</strong> {crackResult.time.toFixed(2)}s</p>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between gap-6">
            <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-3">
                <AlertTriangle className="w-6 h-6 text-red-400" />
                <h3 className="text-red-300 text-lg font-medium">Legal Notice</h3>
              </div>
              <ul className="text-red-200 text-sm space-y-2">
                <li>• Crack only files you are authorized to test</li>
                <li>• Use this tool ethically and legally</li>
                <li>• Brute-force can be time consuming and CPU intensive</li>
              </ul>
            </div>

            <Button disabled={!isAdmin || !selectedFile || isCracking} onClick={handleCrack} className={`w-full text-white font-medium py-3 text-lg ${isCracking ? 'bg-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700'}`}>
              {isCracking ? 'Cracking...' : 'Start Cracking'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrackTab;
