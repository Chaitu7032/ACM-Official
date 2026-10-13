// ---------------------------------------------------------------------------
// src/components/Team.jsx — Interactive Chapter Leadership & Domain Teams Showcase
// ---------------------------------------------------------------------------
import React, { useState } from 'react';
import { User, Shield, Terminal, Crown, Users, Sparkles, Layers } from 'lucide-react';
import { ADMIN_PRESIDENCY, ADMIN_CORE_OFFICERS, ADMIN_MANAGERS, DOMAIN_TEAMS } from '../data/team.js';

// SVG Social Icons
const GithubIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);
const LinkedinIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" />
  </svg>
);

// Member Avatar Card Component
function MemberCard({ member, variant = 'standard' }) {
  const initials = member.name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className={`team-glass-member-card card-${variant}`}>
      {/* Decorative Corner Cyber Brackets */}
      <span className="card-corner-bracket top-left" />
      <span className="card-corner-bracket bottom-right" />

      {/* Role Pill */}
      <div className="member-role-pill">
        <span className="role-dot" />
        <span>{member.role}</span>
      </div>

      {/* Photo Placeholder Frame (Prepped for real photos) */}
      <div className="member-avatar-placeholder">
        <div className="avatar-hologram-glow" />
        <div className="avatar-initials-badge">
          <User size={variant === 'executive' || variant === 'lead' ? 26 : 22} className="avatar-icon-ghost" />
          <span className="avatar-initials-text">{initials}</span>
        </div>
      </div>

      {/* Member Info */}
      <h3 className="member-name-heading">{member.name}</h3>
      <p className="member-quote-text">"{member.quote}"</p>

      {/* Social Strip */}
      <div className="member-socials-cluster">
        <a href={member.socials.linkedin} target="_blank" rel="noreferrer" aria-label={`${member.name} LinkedIn`}>
          <LinkedinIcon />
        </a>
        <a href={member.socials.github} target="_blank" rel="noreferrer" aria-label={`${member.name} GitHub`}>
          <GithubIcon />
        </a>
      </div>
    </div>
  );
}

export default function Team() {
  const [activeTab, setActiveTab] = useState('admin');
  const [activeDomainId, setActiveDomainId] = useState('technical');

  const selectedDomain = DOMAIN_TEAMS.find((d) => d.id === activeDomainId) || DOMAIN_TEAMS[0];

  return (
    <section className="section-full team-section-wrap" id="teams">
      {/* Section Header */}
      <div className="section-header-cluster text-center">
        <div className="section-eyebrow-badge">
          <span className="eyebrow-accent-dot" />
          <span>CHAPTER LEADERSHIP</span>
        </div>
        <h2 className="section-headline-large">
          PEOPLE BEHIND THE <span className="blue-highlight">IMPACT.</span>
        </h2>
        <p className="section-subtext-lede">
          Meet the core leadership and specialized departmental domains spearheading innovation and excellence at ACM VIT-AP.
        </p>
      </div>

      {/* Master Sub-Tabs (1. ADMIN TEAM | 2. DOMAINS & DEPARTMENTS) */}
      <div className="team-filter-tabs-strip">
        <button
          type="button"
          className={`team-subtab-pill ${activeTab === 'admin' ? 'active' : ''}`}
          onClick={() => setActiveTab('admin')}
        >
          <Shield size={14} />
          <span>1. ADMIN TEAM</span>
        </button>
        <button
          type="button"
          className={`team-subtab-pill ${activeTab === 'domains' ? 'active' : ''}`}
          onClick={() => setActiveTab('domains')}
        >
          <Terminal size={14} />
          <span>2. DOMAINS & DEPARTMENTS</span>
        </button>
      </div>

      {activeTab === 'admin' ? (
        /* ─── 1] ADMIN TEAM VIEW ─────────────────────────────────────── */
        <div className="admin-team-structured-layout">
          {/* ROW 1: 2 in a row (President & Vice President side-by-side) */}
          <div className="admin-tier-section">
            <div className="tier-header-badge">
              <Crown size={13} />
              <span>EXECUTIVE PRESIDENCY</span>
            </div>
            <div className="team-grid-2col executive-tier">
              {ADMIN_PRESIDENCY.map((member) => (
                <MemberCard key={member.id} member={member} variant="executive" />
              ))}
            </div>
          </div>

          <div className="tier-connector-line" />

          {/* ROW 2: 3 in a row (Secretary, Joint Secretary, Treasurer) */}
          <div className="admin-tier-section">
            <div className="tier-header-badge">
              <Shield size={13} />
              <span>CORE SECRETARIAT & FINANCE</span>
            </div>
            <div className="team-grid-3col">
              {ADMIN_CORE_OFFICERS.map((member) => (
                <MemberCard key={member.id} member={member} variant="officer" />
              ))}
            </div>
          </div>

          <div className="tier-connector-line" />

          {/* ROW 3: 2 in a row (Club Manager & Technical Manager) */}
          <div className="admin-tier-section">
            <div className="tier-header-badge">
              <Users size={13} />
              <span>MANAGEMENT & TECHNICAL OPERATIONS</span>
            </div>
            <div className="team-grid-2col managers-tier">
              {ADMIN_MANAGERS.map((member) => (
                <MemberCard key={member.id} member={member} variant="manager" />
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* ─── 2] DOMAINS & DEPARTMENTS VIEW ─────────────────────────── */
        <div className="domains-interactive-portal">
          {/* Domain Category Selector Pills */}
          <div className="domain-selector-pills-bar">
            {DOMAIN_TEAMS.map((dom, index) => {
              const isSelected = activeDomainId === dom.id;
              return (
                <button
                  key={dom.id}
                  type="button"
                  className={`domain-selector-chip ${isSelected ? 'active' : ''}`}
                  onClick={() => setActiveDomainId(dom.id)}
                >
                  <span className="domain-index-num">0{index + 1}</span>
                  <span className="domain-chip-title">{dom.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Domain Presentation */}
          <div className="domain-display-container">
            {/* Domain Info Header */}
            <div className="domain-header-banner">
              <div className="domain-banner-tag">DEPARTMENT 0{DOMAIN_TEAMS.findIndex((d) => d.id === activeDomainId) + 1}</div>
              <h3 className="domain-banner-title">{selectedDomain.title}</h3>
              <p className="domain-banner-desc">{selectedDomain.desc}</p>
            </div>

            {/* Hierarchical Structure: Lead separate in middle (1 in row), remaining below */}
            <div className="admin-team-structured-layout domain-structure-layout">
              {/* LEVEL 1: Lead separate in middle (1 in row) */}
              <div className="admin-tier-section">
                <div className="tier-header-badge">
                  <Sparkles size={13} />
                  <span>DOMAIN LEAD</span>
                </div>
                <div className="team-grid-1col-center">
                  <MemberCard member={selectedDomain.lead} variant="lead" />
                </div>
              </div>

              {/* Connector Circuit Line */}
              {selectedDomain.members && selectedDomain.members.length > 0 && (
                <div className="tier-connector-line" />
              )}

              {/* LEVEL 2: Co-leads / Managers grouped as usual (2 or 3 in a row) */}
              {selectedDomain.members && selectedDomain.members.length > 0 && (
                <div className="admin-tier-section">
                  <div className="tier-header-badge">
                    <Users size={13} />
                    <span>CO-LEADS & CORE ASSOCIATES</span>
                  </div>
                  <div
                    className={
                      selectedDomain.members.length === 3
                        ? 'team-grid-3col'
                        : selectedDomain.members.length === 2
                          ? 'team-grid-2col managers-tier'
                          : 'team-grid-1col-center'
                    }
                  >
                    {selectedDomain.members.map((member) => (
                      <MemberCard key={member.id} member={member} variant="officer" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
