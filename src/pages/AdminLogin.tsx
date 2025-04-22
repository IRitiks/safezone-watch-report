
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login, loading, currentUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // If already logged in, redirect to admin dashboard
  React.useEffect(() => {
    if (currentUser) {
      navigate('/admin');
    }
  }, [currentUser, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      await login(email, password);
      // Redirect will happen automatically due to the useEffect above
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to log in. Please check your credentials.');
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-safezone-purple/10 p-3 rounded-full mb-4">
            <Shield className="h-8 w-8 text-safezone-purple" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">SafeZone Admin Portal</h1>
          <p className="text-gray-600 mt-1">Secure access for authorized personnel only</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>
              Enter your credentials to access the administrative dashboard
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  type="email" 
                  placeholder="admin@safezone.app"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password"
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              {error && (
                <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
                  {error}
                </div>
              )}
              
              <div className="text-sm text-gray-500 flex items-center">
                <Lock className="h-4 w-4 mr-1" />
                For demo purposes, use: admin@safezone.app / admin123
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full bg-safezone-purple hover:bg-safezone-darkPurple" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="mt-6 text-center">
          <Button variant="link" onClick={() => navigate('/')}>
            Return to Public Site
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
