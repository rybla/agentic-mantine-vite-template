import { Header } from "@/components/Header";
import classes from "@/pages/about.module.css";
import { useMantineColorScheme } from "@mantine/core";
import { useEffect, useRef, useState } from "react";

interface LogLine {
  id: number;
  time: string;
  text: string;
}

export function AboutPage() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const [logs, setLogs] = useState<LogLine[]>([
    { id: 1, time: "18:15:20", text: "DIAGNOSTIC UNIT ONLINE." },
    { id: 2, time: "18:15:21", text: "AWAITING COLD-START INITIATION..." },
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const logIndexRef = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const diagnosticSequences = [
    "LOADING MEMORY SECTORS 0x00F8 - 0x1EAF...",
    "CHECKING COBALT MEMORY REGISTER STACKS [OK]",
    "VALIDATING PENCIL-THIN RETRO BORDERS [OK]",
    "CALCULATING SOLID OFFSET DROP-SHADOW MATRICES [OK]",
    "MEASURING HIGH-CONTRAST PALETTE FREQUENCIES [OK]",
    "TESTING GRITTY JITTER CORE FREQUENCY [OK]",
    "ANALYZING SCANLINE phosphor DECAY RATES [OK]",
    "DIAGNOSTICS COMPLETE. STATUS: OPERATIONAL.",
  ];

  const triggerDiagnostic = () => {
    if (isRunning) return;
    setIsRunning(true);
    logIndexRef.current = 0;

    // Flush to start
    const startTime = new Date().toTimeString().split(" ")[0] || "00:00:00";
    setLogs([
      {
        id: Date.now(),
        time: startTime,
        text: "INITIATING DIAGNOSTIC SEQUENCE...",
      },
    ]);

    intervalRef.current = setInterval(() => {
      const currentIdx = logIndexRef.current;
      if (currentIdx >= diagnosticSequences.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setIsRunning(false);
        return;
      }

      const logText = diagnosticSequences[currentIdx]!;
      const time = new Date().toTimeString().split(" ")[0] || "00:00:00";
      setLogs((prev) => [
        ...prev,
        { id: Date.now() + Math.random(), time, text: logText },
      ]);

      logIndexRef.current += 1;
    }, 600); // realistic slow console streaming
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className={classes["page"]}>
      <Header />

      {/* SYSTEM HERO */}
      <section className={classes["hero"]}>
        <div className={classes["scanlineOverlay"]} />
        <h1 className={classes["title"]}>SYSTEM DIRECTORY & MANUAL</h1>
        <div className={classes["heroSubtitle"]}>
          <span>DIRECTORY ARCHIVE // SECTOR_902</span>
        </div>
      </section>

      {/* LAYOUT GRID */}
      <div className={classes["layoutGrid"]}>
        {/* SPECIFICATIONS CARD */}
        <div className={classes["card"]}>
          <div className={classes["cardHeader"]}>
            <span>ARCHITECTURE SPECIFICATIONS</span>
            <span style={{ color: "#00ffff" }}>SYSTEM_INFO</span>
          </div>
          <div className={classes["cardBody"]}>
            <div className={classes["specRow"]}>
              <span className={classes["specName"]}>OS VERSION</span>
              <span className={classes["specValue"]}>
                MANTINE_BRUTALIST_v0.9.1
              </span>
            </div>
            <div className={classes["specRow"]}>
              <span className={classes["specName"]}>CPU CORES</span>
              <span className={classes["specValue"]}>
                Z-80 HYBRID (VIRTUALIZED)
              </span>
            </div>
            <div className={classes["specRow"]}>
              <span className={classes["specName"]}>RAM ALLOCATION</span>
              <span className={classes["specValue"]}>64 KB COBALT</span>
            </div>
            <div className={classes["specRow"]}>
              <span className={classes["specName"]}>UI ENGINE</span>
              <span className={classes["specValue"]}>MANTINE v9.4.0</span>
            </div>
            <div className={classes["specRow"]}>
              <span className={classes["specName"]}>COMPILER</span>
              <span className={classes["specValue"]}>VITE v8 & ESBUILD</span>
            </div>
            <div className={classes["specRow"]}>
              <span className={classes["specName"]}>PREPROCESSOR</span>
              <span className={classes["specValue"]}>POSTCSS v8</span>
            </div>
          </div>
        </div>

        {/* GUIDELINES CARD */}
        <div className={classes["card"]}>
          <div className={classes["cardHeader"]}>
            <span>VISUAL DESIGN ARCHITECTURE</span>
            <span style={{ color: "#39ff14" }}>RULES</span>
          </div>
          <div className={classes["cardBody"]}>
            <div className={classes["guideList"]}>
              <div className={classes["guideItem"]}>
                <div className={classes["guideTitle"]}>
                  <span className={classes["guideBadge"]}>01</span>
                  <span>MINIMALIST</span>
                </div>
                <div className={classes["guideText"]}>
                  High-density monospace layout, omitting all excessive visual
                  noise. Text and clean layout boxes represent structured
                  sectors.
                </div>
              </div>

              <div className={classes["guideItem"]}>
                <div className={classes["guideTitle"]}>
                  <span className={classes["guideBadge"]}>02</span>
                  <span>HIGH-CONTRAST ACCENTS</span>
                </div>
                <div className={classes["guideText"]}>
                  Pure neon green (#39FF14), pink (#FF007F), yellow (#FFFF00),
                  and cyan (#00FFFF) define system active states and focus
                  borders.
                </div>
              </div>

              <div className={classes["guideItem"]}>
                <div className={classes["guideTitle"]}>
                  <span className={classes["guideBadge"]}>03</span>
                  <span>PENCIL-THIN BORDERS</span>
                </div>
                <div className={classes["guideText"]}>
                  Demarcations are constructed using sharp, solid, 1-pixel black
                  borders in light mode and white borders in dark mode.
                </div>
              </div>

              <div className={classes["guideItem"]}>
                <div className={classes["guideTitle"]}>
                  <span className={classes["guideBadge"]}>04</span>
                  <span>SOLID OFFSET DROP-SHADOWS</span>
                </div>
                <div className={classes["guideText"]}>
                  Objects use unblurred, solid black/white directional shadows
                  offset by exactly 4px, giving elements physical presence.
                </div>
              </div>

              <div className={classes["guideItem"]}>
                <div className={classes["guideTitle"]}>
                  <span className={classes["guideBadge"]}>05</span>
                  <span>GRITTY ANIMATIONS</span>
                </div>
                <div className={classes["guideText"]}>
                  Quantized keyframe motions (steps(2)), phosphor CRT line
                  sweepings, and high-frequency jitters mimic physical
                  machinery.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DIAGNOSTIC PANEL CARD */}
      <div className={classes["card"]}>
        <div className={classes["cardHeader"]}>
          <span>STATEFUL HARDWARE TESTING LAB</span>
          <span style={{ color: "#ffff00" }}>DIAG_v1</span>
        </div>
        <div className={classes["cardBody"]}>
          <div className={classes["consoleLog"]}>
            {logs.map((log) => (
              <div key={log.id} className={classes["consoleLine"]}>
                <span className={classes["timestamp"]}>[{log.time}]</span>
                <span
                  className={
                    isRunning && log.text.includes("...")
                      ? classes["activeLog"]
                      : ""
                  }
                >
                  {log.text}
                </span>
              </div>
            ))}
          </div>
          <button
            type="button"
            className={classes["accentButton"]}
            onClick={triggerDiagnostic}
            disabled={isRunning}
          >
            {isRunning ? "DIAGNOSTIC ACTIVE..." : "RUN FULL DIAGNOSTIC SCAN"}
          </button>
        </div>
      </div>

      {/* FOOTER */}
      <footer className={classes["footer"]}>
        <span>STYLING ENGINE: NEO_BRUTALIST_v2.6</span>
        <button
          type="button"
          className={classes["colorToggle"]}
          onClick={() => toggleColorScheme()}
        >
          THEME: {colorScheme.toUpperCase()}
        </button>
      </footer>
    </div>
  );
}
