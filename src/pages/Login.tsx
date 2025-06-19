
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, User, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [userError, setUserError] = useState('');
  const [adminError, setAdminError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserError('');
    setLoading(true);
    
    if (!userEmail || !userPassword) {
      setUserError('Please enter both email and password');
      setLoading(false);
      return;
    }
    
    try {
      // For demo purposes, accept any email/password for user login
      // In a real app, this would validate against user credentials
      navigate('/home');
    } catch (err) {
      setUserError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    setLoading(true);
    
    if (!adminEmail || !adminPassword) {
      setAdminError('Please enter both email and password');
      setLoading(false);
      return;
    }
    
    try {
      await login(adminEmail, adminPassword);
      navigate('/admin');
    } catch (err) {
      setAdminError('Invalid admin credentials. Try admin@safezone.app / admin123');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-safezone-purple/10 p-3 rounded-full mb-4">
            <Shield className="h-8 w-8 text-safezone-purple" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome to SafeZone</h1>
          <p className="text-gray-600 mt-1">Choose your login type to continue</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Access your account or administrative dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="user" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="user" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  User Login
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Admin Login
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="user">
                <form onSubmit={handleUserLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="user-email">Email</Label>
                    <Input 
                      id="user-email"
                      type="email" 
                      placeholder="user@example.com"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="user-password">Password</Label>
                    <Input 
                      id="user-password"
                      type="password" 
                      value={userPassword}
                      onChange={(e) => setUserPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  {userError && (
                    <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
                      {userError}
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-500">
                    Demo: Any email and password will work for user login
                  </div>
                  
                  <Button type="submit" className="w-full bg-safezone-purple hover:bg-safezone-darkPurple" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login as User'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="admin">
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Admin Email</Label>
                    <Input 
                      id="admin-email"
                      type="email" 
                      placeholder="admin@safezone.app"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Admin Password</Label>
                    <Input 
                      id="admin-password"
                      type="password" 
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  {adminError && (
                    <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
                      {adminError}
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-500 flex items-center">
                    <Lock className="h-4 w-4 mr-1" />
                    Use: admin@safezone.app / admin123
                  </div>
                  
                  <Button type="submit" className="w-full bg-safezone-purple hover:bg-safezone-darkPurple" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login as Admin'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
