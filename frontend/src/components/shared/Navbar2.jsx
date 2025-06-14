import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "../ui/avatar";
import { LogOut, Menu, User2, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";

const Navbar2 = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setUser(null));
        localStorage.removeItem("token");
        toast.success(res.data.message);
        setTimeout(() => {
          window.location.href = "/";
        }, 500);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <div className="bg-white shadow-sm sticky top-0 z-50">
      <div className="flex items-center justify-between mx-auto max-w-7xl px-4 py-3 md:h-16">
        {/* Logo */}
        <div className="text-2xl font-bold">
          Job<span className="text-[#F83002]">Sprint</span>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-12">
          <ul className="flex font-medium items-center gap-5">
            {user && user.role === "recruiter" ? (
              <>
                <li><Link to="/admin/companies">Companies</Link></li>
                <li><Link to="/admin/jobs">Jobs</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/jobs2">Jobs</Link></li>
              </>
            )}
          </ul>

          {!user ? (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-[#6A38C2] hover:bg-[#5b30a6]">Signup</Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user?.profile?.profilePhoto} alt="User Profile" />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="flex gap-2">
                  <Avatar><AvatarImage src={user?.profile?.profilePhoto} alt="User Profile" /></Avatar>
                  <div>
                    <h4 className="font-medium">{user?.fullname}</h4>
                    <p className="text-sm text-muted-foreground">{user?.profile?.bio}</p>
                  </div>
                </div>
                <div className="flex flex-col mt-3 text-gray-600">
                  {user?.role === "student" && (
                    <div className="flex items-center gap-2">
                      <User2 />
                      <Button variant="link">
                        <Link to="/profile">View Profile</Link>
                      </Button>
                    </div>
                  )}
                  <div className="flex items-center gap-2 cursor-pointer" onClick={logoutHandler}>
                    <LogOut />
                    <Button variant="link">Logout</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="absolute top-16 left-0 w-full bg-white shadow-md border-b md:hidden z-50 px-4 pb-4">
            <ul className="flex flex-col font-medium gap-4 mt-2">
              {user && user.role === "recruiter" ? (
                <>
                  <li><Link to="/admin/companies" onClick={() => setMenuOpen(false)}>Companies</Link></li>
                  <li><Link to="/admin/jobs" onClick={() => setMenuOpen(false)}>Jobs</Link></li>
                </>
              ) : (
                <>
                  <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
                  <li><Link to="/jobs2" onClick={() => setMenuOpen(false)}>Jobs</Link></li>
                </>
              )}
            </ul>

            {!user ? (
              <div className="mt-4 flex flex-col gap-2">
                <Link to="/login"><Button variant="outline" className="w-full">Login</Button></Link>
                <Link to="/signup"><Button className="bg-[#6A38C2] w-full hover:bg-[#5b30a6]">Signup</Button></Link>
              </div>
            ) : (
              <div className="mt-4">
                {user?.role === "student" && (
                  <div className="flex items-center gap-2">
                    <User2 />
                    <Button variant="link" className="p-0">
                      <Link to="/profile" onClick={() => setMenuOpen(false)}>View Profile</Link>
                    </Button>
                  </div>
                )}
                <div className="flex items-center gap-2 mt-2 cursor-pointer" onClick={logoutHandler}>
                  <LogOut />
                  <Button variant="link" className="p-0">Logout</Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar2;
