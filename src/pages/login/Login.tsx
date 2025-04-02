
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FiMail, FiLock, FiGoogle, FiFacebook, FiTwitter } from "react-icons/fi";
import { SiTiktok } from "react-icons/si";
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
                    <FiMail />
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
                    <FiLock />
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
                  <FiGoogle className="text-red-500" />
                  <span>Google</span>
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex items-center justify-center gap-2"
                  onClick={() => handleSocialLogin("facebook")}
                >
                  <FiFacebook className="text-blue-600" />
                  <span>Facebook</span>
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex items-center justify-center gap-2"
                  onClick={() => handleSocialLogin("twitter")}
                >
                  <FiTwitter className="text-blue-400" />
                  <span>Twitter</span>
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex items-center justify-center gap-2"
                  onClick={() => handleSocialLogin("tiktok")}
                >
                  <SiTiktok className="text-black" />
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
