"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Zap } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "./ui/skeleton";
import apiClient from "@/api/apiClient";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsloggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem("userId");
    console.log("token in navbar", token);
    if (token) {
      setIsloggedIn(true);
    }
    setLoading(false);
  }, [isLoggedIn]);

  const handleLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    const response = await apiClient.get("/logout");
    console.log(response);
    if (response.status) {
      setIsloggedIn(false);
    }
  };

  return (
    <nav className="fixed top-5 left-5 right-5 z-50 backdrop-glass bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 backdrop-blur-xl border-black/20 border-2 rounded-2xl shadow-xs">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center w-10 h-10 bg-cta-gradient rounded-xl shadow-soft">
              <img src="/logo.png" />
            </div>
            <span className="text-xl text-primary font-bold"></span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#home"
              className="text-foreground hover:text-primary transition-colors"
            >
              Home
            </a>
            <a
              href="#features"
              className="text-foreground hover:text-primary transition-colors"
            >
              Features
            </a>
            <a
              href="#process"
              className="text-foreground hover:text-primary transition-colors"
            >
              Process
            </a>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {loading ? (
              <Skeleton className="h-8 w-[70px]" />
            ) : isLoggedIn ? (
              <Button variant="hero" size="sm" onClick={() => handleLogout()}>
                Logout
              </Button>
            ) : (
              <Link href={"/auth/signin"}>
                <Button variant="hero" size="sm">
                  Sign in
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20 backdrop-glass">
            <div className="flex flex-col space-y-4">
              <a
                href="#home"
                className="text-foreground hover:text-primary transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </a>
              <a
                href="#features"
                className="text-foreground hover:text-primary transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#process"
                className="text-foreground hover:text-primary transition-colors px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                Process
              </a>
              <div className="flex flex-col space-y-2 pt-4">
                {loading ? (
                  <Skeleton className="h-8 w-full" />
                ) : isLoggedIn ? (
                  <Button
                    variant="ghost-primary"
                    size="sm"
                    onClick={() => handleLogout()}
                  >
                    Logout
                  </Button>
                ) : (
                  <Link href={"/auth/signin"}>
                    <Button variant="hero" size="sm" className="w-full">
                      Sign in
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
