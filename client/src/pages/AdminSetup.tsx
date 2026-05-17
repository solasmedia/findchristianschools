import { useState } from 'react';
import { useLocation } from 'wouter';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Mail, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';

export default function AdminSetup() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState('office@findchristianschools.org');
  const [password, setPassword] = useState('Daith1982!');
  const [name, setName] = useState('Office Admin');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const setupMutation = trpc.adminAuth.setupAdmin.useMutation();

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || password.length < 8) {
      toast.error('Please fill in all fields. Password must be at least 8 characters.');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const result = await setupMutation.mutateAsync({ 
        email, 
        password,
        name: name || undefined
      });
      
      if (result.success) {
        setSuccess(true);
        toast.success('Admin account created successfully!');
        setTimeout(() => {
          navigate('/admin-login');
        }, 2000);
      } else {
        setError(result.error || 'Failed to create admin account');
        toast.error(result.error || 'Failed to create admin account');
      }
    } catch (error) {
      setError('Setup failed. Please try again.');
      toast.error('Setup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#002855] via-[#003d7a] to-[#0055A4]">
        <Navigation />
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <Card className="shadow-2xl border-0 max-w-md w-full">
            <CardContent className="pt-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Setup Complete!</h3>
              <p className="text-gray-600 mb-4">Admin account created successfully.</p>
              <p className="text-sm text-gray-500 mb-6">Redirecting to login...</p>
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div className="bg-[#6EBE44] h-1 rounded-full animate-pulse" style={{ width: '100%' }}></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#002855] via-[#003d7a] to-[#0055A4]">
      <Navigation />
      
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 shadow-lg">
              <Shield className="w-8 h-8 text-[#002855]" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Setup</h1>
            <p className="text-blue-100">Create your admin account</p>
          </div>

          {/* Setup Card */}
          <Card className="shadow-2xl border-0">
            <CardHeader className="bg-gradient-to-r from-[#002855] to-[#0055A4] text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Initialize Admin Account
              </CardTitle>
              <CardDescription className="text-blue-100">
                Set up your admin credentials
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-8">
              <form onSubmit={handleSetup} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Admin Email
                  </label>
                  <Input
                    type="email"
                    placeholder="office@findchristianschools.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-gray-300 focus:border-[#0055A4] focus:ring-[#0055A4]"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    <Lock className="w-4 h-4 inline mr-2" />
                    Password
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-gray-300 focus:border-[#0055A4] focus:ring-[#0055A4]"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Admin Name (Optional)
                  </label>
                  <Input
                    type="text"
                    placeholder="Office Admin"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border-gray-300 focus:border-[#0055A4] focus:ring-[#0055A4]"
                    disabled={isLoading}
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-xs text-red-700 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{error}</span>
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-[#6EBE44] hover:bg-[#5aa838] text-white font-semibold py-2"
                  disabled={isLoading}
                >
                  {isLoading ? 'Setting up...' : 'Create Admin Account'}
                </Button>

                {/* Security Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-xs text-blue-700 flex items-start gap-2">
                    <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>This is a one-time setup. After creating the account, you'll be redirected to the login page.</span>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
