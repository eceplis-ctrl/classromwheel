"use client";
import { useState, useEffect, useRef, useCallback } from "react";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => 
    typeof window !== "undefined" ? window.innerWidth < 540 : false
  );
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 539px)");
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    setIsMobile(mq.matches);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

const COLORS = [
  "#7C3AED","#C4B5FD",
  "#0891B2","#A5F3FC",
  "#DC2626","#FCA5A5",
  "#059669","#6EE7B7",
  "#D97706","#FCD34D",
  "#DB2777","#F9A8D4",
  "#2563EB","#93C5FD",
  "#65A30D","#BBF7D0"
];

const SAMPLE_NAMES = [
  "Emma","Liam","Olivia","Noah","Ava"
];

function WheelCanvas({ names, spinning, onSpinEnd, highlightIndex, size = 360 }) {
  const canvasRef = useRef(null);
  const angleRef = useRef(0);
  const rafRef = useRef(null);
  const onSpinEndRef = useRef(onSpinEnd);
  onSpinEndRef.current = onSpinEnd;

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;
    const r = Math.min(cx, cy) - 8;
    ctx.clearRect(0, 0, W, H);

    if (!names.length) {
      ctx.fillStyle = "#1a1a2e";
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#ffffff44";
      ctx.font = "bold 16px 'DM Sans', sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("Add names to spin", cx, cy);
      return;
    }

    const arc = (Math.PI * 2) / names.length;
    names.forEach((name, i) => {
      const start = angleRef.current + i * arc;
      const end = start + arc;
      ctx.beginPath(); ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, start, end); ctx.closePath();
      ctx.fillStyle = highlightIndex === i ? "#ffffff" : COLORS[i % COLORS.length];
      ctx.fill();
      ctx.strokeStyle = "#0d0d1a"; ctx.lineWidth = 2; ctx.stroke();

      ctx.save(); ctx.translate(cx, cy); ctx.rotate(start + arc / 2);
      const maxLen = names.length > 12 ? 8 : names.length > 8 ? 10 : 14;
      const label = name.length > maxLen ? name.slice(0, maxLen - 1) + "…" : name;
      const fontSize = names.length > 20 ? 10 : names.length > 12 ? 12 : names.length > 8 ? 13 : 15;
      ctx.font = `bold ${fontSize}px 'DM Sans', sans-serif`;
      ctx.fillStyle = highlightIndex === i ? "#1a1a2e" : "#ffffff";
      ctx.textAlign = "right"; ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(0,0,0,0.5)"; ctx.shadowBlur = 4;
      ctx.fillText(label, r - 10, 0); ctx.restore();
    });

    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 28);
    grad.addColorStop(0, "#2d2d5e"); grad.addColorStop(1, "#1a1a2e");
    ctx.beginPath(); ctx.arc(cx, cy, 28, 0, Math.PI * 2);
    ctx.fillStyle = grad; ctx.fill();
    ctx.strokeStyle = "#ffffff22"; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = "#ffffff88"; ctx.font = "16px sans-serif";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("⟳", cx, cy);
  }, [names, highlightIndex]);

  useEffect(() => { draw(); }, [draw]);

  useEffect(() => {
    if (!spinning) return;
    const totalSpins = 5 + Math.random() * 4;
    const winnerIdx = Math.floor(Math.random() * names.length);
    const arc = (Math.PI * 2) / names.length;
    const segCenter = winnerIdx * arc + arc / 2;
    const targetAngle = -segCenter - Math.PI / 2 + totalSpins * Math.PI * 2;
    const start = angleRef.current;
    const delta = targetAngle - start;
    const duration = 3500 + Math.random() * 1000;
    let startTime = null;
    const easeOut = x => 1 - Math.pow(1 - x, 4);
    const step = ts => {
      if (!startTime) startTime = ts;
      const t = Math.min((ts - startTime) / duration, 1);
      angleRef.current = start + delta * easeOut(t);
      draw();
      if (t < 1) { rafRef.current = requestAnimationFrame(step); }
      else { onSpinEndRef.current(winnerIdx); }
    };
    rafRef.current = requestAnimationFrame(step);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [spinning, names.length, draw]);

  return (
    <div style={{ position: "relative", display: "inline-block", width: `min(${size}px, 85vw)`, maxWidth: size }}>
      <div style={{
        position: "absolute", top: "50%", right: -14, transform: "translateY(-50%)",
        width: 0, height: 0,
        borderTop: "14px solid transparent", borderBottom: "14px solid transparent",
        borderRight: "26px solid #ffffff",
        filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.8))", zIndex: 10
      }} />
      <canvas ref={canvasRef} width={size} height={size} style={{
        borderRadius: "50%", display: "block", width: "100%", height: "auto",
        maxWidth: size,
        boxShadow: "0 0 0 3px rgba(106,100,255,0.5), 0 0 24px rgba(106,100,255,0.15)"
      }} />
    </div>
  );
}

function CountdownOverlay({ countdown, studentName, size = 360 }) {
  const isReveal = countdown === "reveal";
  return (
    <div style={{
      width: `min(${size}px, 90vw)`, height: `min(${size}px, 90vw)`, borderRadius: "50%",
      background: "radial-gradient(circle at center, #1e1b4e 0%, #0d0d1a 100%)",
      boxShadow: "0 0 0 3px rgba(253,121,168,0.5), 0 0 30px rgba(106,100,255,0.2)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden"
    }}>
      <div style={{
        position: "absolute", inset: 0, borderRadius: "50%",
        border: "2px solid rgba(253,121,168,0.4)",
        animation: "pulse-ring 1.5s ease-in-out infinite"
      }} />
      {isReveal ? (
        <div style={{
          textAlign: "center", zIndex: 1, padding: "0 30px",
          animation: "pop-in 0.35s cubic-bezier(0.34,1.56,0.64,1)"
        }}>
          <div style={{ fontSize: 11, letterSpacing: "0.2em", fontWeight: 700, color: "rgba(253,121,168,0.9)", marginBottom: 10 }}>
            LAST STUDENT
          </div>
          <div style={{
            fontSize: studentName && studentName.length > 12 ? 32 : 44,
            fontWeight: 800, color: "#fff", letterSpacing: "-1px", lineHeight: 1.1,
            textShadow: "0 0 30px rgba(253,121,168,0.7)"
          }}>
            {studentName}
          </div>
          <div style={{ fontSize: 32, marginTop: 12 }}>🎉</div>
        </div>
      ) : (
        <div key={countdown} style={{
          fontSize: 128, fontWeight: 800, color: "#fff", lineHeight: 1, zIndex: 1,
          textShadow: "0 0 60px rgba(253,121,168,0.9), 0 0 20px rgba(255,255,255,0.5)",
          animation: "count-pop 0.6s cubic-bezier(0.34,1.56,0.64,1)"
        }}>
          {countdown}
        </div>
      )}
    </div>
  );
}

export default function ClassroomWheel() {
  const [classes, setClasses] = useState(
    [{ id: "1", name: "My Class", students: SAMPLE_NAMES.map((n, i) => ({ id: String(i), name: n, picked: false, absent: false })) }]
  );
  const [activeClassId, setActiveClassId] = useState("1");
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [highlightIndex, setHighlightIndex] = useState(null);
  const [newName, setNewName] = useState("");
  const [pasteText, setPasteText] = useState("");
  const [showPaste, setShowPaste] = useState(false);
  const [showNewClass, setShowNewClass] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [noRepeat, setNoRepeat] = useState(true);
  const [history, setHistory] = useState([]);
  const [editingClass, setEditingClass] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [celebrateRound, setCelebrateRound] = useState(false);
  const [wheelKey, setWheelKey] = useState(0);
  const [countdown, setCountdown] = useState(null);
  const confettiRef = useRef(null);
  const [lastStudent, setLastStudent] = useState(null);
  const [projector, setProjector] = useState(false);
  const [showRoster, setShowRoster] = useState(true);
  const projectorRef = useRef(null);
  const [soundOn, setSoundOn] = useState(true);
  const [lastPick, setLastPick] = useState(null);
  const [answerTimer, setAnswerTimer] = useState(null);
  const [answerDuration, setAnswerDuration] = useState(30);
  const [showTimerConfig, setShowTimerConfig] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [showTeams, setShowTeams] = useState(false);
  const [teamCount, setTeamCount] = useState(2);
  const [teams, setTeams] = useState([]);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const audioCtxRef = useRef(null);
  const [storageLoaded, setStorageLoaded] = useState(false);

  const activeClass = classes.find(c => c.id === activeClassId) || classes[0];
  const isCorrectClass = activeClass?.id === activeClassId;
  const eligibleStudents = (activeClass && isCorrectClass)
    ? activeClass.students.filter(s => !s.absent && (!noRepeat || !s.picked))
    : [];

  // in-memory only for preview — localStorage used in production

  const updateClass = (id, fn) => setClasses(cs => cs.map(c => c.id === id ? fn(c) : c));

  const getAudioCtx = () => {
    if (typeof window === "undefined") return null;
    if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtxRef.current;
  };

  const playSound = useCallback((type) => {
    if (!soundOn) return;
    try {
      const ctx = getAudioCtx();
      if (!ctx) return;
      const now = ctx.currentTime;
      if (type === "spin") {
        const osc = ctx.createOscillator(); const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(200, now); osc.frequency.exponentialRampToValueAtTime(800, now + 0.3);
        gain.gain.setValueAtTime(0.15, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now); osc.stop(now + 0.35);
      } else if (type === "win") {
        [0, 0.12, 0.24].forEach((delay, i) => {
          const osc = ctx.createOscillator(); const gain = ctx.createGain();
          osc.connect(gain); gain.connect(ctx.destination);
          osc.frequency.value = [523, 659, 784][i];
          gain.gain.setValueAtTime(0.18, now + delay); gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.4);
          osc.start(now + delay); osc.stop(now + delay + 0.4);
        });
      } else if (type === "round") {
        [523, 659, 784, 1047].forEach((freq, i) => {
          const osc = ctx.createOscillator(); const gain = ctx.createGain();
          osc.connect(gain); gain.connect(ctx.destination);
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.2, now + i * 0.1); gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.5);
          osc.start(now + i * 0.1); osc.stop(now + i * 0.1 + 0.5);
        });
      } else if (type === "tick") {
        const osc = ctx.createOscillator(); const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value = 880;
        gain.gain.setValueAtTime(0.08, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.start(now); osc.stop(now + 0.06);
      }
    } catch(e) {}
  }, [soundOn]);

  const burstConfetti = useCallback(() => {
    const canvas = confettiRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;
    const particles = Array.from({ length: 60 }, () => ({
      x: W / 2, y: H / 2,
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 0.7) * 14,
      color: ["#7C3AED","#C4B5FD","#fd79a8","#FECA57","#06D6A0","#74B9FF","#FCA5A5","#FCD34D"][Math.floor(Math.random() * 8)],
      size: 5 + Math.random() * 6,
      alpha: 1,
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.2
    }));
    let frame;
    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        p.vy += 0.35; p.alpha -= 0.018; p.rot += p.rotV;
        if (p.alpha <= 0) return;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });
      if (particles.some(p => p.alpha > 0)) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    setTimeout(() => { cancelAnimationFrame(frame); ctx.clearRect(0, 0, W, H); }, 2500);
  }, []);

  const handleSpinEnd = (idx) => {
    const student = eligibleStudents[idx];
    if (!student) return;
    setHighlightIndex(idx);
    setWinner(student);
    setLastPick(student);
    setHistory(h => [{ name: student.name, time: new Date().toLocaleTimeString() }, ...h.slice(0, 19)]);
    updateClass(activeClassId, c => ({ ...c, students: c.students.map(s => s.id === student.id ? { ...s, picked: true } : s) }));
    setTimeout(() => { burstConfetti(); playSound('win'); }, 100);
    setTimeout(() => {
      setSpinning(false);
      setWheelKey(k => k + 1);
      if (noRepeat && eligibleStudents.filter(s => s.id !== student.id).length === 0) {
        setCelebrateRound(true);
        playSound('round');
        setTimeout(() => setCelebrateRound(false), 3500);
      }
    }, 200);
  };

  const handleSpinRef = useRef(null);
  const countdownTimers = useRef([]);

  const finishLastStudent = useCallback((student) => {
    setCountdown(null);
    setLastStudent(null);
    setWinner(student);
    setHistory(h => [{ name: student.name, time: new Date().toLocaleTimeString() }, ...h.slice(0, 19)]);
    updateClass(activeClassId, c => ({ ...c, students: c.students.map(s => s.id === student.id ? { ...s, picked: true } : s) }));
    setWheelKey(k => k + 1);
    setTimeout(() => burstConfetti(), 100);
    if (noRepeat) {
      setCelebrateRound(true);
      setTimeout(() => setCelebrateRound(false), 3500);
    }
  }, [activeClassId, noRepeat, burstConfetti, playSound]);

  const startAnswerTimer = () => {
    setAnswerTimer(answerDuration);
    const iv = setInterval(() => {
      setAnswerTimer(prev => {
        if (prev <= 1) { clearInterval(iv); playSound('round'); return null; }
        if (prev <= 4) playSound('tick');
        return prev - 1;
      });
    }, 1000);
  };

  const generateTeams = () => {
    const present = activeClass?.students.filter(s => !s.absent) || [];
    const shuffled = [...present].sort(() => Math.random() - 0.5);
    const result = Array.from({ length: teamCount }, (_, i) =>
      shuffled.filter((_, j) => j % teamCount === i)
    );
    setTeams(result);
    setShowTeams(true);
  };

  const exportRoster = () => {
    if (typeof window === "undefined") return;
    const names = (activeClass?.students || []).map(s => s.name).join('\n');
    const blob = new Blob([names], { type: 'text/plain' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `${activeClass?.name || 'class'}-roster.txt`; a.click();
  };

  const exportHistory = () => {
    if (typeof window === "undefined") return;
    const csv = ['Name,Time', ...history.map(h => `${h.name},${h.time}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `${activeClass?.name || 'class'}-picks.csv`; a.click();
  };

  const toggleProjector = () => {
    if (!projector) {
      setProjector(true);

    } else {
      setProjector(false);

    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onKey = (e) => {
      if (e.key === "Escape") { setProjector(false); setShowShortcuts(false); }
      if (e.key === " " && projector) { e.preventDefault(); if (handleSpinRef.current) handleSpinRef.current(); }
      if (e.key === "?" || e.key === "/") setShowShortcuts(v => !v);
      if ((e.key === "u" || e.key === "U") && !e.target.closest?.('input,textarea')) undoLastPick();
      if ((e.key === "m" || e.key === "M") && !e.target.closest?.('input,textarea')) setSoundOn(v => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [projector]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("cw_classes");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length) setClasses(parsed);
      }
      const savedId = localStorage.getItem("cw_active");
      if (savedId) setActiveClassId(savedId);
      const savedNoRepeat = localStorage.getItem("cw_noRepeat");
      if (savedNoRepeat !== null) setNoRepeat(savedNoRepeat === "true");
    } catch {}
    setStorageLoaded(true);
  }, []);

  useEffect(() => {
    if (!storageLoaded) return;
    try { localStorage.setItem("cw_classes", JSON.stringify(classes)); } catch {}
  }, [classes, storageLoaded]);

  useEffect(() => {
    if (!storageLoaded) return;
    try { localStorage.setItem("cw_active", activeClassId); } catch {}
  }, [activeClassId, storageLoaded]);

  useEffect(() => {
    if (!storageLoaded) return;
    try { localStorage.setItem("cw_noRepeat", String(noRepeat)); } catch {}
  }, [noRepeat, storageLoaded]);

  const handleSpin = () => {
    handleSpinRef.current = handleSpin;
    if (spinning || countdown !== null || eligibleStudents.length === 0) return;
    setWinner(null);
    setHighlightIndex(null);

    if (eligibleStudents.length === 1) {
      const student = eligibleStudents[0];
      setLastStudent(student);
      setCountdown(3);
      const t1 = setTimeout(() => setCountdown(2), 950);
      const t2 = setTimeout(() => setCountdown(1), 1900);
      const t3 = setTimeout(() => setCountdown("reveal"), 2850);
      const t4 = setTimeout(() => finishLastStudent(student), 3900);
      // Store timeout IDs for cleanup
      countdownTimers.current = [t1, t2, t3, t4];
      return;
    }

    playSound('spin');
    setSpinning(true);
  };

  const undoLastPick = () => {
    if (!lastPick) return;
    updateClass(activeClassId, c => ({
      ...c, students: c.students.map(s => s.id === lastPick.id ? { ...s, picked: false } : s)
    }));
    setWinner(null);
    setHighlightIndex(null);
    setHistory(h => h.slice(1));
    setLastPick(null);
    setWheelKey(k => k + 1);
  };

  const resetRound = () => {
    // Clear any running countdown timers
    countdownTimers.current.forEach(t => clearTimeout(t));
    countdownTimers.current = [];
    setCountdown(null);
    setLastStudent(null);
    updateClass(activeClassId, c => ({ ...c, students: c.students.map(s => ({ ...s, picked: false })) }));
    setWinner(null);
    setHighlightIndex(null);
    setWheelKey(k => k + 1);
  };

  const addStudent = () => {
    const name = newName.trim();
    if (!name || !activeClass) return;
    updateClass(activeClassId, c => ({ ...c, students: [...c.students, { id: Date.now().toString(), name, picked: false, absent: false }] }));
    setNewName("");
    if (winner && activeClass.students.length === 0) {
      setWinner(null);
      setHighlightIndex(null);
    }
  };

  const importPaste = () => {
    const names = pasteText.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
    if (!names.length) return;
    updateClass(activeClassId, c => ({ ...c, students: names.map((name, i) => ({ id: Date.now() + i + "", name, picked: false, absent: false })) }));
    setPasteText(""); setShowPaste(false);
  };

  const toggleAbsent = id => updateClass(activeClassId, c => ({ ...c, students: c.students.map(s => s.id === id ? { ...s, absent: !s.absent } : s) }));
  const removeStudent = id => updateClass(activeClassId, c => ({ ...c, students: c.students.filter(s => s.id !== id) }));
  const clearAllStudents = () => {
    if (!activeClass || activeClass.students.length === 0) return;
    if (!window.confirm(`Remove all ${activeClass.students.length} students from "${activeClass.name}"? This can't be undone.`)) return;
    countdownTimers.current.forEach(t => clearTimeout(t));
    countdownTimers.current = [];
    setCountdown(null);
    setLastStudent(null);
    setSpinning(false);
    setWinner(null);
    setHighlightIndex(null);
    setLastPick(null);
    updateClass(activeClassId, c => ({ ...c, students: [] }));
    setWheelKey(k => k + 1);
  };
  const addClass = () => {
    const name = newClassName.trim() || "New Class";
    const id = Date.now().toString();
    setClasses(cs => [...cs, { id, name, students: [] }]);
    setActiveClassId(id);
    setNewClassName("");
    setShowNewClass(false);
    setWinner(null);
    setHighlightIndex(null);
    setWheelKey(k => k + 1);
  };

  const isMobile = useIsMobile();

  const present = activeClass?.students.filter(s => !s.absent) || [];
  const pickedCount = present.filter(s => s.picked).length;
  const isLastOne = eligibleStudents.length === 1;
  const isDisabled = spinning || countdown !== null || eligibleStudents.length === 0;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0d0d1a 0%, #1a1a2e 40%, #16213e 100%)", fontFamily: "'DM Sans','Segoe UI',sans-serif", color: "#f0f0ff", paddingBottom: 40, position: "relative" }}>

      <div style={{ background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: isMobile ? "10px 14px" : "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 24 }}>🎡</span>
          <span style={{ fontSize: isMobile ? 16 : 18, fontWeight: 700, letterSpacing: "-0.5px" }}>ClassroomWheel</span>
          <span style={{ fontSize: 11, background: "rgba(106,100,255,0.3)", color: "#a29bfe", padding: "2px 8px", borderRadius: 99, fontWeight: 600 }}>BETA</span>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: isMobile ? "nowrap" : "wrap", alignItems: "center", overflowX: isMobile ? "auto" : "visible", maxWidth: isMobile ? "calc(100vw - 120px)" : "none", paddingBottom: isMobile ? 2 : 0 }}>
          {classes.map(c => (
            <button key={c.id} onClick={() => { countdownTimers.current.forEach(t => clearTimeout(t)); countdownTimers.current = []; setCountdown(null); setLastStudent(null); setActiveClassId(c.id); setWinner(null); setHighlightIndex(null); setWheelKey(k => k + 1); }} style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid", borderColor: c.id === activeClassId ? "#6a64ff" : "rgba(255,255,255,0.12)", background: c.id === activeClassId ? "rgba(106,100,255,0.2)" : "transparent", color: c.id === activeClassId ? "#a29bfe" : "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              {c.name}
            </button>
          ))}
          <button onClick={() => setShowNewClass(v => !v)} style={{ padding: "6px 10px", borderRadius: 8, border: "1px dashed rgba(255,255,255,0.2)", background: "transparent", color: "rgba(255,255,255,0.4)", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>+ Class</button>
        </div>
      </div>

      {showNewClass && (
        <div style={{ padding: "10px 24px", background: "rgba(106,100,255,0.1)", borderBottom: "1px solid rgba(106,100,255,0.2)", display: "flex", gap: 8 }}>
          <input value={newClassName} onChange={e => setNewClassName(e.target.value)} onKeyDown={e => e.key === "Enter" && addClass()} placeholder="Class name (e.g. 5B Math)" style={{ flex: 1, padding: "8px 12px", borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: 14, fontFamily: "inherit", outline: "none" }} />
          <button onClick={addClass} style={{ padding: "8px 18px", borderRadius: 8, background: "#6a64ff", color: "#fff", border: "none", fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Create</button>
          <button onClick={() => setShowNewClass(false)} style={{ padding: "8px 12px", borderRadius: 8, background: "transparent", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 380px", gap: isMobile ? 16 : 24, maxWidth: 1100, margin: "0 auto", padding: isMobile ? "16px 12px" : "24px 16px", alignItems: "start" }}>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, minWidth: 0 }}>

          {winner && (
            <div style={{ textAlign: "center", animation: "winner-reveal 0.5s cubic-bezier(0.34,1.56,0.64,1)", width: "100%", maxWidth: 420, padding: "8px 0" }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: "0.2em", fontWeight: 600, marginBottom: 6 }}>PICKED</div>
              <div style={{ fontSize: isMobile ? 42 : 58, fontWeight: 800, letterSpacing: "-2px", color: "#fff", lineHeight: 1, textShadow: "0 2px 20px rgba(162,155,254,0.4)" }}>{winner.name}</div>
              <div style={{ marginTop: 8, height: 3, borderRadius: 99, background: "linear-gradient(90deg, #6a64ff, #fd79a8)", maxWidth: 120, margin: "10px auto 0" }} />
            </div>
          )}

          {celebrateRound && (
            <div style={{ background: "linear-gradient(135deg, #00b894, #00cec9)", borderRadius: 16, padding: "14px 28px", textAlign: "center", animation: "fadeIn 0.3s ease", width: "100%", maxWidth: 380 }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>🎉</div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>Everyone's been picked! Resetting for a new round.</div>
            </div>
          )}

          {countdown !== null ? (
            <CountdownOverlay countdown={countdown} studentName={lastStudent?.name} />
          ) : (
            <div style={{ position: "relative", display: "flex", justifyContent: "center", width: "100%" }}>
              {isLastOne && !spinning && (
                <div style={{ position: "absolute", top: -36, left: "50%", transform: "translateX(-50%)", background: "rgba(253,121,168,0.15)", border: "1px solid rgba(253,121,168,0.4)", borderRadius: 99, padding: "4px 14px", fontSize: 12, fontWeight: 700, color: "#fd79a8", whiteSpace: "nowrap", zIndex: 5, animation: "fadeIn 0.3s ease" }}>
                  👀 Last student remaining
                </div>
              )}
              <WheelCanvas
                key={`${activeClassId}-${wheelKey}`}
                names={eligibleStudents.map(s => s.name)}
                spinning={spinning}
                onSpinEnd={handleSpinEnd}
                highlightIndex={highlightIndex}
              />
              <canvas ref={confettiRef} width={360} height={360} style={{
                position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
                pointerEvents: "none", borderRadius: "50%"
              }} />
            </div>
          )}

          <button onClick={handleSpin} disabled={isDisabled} style={{ width: isMobile ? "100%" : "min(260px, 85vw)", height: isMobile ? 56 : 60, borderRadius: 999, background: isDisabled ? "rgba(255,255,255,0.1)" : isLastOne ? "linear-gradient(135deg, #e17055, #fd79a8)" : "linear-gradient(135deg, #6a64ff, #fd79a8)", border: "none", color: "#fff", fontSize: isLastOne ? 14 : 18, fontWeight: 800, cursor: isDisabled ? "not-allowed" : "pointer", letterSpacing: isLastOne ? 0 : "-0.5px", fontFamily: "inherit", boxShadow: isDisabled ? "none" : "0 8px 32px rgba(106,100,255,0.5)", transition: "all 0.2s" }}>
            {spinning ? "Spinning…" : countdown !== null ? "⏳ Revealing..." : eligibleStudents.length === 0 ? "All Picked! ✓" : isLastOne ? "🎭 Reveal last student" : "SPIN"}
          </button>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", width: "100%" }}>
            {[{ label: "Present", value: present.length, color: "#00b894" }, { label: "Picked", value: pickedCount, color: "#6a64ff" }, { label: "Remaining", value: noRepeat ? Math.max(0, present.length - pickedCount) : "—", color: "#fd79a8" }].map(s => (
              <div key={s.label} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: isMobile ? "8px 14px" : "10px 18px", textAlign: "center", minWidth: isMobile ? 70 : 80, flex: isMobile ? 1 : "none" }}>
                <div style={{ fontSize: isMobile ? 20 : 22, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", width: "100%", maxWidth: isMobile ? "100%" : 400 }}>
            <button onClick={() => setNoRepeat(v => !v)} style={{ padding: isMobile ? "10px 16px" : "8px 16px", borderRadius: 8, background: noRepeat ? "rgba(0,184,148,0.2)" : "rgba(255,255,255,0.05)", border: `1px solid ${noRepeat ? "rgba(0,184,148,0.5)" : "rgba(255,255,255,0.1)"}`, color: noRepeat ? "#00b894" : "rgba(255,255,255,0.4)", fontSize: isMobile ? 14 : 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", flex: isMobile ? 1 : "none" }}>
              {noRepeat ? "✓ No-Repeat ON" : "No-Repeat OFF"}
            </button>
            {noRepeat && pickedCount > 0 && (
              <button onClick={resetRound} style={{ padding: "8px 16px", borderRadius: 8, background: "rgba(253,121,168,0.1)", border: "1px solid rgba(253,121,168,0.3)", color: "#fd79a8", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                ↺ New Round
              </button>
            )}
            <button onClick={() => setShowHistory(v => !v)} style={{ padding: "8px 16px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
              History ({history.length})
            </button>
            {!isMobile && (
              <button onClick={toggleProjector} style={{ padding: "8px 16px", borderRadius: 8, background: "rgba(255,200,0,0.12)", border: "1px solid rgba(255,200,0,0.3)", color: "#ffd700", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6 }}>
                📽️ Projector
              </button>
            )}
          </div>

          {/* Second controls row — utility actions */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", width: "100%", maxWidth: isMobile ? "100%" : 460 }}>
            {lastPick && (
              <button onClick={undoLastPick} style={{ padding: "7px 14px", borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 5 }}>
                ↩ Undo pick
              </button>
            )}
            <button onClick={() => setSoundOn(v => !v)} style={{ padding: "7px 14px", borderRadius: 8, background: soundOn ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.1)", color: soundOn ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.25)", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
              {soundOn ? "🔊 Sound" : "🔇 Muted"}
            </button>
            {winner && !spinning && (
              <button onClick={() => { setShowTimerConfig(v => !v); }} style={{ padding: "7px 14px", borderRadius: 8, background: answerTimer !== null ? "rgba(253,121,168,0.15)" : "rgba(255,255,255,0.06)", border: `1px solid ${answerTimer !== null ? "rgba(253,121,168,0.4)" : "rgba(255,255,255,0.1)"}`, color: answerTimer !== null ? "#fd79a8" : "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: answerTimer !== null ? 700 : 400, cursor: "pointer", fontFamily: "inherit" }}>
                ⏱ {answerTimer !== null ? `${answerTimer}s` : "Timer"}
              </button>
            )}
            <button onClick={exportRoster} style={{ padding: "7px 14px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
              ↓ Export roster
            </button>
            {history.length > 0 && (
              <button onClick={exportHistory} style={{ padding: "7px 14px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
                ↓ Export picks
              </button>
            )}
            <button onClick={() => setShowShortcuts(v => !v)} style={{ padding: "7px 14px", borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.3)", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>
              ? Shortcuts
            </button>
          </div>

          {/* Timer config panel */}
          {showTimerConfig && (
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "12px 16px", width: "100%", maxWidth: 380, display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", whiteSpace: "nowrap" }}>Answer time:</span>
              <input type="range" min={5} max={120} step={5} value={answerDuration} onChange={e => setAnswerDuration(Number(e.target.value))} style={{ flex: 1 }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#fd79a8", minWidth: 36 }}>{answerDuration}s</span>
              <button onClick={() => { startAnswerTimer(); setShowTimerConfig(false); }} style={{ padding: "6px 14px", borderRadius: 8, background: "#fd79a8", color: "#fff", border: "none", fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
                Start
              </button>
            </div>
          )}

          {/* Active answer timer display */}
          {answerTimer !== null && (
            <div style={{ textAlign: "center", animation: answerTimer <= 3 ? "pulse-ring 0.5s ease-in-out infinite" : "none" }}>
              <div style={{ fontSize: answerTimer <= 5 ? 64 : 48, fontWeight: 800, color: answerTimer <= 5 ? "#e17055" : "#fd79a8", lineHeight: 1 }}>{answerTimer}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>seconds remaining</div>
            </div>
          )}

          {/* Keyboard shortcuts overlay */}
          {showShortcuts && (
            <div style={{ background: "rgba(13,13,26,0.97)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, padding: "16px 20px", width: "100%", maxWidth: 380 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.8)", marginBottom: 12 }}>Keyboard shortcuts</div>
              {[
                ["Space", "Spin wheel (in projector mode)"],
                ["U", "Undo last pick"],
                ["M", "Toggle sound mute"],
                ["?", "Show / hide shortcuts"],
                ["Esc", "Close projector / overlays"],
              ].map(([key, desc]) => (
                <div key={key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{desc}</span>
                  <kbd style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 6, padding: "2px 8px", fontSize: 11, color: "#fff", fontFamily: "inherit" }}>{key}</kbd>
                </div>
              ))}
            </div>
          )}

          {/* Teams mode panel */}
          <div style={{ width: "100%", maxWidth: 420 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
              <button onClick={generateTeams} style={{ padding: "7px 14px", borderRadius: 8, background: "rgba(106,100,255,0.15)", border: "1px solid rgba(106,100,255,0.3)", color: "#a29bfe", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                👥 Make teams
              </button>
              <input type="range" min={2} max={Math.max(2, Math.floor((activeClass?.students.filter(s=>!s.absent).length||4)/2))} value={teamCount} onChange={e => setTeamCount(Number(e.target.value))} style={{ flex: 1 }} />
              <span style={{ fontSize: 12, color: "#a29bfe", minWidth: 48, fontWeight: 600 }}>{teamCount} teams</span>
            </div>
            {showTeams && teams.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(teamCount, 3)}, 1fr)`, gap: 8 }}>
                {teams.map((team, ti) => (
                  <div key={ti} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "10px 12px" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: COLORS[(ti * 2) % COLORS.length], marginBottom: 6, letterSpacing: "0.08em" }}>TEAM {ti + 1}</div>
                    {team.map(s => (
                      <div key={s.id} style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", padding: "2px 0" }}>{s.name}</div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {showHistory && history.length > 0 && (
            <div style={{ width: "100%", maxWidth: 380, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 8, letterSpacing: "0.08em" }}>RECENT PICKS</div>
              {history.slice(0, 8).map((h, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: i < 7 ? "1px solid rgba(255,255,255,0.05)" : "none", fontSize: 13 }}>
                  <span style={{ fontWeight: 600, color: i === 0 ? "#a29bfe" : "rgba(255,255,255,0.6)" }}>{h.name}</span>
                  <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 11 }}>{h.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: isMobile ? 16 : 20, padding: isMobile ? 14 : 20, position: isMobile ? "static" : "sticky", top: 16, maxHeight: isMobile ? "none" : "calc(100vh - 80px)", overflowY: isMobile ? "visible" : "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: isMobile && !showRoster ? 0 : 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {isMobile && (
                <button onClick={() => setShowRoster(v => !v)} style={{ background: "none", border: "none", color: "#a29bfe", fontSize: 18, cursor: "pointer", padding: "0 2px" }}>
                  {showRoster ? "▲" : "▼"}
                </button>
              )}
              <div>
              {editingClass === activeClassId ? (
                <input autoFocus defaultValue={activeClass?.name}
                  onBlur={e => { const v = e.target.value.trim(); if (v) updateClass(activeClassId, c => ({ ...c, name: v })); setEditingClass(null); }}
                  onKeyDown={e => e.key === "Enter" && e.target.blur()}
                  style={{ background: "transparent", border: "none", borderBottom: "1px solid #6a64ff", color: "#fff", fontSize: 16, fontWeight: 700, fontFamily: "inherit", outline: "none", width: 160 }} />
              ) : (
                <span onClick={() => setEditingClass(activeClassId)} style={{ fontSize: 16, fontWeight: 700, cursor: "pointer" }} title="Click to rename">
                  {activeClass?.name} ✏️
                </span>
              )}
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{activeClass?.students.length || 0} students</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {activeClass?.students.length > 0 && (
                <button onClick={clearAllStudents} title="Remove all students from this class" style={{ padding: "6px 12px", borderRadius: 8, background: "rgba(220,38,38,0.12)", border: "1px solid rgba(220,38,38,0.3)", color: "#fca5a5", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>🗑 Clear all</button>
              )}
              <button onClick={() => setShowPaste(v => !v)} style={{ padding: "6px 12px", borderRadius: 8, background: "rgba(106,100,255,0.15)", border: "1px solid rgba(106,100,255,0.3)", color: "#a29bfe", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>📋 Import</button>
            </div>
          </div>

          {(!isMobile || showRoster) && showPaste && (
            <div style={{ marginBottom: 14, padding: 12, background: "rgba(106,100,255,0.1)", borderRadius: 12 }}>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>Paste names — one per line or comma-separated. Replaces current list.</div>
              <textarea value={pasteText} onChange={e => setPasteText(e.target.value)} placeholder={"Emma\nLiam\nOlivia\nNoah..."} rows={5} style={{ width: "100%", padding: "8px 10px", borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: 13, fontFamily: "inherit", resize: "vertical", outline: "none", boxSizing: "border-box" }} />
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button onClick={importPaste} style={{ flex: 1, padding: "8px", borderRadius: 8, background: "#6a64ff", color: "#fff", border: "none", fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}>Import Names</button>
                <button onClick={() => setShowPaste(false)} style={{ padding: "8px 12px", borderRadius: 8, background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}>✕</button>
              </div>
            </div>
          )}

          {(!isMobile || showRoster) && (
            <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
              <input value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === "Enter" && addStudent()} placeholder="Add student name…" style={{ flex: 1, padding: isMobile ? "12px 14px" : "9px 12px", borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", fontSize: isMobile ? 16 : 13, fontFamily: "inherit", outline: "none" }} />
              <button onClick={addStudent} style={{ padding: "9px 14px", borderRadius: 8, background: "#6a64ff", color: "#fff", border: "none", fontWeight: 700, cursor: "pointer", fontSize: 18, lineHeight: 1, fontFamily: "inherit" }}>+</button>
            </div>
          )}

          {(!isMobile || showRoster) && (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {(activeClass?.students || []).map((s, i) => (
                <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: isMobile ? "9px 10px" : "7px 10px", borderRadius: 10, background: s.absent ? "rgba(255,255,255,0.02)" : s.picked ? "rgba(106,100,255,0.08)" : "rgba(255,255,255,0.04)", border: `1px solid ${s.absent ? "rgba(255,255,255,0.04)" : s.picked ? "rgba(106,100,255,0.2)" : "rgba(255,255,255,0.07)"}`, opacity: s.absent ? 0.4 : 1, transition: "all 0.2s" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, background: s.absent ? "#636e72" : COLORS[i % COLORS.length] }} />
                  {editingStudent === s.id ? (
                    <input autoFocus defaultValue={s.name}
                      onBlur={e => { const v = e.target.value.trim(); if (v) updateClass(activeClassId, c => ({ ...c, students: c.students.map(st => st.id === s.id ? { ...st, name: v } : st) })); setEditingStudent(null); }}
                      onKeyDown={e => { if (e.key === "Enter") e.target.blur(); if (e.key === "Escape") setEditingStudent(null); }}
                      style={{ flex: 1, background: "transparent", border: "none", borderBottom: "1px solid #6a64ff", color: "#fff", fontSize: isMobile ? 15 : 13, fontFamily: "inherit", outline: "none", padding: "1px 0" }} />
                  ) : (
                    <span onClick={() => setEditingStudent(s.id)} title="Click to edit name" style={{ flex: 1, fontSize: isMobile ? 15 : 13, fontWeight: 500, color: s.absent ? "rgba(255,255,255,0.25)" : s.picked ? "rgba(162,155,254,0.6)" : "rgba(255,255,255,0.9)", textDecoration: s.absent ? "line-through" : s.picked ? "line-through" : "none", cursor: "text" }}>{s.name}</span>
                  )}
                  {s.picked && !s.absent && (<span style={{ fontSize: 13, color: "#a29bfe", fontWeight: 700, marginRight: 2 }}>✓</span>)}
                  <button onClick={() => toggleAbsent(s.id)} title={s.absent ? "Mark present" : "Mark absent"} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, opacity: 0.55, padding: "4px 6px", color: "rgba(255,255,255,0.6)", minWidth: 32, minHeight: 32 }}>{s.absent ? "👁" : "🚫"}</button>
                  <button onClick={() => removeStudent(s.id)} title="Remove" style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, opacity: 0.45, padding: "4px 6px", color: "rgba(255,255,255,0.6)", minWidth: 32, minHeight: 32 }}>✕</button>
                </div>
              ))}
              {activeClass?.students.length === 0 && (
                <div style={{ textAlign: "center", padding: "24px 0", color: "rgba(255,255,255,0.25)", fontSize: 13 }}>Add students above or use Import to paste a class list</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* PROJECTOR MODE OVERLAY */}
      {projector && (
        <div ref={projectorRef} style={{
          position: "absolute", top: 0, left: 0, right: 0, minHeight: "100%", zIndex: 9999,
          background: "#080810",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: 0,
          fontFamily: "'DM Sans','Segoe UI',sans-serif"
        }}>
          {/* Top bar */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "16px 28px",
            background: "rgba(255,255,255,0.03)",
            borderBottom: "1px solid rgba(255,255,255,0.06)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 22 }}>🎡</span>
              <span style={{ fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: "-0.5px" }}>
                {activeClass?.name}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ display: "flex", gap: 20 }}>
                {[{ label: "Present", value: present.length, color: "#00b894" },
                  { label: "Picked", value: pickedCount, color: "#a29bfe" },
                  { label: "Left", value: noRepeat ? Math.max(0, present.length - pickedCount) : "—", color: "#fd79a8" }
                ].map(s => (
                  <div key={s.label} style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 26, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <button onClick={toggleProjector} style={{
                padding: "8px 16px", borderRadius: 8, background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.5)",
                fontSize: 13, cursor: "pointer", fontFamily: "inherit"
              }}>✕ Exit  <span style={{ fontSize: 11, opacity: 0.5 }}>ESC</span></button>
            </div>
          </div>

          {/* Winner display */}
          <div style={{
            position: "absolute", top: 80,
            width: "100%", textAlign: "center",
            minHeight: 110,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
          }}>
            {winner && !spinning && countdown === null && (
              <div style={{ animation: "fadeIn 0.4s ease" }}>
                <div style={{ fontSize: 15, letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)", fontWeight: 600, marginBottom: 8 }}>PICKED</div>
                <div style={{
                  fontSize: "clamp(48px, 8vw, 96px)", fontWeight: 800,
                  color: "#fff", letterSpacing: "-2px", lineHeight: 1,
                  textShadow: "0 0 60px rgba(162,155,254,0.6)"
                }}>{winner.name}</div>
              </div>
            )}
            {celebrateRound && (
              <div style={{ animation: "fadeIn 0.3s ease", textAlign: "center" }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>🎉</div>
                <div style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 800, color: "#00b894" }}>
                  Everyone picked! New round starting…
                </div>
              </div>
            )}
          </div>

          {/* Main content row: wheel + roster */}
          <div style={{
            display: "flex", alignItems: "flex-start", justifyContent: "center",
            gap: 32, marginTop: 60, width: "100%", padding: "0 24px", flexWrap: "wrap"
          }}>

          {/* Main wheel area */}
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: 32
          }}>
            {countdown !== null ? (
              <CountdownOverlay countdown={countdown} studentName={lastStudent?.name} size={460} />
            ) : (
              <div style={{ position: "relative" }}>
                {isLastOne && !spinning && (
                  <div style={{ position: "absolute", top: -48, left: "50%", transform: "translateX(-50%)", background: "rgba(253,121,168,0.15)", border: "1px solid rgba(253,121,168,0.4)", borderRadius: 99, padding: "6px 20px", fontSize: 15, fontWeight: 700, color: "#fd79a8", whiteSpace: "nowrap", zIndex: 5 }}>
                    👀 Last student remaining
                  </div>
                )}
                <WheelCanvas
                  key={`proj-${activeClassId}-${wheelKey}`}
                  names={eligibleStudents.map(s => s.name)}
                  spinning={spinning}
                  onSpinEnd={handleSpinEnd}
                  highlightIndex={highlightIndex}
                  size={460}
                />
              </div>
            )}

            {/* Spin button - big for projector */}
            <button onClick={handleSpin} disabled={isDisabled} style={{
              width: "min(340px, 70vw)", height: 72, borderRadius: 999,
              background: isDisabled ? "rgba(255,255,255,0.08)"
                : isLastOne ? "linear-gradient(135deg, #e17055, #fd79a8)"
                : "linear-gradient(135deg, #6a64ff, #fd79a8)",
              border: "none", color: "#fff",
              fontSize: isLastOne ? 18 : 24,
              fontWeight: 800, cursor: isDisabled ? "not-allowed" : "pointer",
              letterSpacing: isLastOne ? 0 : "-0.5px", fontFamily: "inherit",
              boxShadow: isDisabled ? "none" : "0 12px 40px rgba(106,100,255,0.55)",
              transition: "all 0.2s"
            }}>
              {spinning ? "Spinning…"
                : countdown !== null ? "⏳ Revealing..."
                : eligibleStudents.length === 0 ? "All Picked! ✓"
                : isLastOne ? "🎭 Reveal last student"
                : "SPIN"}
            </button>

            {/* Controls row in projector */}
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
              <button onClick={() => setNoRepeat(v => !v)} style={{ padding: "10px 20px", borderRadius: 8, background: noRepeat ? "rgba(0,184,148,0.2)" : "rgba(255,255,255,0.05)", border: `1px solid ${noRepeat ? "rgba(0,184,148,0.5)" : "rgba(255,255,255,0.1)"}`, color: noRepeat ? "#00b894" : "rgba(255,255,255,0.4)", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                {noRepeat ? "✓ No-Repeat ON" : "No-Repeat OFF"}
              </button>
              {noRepeat && pickedCount > 0 && (
                <button onClick={resetRound} style={{ padding: "10px 20px", borderRadius: 8, background: "rgba(253,121,168,0.1)", border: "1px solid rgba(253,121,168,0.3)", color: "#fd79a8", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
                  ↺ New Round
                </button>
              )}
            </div>
          </div>

          {/* Roster panel */}
          <div style={{ width: 280, maxWidth: "90vw", maxHeight: "min(640px, 75vh)", overflowY: "auto", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "16px 18px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.15em", marginBottom: 10 }}>ROSTER</div>
            {(activeClass?.students || []).map((s, i) => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", flexShrink: 0, background: s.absent ? "#636e72" : COLORS[i % COLORS.length] }} />
                <span style={{ flex: 1, fontSize: 16, fontWeight: 500, color: s.absent ? "rgba(255,255,255,0.25)" : s.picked ? "rgba(162,155,254,0.6)" : "rgba(255,255,255,0.85)", textDecoration: (s.absent || s.picked) ? "line-through" : "none" }}>{s.name}</span>
                {s.picked && !s.absent && (<span style={{ fontSize: 14, color: "#a29bfe", fontWeight: 700 }}>✓</span>)}
                {s.absent && (<span style={{ fontSize: 13, opacity: 0.5 }}>🚫</span>)}
              </div>
            ))}
            {(!activeClass?.students || activeClass.students.length === 0) && (
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.25)", padding: "12px 0" }}>No students added yet</div>
            )}
          </div>

          </div>

          {/* Bottom hint */}
          <div style={{
            position: "absolute", bottom: 16,
            fontSize: 12, color: "rgba(255,255,255,0.2)",
            letterSpacing: "0.05em"
          }}>
            SPACE to spin  •  ESC to exit
          </div>
        </div>
      )}

      {!projector && (
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "56px 24px 72px", fontFamily: "'DM Sans','Segoe UI',sans-serif", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "rgba(255,255,255,0.75)", marginBottom: 12, letterSpacing: "-0.5px" }}>
            Free Classroom Spin Wheel for Teachers
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: "rgba(255,255,255,0.4)", marginBottom: 40, maxWidth: 680 }}>
            ClassroomWheel is a free random student picker built for teachers. Spin the wheel to call on students fairly,
            save multiple class rosters, and display everything full-screen on your smartboard or projector — no account needed.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 28, marginBottom: 40 }}>
            {[
              { title: "No-Repeat Mode", body: "Students are removed from the wheel after being picked, so everyone gets a turn before anyone repeats." },
              { title: "Save Multiple Classes", body: "Create a separate roster for each class period. Data stays in your browser — nothing ever leaves your device." },
              { title: "Projector Mode", body: "One click puts the wheel full-screen on your smartboard. Press Space to spin without touching your keyboard." },
              { title: "No Signup Required", body: "Open the site and start spinning immediately. Free forever, no account or installation needed." },
            ].map(({ title, body }) => (
              <div key={title}>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: "rgba(255,255,255,0.55)", marginBottom: 6, marginTop: 0 }}>{title}</h2>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: "rgba(255,255,255,0.3)", margin: 0 }}>{body}</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.7, color: "rgba(255,255,255,0.25)", maxWidth: 680, margin: 0 }}>
            Looking for a wheel of names for your classroom? ClassroomWheel lets you build your class list, mark students absent,
            undo a pick, generate random teams, and export pick history as CSV — all free, with no ads until you consent.
          </p>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @media (max-width: 600px) {
          .wheel-left { align-items: center !important; }
          .stats-row { gap: 8px !important; }
          .controls-row { gap: 6px !important; }
        }
        @keyframes fadeIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes winner-reveal { 0% { opacity:0; transform:scale(0.7) translateY(10px); } 70% { transform:scale(1.04) translateY(-2px); } 100% { opacity:1; transform:scale(1) translateY(0); } }
        @keyframes count-pop { 0% { opacity:0; transform:scale(0.3); } 60% { transform:scale(1.2); } 100% { opacity:1; transform:scale(1); } }
        @keyframes pop-in { 0% { opacity:0; transform:scale(0.6) translateY(12px); } 70% { transform:scale(1.06) translateY(-2px); } 100% { opacity:1; transform:scale(1) translateY(0); } }
        @keyframes pulse-ring { 0% { opacity:0.7; transform:scale(0.95); } 50% { opacity:0.25; transform:scale(1.03); } 100% { opacity:0.7; transform:scale(0.95); } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}
