import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const location = useLocation();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isHeroVisible, setIsHeroVisible] = useState(true);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Track if we're on home page and if hero section is visible
  useEffect(() => {
    const isHomePage = location.pathname === "/";
    
    if (!isHomePage) {
      setIsHeroVisible(false);
      return;
    }

    const handleScroll = () => {
      // Check if hero section is in view
      const heroSection = document.querySelector('.home__hero');
      if (heroSection) {
        const heroBottom = heroSection.getBoundingClientRect().bottom;
        // If hero bottom is above viewport top (scrolled past hero)
        setIsHeroVisible(heroBottom > 0);
      }
    };

    // Initial check
    handleScroll();

    // Add scroll listener
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]);

  const navLinks = [
    { to: "/", label: "Home", type: "always" },
    { to: "/login", label: "Login", type: "guest" },
    { to: "/signup", label: "Signup", type: "guest" },
    { to: "/profile", label: "Profile", type: "user" },
    { to: "/upload", label: "Upload", type: "user" },
    { to: "/osp", label: "OSP", type: "user" },
    { to: "/events", label: "Events", type: "user" },
    { to: "/recycle", label: "Recycle & Earn", type: "user" },
    { to: "/franchisee-dashboard", label: "Franchisee Dashboard", type: "user" },
    { to: "/training", label: "Training", type: "user" },
    { to: "/committee", label: "Committee", type: "user" },
    { to: "/shop", label: "Shop", type: "user" },
    { to: "/officials", label: "Officials", type: "user" },
    { to: "/vendor", label: "Vendor", type: "user" }, 
  ];

  const filteredLinks = navLinks.filter(link => {
    if (link.type === "always") return true;
    if (user && link.type === "user") return true;
    if (!user && link.type === "guest") return true;
    return false;
  });

  return (
    <header className={`navbar ${isHeroVisible ? 'navbar--hero-mode' : 'navbar--compact'}`} style={{padding: 0}}>
      <div className="navbar__container">
        <Link to="/" className="navbar__brand">
          <div className="brand__logo">
            <img
              src={isHeroVisible ? "/Logo1.png" : "/Logo2.png"}
              alt="Swacchta&Life Logo"
            />
          </div>
        </Link>

        <nav className={`navbar__nav ${menuOpen ? "navbar__nav--open" : ""}`}>
          {filteredLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav__link ${location.pathname === link.to ? "active" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          className={`navbar__toggle ${menuOpen ? "navbar__toggle--open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          <span className="hamburger__line hamburger__line--1"></span>
          <span className="hamburger__line hamburger__line--2"></span>
          <span className="hamburger__line hamburger__line--3"></span>
        </button>
        
        <div className="center-div">
         {/* it is just for centering navlinks */}
        </div>
      </div>
    </header>
  );
}