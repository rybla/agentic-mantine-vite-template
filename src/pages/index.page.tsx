import { FilterableList } from "@/components/FilterableList";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { LoadingBar } from "@/components/LoadingBar";
import { RandomSamplerWheel } from "@/components/RandomSamplerWheel";
import classes from "@/pages/index.module.css";
import { useState } from "react";

export function IndexPage() {
  const [logs, setLogs] = useState<
    Array<{ id: number; text: string; time: string }>
  >([
    { id: 1, text: "KERNEL SECTOR BOOTED SUCCESSFULLY.", time: "18:15:01" },
    { id: 2, text: "MANTINE CORE STYLES REGISTERED.", time: "18:15:02" },
    { id: 3, text: "DASHBOARD OS_v0.9.1 READY.", time: "18:15:03" },
  ]);

  const [counter, setCounter] = useState(0);

  const addLog = (text: string) => {
    const time = new Date().toTimeString().split(" ")[0] || "00:00:00";
    setLogs((prev) =>
      [...prev, { id: Date.now() + Math.random(), text, time }].slice(-6)
    ); // keep last 6 logs
  };

  const handleSystemAction = (actionName: string) => {
    addLog(`TRIGGERED INSTANCE ACTION: ${actionName}`);
    setCounter((prev) => prev + 1);
  };

  return (
    <div className={classes["page"]}>
      <Header name="index" />

      <Hero
        title={<>{"Agentic Mantine Vite Template"}</>}
        subtitle={
          <>
            <span>
              {"HOST: "}
              <span className={classes["accentSpan"]}>{"STATIC_VITE_V9"}</span>
            </span>{" "}
            <span>
              {"STATUS: "}
              <span
                className={classes["accentSpan"]}
                style={{ color: "var(--mantine-color-green-filled)" }}
              >
                {"ONLINE"}
              </span>{" "}
            </span>
            <span>
              {"ACTIONS: "}
              <span className={classes["accentSpan"]}>{counter} OPS</span>
            </span>
          </>
        }
      />

      {/* DASHBOARD GRID */}
      <div className={classes["dashboardGrid"]}>
        {/* LEFT COLUMN: ACTIVE CONTROL & RANDOM SAMPLER */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* SAMPLER MODULE */}
          <div className={classes["card"]}>
            <div className={classes["cardHeader"]}>
              <span>WHEEL SAMPLER MODULE</span>
              <span style={{ color: "var(--mantine-color-green-filled)" }}>
                ● LIVE
              </span>
            </div>
            <div className={classes["cardBody"]}>
              <RandomSamplerWheel
                options={[
                  "FLUSH_CACHE",
                  "REBOOT",
                  "BOOT_SECTOR",
                  "MAINTENANCE",
                  "RESET_MATRIX",
                  "OVERCLOCK",
                ]}
                onSpinStart={() =>
                  addLog("INITIATED HIGH-VELOCITY SAMPLER SPIN.")
                }
                onSelection={(selected) =>
                  addLog(`SAMPLER COMPLETED. ACTION APPLIED: ${selected}`)
                }
              />
            </div>
          </div>

          {/* ACTIVE LOG PANEL */}
          <div className={classes["card"]}>
            <div className={classes["cardHeader"]}>
              <span>REAL-TIME SYSTEM MESSAGES</span>
              <span style={{ color: "var(--mantine-color-cyan-filled)" }}>
                LOGS
              </span>
            </div>
            <div className={classes["cardBody"]}>
              <div className={classes["consoleLog"]}>
                {logs.map((log) => (
                  <div key={log.id} className={classes["consoleLine"]}>
                    <span className={classes["timestamp"]}>[{log.time}]</span>
                    <span className={classes["text"]}>{log.text}</span>
                  </div>
                ))}
              </div>
              <div className={classes["controlGrid"]}>
                <button
                  type="button"
                  className={classes["secondaryButton"]}
                  onClick={() => handleSystemAction("FLUSH_BUFFERS")}
                >
                  FLUSH BUFFERS
                </button>
                <button
                  type="button"
                  className={classes["secondaryButton"]}
                  onClick={() => handleSystemAction("PING_SERVER")}
                >
                  PING HOST
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE PROGRESS & SYSTEM DIRECTORY */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* LOAD SIMULATOR */}
          <div className={classes["card"]}>
            <div className={classes["cardHeader"]}>
              <span>BUFFER LOADING SIMULATOR</span>
              <span style={{ color: "var(--mantine-color-pink-filled)" }}>
                AUTO
              </span>
            </div>
            <div className={classes["cardBody"]}>
              <LoadingBar
                autoSimulate
                label="STREAMING SECTOR_7_PACKETS"
                speed={100}
                onComplete={() => addLog("SECTOR_7 DATA PACKETS FULLY LOADED.")}
              />
            </div>
          </div>

          {/* DIRECTORY SYSTEM */}
          <div className={classes["card"]}>
            <div className={classes["cardHeader"]}>
              <span>NETWORK SYSTEM DIRECTORY</span>
              <span style={{ color: "var(--mantine-color-yellow-filled)" }}>
                INDEX
              </span>
            </div>
            <div className={classes["cardBody"]}>
              <FilterableList
                items={[
                  "SYSTEM_DIAGNOSTICS.LOG",
                  "USER_ACCESS_KEY.DAT",
                  "SECTOR_7_CONFIGURATION.CFG",
                  "ABOUT_THIS_OS.TXT",
                  "KERNEL_INITIALIZER.SH",
                  "ROOT_PASSWORD_HASH.HEX",
                ]}
                label="FILES_V1"
                placeholder="FILTER SYSTEM SENSORS..."
                onItemSelect={(item) => addLog(`SELECTED SECURE FILE: ${item}`)}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
