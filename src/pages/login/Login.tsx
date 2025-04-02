
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loginWithSocial, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      // Error is handled in the context
    }
  };

  const handleSocialLogin = async (provider: "google" | "facebook" | "twitter" | "tiktok") => {
    try {
      await loginWithSocial(provider);
      navigate("/dashboard");
    } catch (error) {
      // Error is handled in the context
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 hidden md:block bg-cover bg-center" style={{ backgroundImage: "url('/public/lovable-uploads/1820d274-f0e0-4b58-9bcb-b4d8cb80a12f.png')" }}>
        <div className="w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-white text-4xl md:text-6xl font-bold mb-4">
              <span className="text-brand-yellow">THE PERFECT</span><br/>
              OPTIONS FOR YOUR EVENT
            </h1>
            <p className="text-white text-xl mb-8">
              Connect with the best food trucks for your next event.
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">WELCOME BACK!</CardTitle>
            <CardDescription>Login to manage your food truck experience</CardDescription>
          </CardHeader>
          
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Mail size={16} />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-sm text-brand-pink hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Lock size={16} />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full btn-secondary"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "LOGIN"}
              </Button>
              
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-2 bg-white text-gray-500">or</span>
                <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gray-200"></div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex items-center justify-center gap-2"
                  onClick={() => handleSocialLogin("google")}
                >
                  <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span>Google</span>
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex items-center justify-center gap-2"
                  onClick={() => handleSocialLogin("facebook")}
                >
                  <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Facebook</span>
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex items-center justify-center gap-2"
                  onClick={() => handleSocialLogin("twitter")}
                >
                  <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                  <span>Twitter</span>
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex items-center justify-center gap-2"
                  onClick={() => handleSocialLogin("tiktok")}
                >
                  <svg className="w-4 h-4 text-black" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                    <path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"></path>
                  </svg>
                  <span>TikTok</span>
                </Button>
              </div>
            </CardContent>
          </form>
          
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-brand-pink hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
