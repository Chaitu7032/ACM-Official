// ---------------------------------------------------------------------------
// src/components/Events.jsx — Events Section with Interactive Category Filter
// ---------------------------------------------------------------------------
import React, { useState } from 'react';
import { ArrowRight, Calendar, Users, ExternalLink } from 'lucide-react';
import { EVENT_CATEGORIES, EVENTS_DATA } from '../data/events.js';

export default function Events() {
  const [activeCategory, setActiveCategory] = useState('All Events');

  const filteredEvents = activeCategory === 'All Events'
    ? EVENTS_DATA
    : EVENTS_DATA.filter((e) => e.category === activeCategory);

  return (
    <section className="section-full events-section-wrap" id="events">
      {/* Section Header */}
      <div className="section-header-cluster">
        <div className="section-eyebrow-badge">
          <span className="eyebrow-accent-dot" />
          <span>EVENTS</span>
        </div>
        <h2 className="section-headline-large">
          EVENTS THAT CREATE <span className="blue-highlight">CHANGE.</span>
        </h2>
        <p className="section-subtext-lede">
          From workshops to hackathons, we turn ideas into real-world impact.
        </p>
      </div>

      {/* Filter Category Pills */}
      <div className="events-filter-strip" role="tablist" aria-label="Event categories">
        {EVENT_CATEGORIES.map((cat) => (
          <button
            key={cat}
            role="tab"
            aria-selected={activeCategory === cat}
            className={`event-filter-pill ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid of Event Glass Cards */}
      <div className="events-cards-grid">
        {filteredEvents.map((event) => (
          <article key={event.id} className="event-glass-card">
            {/* Image & Date Badge */}
            <div className="event-card-media-wrap">
              <img
                src={event.image}
                alt={event.title}
                className="event-card-img"
                loading="lazy"
              />
              <div className="event-card-gradient-overlay" />
              <div className="event-date-badge">
                <span>{event.dateBadge}</span>
              </div>
              <div className="event-tag-pill">
                <span>{event.tag}</span>
              </div>
            </div>

            {/* Card Content */}
            <div className="event-card-content">
              <h3 className="event-title-text">{event.title}</h3>
              <p className="event-subtitle-text">{event.subtitle}</p>
              <p className="event-desc-text">{event.description}</p>

              <div className="event-card-footer">
                <span className="event-attendees-chip">
                  <Users size={12} />
                  <span>{event.attendees}</span>
                </span>
                <button className="event-view-link" aria-label={`Details for ${event.title}`}>
                  <span>Details</span>
                  <ExternalLink size={12} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="events-bottom-cta">
        <a href="#join" className="btn-glass-secondary">
          <span>View All Events</span>
          <ArrowRight size={14} />
        </a>
      </div>
    </section>
  );
}
