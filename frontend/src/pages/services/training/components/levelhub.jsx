// src/pages/services/training/components/levelhub.jsx
import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { LEVELS } from "./level";
import "./level.css";
import "./levelhub.css";

const TrainingLevel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const level = LEVELS.find((l) => l.id === id);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [notes, setNotes] = useState("");

  if (!level) {
    return (
      <div className="levels-wrapper">
        <p>Level not found.</p>
        <button className="btn-primary" onClick={() => navigate("/training")}>
          Back to Training
        </button>
      </div>
    );
  }

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleSubmitProof = (e) => {
    e.preventDefault();
    // TODO: connect to backend to upload files and notes
    console.log("Submitting proof for level:", level.id, {
      files: selectedFiles,
      notes,
    });
    alert("Proof submitted! Once verified, you’ll earn points for this level.");
    setSelectedFiles([]);
    setNotes("");
  };

  return (
    <div className="levels-wrapper">
      <Link to="/training" className="back-link">
        ← Back to Training
      </Link>

      <div className="level-detail-card">
        <div className="level-detail-header">
          <div className="level-detail-icon">{level.icon}</div>
          <div>
            <div className="level-rank">Level {level.id}</div>
            <h1 className="level-name">{level.name}</h1>
            <span
              className="level-tag"
              style={{ borderColor: level.badgeColor, color: level.badgeColor }}
            >
              {level.tag}
            </span>
          </div>
        </div>

        <p className="level-detail-description">{level.short}</p>

        {level.description && Array.isArray(level.description) && (
          <section className="level-section">
            <h2>Learn</h2>
            <ul className="description-points">
              {level.description.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          </section>
        )}

        <section className="level-section">
          <h2>Tasks to complete</h2>
          <ol className="tasks-list">
            {level.tasks.map((task, idx) => (
              <li key={idx}>{task}</li>
            ))}
          </ol>
        </section>

        <section className="level-section">
          <h2>Upload proof</h2>
          <p className="section-hint">
            Upload photos, screenshots, PDFs, or reports that show you completed
            the tasks. You can also add notes for the verifier.
          </p>

          <form className="proof-form" onSubmit={handleSubmitProof}>
            <label className="file-input-label">
              Upload files
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="file-input"
              />
            </label>

            {selectedFiles.length > 0 && (
              <ul className="files-preview">
                {selectedFiles.map((file, idx) => (
                  <li key={idx}>{file.name}</li>
                ))}
              </ul>
            )}

            <label className="notes-label">
              Notes for verifier (optional)
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe what you did, dates, people involved, etc."
              />
            </label>

            <button type="submit" className="btn-primary">
              Submit proof for review
            </button>
          </form>

        </section>
      </div>
    </div>
  );
};

export default TrainingLevel;