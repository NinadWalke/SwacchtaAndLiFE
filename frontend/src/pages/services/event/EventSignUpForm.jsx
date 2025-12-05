import React, { useState } from "react";
import "./EventSignUpForm.css";

function EventSignUpForm({ event, onClose, onSubmit }) {
  const [formValues, setFormValues] = useState({
    name: "",
    phone: "",
    participants: "",
    idProof: null,
    notes: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
  const { name, value, type, files } = e.target;

  setFormValues((prev) => ({
    ...prev,
    [name]: type === "file" ? files[0] : value, // 👈 handle file & normal inputs
  }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(formValues);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    if (file && file.size > 2 * 1024 * 1024) {
      alert("File size exceeds 2MB. Please upload a smaller file.");
      return;
    }

    setFormValues((prev) => ({
      ...prev,
      idProof: file,
    }));
  };

  return (
    <div className="event-signup__backdrop">
      <div className="event-signup__card">
        <button
          className="event-signup__close"
          type="button"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="event-signup__title">Confirm your spot</h2>
        <p className="event-signup__subtitle">
          You’re signing up for{" "}
          <span className="highlight">{event.eventName}</span>.
        </p>

        <form className="event-signup__form" onSubmit={handleSubmit}>
          <div className="event-signup__field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your Name"
              value={formValues.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="event-signup__field">
            <label htmlFor="phone">Phone number </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={formValues.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="event-signup__field">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formValues.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select your gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Prefer not to say">Prefer not to say</option>
                <option value="Other">Other</option>
              </select>
            </div>

          
          <div className="event-signup__field">
            <label htmlFor="participants">No. of Participants</label>
            <input
              id="participants"
              name="participants"
              type="tel"
              placeholder="No. of Participants coming with you (if any)"
              value={formValues.participants}
              onChange={handleChange}
            />
          </div>

          <div className="event-signup__field">
        <label htmlFor="idProof">Upload ID Proof (Aadhar / College ID / PAN)</label>
        <input
          type="file"
          id="idProof"
          name="idProof"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={handleChange}
          required
        />
        <small style={{ fontSize: "12px", color: "#777" }}>
          Allowed formats: JPG, PNG, PDF — Max size: 2MB
        </small>
      </div>

      <div className="event-signup__field">
            <label htmlFor="experince">Do you have previous volunteering experience?</label>
            <textarea
              id="experince"
              name="experince"
              rows="3"
              placeholder="Describe your previous experience "
              value={formValues.experince}
              onChange={handleChange}
            />
          </div>

          <div className="event-signup__field">
            <label htmlFor="notes">Any notes for the organizers?</label>
            <textarea
              id="notes"
              name="notes"
              rows="3"
              placeholder="Eg. I’ll bring extra gloves, I’m coming with a friend, etc."
              value={formValues.notes}
              onChange={handleChange}
            />
          </div>

          <div className="event-signup__field">
            <label className="consent-label">
              <input
                type="checkbox"
                name="consent"
                checked={formValues.consent}
                onChange={(e) =>
                  setFormValues({ ...formValues, consent: e.target.checked })
                }
                required
              />
               I agree to participate responsibly and follow event instructions.
            </label>
          </div>


          <div className="event-signup__actions">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={submitting}
            >
              {submitting ? "Signing you up..." : "Confirm Sign Up"}
            </button>
          </div>
        </form>

        <p className="event-signup__hint">
          You’ll receive event updates on your registered number.
        </p>
      </div>
    </div>
  );
}

export default EventSignUpForm;
