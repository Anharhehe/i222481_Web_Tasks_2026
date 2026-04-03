import React from 'react';
import './TravelerOnboarding.css';

const COUNTRIES = [
  { code: '', name: '-- Select Country --', states: [], phoneFormat: '' },
  {
    code: 'PK',
    name: 'Pakistan',
    states: ['Punjab', 'Sindh', 'KPK', 'Balochistan', 'Gilgit-Baltistan'],
    phoneFormat: '+92-3XX-XXXXXXX',
  },
  {
    code: 'US',
    name: 'United States',
    states: ['California', 'New York', 'Texas', 'Florida', 'Illinois'],
    phoneFormat: '+1-XXX-XXX-XXXX',
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    states: ['England', 'Scotland', 'Wales', 'Northern Ireland'],
    phoneFormat: '+44-XXXX-XXXXXX',
  },
  {
    code: 'IN',
    name: 'India',
    states: ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Gujarat'],
    phoneFormat: '+91-XXXXX-XXXXX',
  },
  {
    code: 'CA',
    name: 'Canada',
    states: ['Ontario', 'Quebec', 'British Columbia', 'Alberta', 'Manitoba'],
    phoneFormat: '+1-XXX-XXX-XXXX',
  },
];

export { COUNTRIES };

/** Step 2: Travel Contact & Origin Details */
function Step2({ data, errors, onChange }) {
  const selectedCountry = COUNTRIES.find((c) => c.code === data.country) || COUNTRIES[0];

  return (
    <div className="step-section">
      <h3 className="step-heading">&#128222; Contact &amp; Origin Details</h3>

      <div className="form-group">
        <label>Country *</label>
        <select
          name="country"
          value={data.country}
          onChange={onChange}
          className={errors.country ? 'input-error' : ''}
        >
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
        {errors.country && <span className="error-msg">{errors.country}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>
            Emergency Contact Number *
            {selectedCountry.phoneFormat && (
              <span className="format-hint"> (Format: {selectedCountry.phoneFormat})</span>
            )}
          </label>
          <input
            type="tel"
            name="phone"
            value={data.phone}
            onChange={onChange}
            placeholder={selectedCountry.phoneFormat || '+X-XXX-XXXXXXX'}
            className={errors.phone ? 'input-error' : ''}
          />
          {errors.phone && <span className="error-msg">{errors.phone}</span>}
        </div>

        <div className="form-group">
          <label>Secondary Contact (Optional)</label>
          <input
            type="tel"
            name="phone2"
            value={data.phone2}
            onChange={onChange}
            placeholder="Optional"
          />
        </div>
      </div>

      <div className="form-group">
        <label>Address Line 1 *</label>
        <input
          type="text"
          name="address1"
          value={data.address1}
          onChange={onChange}
          placeholder="Street address, P.O. Box"
          className={errors.address1 ? 'input-error' : ''}
        />
        {errors.address1 && <span className="error-msg">{errors.address1}</span>}
      </div>

      <div className="form-group">
        <label>Address Line 2 (Optional)</label>
        <input
          type="text"
          name="address2"
          value={data.address2}
          onChange={onChange}
          placeholder="Apartment, suite, unit, etc."
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>City *</label>
          <input
            type="text"
            name="city"
            value={data.city}
            onChange={onChange}
            placeholder="e.g. Karachi"
            className={errors.city ? 'input-error' : ''}
          />
          {errors.city && <span className="error-msg">{errors.city}</span>}
        </div>

        <div className="form-group">
          <label>State / Province *</label>
          <select
            name="state"
            value={data.state}
            onChange={onChange}
            className={errors.state ? 'input-error' : ''}
            disabled={!data.country}
          >
            <option value="">-- Select State --</option>
            {selectedCountry.states.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {errors.state && <span className="error-msg">{errors.state}</span>}
        </div>
      </div>

      <div className="form-group">
        <label>Postal Code *</label>
        <input
          type="text"
          name="postalCode"
          value={data.postalCode}
          onChange={onChange}
          placeholder="e.g. 75500"
          className={errors.postalCode ? 'input-error' : ''}
        />
        {errors.postalCode && <span className="error-msg">{errors.postalCode}</span>}
      </div>
    </div>
  );
}

export default Step2;
