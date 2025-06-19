
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, User, Lock, MapPin, AlertTriangle, Phone } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-safezone-lightGray via-white to-safezone-purple/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center bg-safezone-purple/10 p-4 rounded-full mb-6 shadow-lg">
            <Shield className="h-12 w-12 text-safezone-purple" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">SafeZone</h1>
          <p className="text-xl text-safezone-purple font-semibold mb-2">Community Safety & Emergency Response Platform</p>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Empowering communities to stay safe through real-time incident reporting, emergency response coordination, 
            and comprehensive safety management tools.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
          {/* Features Section */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Platform Features</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm border">
                  <div className="bg-safezone-blue/10 p-2 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-safezone-blue" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Incident Reporting</h3>
                    <p className="text-gray-600 text-sm">Report safety incidents with location tracking and photo evidence</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm border">
                  <div className="bg-safezone-red/10 p-2 rounded-lg">
                    <Phone className="h-6 w-6 text-safezone-red" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Emergency SOS</h3>
                    <p className="text-gray-600 text-sm">One-touch emergency alert system with GPS location sharing</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm border">
                  <div className="bg-safezone-purple/10 p-2 rounded-lg">
                    <MapPin className="h-6 w-6 text-safezone-purple" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Real-time Mapping</h3>
                    <p className="text-gray-600 text-sm">Interactive maps showing incident locations and safety zones</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm border">
                  <div className="bg-safezone-lightPurple/10 p-2 rounded-lg">
                    <Shield className="h-6 w-6 text-safezone-lightPurple" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Admin Dashboard</h3>
                    <p className="text-gray-600 text-sm">Comprehensive analytics and management tools for safety coordinators</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-safezone-purple/5 p-6 rounded-lg border">
              <h3 className="font-semibold text-gray-900 mb-2">About SafeZone</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                SafeZone is designed to create safer communities through technology. Our platform enables rapid response 
                to emergencies, proactive safety management, and community-wide awareness of potential risks. 
                Whether you're a community member reporting an incident or a safety coordinator managing emergency responses, 
                SafeZone provides the tools you need to keep everyone safe.
              </p>
            </div>
          </div>

          {/* Login Card */}
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl text-gray-900">Welcome Back</CardTitle>
                  <CardDescription className="text-gray-600">
                    Choose your login type to access the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="user" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="user" className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4" />
                        Community User
                      </TabsTrigger>
                      <TabsTrigger value="admin" className="flex items-center gap-2 text-sm">
                        <Lock className="h-4 w-4" />
                        Administrator
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="user">
                      <form onSubmit={handleUserLogin} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="user-email">Email Address</Label>
                          <Input 
                            id="user-email"
                            type="email" 
                            placeholder="your@email.com"
                            value={userEmail}
                            onChange={(e) => setUserEmail(e.target.value)}
                            required
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="user-password">Password</Label>
                          <Input 
                            id="user-password"
                            type="password" 
                            placeholder="Enter your password"
                            value={userPassword}
                            onChange={(e) => setUserPassword(e.target.value)}
                            required
                            className="h-12"
                          />
                        </div>
                        
                        {userError && (
                          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                            {userError}
                          </div>
                        )}
                        
                        <div className="text-sm text-safezone-purple bg-safezone-purple/5 p-3 rounded-lg border border-safezone-purple/20">
                          <strong>Demo Access:</strong> Any email and password combination will work for community user login
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="w-full h-12 bg-safezone-purple hover:bg-safezone-darkPurple text-white font-medium text-base" 
                          disabled={loading}
                        >
                          {loading ? 'Signing In...' : 'Sign In as Community User'}
                        </Button>
                      </form>
                    </TabsContent>
                    
                    <TabsContent value="admin">
                      <form onSubmit={handleAdminLogin} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="admin-email">Administrator Email</Label>
                          <Input 
                            id="admin-email"
                            type="email" 
                            placeholder="admin@safezone.app"
                            value={adminEmail}
                            onChange={(e) => setAdminEmail(e.target.value)}
                            required
                            className="h-12"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="admin-password">Administrator Password</Label>
                          <Input 
                            id="admin-password"
                            type="password" 
                            placeholder="Enter admin password"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            required
                            className="h-12"
                          />
                        </div>
                        
                        {adminError && (
                          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                            {adminError}
                          </div>
                        )}
                        
                        <div className="text-sm text-safezone-darkPurple bg-safezone-darkPurple/5 p-3 rounded-lg border border-safezone-darkPurple/20 flex items-start">
                          <Lock className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                          <div>
                            <strong>Admin Credentials:</strong><br />
                            Email: admin@safezone.app<br />
                            Password: admin123
                          </div>
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="w-full h-12 bg-safezone-darkPurple hover:bg-safezone-purple text-white font-medium text-base" 
                          disabled={loading}
                        >
                          {loading ? 'Authenticating...' : 'Sign In as Administrator'}
                        </Button>
                      </form>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-500 text-sm">
          <p>&copy; 2024 SafeZone Platform. Building safer communities through technology.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
