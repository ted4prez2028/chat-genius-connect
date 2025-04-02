
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FiUser, FiMail, FiLock, FiGoogle, FiFacebook, FiTwitter } from "react-icons/fi";
import { SiTiktok } from "react-icons/si";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { register, loginWithSocial, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill out all fields");
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    try {
      await register(name, email, password);
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
      <div className="flex-1 hidden md:block bg-cover bg-center" style={{ backgroundImage: "url('/public/lovable-uploads/35a54043-0fcb-4aff-9eb4-8a8f3bff0ca2.png')" }}>
        <div className="w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-white text-4xl md:text-6xl font-bold mb-4">
              JOIN OUR<br/>
              <span className="text-brand-yellow">FOOD TRUCK COMMUNITY</span>
            </h1>
            <p className="text-white text-xl mb-8">
              Create an account to start booking the best food trucks for your events.
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
            <CardDescription>Sign up to get started with Food Truck Community</CardDescription>
          </CardHeader>
          
          <form onSubmit={handleRegister}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FiUser />
                  </div>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    className="pl-10"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FiMail />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FiLock />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FiLock />
                  </div>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    className="pl-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full btn-secondary"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "SIGN UP"}
              </Button>
              
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-2 bg-white text-gray-500">or sign up with</span>
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
              Already have an account?{" "}
              <Link to="/login" className="text-brand-pink hover:underline">
                Log in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
