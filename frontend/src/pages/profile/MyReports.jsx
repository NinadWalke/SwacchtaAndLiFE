import React, { useEffect, useState } from 'react';
import api from '../../utils/axiosConfig';
import './MyReports.css'; // Import the corresponding CSS file

function MyReports() {
    // Starts as null, just like your original file
    const [reports, setReports] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getReports = async () => {
            setLoading(true);
            setError(null);
            try {
                // This is your API call
                const res = await api.get('/reports/my-reports');
                setReports(res.data);
            } catch (err) {
                console.error("Failed to fetch reports:", err);
                setError('Failed to load reports. Please try again later.');
                setReports([]); // Set to empty on error to avoid render issues
            } finally {
                setLoading(false);
            }
        }
        
        getReports();
    }, []);

    // Helper function to format the date
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Helper function to get status class from schema
    const getStatusClass = (status) => {
        if (!status) return 'aspirely-report-status-default';
        // Handles "pending", "allotted", "resolved"
        return `aspirely-report-status-${status.toLowerCase()}`;
    };

    // Renders the correct content based on fetch state
    const renderContent = () => {
        if (loading) {
            return <div className="aspirely-reports-helper-text">Loading Reports...</div>;
        }

        if (error) {
            return <div className="aspirely-reports-helper-text aspirely-reports-error">{error}</div>;
        }

        // Handles both initial 'null' state and an empty array response
        if (!reports || reports.length === 0) {
            return <div className="aspirely-reports-helper-text">You have no reports.</div>;
        }

        return (
            <div className="aspirely-reports-grid">
                {reports.map((report) => (
                    <div key={report._id} className="aspirely-report-card">
                        <img 
                            src={report.reportImg} 
                            alt="Report" 
                            className="aspirely-report-card-img" 
                        />
                        <div className="aspirely-report-card-content">
                            <div className="aspirely-report-card-header">
                                <span className={`aspirely-report-status ${getStatusClass(report.status)}`}>
                                    {report.status}
                                </span>
                                <span className="aspirely-report-card-date">
                                    {formatDate(report.time || report.createdAt)}
                                </span>
                            </div>
                            
                            <p className="aspirely-report-card-remarks">
                                {report.remarks}
                            </p>

                            <div className="aspirely-report-card-footer">
                                {/* Links to Google Maps: "latitude,longitude" */}
                                <a 
                                    href={`https://www.google.com/maps?q=${report.location.coordinates[1]},${report.location.coordinates[0]}`}
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="aspirely-btn-secondary"
                                >
                                    View Location
                                </a>
                                
                                {/* Conditionally render button ONLY if reportYoloImg exists */}
                                {report.reportYoloImg && (
                                    <a 
                                        href={report.reportYoloImg} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="aspirely-btn-primary"
                                    >
                                        View Image
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return ( 
        <div className="aspirely-myreports-container">
            <h1 className="aspirely-myreports-title">My Reports</h1>
            {renderContent()}
        </div>
     );
}

export default MyReports;