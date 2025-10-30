import React, { useState, useEffect } from 'react';
import api from '../../utils/axiosConfig.js'; // Corrected path as per your new JSX
import './Leaderboard.css';

function Leaderboard() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                // The API path is /auth/users as per your original request
                const response = await api.get('/auth/users');
                
                // Sort users by report count (descending) before setting state
                const sortedUsers = Array.isArray(response.data) 
                    ? response.data.sort((a, b) => b.reports.length - a.reports.length)
                    : [];
                
                setUsers(sortedUsers);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch leaderboard:", err);
                setError("Failed to load leaderboard. Please try again later.");
                setUsers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []); // Empty dependency array ensures this runs once on mount

    const renderContent = () => {
        if (loading) {
            return <div className="loader-container"><div className="loader"></div><span>Loading...</span></div>;
        }

        if (error) {
            return <div className="error-message">{error}</div>;
        }

        if (users.length === 0) {
            return (
                <div className="empty-state">
                    <h2>No Reports Yet</h2>
                    <p>Be the first to make an impact and get on the leaderboard!</p>
                </div>
            );
        }

        return (
            <div className="leaderboard-table-container">
                <table className="leaderboard-table">
                    <thead>
                        <tr>
                            <th className="header-rank">Rank</th>
                            <th className="header-user">User</th>
                            <th className="header-score">Reports</th>
                            <th className="header-score">Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => {
                            const rank = index + 1;
                            const fullName = `${user.fname || ''} ${user.lname || ''}`.trim() || 'Anonymous User';
                            
                            // Add special classes for top 3 rows
                            let rowClass = 'leaderboard-row';
                            if (rank === 1) rowClass += ' rank-1-row';
                            if (rank === 2) rowClass += ' rank-2-row';
                            if (rank === 3) rowClass += ' rank-3-row';

                            // Add special class for rank cell
                            let rankCellClass = 'rank-cell';
                            if (rank === 1) rankCellClass += ' rank-1';
                            if (rank === 2) rankCellClass += ' rank-2';
                            if (rank === 3) rankCellClass += ' rank-3';

                            return (
                                <tr key={user._id || index} className={rowClass}>
                                    <td className={rankCellClass}>
                                        {rank}
                                    </td>
                                    <td className="user-cell">{fullName}</td>
                                    <td className="score-cell text-center">{user.reports.length}</td>
                                    <td className="score-cell text-center">{user.points}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <main className="leaderboard-container">
            <div className="leaderboard-header">
                <h1 className="leaderboard-title">Community Leaderboard</h1>
                <p className="leaderboard-subtitle">
                    See who's making the biggest impact by reporting issues!
                </p>
            </div>
            {renderContent()}
        </main>
    );
}

export default Leaderboard;