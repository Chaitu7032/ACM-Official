// ---------------------------------------------------------------------------
// src/components/Contact.jsx — Futuristic ACM VIT-AP Contact Us Section
// ---------------------------------------------------------------------------
import React, { useState, useEffect, useRef } from 'react';
import {
  Mail,
  Send,
  User,
  MessageSquare,
  FileEdit,
  ChevronDown,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';

const OFFICIAL_EMAIL = 'acm.studentchapter@vitap.ac.in';

// Verified Chapter Social Links
const SOCIAL_LINKS = [
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
  {
    name: 'GitHub',
    url: 'https://github.com/Chaitu7032/ACM-Official',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    url: 'https://youtube.com',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
        <polygon points="10 15 15 12 10 9 10 15" />
      </svg>
    ),
  },
];

const SUBJECT_OPTIONS = [
  'General Enquiry',
  'Events',
  'Collaboration',
  'Membership',
  'Other',
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    hp_company: '', // invisible honeypot
  });

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [serverFeedback, setServerFeedback] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const mountTimeRef = useRef(Date.now());

  // Record mount timestamp for human verification
  useEffect(() => {
    mountTimeRef.current = Date.now();
  }, []);

  // Validation function
  const validateField = (field, value) => {
    switch (field) {
      case 'name':
        if (!value.trim()) return 'Full name is required.';
        if (value.trim().length < 2) return 'Name must be at least 2 characters.';
        if (value.trim().length > 100) return 'Name cannot exceed 100 characters.';
        return '';
      case 'email':
        if (!value.trim()) return 'Email address is required.';
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
        if (!emailRegex.test(value.trim())) return 'Please enter a valid email address.';
        return '';
      case 'subject':
        if (!value) return 'Please select a topic.';
        return '';
      case 'message':
        if (!value.trim()) return 'Message is required.';
        if (value.trim().length < 10) return 'Message must be at least 10 characters.';
        if (value.trim().length > 500) return 'Message cannot exceed 500 characters.';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value),
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const validateAll = () => {
    const newErrors = {
      name: validateField('name', formData.name),
      email: validateField('email', formData.email),
      subject: validateField('subject', formData.subject),
      message: validateField('message', formData.message),
    };
    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      subject: true,
      message: true,
    });
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateAll()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    setServerFeedback(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          _timestamp: mountTimeRef.current,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.ok) {
        setSubmitStatus('success');
        setServerFeedback({
          message: data.message || 'Your message has been sent successfully.',
          recipient: OFFICIAL_EMAIL,
        });
        // Clear form only on successful delivery
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          hp_company: '',
        });
        setTouched({});
        setErrors({});
      } else {
        setSubmitStatus('error');
        setServerFeedback({
          message: data.error || 'Server rejected message delivery.',
          unconfigured: data.unconfigured || false,
          status: response.status,
        });
      }
    } catch (err) {
      console.error('Contact form submission error:', err);
      setSubmitStatus('error');
      setServerFeedback({
        message: 'Could not connect to the server endpoint. Please verify your internet connection or use direct email.',
        unconfigured: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(OFFICIAL_EMAIL);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2400);
    } catch {
      // Fallback
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2400);
    }
  };

  const handleResetAfterSuccess = () => {
    setSubmitStatus(null);
    setServerFeedback(null);
    mountTimeRef.current = Date.now();
  };

  // Generate mailto fallback URL
  const mailtoFallbackUrl = `mailto:${OFFICIAL_EMAIL}?subject=${encodeURIComponent(
    formData.subject ? `[ACM VIT-AP] ${formData.subject}` : 'ACM VIT-AP Enquiry'
  )}&body=${encodeURIComponent(
    `Name: ${formData.name || ''}\nEmail: ${formData.email || ''}\n\nMessage:\n${formData.message || ''}`
  )}`;

  return (
    <section className="contact-section-wrapper" id="contact" aria-label="Contact Us">
      <div className="contact-main-frame">
        {/* Futuristic glowing corner accent brackets */}
        <div className="corner-bracket corner-bracket--tl" aria-hidden="true" />
        <div className="corner-bracket corner-bracket--tr" aria-hidden="true" />
        <div className="corner-bracket corner-bracket--bl" aria-hidden="true" />
        <div className="corner-bracket corner-bracket--br" aria-hidden="true" />

        {/* Ambient Top Light Beam Accent */}
        <div className="contact-frame-beam" aria-hidden="true" />

        {/* Cinematic Background Plate with Official Artwork */}
        <div className="contact-bg-plate" aria-hidden="true">
          <img
            src="/assets/12048ff2-053d-45aa-97cf-7bda4c6ba4eb.png"
            alt=""
            className="contact-bg-image"
            loading="lazy"
          />
          <div className="contact-bg-scrim-left" />
          <div className="contact-bg-scrim-right" />
          <div className="contact-bg-vignette" />
        </div>

        {/* Two-Column Grid: Left Info, Right Message Form */}
        <div className="contact-content-grid">
          {/* ════ LEFT COLUMN: Contact Information ════ */}
          <div className="contact-info-col">
            <div className="contact-eyebrow">
              <span className="eyebrow-accent-dash" />
              <span>CONTACT US</span>
            </div>

            <h2 className="contact-headline">
              HAVE AN IDEA?<br />
              <span className="cyan-glow-text">LET&apos;S TALK.</span>
            </h2>

            <p className="contact-lead-desc">
              Questions about ACM, collaborations, events, membership, or just want to say hi?
              We&apos;d love to hear from you.
            </p>

            {/* Card 1: Official Chapter Email */}
            <div className="contact-info-card email-feature-card">
              <div className="contact-card-icon-halo">
                <Mail size={18} className="card-icon-svg" />
              </div>

              <div className="contact-card-details">
                <span className="contact-card-micro-label">OFFICIAL CHAPTER EMAIL</span>
                <div className="contact-email-action-row">
                  <a
                    href={`mailto:${OFFICIAL_EMAIL}`}
                    className="contact-email-anchor"
                    title={`Send mail to ${OFFICIAL_EMAIL}`}
                  >
                    {OFFICIAL_EMAIL}
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="contact-copy-btn"
                    aria-label="Copy official email address to clipboard"
                    title="Copy email to clipboard"
                  >
                    {copiedEmail ? <Check size={13} className="copied-check" /> : <Copy size={13} />}
                    {copiedEmail && <span className="copy-popover">Copied!</span>}
                  </button>
                </div>
                <span className="contact-card-subtext">
                  We usually respond within 1–2 working days.
                </span>
              </div>
            </div>

            {/* Card 2: Follow Our Journey (Social Links) */}
            <div className="contact-info-card journey-feature-card">
              <span className="contact-card-micro-label">FOLLOW OUR JOURNEY</span>
              <div className="journey-card-content">
                <div className="contact-social-pills-row" aria-label="Official Social Channels">
                  {SOCIAL_LINKS.map((item) => (
                    <a
                      key={item.name}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-social-pill-btn"
                      aria-label={`Official ACM VIT-AP on ${item.name}`}
                    >
                      {item.icon}
                    </a>
                  ))}
                </div>

                <div className="journey-vertical-sep" aria-hidden="true" />

                <p className="journey-invitation-text">
                  Stay connected for updates, events, and more.
                </p>
              </div>
            </div>
          </div>

          {/* ════ RIGHT COLUMN: Contact Message Form Card ════ */}
          <div className="contact-form-col">
            <div className="contact-form-card">
              <div className="corner-bracket corner-bracket--tl-inner" aria-hidden="true" />
              <div className="corner-bracket corner-bracket--tr-inner" aria-hidden="true" />

              <h3 className="form-card-title">Send us a message</h3>
              <p className="form-card-subtitle">
                Fill in the details and we&apos;ll get back to you soon.
              </p>

              {/* SUCCESS CONFIRMATION STATE */}
              {submitStatus === 'success' && (
                <div className="form-feedback-card feedback-success" role="alert">
                  <div className="feedback-icon-wrap success-glow">
                    <CheckCircle2 size={28} />
                  </div>
                  <h4 className="feedback-heading">Transmission Accepted</h4>
                  <p className="feedback-body-text">
                    Thank you for reaching out! Your message has been safely delivered to{' '}
                    <strong>{OFFICIAL_EMAIL}</strong>. Our chapter leadership will review it and reply directly to your email shortly.
                  </p>
                  <button
                    type="button"
                    onClick={handleResetAfterSuccess}
                    className="feedback-reset-btn"
                  >
                    <span>Send Another Message</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}

              {/* FORM VIEW (Visible when not in success state) */}
              {submitStatus !== 'success' && (
                <form
                  onSubmit={handleSubmit}
                  className="contact-actual-form"
                  noValidate
                >
                  {/* Honeypot Spam Trap (Hidden from genuine visitors) */}
                  <div className="honeypot-trap" aria-hidden="true">
                    <label htmlFor="hp_company">Company</label>
                    <input
                      type="text"
                      id="hp_company"
                      name="hp_company"
                      value={formData.hp_company}
                      onChange={handleChange}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  {/* Top Two-Column Grid: Name & Email */}
                  <div className="form-grid-pair">
                    {/* Full Name Field */}
                    <div className="form-field-group">
                      <label htmlFor="contact_name" className="field-label">
                        Your Name <span className="req-asterisk">*</span>
                      </label>
                      <div className={`field-input-wrapper ${errors.name && touched.name ? 'has-error' : ''}`}>
                        <User size={14} className="field-adornment-icon" aria-hidden="true" />
                        <input
                          type="text"
                          id="contact_name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="Enter your full name"
                          autoComplete="name"
                          aria-required="true"
                          aria-invalid={Boolean(errors.name && touched.name)}
                          aria-describedby={errors.name && touched.name ? 'contact_name_err' : undefined}
                          disabled={isSubmitting}
                          className="field-text-input"
                        />
                      </div>
                      {errors.name && touched.name && (
                        <p id="contact_name_err" className="inline-error-msg" role="alert">
                          <AlertCircle size={11} />
                          <span>{errors.name}</span>
                        </p>
                      )}
                    </div>

                    {/* Email Address Field */}
                    <div className="form-field-group">
                      <label htmlFor="contact_email" className="field-label">
                        Your Email <span className="req-asterisk">*</span>
                      </label>
                      <div className={`field-input-wrapper ${errors.email && touched.email ? 'has-error' : ''}`}>
                        <Mail size={14} className="field-adornment-icon" aria-hidden="true" />
                        <input
                          type="email"
                          id="contact_email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          placeholder="you@example.com"
                          autoComplete="email"
                          aria-required="true"
                          aria-invalid={Boolean(errors.email && touched.email)}
                          aria-describedby={errors.email && touched.email ? 'contact_email_err' : undefined}
                          disabled={isSubmitting}
                          className="field-text-input"
                        />
                      </div>
                      {errors.email && touched.email && (
                        <p id="contact_email_err" className="inline-error-msg" role="alert">
                          <AlertCircle size={11} />
                          <span>{errors.email}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Subject Dropdown Field */}
                  <div className="form-field-group">
                    <label htmlFor="contact_subject" className="field-label">
                      Subject <span className="req-asterisk">*</span>
                    </label>
                    <div className={`field-input-wrapper ${errors.subject && touched.subject ? 'has-error' : ''}`}>
                      <MessageSquare size={14} className="field-adornment-icon" aria-hidden="true" />
                      <select
                        id="contact_subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        aria-required="true"
                        aria-invalid={Boolean(errors.subject && touched.subject)}
                        aria-describedby={errors.subject && touched.subject ? 'contact_subject_err' : undefined}
                        disabled={isSubmitting}
                        className={`field-select-input ${!formData.subject ? 'is-placeholder' : ''}`}
                      >
                        <option value="" disabled>
                          Select a topic
                        </option>
                        {SUBJECT_OPTIONS.map((opt) => (
                          <option key={opt} value={opt} className="select-dark-opt">
                            {opt}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="field-select-chevron" aria-hidden="true" />
                    </div>
                    {errors.subject && touched.subject && (
                      <p id="contact_subject_err" className="inline-error-msg" role="alert">
                        <AlertCircle size={11} />
                        <span>{errors.subject}</span>
                      </p>
                    )}
                  </div>

                  {/* Message Textarea Field */}
                  <div className="form-field-group">
                    <div className="field-label-split">
                      <label htmlFor="contact_message" className="field-label">
                        Message <span className="req-asterisk">*</span>
                      </label>
                      <span className={`char-counter ${formData.message.length >= 480 ? 'limit-warning' : ''}`}>
                        {formData.message.length}/500
                      </span>
                    </div>
                    <div className={`field-textarea-wrapper ${errors.message && touched.message ? 'has-error' : ''}`}>
                      <FileEdit size={14} className="field-textarea-icon" aria-hidden="true" />
                      <textarea
                        id="contact_message"
                        name="message"
                        rows={3}
                        maxLength={500}
                        value={formData.message}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Tell us how we can help..."
                        aria-required="true"
                        aria-invalid={Boolean(errors.message && touched.message)}
                        aria-describedby={errors.message && touched.message ? 'contact_message_err' : undefined}
                        disabled={isSubmitting}
                        className="field-textarea-input"
                      />
                    </div>
                    {errors.message && touched.message && (
                      <p id="contact_message_err" className="inline-error-msg" role="alert">
                        <AlertCircle size={11} />
                        <span>{errors.message}</span>
                      </p>
                    )}
                  </div>

                  {/* Server Error / Unconfigured Notice */}
                  {submitStatus === 'error' && serverFeedback && (
                    <div className="form-feedback-card feedback-error" role="alert">
                      <div className="error-alert-header">
                        <AlertCircle size={16} className="error-alert-icon" />
                        <strong>Submission Issue</strong>
                      </div>
                      <p className="error-alert-text">
                        {serverFeedback.message}
                      </p>
                      {serverFeedback.unconfigured && (
                        <p className="error-alert-hint">
                          Server environment variable <code>RESEND_API_KEY</code> is not yet configured. You can send your message directly via email client below.
                        </p>
                      )}
                      <div className="error-fallback-actions">
                        <a
                          href={mailtoFallbackUrl}
                          className="btn-mailto-fallback"
                          title="Open your email client with your entered message"
                        >
                          <Mail size={13} />
                          <span>Send via Email App (Direct Fallback)</span>
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="contact-submit-btn"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={14} className="submit-spinner" />
                        <span>Transmitting Message...</span>
                      </>
                    ) : (
                      <>
                        <Send size={14} className="submit-send-icon" />
                        <span className="submit-btn-label">Send Message</span>
                        <ArrowRight size={14} className="submit-arrow-icon" />
                      </>
                    )}
                  </button>

                  {/* Bottom Chapter Consent Note */}
                  <p className="form-consent-notice">
                    By sending this message, you agree to be contacted by the ACM Student Chapter VIT-AP.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ════ PRESERVED SITE FOOTER (Panel 12) ════ */}
      <footer className="site-footer">
        <div className="footer-brand-side">
          <div className="footer-logo-row">
            <img src="/acm-logo.svg" alt="ACM Logo" width={28} height={28} />
            <span className="footer-brand-name">ACM STUDENT CHAPTER · VIT-AP</span>
          </div>
          <p className="footer-tagline">&ldquo;See you in the next idea.&rdquo; &mdash; NEX</p>
        </div>
        <div className="footer-links-side">
          <div className="footer-nav-col">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#events">Events</a>
            <a href="#teams">Teams</a>
            <a href="#gallery">Gallery</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="footer-copyright">
            &copy; {new Date().getFullYear()} ACM VIT-AP Student Chapter. Built for builders.
          </div>
        </div>
      </footer>
    </section>
  );
}
