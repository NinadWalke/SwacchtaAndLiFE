import React, { useState } from 'react';
import './FranchiseeForm.css';
import api from '../../../utils/axiosConfig';

function FranchiseeForm() {
  const [formData, setFormData] = useState({
    ownerEmail: '',
    centerName: '',
    phone: '',
    address: '',
    pincode: ''
  });

  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await api.post('/official/franchisee/create', formData);

      if (response) {
        setMessage({ type: 'success', text: 'Franchisee created successfully!' });
        setFormData({
          ownerEmail: '',
          centerName: '',
          phone: '',
          address: '',
          pincode: ''
        });
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Something went wrong' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Server error. Please try again.' });
    }

    setLoading(false);
  };

  return (
    <div className="franchisee-form-page">
      <div className="franchisee-form-card">
        <div className="franchisee-form__header">
          <h2 className="franchisee-form__title">Create Franchisee Center</h2>
        </div>

        <form className="franchisee-form" onSubmit={handleSubmit}>
          
          {/* Owner Email */}
          <div className="form__group">
            <label className="form__label">Owner Email</label>
            <input
              type="email"
              name="ownerEmail"
              className="form__input"
              placeholder="owner@example.com"
              value={formData.ownerEmail}
              onChange={handleChange}
              required
            />
          </div>

          {/* Center Name */}
          <div className="form__group">
            <label className="form__label">Center Name</label>
            <input
              type="text"
              name="centerName"
              className="form__input"
              placeholder="GreenSathi Center - Mumbai"
              value={formData.centerName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Phone */}
          <div className="form__group">
            <label className="form__label">Phone Number</label>
            <input
              type="text"
              name="phone"
              className="form__input"
              placeholder="9876543210"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          {/* Address */}
          <div className="form__group">
            <label className="form__label">Address</label>
            <textarea
              name="address"
              className="form__textarea"
              placeholder="Street, Area, City"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          {/* Pincode */}
          <div className="form__group">
            <label className="form__label">Pincode</label>
            <input
              type="text"
              name="pincode"
              className="form__input"
              placeholder="400001"
              value={formData.pincode}
              onChange={handleChange}
              required
            />
          </div>

          {/* Submit */}
          <button className="btn btn--primary" disabled={loading}>
            {loading ? 'Creating…' : 'Create Franchisee'}
          </button>
        </form>

        {/* Status message */}
        {message && (
          <div
            className={`form__message ${
              message.type === 'success'
                ? 'form__message--success'
                : 'form__message--error'
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}

export default FranchiseeForm;
