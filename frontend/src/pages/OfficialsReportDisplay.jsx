import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../utils/axiosConfig';

export default function OfficialsReportDisplay() {
    const { id } = useParams();
    const [currReport, setCurrReport] = useState(null);

    useEffect(() => {
        const getReport = async () => {
            try {
                const res = await api.get(`/reports/${id}`);
                setCurrReport(res.data.report);
            } catch (err) {
                console.error("Error fetching report:", err);
            }
        }
        getReport();
    }, [id]);

    if (!currReport) {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                background: "#f5f5f5",
                color: "#555",
                fontSize: "1.2rem"
            }}>
                Loading report...
            </div>
        );
    }

    const { reportImg, reportYoloImg, location, remarks, status, time, reportOwner } = currReport;

    return (
        <div style={{ minHeight: "100vh", background: "#f0f2f5", padding: "40px 20px", fontFamily: "'Segoe UI', sans-serif" }}>
            <div style={{
                maxWidth: 1000,
                margin: "0 auto",
                background: "#fff",
                borderRadius: 20,
                boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                overflow: "hidden"
            }}>
                <div style={{
                    background: "linear-gradient(90deg, #2ecc71 0%, #27ae60 100%)",
                    color: "white",
                    padding: "24px 32px"
                }}>
                    <h1 style={{ margin: 0, fontSize: "2rem" }}>Report Details</h1>
                    <p style={{ margin: "8px 0 0 0", fontSize: "1rem", opacity: 0.9 }}>Report ID: {id}</p>
                </div>

                <div style={{ padding: 32, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
                    {/* Images */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div style={{ textAlign: "center" }}>
                            <h3 style={{ marginBottom: 8 }}>Original Image</h3>
                            <img src={reportImg} alt="Report" style={{
                                width: "100%",
                                borderRadius: 12,
                                border: "1px solid #ddd",
                                boxShadow: "0 4px 16px rgba(0,0,0,0.08)"
                            }} />
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <h3 style={{ marginBottom: 8 }}>YOLO Processed Image</h3>
                            <img src={reportYoloImg} alt="YOLO Report" style={{
                                width: "100%",
                                borderRadius: 12,
                                border: "1px solid #ddd",
                                boxShadow: "0 4px 16px rgba(0,0,0,0.08)"
                            }} />
                        </div>
                    </div>

                    {/* Details */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                        <div style={{
                            padding: 24,
                            borderRadius: 16,
                            background: "#f9f9f9",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
                        }}>
                            <h3 style={{ marginBottom: 12 }}>Report Information</h3>
                            <p><strong>Status:</strong> <span style={{
                                color: status === "pending" ? "#f39c12" : status === "alloted" ? "#2980b9" : "#27ae60",
                                fontWeight: 600
                            }}>{status.toUpperCase()}</span></p>
                            <p><strong>Location:</strong> {location}</p>
                            <p><strong>Remarks:</strong> {remarks}</p>
                            <p><strong>Submitted At:</strong> {new Date(time).toLocaleString()}</p>
                        </div>

                        <div style={{
                            padding: 24,
                            borderRadius: 16,
                            background: "#f9f9f9",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
                        }}>
                            <h3 style={{ marginBottom: 12 }}>Reporter Information</h3>
                            <p><strong>Name:</strong> {reportOwner.fname} {reportOwner.lname}</p>
                            <p><strong>Email:</strong> {reportOwner.email}</p>
                            <p><strong>Phone:</strong> {reportOwner.phone}</p>
                            <p><strong>Address:</strong> {reportOwner.address || "N/A"}</p>
                            <p><strong>Role:</strong> {reportOwner.role}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
