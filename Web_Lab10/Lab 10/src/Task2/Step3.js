import React, { useState } from 'react';
import './TravelerOnboarding.css';

const PROFESSIONS = [
  'Software Engineer',
  'Doctor',
  'Teacher',
  'Lawyer',
  'Accountant',
  'Business Analyst',
  'Data Scientist',
  'Designer',
  'Student',
  'Other',
];

const LANGUAGES = [
  'English', 'Urdu', 'Arabic', 'French', 'Spanish', 'Chinese',
  'German', 'Portuguese', 'Russian', 'Japanese', 'Hindi', 'Turkish',
];

/** Step 3: Travel Background Information */
function Step3({ data, errors, onChange, onTagChange }) {
  const [langInput, setLangInput] = useState('');

  const addLanguage = (lang) => {
    const trimmed = lang.trim();
    if (!trimmed) return;
    if (data.languages.includes(trimmed)) return;
    if (data.languages.length >= 10) return;
    onTagChange('languages', [...data.languages, trimmed]);
    setLangInput('');
  };

  const removeLanguage = (lang) => {
    onTagChange('languages', data.languages.filter((l) => l !== lang));
  };

  return (
    <div className="step-section">
      <h3 className="step-heading">&#9992;&#65039; Travel Background</h3>

      <div className="form-group">
        <label>Profession *</label>
        <select
          name="profession"
          value={data.profession}
          onChange={onChange}
          className={errors.profession ? 'input-error' : ''}
        >
          <option value="">-- Select Profession --</option>
          {PROFESSIONS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        {errors.profession && <span className="error-msg">{errors.profession}</span>}
      </div>

      {data.profession === 'Other' && (
        <div className="form-group">
          <label>Specify Profession *</label>
          <input
            type="text"
            name="professionOther"
            value={data.professionOther}
            onChange={onChange}
            placeholder="Enter your profession"
            className={errors.professionOther ? 'input-error' : ''}
          />
          {errors.professionOther && <span className="error-msg">{errors.professionOther}</span>}
        </div>
      )}

      <div className="form-group">
        <label>International Travel Experience (years) *</label>
        <input
          type="number"
          name="travelExp"
          value={data.travelExp}
          onChange={onChange}
          min="0"
          placeholder="e.g. 3"
          className={errors.travelExp ? 'input-error' : ''}
        />
        {errors.travelExp && <span className="error-msg">{errors.travelExp}</span>}
      </div>

      <div className="form-group">
        <label>Languages Known * (min 2, max 10)</label>
        <div className="tag-input-wrap">
          {data.languages.map((lang) => (
            <span key={lang} className="tag">
              {lang}
              <button
                type="button"
                className="tag-remove"
                onClick={() => removeLanguage(lang)}
              >
                &#215;
              </button>
            </span>
          ))}
          {data.languages.length < 10 && (
            <>
              <select
                className="tag-select"
                value=""
                onChange={(e) => {
                  if (e.target.value) addLanguage(e.target.value);
                }}
              >
                <option value="">+ Add language</option>
                {LANGUAGES.filter((l) => !data.languages.includes(l)).map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
                <option value="__custom">Custom...</option>
              </select>
            </>
          )}
        </div>
        {/* Custom language input */}
        <div className="tag-custom-row">
          <input
            type="text"
            value={langInput}
            onChange={(e) => setLangInput(e.target.value)}
            placeholder="Type custom language..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') { e.preventDefault(); addLanguage(langInput); }
            }}
            className="tag-custom-input"
          />
          <button type="button" className="btn-add-tag" onClick={() => addLanguage(langInput)}>
            Add
          </button>
        </div>
        {errors.languages && <span className="error-msg">{errors.languages}</span>}
      </div>

      <div className="form-group">
        <label>LinkedIn Profile URL (Optional)</label>
        <input
          type="url"
          name="linkedin"
          value={data.linkedin}
          onChange={onChange}
          placeholder="https://linkedin.com/in/username"
          className={errors.linkedin ? 'input-error' : ''}
        />
        {errors.linkedin && <span className="error-msg">{errors.linkedin}</span>}
      </div>

      <div className="form-group">
        <label>Travel Blog / Website (Optional)</label>
        <input
          type="url"
          name="website"
          value={data.website}
          onChange={onChange}
          placeholder="https://yourblog.com"
          className={errors.website ? 'input-error' : ''}
        />
        {errors.website && <span className="error-msg">{errors.website}</span>}
      </div>
    </div>
  );
}

export default Step3;
