// ---------------------------------------------------------------------------
// NexCompanion.jsx — Interactive NEX Robot Companion
// Rendering: CSS transforms + pre-rendered JPG pose images (NO WebGL/Three.js)
// Features: State machine, nav awareness, activities, AI chat, voice synthesis
// ---------------------------------------------------------------------------
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useReducer,
} from 'react';
import { X, Sparkles, MessageCircle, ChevronRight, Mic, Volume2, VolumeX } from 'lucide-react';

// ─── Asset Map — pre-rendered JPG poses ─────────────────────────────────────
const POSES = {
  idle:       '/assets/panels/nex-idle-new.jpg',
  greeting:   '/assets/panels/nex-wave.jpg',
  thinking:   '/assets/panels/nex-thinking.jpg',
  speaking:   '/assets/panels/nex-idle-new.jpg',   // reuse idle w/ speech bubble
  listening:  '/assets/panels/nex-thinking.jpg',   // curious tilt = listening
  celebrating:'/assets/panels/nex-celebrate-new.jpg',
  pointing:   '/assets/panels/nex-wave.jpg',        // wave = point variant
  curious:    '/assets/panels/nex-thinking.jpg',
  goodbye:    '/assets/panels/nex-wave.jpg',
};

// ─── Section-aware contextual messages ──────────────────────────────────────
const SECTION_MESSAGES = {
  home:    { text: "Hey, explorer! I'm NEX, your ACM companion. Where shall we go?", pose: 'greeting', action: null },
  about:   { text: "ACM VIT-AP is a community of 1K+ builders. We learn, build and share together!", pose: 'speaking', action: { label: 'Learn More', href: '#about' } },
  events:  { text: "We run hackathons, tech talks and workshops. Want to check out our events?", pose: 'pointing', action: { label: 'See Events', href: '#events' } },
  teams:   { text: "Our team spans tech, design, content and outreach. Meet the builders!", pose: 'curious', action: { label: 'Meet the Team', href: '#teams' } },
  gallery: { text: "Peek at our moments — hackathons, open-source days, community circles!", pose: 'speaking', action: { label: 'View Gallery', href: '#gallery' } },
  join:    { text: "Ready to join ACM VIT-AP? Email us at acm@vitap.ac.in to get started!", pose: 'celebrating', action: { label: 'Join ACM', href: 'mailto:acm@vitap.ac.in' } },
};

// ─── Tech Quiz Questions ─────────────────────────────────────────────────────
const QUIZ_QUESTIONS = [
  { q: "What does CPU stand for?", opts: ["Central Processing Unit", "Core Power Unit", "Central Program Utility", "Compute Processing Unit"], ans: 0 },
  { q: "Which language was created by Guido van Rossum?", opts: ["Java", "Ruby", "Python", "Rust"], ans: 2 },
  { q: "What does HTTP stand for?", opts: ["HyperText Transfer Protocol", "High Traffic Text Protocol", "HyperText Transmission Path", "Hybrid Transfer Text Protocol"], ans: 0 },
  { q: "Which data structure uses LIFO?", opts: ["Queue", "Stack", "Linked List", "Tree"], ans: 1 },
  { q: "What is the binary representation of the number 10?", opts: ["1000", "1010", "0110", "1100"], ans: 1 },
  { q: "Who co-founded Apple Inc.?", opts: ["Bill Gates", "Linus Torvalds", "Steve Jobs", "Mark Zuckerberg"], ans: 2 },
  { q: "What does RAM stand for?", opts: ["Random Access Memory", "Read-Only Array Module", "Rapid Application Memory", "Remote Access Module"], ans: 0 },
  { q: "Which sorting algorithm has O(n log n) average complexity?", opts: ["Bubble Sort", "Insertion Sort", "Merge Sort", "Selection Sort"], ans: 2 },
];

// ─── Daily Tech Facts ────────────────────────────────────────────────────────
const TECH_FACTS = [
  "The first computer bug was an actual bug — a moth found in a Harvard Mark II computer in 1947!",
  "The ACM (Association for Computing Machinery) was founded in 1947, making it one of the world's oldest computing societies.",
  "The first 1GB hard drive (1980) weighed 550 lbs and cost $40,000.",
  "There are over 700 programming languages in existence today.",
  "The original name for Python was 'ABC' — Guido van Rossum changed it to Python in 1989.",
  "Git was created by Linus Torvalds in just 10 days in 2005.",
  "The Internet was originally called ARPANET, launched in 1969.",
  "About 90% of the world's currency exists only digitally.",
];

// ─── Moods ──────────────────────────────────────────────────────────────────
const MOODS = [
  { id: 'happy',   emoji: '😄', label: 'Happy',   pose: 'celebrating', msg: "I'm so happy to be your guide today! Let's explore ACM together!" },
  { id: 'curious', emoji: '🤔', label: 'Curious',  pose: 'curious',     msg: "My circuits are buzzing with curiosity! Ask me anything about ACM!" },
  { id: 'focused', emoji: '🎯', label: 'Focused',  pose: 'thinking',    msg: "Systems optimal. Focus mode engaged. How can I help you navigate?" },
  { id: 'excited', emoji: '⚡', label: 'Excited',  pose: 'greeting',    msg: "ENERGY LEVELS: MAXIMUM! Ready to dive into everything ACM VIT-AP has to offer!" },
];

// ─── Tour Steps ──────────────────────────────────────────────────────────────
const TOUR_STEPS = [
  { label: 'Home',    href: '#home',    desc: "Start at the beginning — the ACM VIT-AP universe awaits!", emoji: '🏠' },
  { label: 'About',   href: '#about',   desc: "Discover what makes our chapter special and who we are.", emoji: '💡' },
  { label: 'Events',  href: '#events',  desc: "Hackathons, tech talks and workshops — the action is here!", emoji: '⚡' },
  { label: 'Teams',   href: '#teams',   desc: "Meet the incredible people who make ACM VIT-AP run.", emoji: '👥' },
  { label: 'Gallery', href: '#gallery', desc: "Relive our best moments and community highlights.", emoji: '📸' },
  { label: 'Join Us', href: '#join',    desc: "Ready to be part of something great? Join us!", emoji: '🚀' },
];

// ─── Voice Synth Helper ──────────────────────────────────────────────────────
function speakText(text, enabled) {
  if (!enabled || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.rate = 1.05;
  utt.pitch = 1.15;
  utt.volume = 0.85;
  window.speechSynthesis.speak(utt);
}

// ─── State Reducer ───────────────────────────────────────────────────────────
const initialNexState = {
  pose: 'idle',
  message: null,
  isOpen: true,
  isDismissed: false,
  hasGreeted: false,
  activePanel: null, // 'chat' | 'quiz' | 'mood' | 'tour' | 'fact'
};

function nexReducer(state, action) {
  switch (action.type) {
    case 'SET_POSE':    return { ...state, pose: action.pose };
    case 'SET_MESSAGE': return { ...state, message: action.message, pose: action.pose || state.pose };
    case 'CLEAR_MESSAGE': return { ...state, message: null, pose: 'idle' };
    case 'DISMISS':     return { ...state, isDismissed: true, activePanel: null };
    case 'RESTORE':     return { ...state, isDismissed: false };
    case 'SET_PANEL':   return { ...state, activePanel: action.panel };
    case 'MARK_GREETED': return { ...state, hasGreeted: true };
    case 'NAV_UPDATE':  return { ...state, message: action.message, pose: action.pose };
    default: return state;
  }
}

// ─── Quiz Panel ──────────────────────────────────────────────────────────────
function QuizPanel({ onClose, onCelebrate }) {
  const [qIdx, setQIdx] = useState(() => Math.floor(Math.random() * QUIZ_QUESTIONS.length));
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const q = QUIZ_QUESTIONS[qIdx];

  const handleAnswer = (i) => {
    if (revealed) return;
    setSelected(i);
    setRevealed(true);
    const correct = i === q.ans;
    if (correct) { setScore(s => s + 1); onCelebrate(); }
    setTotal(t => t + 1);
  };

  const handleNext = () => {
    setQIdx((qIdx + 1) % QUIZ_QUESTIONS.length);
    setSelected(null);
    setRevealed(false);
  };

  return (
    <div className="nex-panel nex-quiz-panel">
      <div className="nex-panel-header">
        <span>⚡ Quick Tech Quiz</span>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span className="nex-score-badge">{score}/{total}</span>
          <button className="nex-panel-close" onClick={onClose} aria-label="Close quiz">×</button>
        </div>
      </div>
      <div className="nex-quiz-body">
        <p className="nex-quiz-question">{q.q}</p>
        <div className="nex-quiz-options">
          {q.opts.map((opt, i) => {
            let cls = 'nex-quiz-opt';
            if (revealed) {
              if (i === q.ans) cls += ' correct';
              else if (i === selected) cls += ' wrong';
            }
            return (
              <button key={i} className={cls} onClick={() => handleAnswer(i)} disabled={revealed}>
                <span className="nex-opt-letter">{String.fromCharCode(65 + i)}</span>
                {opt}
              </button>
            );
          })}
        </div>
        {revealed && (
          <div className="nex-quiz-result">
            <span>{selected === q.ans ? '🎉 Correct!' : `❌ The answer is: ${q.opts[q.ans]}`}</span>
            <button className="nex-quiz-next" onClick={handleNext}>Next →</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Mood Panel ───────────────────────────────────────────────────────────────
function MoodPanel({ onClose, onMoodSelect }) {
  return (
    <div className="nex-panel nex-mood-panel">
      <div className="nex-panel-header">
        <span>🎭 NEX Mood Selector</span>
        <button className="nex-panel-close" onClick={onClose} aria-label="Close mood panel">×</button>
      </div>
      <p className="nex-panel-hint">Choose a vibe for NEX!</p>
      <div className="nex-mood-grid">
        {MOODS.map(m => (
          <button key={m.id} className="nex-mood-btn" onClick={() => onMoodSelect(m)}>
            <span className="nex-mood-emoji">{m.emoji}</span>
            <span>{m.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Tour Panel ───────────────────────────────────────────────────────────────
function TourPanel({ onClose, onNavigate }) {
  const [step, setStep] = useState(0);
  const current = TOUR_STEPS[step];

  return (
    <div className="nex-panel nex-tour-panel">
      <div className="nex-panel-header">
        <span>🗺️ Explore ACM</span>
        <button className="nex-panel-close" onClick={onClose} aria-label="Close tour">×</button>
      </div>
      <div className="nex-tour-body">
        <div className="nex-tour-step-indicator">
          {TOUR_STEPS.map((_, i) => (
            <div key={i} className={`nex-tour-dot ${i === step ? 'active' : i < step ? 'done' : ''}`} />
          ))}
        </div>
        <div className="nex-tour-card">
          <span className="nex-tour-emoji">{current.emoji}</span>
          <h4>{current.label}</h4>
          <p>{current.desc}</p>
          <a href={current.href} className="nex-tour-go" onClick={() => onNavigate(current.href)}>
            Go to {current.label} <ChevronRight size={14} />
          </a>
        </div>
        <div className="nex-tour-nav">
          <button className="nex-tour-btn" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>← Back</button>
          {step < TOUR_STEPS.length - 1
            ? <button className="nex-tour-btn primary" onClick={() => setStep(s => s + 1)}>Next →</button>
            : <button className="nex-tour-btn primary" onClick={onClose}>Finish! 🎉</button>
          }
        </div>
      </div>
    </div>
  );
}

// ─── Fact Panel ───────────────────────────────────────────────────────────────
function FactPanel({ onClose }) {
  const [factIdx] = useState(() => {
    const today = new Date();
    return (today.getDate() + today.getMonth()) % TECH_FACTS.length;
  });

  return (
    <div className="nex-panel nex-fact-panel">
      <div className="nex-panel-header">
        <span>💡 Tech Fact of the Day</span>
        <button className="nex-panel-close" onClick={onClose} aria-label="Close fact">×</button>
      </div>
      <div className="nex-fact-body">
        <div className="nex-fact-icon">🤖</div>
        <p>{TECH_FACTS[factIdx]}</p>
      </div>
    </div>
  );
}

// ─── AI Chat Panel ────────────────────────────────────────────────────────────
function ChatPanel({ onClose }) {
  const [messages, setMessages] = useState([
    { role: 'nex', text: "Hi! I'm NEX. Ask me about ACM VIT-AP, our events, teams, or how to join!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const getLocalAnswer = (q) => {
    const lower = q.toLowerCase();
    if (lower.includes('join') || lower.includes('member')) return "To join ACM VIT-AP, email us at acm@vitap.ac.in — scroll to the 'Join Us' section for more info!";
    if (lower.includes('event') || lower.includes('hackathon') || lower.includes('workshop')) return "We run hackathons like 'Hack the Horizon', tech talks on cutting-edge architectures, and hands-on workshops. Check the Events section!";
    if (lower.includes('team') || lower.includes('lead') || lower.includes('who')) return "Our chapter is led by Krishna Chaitanya with a dedicated team across tech, design, outreach and events.";
    if (lower.includes('acm') || lower.includes('chapter') || lower.includes('about')) return "ACM VIT-AP is the student chapter of the Association for Computing Machinery at VIT-AP University. We have 1K+ members, 50+ events and 10+ domains!";
    if (lower.includes('gallery') || lower.includes('photo')) return "Our gallery captures hackathon arenas, hands-on labs, community circles and open source days!";
    if (lower.includes('contact') || lower.includes('email')) return "Reach us at acm@vitap.ac.in — we'd love to hear from you!";
    return null;
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setError(null);
    setMessages(m => [...m, { role: 'user', text }]);
    setLoading(true);

    // Try local knowledge first
    const local = getLocalAnswer(text);
    if (local) {
      setTimeout(() => {
        setMessages(m => [...m, { role: 'nex', text: local }]);
        setLoading(false);
      }, 600);
      return;
    }

    // AI endpoint (graceful degradation if not configured)
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const res = await fetch('/api/nex-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (!res.ok) throw new Error('API unavailable');
      const data = await res.json();
      setMessages(m => [...m, { role: 'nex', text: data.reply || "I'm not sure about that — try asking about events, teams, or joining ACM!" }]);
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Request timed out.');
      } else {
        // Graceful degradation: AI not configured, use friendly fallback
        setMessages(m => [...m, { role: 'nex', text: "I don't have that info right now, but try asking about our events, teams, or how to join ACM VIT-AP!" }]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className="nex-panel nex-chat-panel">
      <div className="nex-panel-header">
        <span>💬 Chat with NEX</span>
        <button className="nex-panel-close" onClick={onClose} aria-label="Close chat">×</button>
      </div>
      <div className="nex-chat-messages" ref={messagesRef}>
        {messages.map((m, i) => (
          <div key={i} className={`nex-chat-msg ${m.role === 'nex' ? 'nex-msg' : 'user-msg'}`}>
            {m.role === 'nex' && <span className="nex-chat-avatar">N</span>}
            <div className="nex-chat-bubble">{m.text}</div>
          </div>
        ))}
        {loading && (
          <div className="nex-chat-msg nex-msg">
            <span className="nex-chat-avatar">N</span>
            <div className="nex-chat-bubble nex-typing">
              <span /><span /><span />
            </div>
          </div>
        )}
        {error && <div className="nex-chat-error">{error}</div>}
      </div>
      <div className="nex-chat-input-row">
        <input
          ref={inputRef}
          className="nex-chat-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask me about ACM..."
          maxLength={200}
          aria-label="Chat with NEX"
        />
        <button
          className="nex-chat-send"
          onClick={handleSend}
          disabled={!input.trim() || loading}
          aria-label="Send message"
        >
          →
        </button>
      </div>
    </div>
  );
}

// ─── Activities Menu ─────────────────────────────────────────────────────────
function ActivitiesMenu({ onSelect, onClose }) {
  const items = [
    { id: 'quiz',  emoji: '⚡', label: 'Tech Quiz',       desc: 'Test your knowledge' },
    { id: 'mood',  emoji: '🎭', label: 'NEX Mood',        desc: 'Change my vibe' },
    { id: 'tour',  emoji: '🗺️', label: 'Explore ACM',     desc: 'Guided tour' },
    { id: 'fact',  emoji: '💡', label: 'Tech Fact',       desc: 'Daily surprise' },
    { id: 'chat',  emoji: '💬', label: 'Chat',            desc: 'Ask me anything' },
  ];

  return (
    <div className="nex-panel nex-activities-menu">
      <div className="nex-panel-header">
        <span>✨ Activities</span>
        <button className="nex-panel-close" onClick={onClose} aria-label="Close activities">×</button>
      </div>
      <div className="nex-activities-list">
        {items.map(item => (
          <button key={item.id} className="nex-activity-item" onClick={() => onSelect(item.id)}>
            <span className="nex-activity-emoji">{item.emoji}</span>
            <div className="nex-activity-info">
              <strong>{item.label}</strong>
              <span>{item.desc}</span>
            </div>
            <ChevronRight size={14} className="nex-activity-arrow" />
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Main NexCompanion Component ─────────────────────────────────────────────
export default function NexCompanion({ activeSection = 'home' }) {
  const [state, dispatch] = useReducer(nexReducer, initialNexState);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [showActivities, setShowActivities] = useState(false);
  const idleTimer = useRef(null);
  const greetTimer = useRef(null);
  const prevSection = useRef(null);

  // Greeting on first visit (once per session)
  useEffect(() => {
    if (!state.hasGreeted) {
      greetTimer.current = setTimeout(() => {
        dispatch({ type: 'SET_MESSAGE', pose: 'greeting', message: SECTION_MESSAGES.home.text });
        dispatch({ type: 'MARK_GREETED' });
        speakText(SECTION_MESSAGES.home.text, voiceEnabled);
        scheduleIdleReturn();
      }, 1200);
    }
    return () => clearTimeout(greetTimer.current);
  }, []); // only once

  // Navigation awareness
  useEffect(() => {
    if (!state.hasGreeted) return;
    if (prevSection.current === activeSection) return;
    prevSection.current = activeSection;

    const info = SECTION_MESSAGES[activeSection] || SECTION_MESSAGES.home;
    dispatch({ type: 'NAV_UPDATE', pose: info.pose, message: info.text });
    speakText(info.text, voiceEnabled);
    scheduleIdleReturn();
  }, [activeSection]);

  const scheduleIdleReturn = () => {
    clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      dispatch({ type: 'CLEAR_MESSAGE' });
    }, 6000);
  };

  // Cleanup
  useEffect(() => () => {
    clearTimeout(idleTimer.current);
    clearTimeout(greetTimer.current);
  }, []);

  const handleCelebrate = useCallback(() => {
    dispatch({ type: 'SET_POSE', pose: 'celebrating' });
    setTimeout(() => dispatch({ type: 'SET_POSE', pose: 'idle' }), 2500);
  }, []);

  const handleMoodSelect = useCallback((mood) => {
    dispatch({ type: 'SET_MESSAGE', pose: mood.pose, message: mood.msg });
    speakText(mood.msg, voiceEnabled);
    setShowActivities(false);
    dispatch({ type: 'SET_PANEL', panel: null });
    scheduleIdleReturn();
  }, [voiceEnabled]);

  const handleActivitySelect = useCallback((id) => {
    setShowActivities(false);
    dispatch({ type: 'SET_PANEL', panel: id });
  }, []);

  const handleNexClick = () => {
    if (state.isDismissed) { dispatch({ type: 'RESTORE' }); return; }
    dispatch({ type: 'SET_MESSAGE', pose: 'greeting', message: "Hi there! 👋 I'm NEX. Need help exploring ACM VIT-AP?" });
    scheduleIdleReturn();
  };

  // Reduced motion support
  const prefersReduced = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  if (state.isDismissed) {
    return (
      <button
        className="nex-restore-btn"
        onClick={() => dispatch({ type: 'RESTORE' })}
        aria-label="Reopen NEX companion"
        title="Open NEX Companion"
      >
        <img src={POSES.idle} alt="NEX" className="nex-restore-img" />
      </button>
    );
  }

  const currentPose = state.pose || 'idle';
  const sectionInfo = SECTION_MESSAGES[activeSection];

  return (
    <aside className="nex-companion-root" aria-label="NEX Companion">

      {/* ── Active Panel Layer ─────────────────────────────── */}
      {state.activePanel === 'quiz' && (
        <QuizPanel
          onClose={() => dispatch({ type: 'SET_PANEL', panel: null })}
          onCelebrate={handleCelebrate}
        />
      )}
      {state.activePanel === 'mood' && (
        <MoodPanel
          onClose={() => dispatch({ type: 'SET_PANEL', panel: null })}
          onMoodSelect={handleMoodSelect}
        />
      )}
      {state.activePanel === 'tour' && (
        <TourPanel
          onClose={() => dispatch({ type: 'SET_PANEL', panel: null })}
          onNavigate={(href) => { window.location.hash = href.replace('#',''); }}
        />
      )}
      {state.activePanel === 'fact' && (
        <FactPanel onClose={() => dispatch({ type: 'SET_PANEL', panel: null })} />
      )}
      {state.activePanel === 'chat' && (
        <ChatPanel onClose={() => dispatch({ type: 'SET_PANEL', panel: null })} />
      )}

      {/* ── Activities Menu ────────────────────────────────── */}
      {showActivities && !state.activePanel && (
        <ActivitiesMenu
          onSelect={handleActivitySelect}
          onClose={() => setShowActivities(false)}
        />
      )}

      {/* ── Speech Bubble ─────────────────────────────────── */}
      {state.message && !state.activePanel && !showActivities && (
        <div className="nex-speech-bubble" role="status" aria-live="polite">
          <button
            className="nex-bubble-dismiss"
            onClick={() => { clearTimeout(idleTimer.current); dispatch({ type: 'CLEAR_MESSAGE' }); }}
            aria-label="Dismiss message"
          >×</button>
          <p>{state.message}</p>
          {sectionInfo?.action && (
            <a href={sectionInfo.action.href} className="nex-bubble-action">
              {sectionInfo.action.label} <ChevronRight size={12} />
            </a>
          )}
        </div>
      )}

      {/* ── Robot Body ────────────────────────────────────── */}
      <div className="nex-robot-wrap">

        {/* Controls row */}
        <div className="nex-controls-row">
          <button
            className="nex-ctrl-btn"
            onClick={() => setVoiceEnabled(v => !v)}
            aria-label={voiceEnabled ? 'Mute NEX voice' : 'Enable NEX voice'}
            title={voiceEnabled ? 'Mute' : 'Enable voice'}
          >
            {voiceEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
          </button>
          <button
            className="nex-ctrl-btn"
            onClick={() => { setShowActivities(v => !v); dispatch({ type: 'SET_PANEL', panel: null }); }}
            aria-label="Open activities menu"
            title="Activities"
          >
            <Sparkles size={13} />
          </button>
          <button
            className="nex-ctrl-btn"
            onClick={() => dispatch({ type: 'DISMISS' })}
            aria-label="Dismiss NEX companion"
            title="Dismiss"
          >
            <X size={13} />
          </button>
        </div>

        {/* Character image */}
        <button
          className={`nex-character-btn ${prefersReduced ? '' : `nex-pose--${currentPose}`}`}
          onClick={handleNexClick}
          aria-label={`NEX robot companion — ${currentPose} state. Click to interact.`}
          title="Click to interact with NEX"
        >
          <img
            src={POSES[currentPose]}
            alt={`NEX in ${currentPose} pose`}
            className="nex-character-img"
            draggable={false}
          />
          {/* Glow ring under NEX */}
          <div className="nex-ground-glow" aria-hidden="true" />
        </button>

        {/* Bottom label */}
        <div className="nex-label-bar">
          <span className="nex-status-pip" />
          <span className="nex-label-text">NEX · ACM Companion</span>
        </div>
      </div>
    </aside>
  );
}
