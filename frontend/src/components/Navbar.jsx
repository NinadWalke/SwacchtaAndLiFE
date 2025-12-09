import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const location = useLocation();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const [servicesOpen, setServicesOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setMenuOpen(false);
    setServicesOpen(false);
  }, [location]);

  useEffect(() => {
    const isHomePage = location.pathname === "/";
    
    if (!isHomePage) {
      setIsHeroVisible(false);
      return;
    }

    const handleScroll = () => {
      const heroSection = document.querySelector('.home__hero');
      if (heroSection) {
        const heroBottom = heroSection.getBoundingClientRect().bottom;
        setIsHeroVisible(heroBottom > 0);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setServicesOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navLinks = [
    { to: "/", label: "Home", type: "always" },
    { to: "/login", label: "Login", type: "guest" },
    { to: "/signup", label: "Signup", type: "guest" },
    { to: "/profile", label: "Profile", type: "user" },
    { to: "/osp", label: "OSP", type: "user" },
    { to: "/franchisee-dashboard", label: "Franchisee Dashboard", type: "user" },
    { to: "/officials", label: "Officials", type: "user" },
    { to: "/vendor", label: "Vendor", type: "user" }, 
  ];

  const serviceLinks = [
    { to: "/upload", label: "Upload" },
    { to: "/events", label: "Events" },
    { to: "/recycle", label: "Recycle & Earn" },
    { to: "/training", label: "Training" },
    { to: "/committee", label: "Committee" },
    { to: "/shop", label: "Shop" },
  ];

  const filteredLinks = navLinks.filter(link => {
    if (link.type === "always") return true;
    if (user && link.type === "user") return true;
    if (!user && link.type === "guest") return true;
    return false;
  });

  const isServiceActive = serviceLinks.some(link => location.pathname === link.to);

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

          {user && (
            <div 
              className="nav__dropdown" 
              ref={dropdownRef}
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                className={`nav__link nav__dropdown-trigger ${isServiceActive ? "active" : ""}`}
                onClick={() => setServicesOpen(!servicesOpen)}
              >
                Services
                <span className={`dropdown-arrow ${servicesOpen ? "dropdown-arrow--open" : ""}`}>▼</span>
              </button>

              {servicesOpen && (
                <div className="nav__dropdown-menu">
                  {serviceLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={`nav__dropdown-item ${location.pathname === link.to ? "active" : ""}`}
                      onClick={() => {
                        setServicesOpen(false);
                        setMenuOpen(false);
                      }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
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
        
        <div className="center-div"></div>
      </div>
    </header>
  );
}