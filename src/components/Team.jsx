// ---------------------------------------------------------------------------
// src/components/Team.jsx — Interactive Chapter Leadership & Department Showcase
// ---------------------------------------------------------------------------
import React, { useState } from 'react';
import {
  User,
  Shield,
  Terminal,
  Crown,
  Users,
  Sparkles,
  Code2,
  CalendarCheck,
  Share2,
  Palette,
  Megaphone,
  FlaskConical,
  FileText,
  Briefcase,
  ChevronRight,
  ArrowLeft,
  ExternalLink,
} from 'lucide-react';
import { ADMIN_PRESIDENCY, ADMIN_CORE_OFFICERS, ADMIN_MANAGERS, DOMAIN_TEAMS } from '../data/team.js';

// Lucide icon dictionary mapping for Department Cards
const DEPARTMENT_ICONS = {
  Code2,
  CalendarCheck,
  Share2,
  Palette,
  Megaphone,
  FlaskConical,
  FileText,
};

// SVG Social Icons
const GithubIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" />
  </svg>
);

// Member Avatar & Profile Card Component
function MemberCard({ member, variant = 'standard', index = 0 }) {
  const [imgFailed, setImgFailed] = useState(false);

  const initials = member.name
    ? member.name
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'ACM';

  const hasPhoto = Boolean(member.photo && !imgFailed);
  const hasSocials = Boolean(member.socials && (member.socials.linkedin || member.socials.github || member.socials.website));

  return (
    <div
      className={`team-glass-member-card card-${variant}`}
      style={{ animationDelay: `${index * 70}ms` }}
    >
      {/* Decorative Corner Cyber Brackets */}
      <span className="card-corner-bracket top-left" aria-hidden="true" />
      <span className="card-corner-bracket bottom-right" aria-hidden="true" />

      {/* Role Pill */}
      {member.role && (
        <div className="member-role-pill">
          <span className="role-dot" aria-hidden="true" />
          <span>{member.role}</span>
        </div>
      )}

      {/* Profile Photo Frame with Avatar / Initials Fallback */}
      <div className="member-avatar-placeholder">
        <div className="avatar-hologram-glow" aria-hidden="true" />
        <div className="avatar-initials-badge">
          {hasPhoto ? (
            <img
              src={member.photo}
              alt={member.name}
              className="member-profile-img"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <>
              <User size={variant === 'executive' || variant === 'lead' ? 26 : 22} className="avatar-icon-ghost" aria-hidden="true" />
              <span className="avatar-initials-text">{initials}</span>
            </>
          )}
        </div>
      </div>

      {/* Member Info */}
      <h3 className="member-name-heading">{member.name}</h3>

      {member.quote && <p className="member-quote-text">"{member.quote}"</p>}
      {member.bio && <p className="member-bio-text">{member.bio}</p>}

      {/* Social Strip — Only display social links that actually exist in the data */}
      {hasSocials && (
        <div className="member-socials-cluster">
          {member.socials.linkedin && (
            <a
              href={member.socials.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`${member.name}'s LinkedIn profile`}
            >
              <LinkedinIcon />
            </a>
          )}
          {member.socials.github && (
            <a
              href={member.socials.github}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`${member.name}'s GitHub profile`}
            >
              <GithubIcon />
            </a>
          )}
          {member.socials.website && (
            <a
              href={member.socials.website}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`${member.name}'s website`}
            >
              <ExternalLink size={15} />
            </a>
          )}
        </div>
      )}
    </div>
  );
}

// Department Selection Card Component
function DepartmentCard({ dept, onSelect, index = 0 }) {
  const IconComponent = DEPARTMENT_ICONS[dept.iconName] || Terminal;

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(dept.id);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Open ${dept.title}`}
      className="dept-selection-card"
      style={{ animationDelay: `${index * 60}ms` }}
      onClick={() => onSelect(dept.id)}
      onKeyDown={handleKeyDown}
    >
      <div className="dept-card-top-row">
        <div className="dept-icon-box">
          <IconComponent size={20} className="dept-icon-symbol" />
        </div>
        <span className="dept-number-tag">DEPT {dept.departmentNumber}</span>
      </div>

      <div className="dept-card-body">
        <h3 className="dept-card-title">{dept.title}</h3>
        <p className="dept-card-desc">{dept.desc}</p>
      </div>

      <div className="dept-card-footer">
        <span className="dept-view-prompt">Enter Department</span>
        <ChevronRight size={16} className="dept-chevron-icon" />
      </div>

      {/* Cyber Corner Accents */}
      <span className="dept-card-bracket top-left" aria-hidden="true" />
      <span className="dept-card-bracket bottom-right" aria-hidden="true" />
    </div>
  );
}

export default function Team() {
  const [activeTab, setActiveTab] = useState('domains');
  // activeDepartmentId is null when showing the department selection grid; set to dept.id when drilled inside
  const [activeDepartmentId, setActiveDepartmentId] = useState(null);

  const selectedDepartment = DOMAIN_TEAMS.find((d) => d.id === activeDepartmentId);

  // Dynamic role grouping from verified data for selected department
  const leads = [];
  if (selectedDepartment && selectedDepartment.lead) {
    leads.push(selectedDepartment.lead);
  }

  const allOther = (selectedDepartment && selectedDepartment.members) || [];
  const totalDeptMembers = [...leads, ...allOther];
  const coLeads = allOther.filter((m) =>
    (m.role || '').toLowerCase().includes('co-lead')
  );
  const managers = allOther.filter((m) =>
    (m.role || '').toLowerCase().includes('manager')
  );
  const standardMembers = allOther.filter(
    (m) =>
      !(m.role || '').toLowerCase().includes('co-lead') &&
      !(m.role || '').toLowerCase().includes('manager')
  );

  const handleSelectDepartment = (deptId) => {
    setActiveDepartmentId(deptId);
    // Smooth scroll to top of team section to see the department details immediately
    const section = document.getElementById('teams');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleBackToGrid = () => {
    setActiveDepartmentId(null);
    const section = document.getElementById('teams');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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
          onClick={() => {
            setActiveTab('admin');
            setActiveDepartmentId(null);
          }}
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
        <div className="departments-view-container">
          {!selectedDepartment ? (
            /* VIEW 2A: 7-DEPARTMENT 2-COLUMN SELECTION GRID */
            <div className="dept-grid-view-wrapper">
              <div className="departments-section-intro">
                <h3 className="departments-grid-headline">Select a Department</h3>
                <p className="departments-grid-subline">
                  Choose any of the seven specialized chapter teams to enter and view its full roster and leadership.
                </p>
              </div>

              {/* Responsive Two-Column Department Selection Grid (7 departments) */}
              <div className="department-selection-grid" role="region" aria-label="Department selection grid">
                {DOMAIN_TEAMS.map((dept, idx) => (
                  <DepartmentCard
                    key={dept.id}
                    dept={dept}
                    index={idx}
                    onSelect={handleSelectDepartment}
                  />
                ))}
              </div>
            </div>
          ) : (
            /* VIEW 2B: DEDICATED INSIDE VIEW FOR SELECTED DEPARTMENT */
            <div className="selected-department-showcase inside-mode" aria-live="polite">
              {/* Back to All Departments Navigation Bar */}
              <div className="dept-navigation-bar">
                <button
                  type="button"
                  className="dept-back-btn"
                  onClick={handleBackToGrid}
                  aria-label="Back to all departments grid"
                >
                  <ArrowLeft size={16} />
                  <span>← Back to All Departments</span>
                </button>
              </div>

              {/* Active Department Header Banner */}
              <div className="domain-header-banner">
                <div className="domain-banner-tag">
                  DEPARTMENT {selectedDepartment.departmentNumber}
                </div>
                <h3 className="domain-banner-title">{selectedDepartment.title}</h3>
                <p className="domain-banner-desc">{selectedDepartment.desc}</p>
              </div>

              {/* Department Team Members Display */}
              <div className="dept-hierarchy-wrapper">
                {/* SPECIAL CASE: If exactly 2 people in the department, render them side by side */}
                {totalDeptMembers.length === 2 ? (
                  <div className="admin-tier-section">
                    <div className="tier-header-badge">
                      <Users size={13} />
                      <span>DEPARTMENT LEADERSHIP</span>
                    </div>
                    <div className="team-grid-2col managers-tier">
                      {totalDeptMembers.map((member, i) => (
                        <MemberCard
                          key={member.id}
                          member={member}
                          index={i}
                          variant={member.role && member.role.toLowerCase().includes('lead') && !member.role.toLowerCase().includes('co-lead') ? 'lead' : 'officer'}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  /* STANDARD HIERARCHICAL LAYOUT (for 3 or more members) */
                  <>
                    {/* 1. Team Lead — Centered in its own row */}
                    {leads.length > 0 && (
                      <div className="admin-tier-section">
                        <div className="tier-header-badge">
                          <Sparkles size={13} />
                          <span>TEAM LEAD</span>
                        </div>
                        <div className="team-grid-1col-center">
                          {leads.map((lead, i) => (
                            <MemberCard key={lead.id} member={lead} variant="lead" index={i} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Connector Line if further members exist */}
                    {leads.length > 0 && (coLeads.length > 0 || managers.length > 0 || standardMembers.length > 0) && (
                      <div className="tier-connector-line" />
                    )}

                    {/* 2. Co-Leads — Side by side in the next row */}
                    {coLeads.length > 0 && (
                      <div className="admin-tier-section">
                        <div className="tier-header-badge">
                          <Users size={13} />
                          <span>CO-LEADS</span>
                        </div>
                        <div className={coLeads.length === 1 ? 'team-grid-1col-center' : 'team-grid-2col managers-tier'}>
                          {coLeads.map((colead, i) => (
                            <MemberCard key={colead.id} member={colead} variant="officer" index={i + 1} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Connector Line between Co-Leads and Managers/Members */}
                    {coLeads.length > 0 && (managers.length > 0 || standardMembers.length > 0) && (
                      <div className="tier-connector-line" />
                    )}

                    {/* 3. Managers — Grouped below if that department has managers */}
                    {managers.length > 0 && (
                      <div className="admin-tier-section">
                        <div className="tier-header-badge">
                          <Briefcase size={13} />
                          <span>MANAGEMENT</span>
                        </div>
                        <div className={managers.length === 1 ? 'team-grid-1col-center' : 'team-grid-2col managers-tier'}>
                          {managers.map((manager, i) => (
                            <MemberCard key={manager.id} member={manager} variant="manager" index={i + 2} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Connector Line between Managers and other members */}
                    {managers.length > 0 && standardMembers.length > 0 && (
                      <div className="tier-connector-line" />
                    )}

                    {/* 4. Other Members — Displayed in a responsive card grid */}
                    {standardMembers.length > 0 && (
                      <div className="admin-tier-section">
                        <div className="tier-header-badge">
                          <Users size={13} />
                          <span>TEAM MEMBERS</span>
                        </div>
                        <div className="team-grid-3col">
                          {standardMembers.map((member, i) => (
                            <MemberCard key={member.id} member={member} variant="standard" index={i + 3} />
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
