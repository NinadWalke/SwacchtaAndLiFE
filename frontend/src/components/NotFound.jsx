import React from 'react';
import './NotFound.css';

function NotFound() {
    return ( 
        <main className="not-found-container">
            <div className="not-found-content">
                <span className="not-found-code">404</span>
                <h1 className="not-found-title">Oops! Page Not Found</h1>
                <p className="not-found-message">
                    We can't seem to find the page you're looking for. It might have been moved or deleted.
                </p>
                <a href="/" className="not-found-home-link">
                    Go Back Home
                </a>
            </div>
        </main>
     );
}

export default NotFound;