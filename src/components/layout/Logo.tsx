
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center">
      <img 
        src="/lovable-uploads/a843dce8-af86-413a-b3d6-3e13a287cd4f.png" 
        alt="FodTruck Community" 
        className="h-10 w-auto object-contain"
      />
    </Link>
  );
};

export default Logo;
