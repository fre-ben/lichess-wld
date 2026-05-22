import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { getSettings, saveSettings } from "../utils/settings";
import type { Settings } from "../types/settings";
import "./style.css";

function Popup() {
  const [settings, setSettings] = useState<Settings | null>(null);

  useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  if (!settings) return null;

  function handleTimespanChange(value: 6 | 12 | 24) {
    const updated = { ...settings!, timespan: value };
    setSettings(updated);
    saveSettings({ timespan: value });
  }

  function handleWinRateToggle() {
    const updated = { ...settings!, showWinRate: !settings!.showWinRate };
    setSettings(updated);
    saveSettings({ showWinRate: updated.showWinRate });
  }

  return (
    <div className="popup">
      <h1 className="popup-title">Lichess WLD</h1>

      <section className="popup-section">
        <label className="popup-toggle">
          <span className="popup-label">Show Win Rate</span>
          <input
            type="checkbox"
            checked={settings.showWinRate}
            onChange={handleWinRateToggle}
          />
          <span className="toggle-slider" />
        </label>
      </section>

      <section className="popup-section">
        <p className="popup-section-title">Timespan</p>
        <div className="radio-group">
          {([6, 12, 24] as const).map((h) => (
            <label key={h} className="radio-label">
              <input
                type="radio"
                name="timespan"
                value={h}
                checked={settings.timespan === h}
                onChange={() => handleTimespanChange(h)}
              />
              <span>{h}h</span>
            </label>
          ))}
        </div>
      </section>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
);
