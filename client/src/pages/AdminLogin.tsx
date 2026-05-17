import { useState } from 'react';
import { useLocation } from 'wouter';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Mail, Shield, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const [step, setStep] = useState<'credentials' | '2fa' | 'success'>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFACode, setTwoFACode] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [adminId, setAdminId] = useState<number | null>(null);
  const [devCode, setDevCode] = useState<string>('');

  // tRPC mutations
  const utils = trpc.useUtils();
  const loginMutation = trpc.adminAuth.login.useMutation();
  const verify2FAMutation = trpc.adminAuth.verify2FA.useMutation();

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const result = await loginMutation.mutateAsync({ email, password });
      if (result.success) {
        setStep('success');
        toast.success('Login successful! Redirecting to dashboard...');
        // Invalidate auth cache and do a hard redirect so the cookie is sent fresh
        await utils.auth.me.invalidate();
        setTimeout(() => {
          window.location.href = '/admin';
        }, 1000);
      } else {
        setError(result.error || 'Invalid email or password');
        toast.error(result.error || 'Invalid email or password');
      }
    } catch (error) {
      setError('Authentication failed. Please try again.');
      toast.error('Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwoFASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!twoFACode || twoFACode.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }

    if (!adminId) {
      toast.error('Session expired. Please log in again.');
      setStep('credentials');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const result = await verify2FAMutation.mutateAsync({ 
        adminId, 
        code: twoFACode 
      });
      if (result.success) {
        setStep('success');
        toast.success('2FA verified! Redirecting to dashboard...');
        setTimeout(() => {
          navigate('/admin');
        }, 2000);
      } else {
        setError(result.error || 'Invalid 2FA code');
        toast.error(result.error || 'Invalid 2FA code. Please try again.');
      }
    } catch (error) {
      setError('2FA verification failed. Please try again.');
      toast.error('2FA verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#002855] via-[#003d7a] to-[#0055A4]">
      <Navigation />
      
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full mb-4 shadow-lg">
              <Shield className="w-8 h-8 text-[#002855]" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
            <p className="text-blue-100">Secure access to Find Christian Schools<span className="trademark">™</span> management</p>
          </div>

          {/* Main Card */}
          <Card className="shadow-2xl border-0">
            <CardHeader className="bg-gradient-to-r from-[#002855] to-[#0055A4] text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                {step === 'credentials' && 'Sign In'}
                {step === '2fa' && 'Two-Factor Authentication'}
                {step === 'success' && 'Access Granted'}
              </CardTitle>
              <CardDescription className="text-blue-100">
                {step === 'credentials' && 'Enter your admin credentials'}
                {step === '2fa' && 'Enter the code from your authenticator app'}
                {step === 'success' && 'Redirecting to dashboard...'}
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-8">
              {/* Step 1: Credentials */}
              {step === 'credentials' && (
                <form onSubmit={handleCredentialsSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Admin Email
                    </label>
                    <Input
                      type="email"
                      placeholder="Enter your admin email"
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
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border-gray-300 focus:border-[#0055A4] focus:ring-[#0055A4] pr-10"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
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
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>

                  {/* Security Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-xs text-blue-700 flex items-start gap-2">
                      <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>This portal is protected by SSL encryption and two-factor authentication.</span>
                    </p>
                  </div>
                </form>
              )}

              {/* Step 2: 2FA */}
              {step === '2fa' && (
                <form onSubmit={handleTwoFASubmit} className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <p className="text-sm text-green-700 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>Credentials verified. Check your authenticator app for a 6-digit code.</span>
                    </p>
                  </div>

                  {devCode && (
                    <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mb-6">
                      <p className="text-xs text-yellow-700 font-semibold mb-2">🔧 Development Mode - Your Code:</p>
                      <p className="text-3xl font-mono font-bold text-yellow-900 text-center tracking-widest">{devCode}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Shield className="w-4 h-4 inline mr-2" />
                      2FA Code
                    </label>
                    <Input
                      type="text"
                      placeholder="000000"
                      value={twoFACode}
                      onChange={(e) => setTwoFACode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      maxLength={6}
                      className="border-gray-300 focus:border-[#0055A4] focus:ring-[#0055A4] text-center text-2xl tracking-widest font-mono"
                      disabled={isLoading}
                      autoFocus
                    />
                    <p className="text-xs text-gray-500 mt-2">Enter the 6-digit code from your authenticator app</p>
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
                    {isLoading ? 'Verifying...' : 'Verify & Sign In'}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setStep('credentials');
                      setPassword('');
                      setTwoFACode('');
                      setError('');
                    }}
                    disabled={isLoading}
                  >
                    Back to Login
                  </Button>

                  {/* Forgot Code Info */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-xs text-blue-700 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>Check your authenticator app or email for your 2FA code.</span>
                    </p>
                  </div>
                </form>
              )}

              {/* Step 3: Success */}
              {step === 'success' && (
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Access Granted</h3>
                  <p className="text-gray-600">You have successfully authenticated. Redirecting to the admin dashboard...</p>
                  <div className="pt-4">
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div className="bg-[#6EBE44] h-1 rounded-full animate-pulse" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Footer Info */}
          <div className="mt-8 text-center text-blue-100 text-xs">
            <p>For security concerns, contact: security@findchristianschools.org</p>
          </div>
        </div>
      </div>
    </div>
  );
}
