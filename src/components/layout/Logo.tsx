
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" className="flex items-center space-x-2">
      <div className="flex flex-col">
        <div className="flex items-center">
          <span className="text-xl font-bold text-white">F<img src="/public/lovable-uploads/fdab0375-3e61-4100-acfd-58213095ef9e.png" alt="Truck" className="inline h-6 mx-1" />DTRUCK</span>
        </div>
        <span className="text-xs tracking-widest text-white uppercase">COMMUNITY</span>
      </div>
    </Link>
  );
};

export default Logo;
