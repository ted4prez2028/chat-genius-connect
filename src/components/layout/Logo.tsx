
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <div className="flex flex-col">
        <div className="flex items-center">
          <span className="text-2xl font-bold text-white tracking-wider">F<img src="/lovable-uploads/605016c4-3826-4eb4-a00e-7e223f2df632.png" alt="Truck" className="inline h-6 mx-1" />DTRUCK</span>
        </div>
        <span className="text-xs tracking-wider text-white uppercase font-light">COMMUNITY</span>
      </div>
    </Link>
  );
};

export default Logo;
