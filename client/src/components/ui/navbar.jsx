import { Menu, School, LogOut, User, LayoutDashboard } from "lucide-react";
import React, { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "./button";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import DarkMode from "@/pages/DarkMode";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "./sheet";
import { Label } from "./label";
import { Input } from "./input";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "@/features/api/authApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);

  const navigate = useNavigate();
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const logoutHandler = async () => {
    await logoutUser();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "User log out");
      navigate("/login");
    }
  }, [isSuccess]);

  return (
    <header className="fixed top-0 left-0 right-0 z-30">
      <div className="backdrop-blur-sm bg-white/60 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-3">
                <div className="flex items-center justify-center h-10 w-10 rounded-xl shadow-md bg-gradient-to-tr from-indigo-600 to-violet-500">
                  <School className="text-white" size={18} />
                </div>
                <span className="hidden sm:inline-block font-extrabold text-lg text-slate-900 dark:text-slate-100">
                  Learning Hub
                </span>
              </Link>
            </div>

            {/* Desktop actions */}
            <nav className="hidden md:flex items-center gap-4">
              <Link
                to="/courses"
                className="text-sm font-medium text-slate-700 dark:text-slate-200 hover:underline"
              >
                Courses
              </Link>
              <Link
                to="/about"
                className="text-sm font-medium text-slate-700 dark:text-slate-200 hover:underline"
              >
                About
              </Link>

              {/* if logged in: avatar & menu, else CTAs */}
              {user ? (
                <div className="flex items-center gap-3">
                  <DarkMode />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        aria-label="Open account menu"
                        className="rounded-full ring-1 ring-slate-100 dark:ring-slate-800 p-0.5"
                      >
                        <Avatar>
                          <AvatarImage
                            src={user?.photoUrl || "https://github.com/shadcn.png"}
                            alt={user?.name || "avatar"}
                          />
                          <AvatarFallback>
                            {user?.name ? user.name.slice(0, 2).toUpperCase() : "UH"}
                          </AvatarFallback>
                        </Avatar>
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel className="font-semibold">
                        {user?.name || "My Account"}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                          <Link to="/my-learning" className="flex items-center gap-2">
                            <User size={16} /> My Learning
                          </Link>
                        </DropdownMenuItem>

                        <DropdownMenuItem asChild>
                          <Link to="/profile" className="flex items-center gap-2">
                            <User size={16} /> Edit Profile
                          </Link>
                        </DropdownMenuItem>

                        {user?.role === "instructor" && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => navigate("/admin/dashboard")}
                              className="flex items-center gap-2"
                            >
                              <LayoutDashboard size={16} /> Dashboard
                            </DropdownMenuItem>
                          </>
                        )}

                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logoutHandler} className="flex items-center gap-2">
                          <LogOut size={16} /> Log out
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <DarkMode />
                  <Button variant="ghost" onClick={() => navigate("/login")}>
                    Login
                  </Button>
                  <Button onClick={() => navigate("/login")}>Signup</Button>
                </div>
              )}
            </nav>

            {/* Mobile: menu button */}
            <div className="md:hidden flex items-center gap-2">
              <DarkMode />
              <MobileNavbar user={user} logoutHandler={logoutHandler} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

/* ----------------- Mobile Navbar (Sheet) ----------------- */
const MobileNavbar = ({ user, logoutHandler }) => {
  const role = user?.role;
  const navigate = useNavigate();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full p-2 border border-slate-100 dark:border-slate-800"
          aria-label="Open menu"
        >
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-72">
        <SheetHeader className="flex items-center justify-between">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-4">
          <Link to="/Courses" className="block text-sm font-medium" onClick={() => {}}>
            Courses
          </Link>
          <Link to="/about" className="block text-sm font-medium">
            About
          </Link>

          <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user?.photoUrl} alt={user?.name} />
                    <AvatarFallback>{user?.name?.slice(0,2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold">{user?.name}</div>
                    <div className="text-xs text-slate-500">{user?.email}</div>
                  </div>
                </div>

                <nav className="flex flex-col space-y-2">
                  <Link to="/my-learning" className="py-2 px-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
                    My Learning
                  </Link>
                  <Link to="/profile" className="py-2 px-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
                    Edit Profile
                  </Link>
                  {role === "instructor" && (
                    <button
                      className="py-2 px-2 rounded-md text-left hover:bg-slate-100 dark:hover:bg-slate-800"
                      onClick={() => navigate("/admin/dashboard")}
                    >
                      Dashboard
                    </button>
                  )}
                  <button
                    className="py-2 px-2 rounded-md text-left hover:bg-slate-100 dark:hover:bg-slate-800"
                    onClick={logoutHandler}
                  >
                    Log out
                  </button>
                </nav>
              </div>
            ) : (
              <div className="space-y-2">
                <Button variant="ghost" onClick={() => navigate("/login")}>Login</Button>
                <Button onClick={() => navigate("/login")}>Signup</Button>
              </div>
            )}
          </div>
        </div>

        <SheetFooter className="mt-6">
          <div className="w-full text-center text-xs text-slate-500">
            © {new Date().getFullYear()} Learning Hub
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
