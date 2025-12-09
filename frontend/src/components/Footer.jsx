import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__col">
          <h3 className="footer__col-title">GreenSathi</h3>
          <p className="footer__brand-tagline">
            A smart waste management initiative leveraging technology and citizen
            participation for a cleaner, greener India.
          </p>
          <ul className="footer__social-list">
            <li><a href="/" className="footer__social-link" aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></a></li>
            <li><a href="/" className="footer__social-link" aria-label="Twitter"><i className="fa-brands fa-x-twitter"></i></a></li>
            <li><a href="/" className="footer__social-link" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a></li>
          </ul>
        </div>

        <div className="footer__col">
          <h4 className="footer__col-title">Quick Links</h4>
          <ul className="footer__nav-list">
            <li className="footer__nav-item">
              <Link to="/" className="footer__nav-link">Home</Link>
            </li>
            <li className="footer__nav-item">
              <Link to="/upload" className="footer__nav-link">Report Garbage</Link>
            </li>
            <li className="footer__nav-item">
              <Link to="/profile" className="footer__nav-link">My Profile</Link>
            </li>
            <li className="footer__nav-item">
              <Link to="/events" className="footer__nav-link">Community Events</Link>
            </li>
          </ul>
        </div>

        <div className="footer__col">
          <h4 className="footer__col-title">Resources</h4>
          <ul className="footer__nav-list">
            <li className="footer__nav-item">
              <Link to="/contact" className="footer__nav-link">Contact Us</Link>
            </li>
            <li className="footer__nav-item">
              <Link to="/privacy-policy" className="footer__nav-link">Privacy Policy</Link>
            </li>
            <li className="footer__nav-item">
              <Link to="/terms-of-service" className="footer__nav-link">Terms of Service</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom-bar">
        <div className="bottom-bar__container">
          <p className="bottom-bar__copyright">
            {/* Dynamic year for copyright */}
            &copy; {new Date().getFullYear()} GreenSathi | Govt. of India
          </p>
          <p className="bottom-bar__credit">Made with ❤️ for a cleaner tomorrow</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;