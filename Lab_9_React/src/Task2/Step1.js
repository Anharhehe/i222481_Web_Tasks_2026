import React from 'react';
import './TravelerOnboarding.css';

/** Step 1: Traveler Identity Details */
function Step1({ data, errors, onChange, onFileChange }) {
  return (
    <div className="step-section">
      <h3 className="step-heading">&#128100; Traveler Identity Details</h3>

      <div className="form-row">
        <div className="form-group">
          <label>First Name *</label>
          <input
            type="text"
            name="firstName"
            value={data.firstName}
            onChange={onChange}
            placeholder="e.g. John"
            className={errors.firstName ? 'input-error' : ''}
          />
          {errors.firstName && <span className="error-msg">{errors.firstName}</span>}
        </div>

        <div className="form-group">
          <label>Last Name *</label>
          <input
            type="text"
            name="lastName"
            value={data.lastName}
            onChange={onChange}
            placeholder="e.g. Doe"
            className={errors.lastName ? 'input-error' : ''}
          />
          {errors.lastName && <span className="error-msg">{errors.lastName}</span>}
        </div>
      </div>

      <div className="form-group">
        <label>Contact Email *</label>
        <input
          type="email"
          name="email"
          value={data.email}
          onChange={onChange}
          placeholder="e.g. john.doe@gmail.com"
          className={errors.email ? 'input-error' : ''}
        />
        {errors.email && <span className="error-msg">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label>Date of Birth *</label>
        <input
          type="date"
          name="dob"
          value={data.dob}
          onChange={onChange}
          className={errors.dob ? 'input-error' : ''}
        />
        {errors.dob && <span className="error-msg">{errors.dob}</span>}
      </div>

      <div className="form-group">
        <label>Passport Photo * (JPG/PNG/JPEG, max 5 MB)</label>
        <input
          type="file"
          name="passportPhoto"
          accept=".jpg,.jpeg,.png"
          onChange={onFileChange}
          className={errors.passportPhoto ? 'input-error' : ''}
        />
        {data.passportPhotoName && (
          <span className="file-name">&#128247; {data.passportPhotoName}</span>
        )}
        {errors.passportPhoto && <span className="error-msg">{errors.passportPhoto}</span>}
      </div>
    </div>
  );
}

export default Step1;
