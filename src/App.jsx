/*import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
*/

/*
FRAX - React single-file prototype
This file is a self-contained React component (App.jsx) you can drop into a Vite/CRA project.
It injects minimal CSS at runtime so it looks nice without Tailwind setup. If you prefer Tailwind, follow the README steps below (not repeated here).

Usage (quick):
1) Create a Vite React project:
   npm create vite@latest frax-app -- --template react
   cd frax-app
   npm install
2) Replace src/App.jsx with this file's content.
3) Replace src/main.jsx imports if necessary and run:
   npm run dev

This component implements:
- Inputs for age, sex, weight, height, T-score
- Checkboxes for common risk factors
- Instant simulated calculation for Major fracture & Hip fracture
- Small history/result panel and a Reset button

Note: Calculation is a placeholder formula. Replace with FRAX algorithm if you have access.
*/

import React, { useState, useEffect } from 'react';

export default function App() {
  // form state
  const [age, setAge] = useState(65);
  const [sex, setSex] = useState('female');
  const [weight, setWeight] = useState(51);
  const [height, setHeight] = useState(164);
  const [tScore, setTScore] = useState(-2.74);

  const defaultRiskFlags = {
    previousFracture: false,
    parentHip: false,
    smoking: false,
    glucocorticoids: false,
    ra: false,
    secondaryOsteo: false,
    alcohol3: false,
  };
  const [flags, setFlags] = useState(defaultRiskFlags);

  const [majorRisk, setMajorRisk] = useState(null);
  const [hipRisk, setHipRisk] = useState(null);

  // inject simple CSS so this single-file works standalone
  useEffect(() => {
    const css = `
      :root{--accent:#c85c36;--muted:#6b7280;--panel:#f8fafc}
      *{box-sizing:border-box}
      body,html,#root{height:100%}
      .app-wrap{font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,"Helvetica Neue",Arial;padding:28px;background:#ffffff;min-height:100vh}
      .container{max-width:980px;margin:0 auto}
      .grid{display:grid;grid-template-columns:1fr 360px;gap:24px}
      .card{background:white;border:1px solid #e6e9ee;padding:18px;border-radius:10px;box-shadow:0 6px 18px rgba(12,16,26,0.03)}
      h1{font-weight:700;font-size:26px;margin:0 0 8px}
      label{display:block;font-weight:600;margin-bottom:6px}
      .row{display:flex;gap:8px;align-items:center;margin-bottom:10px}
      input[type="number"], select, .input-text{padding:8px 10px;border-radius:8px;border:1px solid #d1d5db;width:100%}
      .muted{color:var(--muted);font-size:13px}
      .checkbox-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
      .result-big{font-size:28px;font-weight:700;color:var(--accent)}
      .btn{padding:10px 14px;border-radius:8px;border:none;cursor:pointer;font-weight:600}
      .btn-primary{background:var(--accent);color:white}
      .btn-ghost{background:transparent;border:1px solid #e6e9ee}
      .small{font-size:13px}
      @media (max-width:900px){.grid{grid-template-columns:1fr;}.container{padding:0 12px}}
    `;
    const style = document.createElement('style');
    style.setAttribute('data-frax-inline','true');
    style.innerHTML = css;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // helper
  const bmi = () => {
    const h = height > 0 ? height / 100 : 1;
    return +(weight / (h * h)).toFixed(1);
  };

  const riskFactorsCount = () => Object.values(flags).filter(Boolean).length;

  // simulated calc
  const calculate = () => {
    // baseline from age and sex
    const ageFactor = Math.max(0, age - 40) * 0.18; // gives some growth with age
    const sexFactor = sex === 'female' ? 4.2 : 2.6;
    const bmiFactor = bmi() < 20 ? 3.0 : 0; // smaller BMI higher risk
    const tscoreFactor = tScore < -1.0 ? Math.abs(tScore + 1) * 1.6 : 0; // lower Tscore more risk
    const rfCount = riskFactorsCount();

    const raw = ageFactor + sexFactor + bmiFactor + tscoreFactor + rfCount * 2.2;
    const major = Math.min(60, +(raw / 7).toFixed(1));
    const hip = Math.min(30, +(raw / 14).toFixed(1));

    setMajorRisk(major);
    setHipRisk(hip);
  };

  // auto-calc when inputs change (optional) — keep small debounce-like effect
  useEffect(() => {
    // reset results when inputs change
    setMajorRisk(null);
    setHipRisk(null);
  }, [age, sex, weight, height, tScore, flags]);

  const toggleFlag = (name) => {
    setFlags((s) => ({ ...s, [name]: !s[name] }));
  };

  const reset = () => {
    setAge(65);
    setSex('female');
    setWeight(51);
    setHeight(164);
    setTScore(-2.74);
    setFlags(defaultRiskFlags);
    setMajorRisk(null);
    setHipRisk(null);
  };

  return (
    <div className="app-wrap">
      <div className="container">
        <h1>FRAX-like Risk Calculator (Prototype)</h1>
        <p className="muted">輸入下列參數以估算 10 年主要骨折與髖部骨折機率（模擬公式）</p>

        <div className="grid" style={{ marginTop: 18 }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <strong>Questionnaire</strong>
                <span className="muted small">請填入患者基本資料與風險因子</span>
              </div>
              <div className="muted small">Population: Taiwan (Prototype)</div>
            </div>

            <div style={{ display: 'grid', gap: 10 }}>
              <div>
                <label>1. Age (40-90)</label>
                <input type="number" min={40} max={90} value={age} onChange={(e) => setAge(Number(e.target.value))} className="input-text" />
              </div>

              <div>
                <label>2. Sex</label>
                <div className="row">
                  <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input type="radio" name="sex" checked={sex === 'female'} onChange={() => setSex('female')} /> Female
                  </label>
                  <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input type="radio" name="sex" checked={sex === 'male'} onChange={() => setSex('male')} /> Male
                  </label>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div>
                  <label>3. Weight (kg)</label>
                  <input type="number" min={20} max={200} value={weight} onChange={(e) => setWeight(Number(e.target.value))} className="input-text" />
                </div>
                <div>
                  <label>4. Height (cm)</label>
                  <input type="number" min={100} max={230} value={height} onChange={(e) => setHeight(Number(e.target.value))} className="input-text" />
                </div>
              </div>

              <div>
                <label>5. T-score (optional)</label>
                <input type="number" step="0.01" value={tScore} onChange={(e) => setTScore(Number(e.target.value))} className="input-text" />
                <div className="muted small">Example: -2.74 (leave empty for no BMD)</div>
              </div>

              <div>
                <label>Risk factors</label>
                <div className="checkbox-grid">
                  <label><input type="checkbox" checked={flags.previousFracture} onChange={() => toggleFlag('previousFracture')} /> Previous fracture</label>
                  <label><input type="checkbox" checked={flags.parentHip} onChange={() => toggleFlag('parentHip')} /> Parent fractured hip</label>
                  <label><input type="checkbox" checked={flags.smoking} onChange={() => toggleFlag('smoking')} /> Current smoking</label>
                  <label><input type="checkbox" checked={flags.glucocorticoids} onChange={() => toggleFlag('glucocorticoids')} /> Glucocorticoids</label>
                  <label><input type="checkbox" checked={flags.ra} onChange={() => toggleFlag('ra')} /> Rheumatoid arthritis</label>
                  <label><input type="checkbox" checked={flags.secondaryOsteo} onChange={() => toggleFlag('secondaryOsteo')} /> Secondary osteoporosis</label>
                  <label><input type="checkbox" checked={flags.alcohol3} onChange={() => toggleFlag('alcohol3')} /> Alcohol ≥3 units/day</label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button className="btn btn-primary" onClick={calculate}>Calculate</button>
                <button className="btn btn-ghost" onClick={reset}>Reset</button>
                <div style={{ marginLeft: 'auto' }} className="muted small">BMI: {bmi()}</div>
              </div>
            </div>

          </div>

          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div className="muted small">Age: <strong>{age}</strong> &nbsp; BMI: <strong>{bmi()}</strong></div>
                <div className="muted small">T-score: <strong>{tScore}</strong></div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="muted small">Estimated 10-year probability</div>
                <div style={{ marginTop: 8 }}>
                  <div className="small muted">Major osteoporotic</div>
                  <div className="result-big">{majorRisk === null ? '—' : `${majorRisk}%`}</div>
                </div>
                <div style={{ marginTop: 12 }}>
                  <div className="small muted">Hip fracture</div>
                  <div className="result-big">{hipRisk === null ? '—' : `${hipRisk}%`}</div>
                </div>
              </div>
            </div>

            <hr style={{ margin: '12px 0', border: 'none', borderTop: '1px solid #eef2f6' }} />
            <div className="muted small">Risk factors selected: {riskFactorsCount()}</div>
            <div style={{ marginTop: 10 }}>
              <button className="btn btn-primary" onClick={calculate}>Recalculate</button>
              <button className="btn" style={{ marginLeft: 8 }} onClick={() => { navigator.clipboard?.writeText(`Age:${age},BMI:${bmi()},Major:${majorRisk || '—'},Hip:${hipRisk || '—'}`)}}>Copy summary</button>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 20 }} className="card">
          <strong>Notes</strong>
          <p className="muted small">This is a front-end prototype. Calculation is a simplified simulation for demo purposes. To implement official FRAX calculations you need the FRAX algorithm tables / coefficients and potentially a backend to host them. I can help integrate real FRAX logic if you have access.</p>
        </div>

      </div>
    </div>
  );
}

