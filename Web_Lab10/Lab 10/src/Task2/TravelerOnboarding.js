import React, { useState, useEffect } from 'react';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import './TravelerOnboarding.css';

const STORAGE_KEY = 'traveler_onboarding_data';

const TEMP_EMAIL_DOMAINS = [
  'mailinator.com', 'guerrillamail.com', 'tempmail.com', 'throwaway.email',
  'yopmail.com', 'sharklasers.com', 'trashmail.com',
];

function getInitialFormData() {
  return {
    step1: { firstName: '', lastName: '', email: '', dob: '', passportPhoto: null, passportPhotoName: '' },
    step2: { country: '', phone: '', phone2: '', address1: '', address2: '', city: '', state: '', postalCode: '' },
    step3: { profession: '', professionOther: '', travelExp: '', languages: [], linkedin: '', website: '' },
    step4: { username: '', password: '', confirmPassword: '', notifications: {}, terms: false, privacy: false },
  };
}

// ─── Validators ──────────────────────────────────────────────────────────────

function validateStep1(data) {
  const errors = {};
  const nameRe = /^[A-Za-z\s]+$/;

  if (!data.firstName) errors.firstName = 'First name is required.';
  else if (data.firstName.length < 2) errors.firstName = 'Min 2 characters.';
  else if (data.firstName.length > 50) errors.firstName = 'Max 50 characters.';
  else if (!nameRe.test(data.firstName)) errors.firstName = 'No numbers or special characters.';

  if (!data.lastName) errors.lastName = 'Last name is required.';
  else if (data.lastName.length < 2) errors.lastName = 'Min 2 characters.';
  else if (data.lastName.length > 50) errors.lastName = 'Max 50 characters.';
  else if (!nameRe.test(data.lastName)) errors.lastName = 'No numbers or special characters.';

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email) errors.email = 'Email is required.';
  else if (!emailRe.test(data.email)) errors.email = 'Invalid email format.';
  else {
    const domain = data.email.split('@')[1]?.toLowerCase();
    if (TEMP_EMAIL_DOMAINS.includes(domain))
      errors.email = 'Temporary email domains are not allowed.';
  }

  if (!data.dob) {
    errors.dob = 'Date of birth is required.';
  } else {
    const today = new Date();
    const dob = new Date(data.dob);
    if (dob > today) errors.dob = 'Date of birth cannot be in the future.';
    else {
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
      if (age < 18) errors.dob = 'Traveler must be at least 18 years old.';
    }
  }

  if (!data.passportPhoto) errors.passportPhoto = 'Passport photo is required.';

  return errors;
}

function validateStep2(data) {
  const errors = {};

  if (!data.country) errors.country = 'Please select a country.';

  if (!data.phone) errors.phone = 'Emergency contact number is required.';
  else if (!/^\+?[\d\s\-().]{7,20}$/.test(data.phone))
    errors.phone = 'Invalid phone number format.';

  if (!data.address1) errors.address1 = 'Address is required.';
  else if (data.address1.length < 5) errors.address1 = 'Min 5 characters.';

  if (!data.city) errors.city = 'City is required.';
  else if (/\d/.test(data.city)) errors.city = 'City cannot contain numbers.';

  if (!data.state) errors.state = 'Please select a state/province.';

  if (!data.postalCode) errors.postalCode = 'Postal code is required.';
  else if (!/^[A-Za-z0-9\s\-]{3,10}$/.test(data.postalCode))
    errors.postalCode = 'Invalid postal code format.';

  return errors;
}

function validateStep3(data, dobStr) {
  const errors = {};

  if (!data.profession) errors.profession = 'Please select a profession.';
  if (data.profession === 'Other' && !data.professionOther)
    errors.professionOther = 'Please specify your profession.';

  const exp = Number(data.travelExp);
  if (data.travelExp === '' || data.travelExp === undefined) {
    errors.travelExp = 'Travel experience is required.';
  } else if (isNaN(exp) || exp < 0) {
    errors.travelExp = 'Must be a non-negative number.';
  } else if (dobStr) {
    const dob = new Date(dobStr);
    const today = new Date();
    const maxAge = today.getFullYear() - dob.getFullYear() - 18;
    if (exp > maxAge) errors.travelExp = `Cannot exceed ${maxAge} years (age - 18).`;
  }

  if (data.languages.length < 2) errors.languages = 'Must add at least 2 languages.';

  if (data.linkedin) {
    const linkedinRe = /^https:\/\/(www\.)?linkedin\.com\/in\/.+/;
    if (!linkedinRe.test(data.linkedin))
      errors.linkedin = 'Must be a valid LinkedIn URL (https://linkedin.com/in/username).';
  }

  if (data.website) {
    try {
      new URL(data.website);
    } catch {
      errors.website = 'Must be a valid URL.';
    }
  }

  return errors;
}

function validateStep4(data) {
  const errors = {};
  const usedUsernames = ['admin', 'root', 'traveler', 'user123'];

  if (!data.username) {
    errors.username = 'Username is required.';
  } else if (!/^[A-Za-z0-9_]{5,20}$/.test(data.username)) {
    errors.username = '5–20 characters, alphanumeric and underscores only.';
  } else if (usedUsernames.includes(data.username.toLowerCase())) {
    errors.username = 'This username is already taken.';
  }

  const pwRe = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
  if (!data.password) errors.password = 'Password is required.';
  else if (!pwRe.test(data.password))
    errors.password = 'Min 8 chars with uppercase, lowercase, number & special character.';

  if (!data.confirmPassword) errors.confirmPassword = 'Please confirm your password.';
  else if (data.password !== data.confirmPassword) errors.confirmPassword = 'Passwords do not match.';

  if (!data.terms) errors.terms = 'You must accept the Terms & Conditions.';
  if (!data.privacy) errors.privacy = 'You must consent to the Data Privacy Policy.';

  return errors;
}

// ─── Progress calculation ─────────────────────────────────────────────────────

function calcProgress(currentStep, formData) {
  const totalFields = 22; // rough total of required fields
  const filled = [
    formData.step1.firstName, formData.step1.lastName, formData.step1.email,
    formData.step1.dob, formData.step1.passportPhoto,
    formData.step2.country, formData.step2.phone, formData.step2.address1,
    formData.step2.city, formData.step2.state, formData.step2.postalCode,
    formData.step3.profession, formData.step3.travelExp,
    formData.step3.languages.length >= 2 ? 'ok' : '',
    formData.step4.username, formData.step4.password, formData.step4.confirmPassword,
    formData.step4.terms ? 'ok' : '',
    formData.step4.privacy ? 'ok' : '',
  ].filter(Boolean).length;

  const stepBonus = ((currentStep - 1) / 4) * 5;
  return Math.min(100, Math.round((filled / totalFields) * 95 + stepBonus));
}

function progressColor(pct) {
  if (pct <= 25) return '#ef4444';
  if (pct <= 50) return '#eab308';
  if (pct <= 75) return '#3b82f6';
  return '#22c55e';
}

// ─── Main Component ──────────────────────────────────────────────────────────

const STEP_TITLES = [
  '1. Identity',
  '2. Contact & Origin',
  '3. Background',
  '4. Account Setup',
];

function TravelerOnboarding() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : getInitialFormData();
    } catch {
      return getInitialFormData();
    }
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Persist to localStorage whenever formData changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const showNotif = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  // ── Generic onChange for text/select/date/email inputs
  const handleChange = (step) => (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [step]: { ...prev[step], [name]: value },
    }));
    // Clear error on change
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // ── File upload handler
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowed = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowed.includes(file.type)) {
      setErrors((prev) => ({ ...prev, passportPhoto: 'Only JPG, JPEG, and PNG files are allowed.' }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, passportPhoto: 'File size must not exceed 5 MB.' }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      step1: { ...prev.step1, passportPhoto: file.name, passportPhotoName: file.name },
    }));
    setErrors((prev) => ({ ...prev, passportPhoto: undefined }));
  };

  // ── Tag (languages) handler
  const handleTagChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      step3: { ...prev.step3, [field]: value },
    }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // ── Checkbox change for terms/privacy
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      step4: { ...prev.step4, [name]: checked },
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // ── Notifications checkbox
  const handleNotifChange = (id, checked) => {
    setFormData((prev) => ({
      ...prev,
      step4: {
        ...prev.step4,
        notifications: { ...prev.step4.notifications, [id]: checked },
      },
    }));
  };

  // ── Validate current step
  const validateCurrent = () => {
    let errs = {};
    if (currentStep === 1) errs = validateStep1(formData.step1);
    if (currentStep === 2) errs = validateStep2(formData.step2);
    if (currentStep === 3) errs = validateStep3(formData.step3, formData.step1.dob);
    if (currentStep === 4) errs = validateStep4(formData.step4);
    return errs;
  };

  const handleNext = () => {
    const errs = validateCurrent();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      showNotif('Please fix the errors before continuing.', 'error');
      return;
    }
    setErrors({});
    setCurrentStep((s) => s + 1);
  };

  const handlePrev = () => {
    setErrors({});
    setCurrentStep((s) => s - 1);
  };

  const handleSubmit = () => {
    const errs = validateStep4(formData.step4);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      showNotif('Please fix the errors before submitting.', 'error');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      localStorage.removeItem(STORAGE_KEY);
      showNotif('Registration successful! Welcome aboard.', 'success');
    }, 1500);
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear all form data? This cannot be undone.')) {
      setFormData(getInitialFormData());
      setErrors({});
      setCurrentStep(1);
      localStorage.removeItem(STORAGE_KEY);
      showNotif('Form cleared.', 'info');
    }
  };

  const progress = calcProgress(currentStep, formData);
  const barColor = progressColor(progress);

  // ── Rendered step
  const renderStep = () => {
    if (currentStep === 1)
      return (
        <Step1
          data={formData.step1}
          errors={errors}
          onChange={handleChange('step1')}
          onFileChange={handleFileChange}
        />
      );
    if (currentStep === 2)
      return (
        <Step2
          data={formData.step2}
          errors={errors}
          onChange={handleChange('step2')}
        />
      );
    if (currentStep === 3)
      return (
        <Step3
          data={formData.step3}
          errors={errors}
          onChange={handleChange('step3')}
          onTagChange={handleTagChange}
        />
      );
    return (
      <Step4
        data={formData.step4}
        errors={errors}
        onChange={handleChange('step4')}
        onCheckboxChange={handleCheckboxChange}
        onNotifChange={handleNotifChange}
      />
    );
  };

  if (submitted) {
    return (
      <div className="onboard-wrap">
        <div className="success-card">
          <div className="success-icon">&#9989;</div>
          <h2>Registration Complete!</h2>
          <p>Welcome, <strong>{formData.step1.firstName} {formData.step1.lastName}</strong>!</p>
          <p>Your traveler profile has been created successfully.</p>
          <button
            className="btn-nav btn-nav--next"
            onClick={() => { setSubmitted(false); setFormData(getInitialFormData()); setCurrentStep(1); }}
          >
            Register Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="onboard-wrap">
      {notification && (
        <div className={`notif notif--${notification.type}`}>{notification.msg}</div>
      )}

      <div className="onboard-header">
        <h2 className="onboard-title">&#127758; Traveler Onboarding System</h2>
        <p className="onboard-sub">Multi-Step International Travel Registration</p>
      </div>

      {/* Step pills */}
      <div className="step-pills">
        {STEP_TITLES.map((title, idx) => (
          <div
            key={idx}
            className={`step-pill${currentStep === idx + 1 ? ' step-pill--active' : ''}${currentStep > idx + 1 ? ' step-pill--done' : ''}`}
          >
            {currentStep > idx + 1 ? '✓' : idx + 1} {title.split('. ')[1]}
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="progress-wrap">
        <div className="progress-label">
          Journey Completion: <strong>{progress}%</strong>
        </div>
        <div className="progress-bar-bg">
          <div
            className="progress-bar-fill"
            style={{ width: `${progress}%`, background: barColor, transition: 'width 0.4s ease, background 0.4s ease' }}
          />
        </div>
      </div>

      {/* Form body */}
      <div className="onboard-body">{renderStep()}</div>

      {/* Navigation */}
      <div className="nav-row">
        <button className="btn-clear" onClick={handleClear}>
          &#128465; Clear Form
        </button>
        <div className="nav-btns">
          {currentStep > 1 && (
            <button className="btn-nav btn-nav--prev" onClick={handlePrev}>
              &#8592; Previous
            </button>
          )}
          {currentStep < 4 ? (
            <button className="btn-nav btn-nav--next" onClick={handleNext}>
              Next &#8594;
            </button>
          ) : (
            <button
              className="btn-nav btn-nav--submit"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? 'Submitting...' : '&#9989; Submit Registration'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default TravelerOnboarding;
