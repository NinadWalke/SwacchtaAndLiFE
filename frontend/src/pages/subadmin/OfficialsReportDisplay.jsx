import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../utils/axiosConfig";
// Import the new stylesheet
import "./OfficialsReportDisplay.css";

function LoadingSpinner() {
  // A styled loading state consistent with our other pages
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "#f8f9fa",
        color: "#0a6847",
        fontSize: "1.5rem",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      Loading Report Details...
    </div>
  );
}

export default function OfficialsReportDisplay() {
  const { id } = useParams();
  const [currReport, setCurrReport] = useState(null);

  useEffect(() => {
    const getReport = async () => {
      try {
        const res = await api.get(`/reports/${id}`);
        console.log(res);

        setCurrReport(res.data.report);
      } catch (err) {
        console.error("Error fetching report:", err);
      }
    };
    getReport();
  }, [id]);

  if (!currReport) {
    return <LoadingSpinner />;
  }

  const {
    reportImg,
    reportYoloImg,
    location,
    remarks,
    status,
    time,
    reportOwner,
  } = currReport;

  return (
    <main className="report-display-page">
      <Link to="/officials" className="back-link">
        &larr; Back to Dashboard
      </Link>

      <div className="report-container">
        <header className="report-header">
          <h1 className="report-header__title">Report Details</h1>
          <p className="report-header__id">ID: {id}</p>
        </header>

        <div className="report-body__grid">
          {/* --- Images Column --- */}
          <section className="report-images">
            <div className="image-display">
              <h2 className="image-display__caption">Original Image</h2>
              <img
                src={reportImg}
                alt="Original report"
                className="image-display__img"
              />
            </div>
            <div className="image-display">
              <h2 className="image-display__caption">AI Processed Image</h2>
              <img
                src={reportYoloImg}
                alt="YOLO processed report"
                className="image-display__img"
              />
            </div>
          </section>

          {/* --- Details Column --- */}
          <section className="report-details">
            <div className="info-box">
              <h2 className="info-box__title">Report Information</h2>
              <dl>
                <dt>Status</dt>
                <dd>
                  <span className={`status-badge status--${status}`}>
                    {status}
                  </span>
                </dd>

                <dt>Location</dt>
                <dd>
                  {location && location.coordinates?.length === 2 ? (
                    <a
                      href={`https://www.google.com/maps?q=${location.coordinates[1]},${location.coordinates[0]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View on Google Maps
                    </a>
                  ) : (
                    "Not specified"
                  )}
                </dd>

                <dt>Remarks</dt>
                <dd>{remarks || "No remarks provided."}</dd>

                <dt>Submitted At</dt>
                <dd>{new Date(time).toLocaleString()}</dd>
              </dl>
            </div>

            <div className="info-box">
              <h2 className="info-box__title">Reporter Information</h2>
              <dl>
                <dt>Name</dt>
                <dd>
                  {reportOwner.fname} {reportOwner.lname}
                </dd>

                <dt>Email</dt>
                <dd>{reportOwner.email}</dd>

                <dt>Phone</dt>
                <dd>{reportOwner.phone || "N/A"}</dd>

                <dt>Address</dt>
                <dd>{reportOwner.address || "N/A"}</dd>

                <dt>Role</dt>
                <dd>{reportOwner.role}</dd>
              </dl>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
