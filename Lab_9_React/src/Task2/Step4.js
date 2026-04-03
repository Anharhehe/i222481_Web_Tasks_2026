import React from 'react';
import './TravelerOnboarding.css';

const NOTIFICATION_OPTIONS = [
  { id: 'flightUpdates', label: 'Flight Updates' },
  { id: 'visaUpdates', label: 'Visa Updates' },
  { id: 'promoOffers', label: 'Promotional Offers' },
];

/** Step 4: Travel Account Setup */
function Step4({ data, errors, onChange, onCheckboxChange, onNotifChange }) {
  return (
    <div className="step-section">
      <h3 className="step-heading">&#128274; Account Setup</h3>

      <div className="form-group">
        <label>Portal Username * (5–20 chars, alphanumeric + underscores)</label>
        <input
          type="text"
          name="username"
          value={data.username}
          onChange={onChange}
          placeholder="e.g. john_doe_2025"
          className={errors.username ? 'input-error' : ''}
        />
        {errors.username && <span className="error-msg">{errors.username}</span>}
      </div>

      <div className="form-group">
        <label>Password * (min 8 chars, upper, lower, number, special)</label>
        <input
          type="password"
          name="password"
          value={data.password}
          onChange={onChange}
          placeholder="••••••••"
          className={errors.password ? 'input-error' : ''}
        />
        {errors.password && <span className="error-msg">{errors.password}</span>}
      </div>

      <div className="form-group">
        <label>Confirm Password *</label>
        <input
          type="password"
          name="confirmPassword"
          value={data.confirmPassword}
          onChange={onChange}
          placeholder="••••••••"
          className={errors.confirmPassword ? 'input-error' : ''}
        />
        {errors.confirmPassword && <span className="error-msg">{errors.confirmPassword}</span>}
      </div>

      <div className="form-group">
        <label>Travel Notification Preferences</label>
        <div className="checkbox-group">
          {NOTIFICATION_OPTIONS.map((opt) => (
            <label key={opt.id} className="checkbox-label">
              <input
                type="checkbox"
                checked={data.notifications[opt.id] || false}
                onChange={(e) => onNotifChange(opt.id, e.target.checked)}
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <div className="form-group consent-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="terms"
            checked={data.terms}
            onChange={onCheckboxChange}
            className={errors.terms ? 'input-error' : ''}
          />
          <span>
            I agree to the <strong>Travel Terms &amp; Conditions</strong> *
          </span>
        </label>
        {errors.terms && <span className="error-msg">{errors.terms}</span>}
      </div>

      <div className="form-group consent-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="privacy"
            checked={data.privacy}
            onChange={onCheckboxChange}
            className={errors.privacy ? 'input-error' : ''}
          />
          <span>
            I consent to the <strong>Data Privacy Policy</strong> *
          </span>
        </label>
        {errors.privacy && <span className="error-msg">{errors.privacy}</span>}
      </div>
    </div>
  );
}

export default Step4;
