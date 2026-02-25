import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleGenAI } from '@google/genai';
import { Waves, Filter, Layers, Zap, AlertTriangle, Biohazard, HeartPulse, Wrench, Network, Terminal, HelpCircle, PowerOff, FlaskConical, Fan, BrainCircuit, X, Loader, ChevronDown, Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ theme, setTheme }) => (
  <button
    onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    className="absolute top-4 right-4 p-2 rounded-full bg-slate-200 dark:bg-slate-700/50 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600/50 transition-colors"
    aria-label="Toggle theme"
  >
    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
  </button>
);

const Gauge = ({ value, min, max, label, unit, severity, isSpoofed = false, theme }) => {
  const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  const angle = (percentage / 100) * 180;
  const cardBgClass = isSpoofed ? 'animate-spoof-flash' : 'bg-slate-100 dark:bg-slate-800/[.5]';
  const holeBgClass = isSpoofed ? 'bg-transparent' : cardBgClass;

  const getFillColor = () => {
    if (isSpoofed) return theme === 'light' ? '#ef4444' : '#f87171';
    switch (severity) {
      case 'critical': return theme === 'light' ? '#dc2626' : '#f87171';
      case 'warning': return theme === 'light' ? '#f59e0b' : '#facc15';
      default: return theme === 'light' ? '#64748b' : '#94a3b8';
    }
  };

  const getGhostFillColor = () => {
    if (isSpoofed) return theme === 'light' ? '#f87171' : '#ef4444';
    switch (severity) {
      case 'critical': return theme === 'light' ? '#f87171' : '#dc2626';
      case 'warning': return theme === 'light' ? '#facc15' : '#f59e0b';
      default: return theme === 'light' ? '#94a3b8' : '#64748b';
    }
  };

  const gaugeStyle = {
    background: `conic-gradient(from 180deg, ${getFillColor()} ${angle}deg, ${theme === 'light' ? '#e2e8f0' : '#334155'} ${angle}deg 180deg)`
  };

  const ghostStyle = {
    background: `conic-gradient(from 180deg, ${getGhostFillColor()} ${angle}deg, transparent ${angle}deg 180deg)`
  };

  return (
    <div className={`p-4 rounded-xl text-center transition-colors duration-300 ${cardBgClass} border border-slate-200/50 dark:border-slate-700/30`}>
      <div className="relative w-40 h-20 mx-auto">
        <div className="absolute inset-0">
          <div className="w-full h-full absolute rounded-t-full opacity-40" style={ghostStyle}></div>
          <div className="w-[85%] h-[85%] absolute top-[7.5%] left-[7.5%] rounded-t-full transition-all" style={gaugeStyle}></div>
          <div className={`w-[65%] h-[65%] absolute top-[17.5%] left-[17.5%] ${holeBgClass} rounded-t-full transition-colors duration-300`}></div>
        </div>
        <div className="relative h-full flex flex-col items-center justify-center pt-2">
          <div>
            <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">{value.toFixed(1)}</span>
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 ml-1">{unit}</span>
          </div>
        </div>
      </div>
      <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider mt-1">{label}</p>
    </div>
  );
};

const AttackerToggle = ({ label, enabled, onChange, disabled }) => (
  <div className="flex items-center justify-between p-2 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg">
    <label className="text-sm font-medium text-red-600 dark:text-red-300">{label}</label>
    <button onClick={onChange} disabled={disabled} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors disabled:opacity-50 ${enabled ? 'bg-red-600' : 'bg-slate-400 dark:bg-slate-600'}`}>
      <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  </div>
);

const ControlSlider = ({ label, value, onChange, min, max, step, unit, disabled = false, severity = 'normal' }) => {
  const severityClasses = { normal: 'slider-normal', warning: 'slider-warning', critical: 'slider-critical' };
  return (
    <div className="my-3 space-y-2">
      <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">{label} <span className="text-sky-500 dark:text-sky-400 font-bold">({value.toFixed(1)}{unit})</span></label>
      <input type="range" min={min} max={max} step={step} value={value} onChange={onChange} disabled={disabled} className={`w-full h-2 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed transition-opacity duration-300 ${severityClasses[severity]}`} />
    </div>
  );
};

const StatusIndicator = ({ label, value, icon, severity, reasoning }) => {
  const severityClasses = {
    normal: 'bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/50',
    warning: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-300 border-yellow-500/50',
    critical: 'bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/50',
  };
  return (
    <div className={`p-3 rounded-lg shadow-lg border-l-4 ${severityClasses[severity]}`}>
      <div className="flex items-center">
        {React.cloneElement(icon, { className: 'w-6 h-6' })}
        <div className="ml-3"><p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{label}</p><p className="text-xs font-medium">{value}</p></div>
      </div>
      {reasoning && <div className="mt-2 pt-2 border-t border-slate-300 dark:border-slate-700 flex items-start text-xs text-slate-600 dark:text-slate-400"><HelpCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" /><span>{reasoning}</span></div>}
    </div>
  );
};

const KaliTerminal = ({ commandHistory }) => {
  const terminalRef = useRef(null);
  useEffect(() => { if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight; }, [commandHistory]);
  return (
    <div className="bg-slate-950 text-white font-mono p-3 rounded-lg h-56 overflow-y-auto text-sm border border-slate-700" ref={terminalRef}>
      <div><span className="text-green-400">root@kali</span><span className="text-gray-400">:</span><span className="text-blue-400">~#</span> ./connect_plc.sh</div>
      <div className="text-gray-300 pl-2 whitespace-pre-wrap">{`Scanning for Modbus services on 10.10.0.0/22...\nPLC found at 10.10.0.15\nEstablishing connection... Success.\nReady to write to registers.`}</div>
      <br />
      {commandHistory.map((item, i) => <div key={i}><span className="text-green-400">root@kali</span><span className="text-gray-400">:</span><span className="text-blue-400">~#</span> {item.cmd}<div className="text-gray-300 pl-2">{item.output}</div></div>)}
      <span className="text-green-400">root@kali</span><span className="text-gray-400">:</span><span className="text-blue-400">~#</span><span className="bg-green-400 w-2 h-4 inline-block animate-pulse ml-1"></span>
    </div>
  );
};

const AnalysisModal = ({ analysis, onClose, isAnalyzing }) => {
  if (!analysis && !isAnalyzing) return null;
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-slate-300 dark:border-slate-700">
          <h3 className="font-bold text-lg text-sky-600 dark:text-sky-400 flex items-center"><BrainCircuit className="mr-2" />AI Incident Analysis</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"><X /></button>
        </header>
        <div className="p-6 overflow-y-auto">
          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400"><Loader className="w-10 h-10 animate-spin mb-4" /><p className="text-lg">Analyzing incident data...</p><p>Gemini is reviewing the final plant state.</p></div>
          ) : (
            <div className="prose prose-sm md:prose-base dark:prose-invert whitespace-pre-wrap text-slate-700 dark:text-slate-300" style={{ '--tw-prose-bold': 'var(--tw-prose-body)' }}>{analysis}</div>
          )}
        </div>
      </div>
    </div>
  );
};

const Accordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);
  return <div className="bg-white/70 dark:bg-slate-800/50 rounded-lg border border-slate-300 dark:border-slate-700"><button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-3 text-left font-semibold text-slate-900 dark:text-slate-100"><span>{title}</span><ChevronDown className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} /></button>{isOpen && <div className="p-3 pt-0">{children}</div>}</div>;
};

const AnimatedPipe = ({ color, flow, horizontal, className = '' }) => <div className={`relative ${horizontal ? 'h-3' : 'w-3'} ${flow ? color : 'bg-slate-500 dark:bg-slate-600'} rounded-full overflow-hidden ${className}`}><div className={`absolute top-0 left-0 w-full h-full ${flow ? 'animate-flow' : ''}`} style={{ backgroundSize: '40px 40px' }}></div></div>;
const DosingUnit = ({ label }) => <div className="flex flex-col items-center space-y-1"><span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase whitespace-nowrap">{label}</span><div className="w-10 h-10 rounded-lg flex items-center justify-center bg-sky-900/50 border-2 border-sky-600 shadow-md"><FlaskConical size={20} className="text-sky-300" /></div></div>;
const PlantComponent = ({ label, icon, health, statusColor, isTripped = false, isProcessing = false, animationType = 'none' }) => {
  const healthColor = health > 80 ? 'border-green-500' : health > 40 ? 'border-yellow-500' : 'border-red-500';
  let processingAnimationClass = '';
  if (isProcessing && !isTripped) processingAnimationClass = animationType === 'spin' ? 'animate-spin-slow' : animationType === 'pulse' ? 'animate-pulse' : animationType === 'pulse-slow' ? 'animate-pulse-slow' : '';
  const processedIcon = React.cloneElement(icon, { className: `${icon.props.className} ${processingAnimationClass}` });
  return <div className="flex flex-col items-center w-24"><div className={`relative w-20 h-20 rounded-lg flex items-center justify-center transition-colors duration-500 border-4 ${healthColor} ${statusColor}`}>{processedIcon}{isTripped && <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center rounded-md text-yellow-400"><PowerOff size={28} className="animate-pulse" /><span className="text-xs font-bold mt-1">TRIPPED</span></div>}<div className="absolute bottom-0 left-0 w-full h-1.5 bg-slate-400 dark:bg-slate-600 rounded-b-md"><div className="h-1.5 bg-green-500 rounded-b-md" style={{ width: `${health}%` }}></div></div></div><span className="text-xs mt-2 font-semibold text-slate-700 dark:text-slate-300 text-center">{label}</span></div>;
};
const TankComponent = ({ label, level, statusColor }) => <div className="flex flex-col items-center w-24"><div className="relative w-20 h-28 bg-slate-300 dark:bg-slate-700 rounded-lg border-4 border-slate-400 dark:border-slate-500 shadow-inner"><div className={`absolute bottom-0 w-full rounded-b-md transition-all duration-500 ${statusColor}`} style={{ height: `${level}%` }}></div><div className="absolute inset-0 flex items-center justify-center"><span className="text-white font-bold text-xl drop-shadow-md">{level.toFixed(0)}%</span></div></div><span className="text-xs mt-2 font-semibold text-slate-700 dark:text-slate-300 text-center">{label}</span></div>;
const Disclaimer = () => <div className="mt-8 p-4 bg-slate-200/50 dark:bg-slate-800/50 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs"><h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center"><AlertTriangle size={16} className="mr-2 text-yellow-500 dark:text-yellow-400" />Important Disclaimer & Simulation Context</h4><p className="mb-2"><strong>Process Simulation:</strong> This simulator is an educational tool designed to demonstrate cyber-physical security principles. Dynamics are intentionally simplified for clarity.</p><p><strong>Security Scenario:</strong> The scenario starts after attacker access to OT controls and focuses on post-exploitation impact.</p></div>;

const App = () => {
  const [theme, setTheme] = useState('dark');
  useEffect(() => { document.documentElement.classList.toggle('dark', theme !== 'light'); }, [theme]);

  const defaultParams = useMemo(() => ({ coagulantDose: 30, preTreatmentPh: 7.0, preChlorineDose: 2.0, antiScalantDose: 5, sbsDose: 2, hppPressure: 70, chlorineResidual: 1.5, finalPh: 7.5 }), []);
  const defaultSpoof = useMemo(() => ({ chlorine: false, ph: false }), []);
  const defaultHealth = useMemo(() => ({ membranes: { health: 100, reasoning: '' }, hpp: { health: 100, reasoning: '' }, pipes: { health: 100, reasoning: '' } }), []);
  const defaultImpact = useMemo(() => ({ waterSafety: { status: 'Safe', reasoning: '' }, personnelSafety: { status: 'Safe', reasoning: '' } }), []);

  const [params, setParams] = useState(defaultParams);
  const [spoof, setSpoof] = useState(defaultSpoof);
  const [assetHealth, setAssetHealth] = useState(defaultHealth);
  const [publicImpact, setPublicImpact] = useState(defaultImpact);
  const [alerts, setAlerts] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [commandHistory, setCommandHistory] = useState([]);
  const [analysis, setAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const paramToRegisterMap = useMemo(() => ({ coagulantDose: 40001, preTreatmentPh: 40003, preChlorineDose: 40005, antiScalantDose: 40007, sbsDose: 40009, hppPressure: 40011, chlorineResidual: 40013, finalPh: 40015 }), []);
  const operatorView = useMemo(() => ({ turbidity: params.coagulantDose < 15 ? 0.5 + (1 - (params.coagulantDose / 15)) * 4.5 : params.coagulantDose > 50 ? 0.2 + ((params.coagulantDose - 50) / 20) * 1.0 : 0.2, hppPressure: params.hppPressure, chlorine: spoof.chlorine ? 1.5 : params.chlorineResidual, ph: spoof.ph ? 7.5 : params.finalPh }), [spoof, params]);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      const newHealth = JSON.parse(JSON.stringify(assetHealth));
      const newImpact = JSON.parse(JSON.stringify(publicImpact));
      const currentAlerts = new Set(alerts);
      const isLowProduction = params.hppPressure < 50;
      Object.keys(newHealth).forEach(k => newHealth[k].reasoning = '');
      Object.keys(newImpact).forEach(k => newImpact[k].reasoning = '');
      if (params.coagulantDose < 15) { newHealth.membranes.health = Math.max(0, newHealth.membranes.health - 2); newHealth.membranes.reasoning += 'Underdosing coagulant causes membrane fouling. '; }
      if (params.preTreatmentPh < 6.0) { newHealth.pipes.health = Math.max(0, newHealth.pipes.health - 1); newHealth.pipes.reasoning += 'Low pH is corrosive to pipes. '; }
      if (params.hppPressure > 85) { newHealth.hpp.health = Math.max(0, newHealth.hpp.health - 2); newHealth.hpp.reasoning += 'Over-pressure stresses pump components. '; }
      if (params.finalPh < 6.5) { newHealth.pipes.health = Math.max(0, newHealth.pipes.health - 0.5); newHealth.pipes.reasoning += 'Acidic water accelerates corrosion. '; }
      newImpact.waterSafety = { status: 'Safe', reasoning: '' };
      if (isLowProduction) newImpact.waterSafety = { status: 'Low Production', reasoning: 'HPP pressure too low for effective production.' };
      else if (params.chlorineResidual < 0.5) newImpact.waterSafety = { status: 'Biological Contamination', reasoning: 'Final disinfection is inadequate.' };
      newImpact.personnelSafety = { status: params.hppPressure > 95 ? 'Explosion Risk' : 'Safe', reasoning: params.hppPressure > 95 ? 'Extreme pressure can cause catastrophic failure.' : '' };
      if (newHealth.membranes.health < 50) currentAlerts.add('CRITICAL: Membrane integrity failing.');
      if (newHealth.hpp.health < 50) currentAlerts.add('CATASTROPHE: HPP failure imminent.');
      if (newHealth.pipes.health < 80) currentAlerts.add('WARNING: Distribution network corrosion detected.');
      setAssetHealth(newHealth); setPublicImpact(newImpact); setAlerts(Array.from(currentAlerts));
    }, 200);
    return () => clearInterval(interval);
  }, [isRunning, params, assetHealth, publicImpact, alerts]);

  const addCommand = (cmd, output) => setCommandHistory(prev => [...prev, { cmd, output }]);
  const handleParamChange = (param, value) => { setParams(p => ({ ...p, [param]: parseFloat(value) })); addCommand(`write_register -a ${paramToRegisterMap[param]} -v ${parseFloat(value).toFixed(2)}`, 'OK'); };
  const handleSpoofChange = (param) => { const next = !spoof[param]; setSpoof(s => ({ ...s, [param]: next })); addCommand(`mitm ${next ? 'start' : 'stop'} ${param}_sensor`, `Spoofing ${next ? 'started' : 'stopped'}.`); };
  const startStopSimulation = () => { if (isRunning) { setIsRunning(false); addCommand('exit', 'Attack scripts terminated.'); } else { setAssetHealth(defaultHealth); setPublicImpact(defaultImpact); setAlerts([]); setParams(defaultParams); setSpoof(defaultSpoof); setCommandHistory([]); setAnalysis(''); setIsRunning(true); } };

  const handleAnalyzeIncident = async () => {
    if (isRunning || isAnalyzing) return;
    setIsAnalyzing(true); setAnalysis('');
    try {
      let apiKey = localStorage.getItem('GEMINI_API_KEY') || '';
      if (!apiKey) {
        apiKey = window.prompt('Enter Gemini API key (stored in local browser storage):') || '';
        if (apiKey) localStorage.setItem('GEMINI_API_KEY', apiKey);
      }
      if (!apiKey) throw new Error('Missing API key');
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Analyze the final state of this RO plant incident and return markdown with Executive Summary, Root Cause, Impact, and Mitigation. Parameters: ${JSON.stringify(params)}. Water: ${publicImpact.waterSafety.status}. Personnel: ${publicImpact.personnelSafety.status}. Alerts: ${alerts.join(' | ') || 'none'}.`;
      const responseStream = await ai.models.generateContentStream({ model: 'gemini-2.5-flash', contents: prompt });
      for await (const chunk of responseStream) setAnalysis(prev => prev + chunk.text);
    } catch (error) {
      console.error('Gemini API call failed:', error);
      setAnalysis('Error: Could not retrieve analysis. Confirm GEMINI_API_KEY and browser network access.');
    } finally { setIsAnalyzing(false); }
  };

  const getWaterColor = (stage) => {
    if (params.hppPressure < 50 && !['intake', 'pre-treatment', 'feed'].includes(stage)) return 'bg-slate-400 dark:bg-slate-500';
    if (stage === 'intake' || stage === 'feed') return 'bg-blue-600';
    if (stage === 'pre-treatment') return params.coagulantDose < 15 ? 'bg-yellow-700' : 'bg-blue-500';
    if (stage === 'post-ro') {
      if (publicImpact.waterSafety.status.includes('Contamination')) return 'bg-red-600';
      if (assetHealth.membranes.health < 50) return 'bg-yellow-600';
    }
    return 'bg-sky-600';
  };
  const getStatusSeverity = (status) => status.includes('Contamination') || status.includes('Explosion') || status.includes('failure') ? 'critical' : status.includes('Risk') || status.includes('corrosion') || status.includes('Low Production') ? 'warning' : 'normal';
  const getParamSeverity = useCallback((param, value) => {
    const v = parseFloat(value);
    if (param === 'hppPressure') return v < 50 || v > 95 ? 'critical' : v < 60 || v > 85 ? 'warning' : 'normal';
    if (param === 'chlorineResidual') return v < 0.5 || v > 3.0 ? 'critical' : v < 1.0 || v > 2.5 ? 'warning' : 'normal';
    if (param === 'finalPh') return v < 6.5 ? 'critical' : v < 7.0 ? 'warning' : 'normal';
    return 'normal';
  }, []);

  const isLowProduction = params.hppPressure < 50;
  const isHppTripped = assetHealth.hpp.health < 20;

  return (
    <div className="min-h-screen font-sans p-4 text-slate-800 dark:text-slate-300">
      <AnalysisModal analysis={analysis} onClose={() => setAnalysis('')} isAnalyzing={isAnalyzing} />
      <div className="max-w-screen-2xl mx-auto">
        <header className="relative text-center mb-6"><h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">DESALINATION PLANT SIMULATOR</h1><p className="text-md text-slate-600 dark:text-slate-400">Advanced Cyber-Physical Attack Scenario Demonstration</p><ThemeToggle theme={theme} setTheme={setTheme} /></header>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col">
            <h3 className="text-xl font-bold text-red-600 dark:text-red-500 mb-4">Attacker's Control Panel</h3>
            <div className="flex-grow space-y-4">
              <Accordion title="Core Controls">
                <ControlSlider label="HPP Pressure" value={params.hppPressure} onChange={(e) => handleParamChange('hppPressure', e.target.value)} min="40" max="100" step="1" unit=" bar" disabled={!isRunning} severity={getParamSeverity('hppPressure', params.hppPressure)} />
                <ControlSlider label="Product Chlorination" value={params.chlorineResidual} onChange={(e) => handleParamChange('chlorineResidual', e.target.value)} min="0" max="5" step="0.1" unit=" ppm" disabled={!isRunning || isLowProduction} severity={getParamSeverity('chlorineResidual', params.chlorineResidual)} />
                <ControlSlider label="Final pH Adjustment" value={params.finalPh} onChange={(e) => handleParamChange('finalPh', e.target.value)} min="5" max="10" step="0.1" unit="" disabled={!isRunning || isLowProduction} severity={getParamSeverity('finalPh', params.finalPh)} />
                <div className="space-y-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700"><h4 className="font-semibold text-slate-800 dark:text-slate-200">Sensor Spoofing (MITM)</h4><AttackerToggle label="Spoof Chlorine Sensor" enabled={spoof.chlorine} onChange={() => handleSpoofChange('chlorine')} disabled={!isRunning} /><AttackerToggle label="Spoof pH Sensor" enabled={spoof.ph} onChange={() => handleSpoofChange('ph')} disabled={!isRunning} /></div>
              </Accordion>
            </div>
            <div className="mt-4"><h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2 flex items-center"><Terminal className="mr-2" />Command Execution</h4><KaliTerminal commandHistory={commandHistory} /></div>
            <div className="flex space-x-2 mt-4"><button onClick={startStopSimulation} className={`w-full text-white font-bold py-3 rounded-lg transition-colors ${isRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}>{isRunning ? 'STOP SIMULATION' : 'START SIMULATION'}</button><button onClick={handleAnalyzeIncident} disabled={isRunning || isAnalyzing} className="w-full flex items-center justify-center bg-sky-600 hover:bg-sky-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors"><BrainCircuit className="mr-2 h-5 w-5" />{isAnalyzing ? 'Analyzing...' : 'Analyze Incident'}</button></div>
          </div>

          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-xl font-bold text-sky-600 dark:text-sky-400 mb-4 text-center">DESALINATION PROCESS</h3>
              <div className="w-full p-4 bg-slate-200/50 dark:bg-slate-900/50 rounded-lg overflow-x-auto"><div className="flex items-center justify-center space-x-2 min-w-[950px] mt-16 mb-4"><PlantComponent label="Seawater Intake" icon={<Waves size={32} className="text-white" />} health={100} statusColor={getWaterColor('intake')} isProcessing={isRunning} animationType="pulse-slow" /><AnimatedPipe horizontal flow={isRunning} color={getWaterColor('intake')} className="flex-1 min-w-8" /><PlantComponent label="Feed Pump" icon={<Fan size={32} className="text-white" />} health={100} statusColor={'bg-slate-500 dark:bg-slate-600'} isProcessing={isRunning} animationType="spin" /><AnimatedPipe horizontal flow={isRunning} color={getWaterColor('feed')} className="flex-1 min-w-8" /><div className="relative"><div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 flex flex-col items-center space-y-1"><div className="flex space-x-2"><DosingUnit label="Coag" /><DosingUnit label="pH" /><DosingUnit label="CHL" /></div><AnimatedPipe flow={isRunning} color={'bg-cyan-500'} horizontal={false} className="h-6" /></div><PlantComponent label="Pre-Treatment" icon={<Filter size={32} className="text-white" />} health={100} statusColor={getWaterColor('pre-treatment')} isProcessing={isRunning} animationType="pulse" /></div><AnimatedPipe horizontal flow={isRunning} color={getWaterColor('pre-treatment')} className="flex-1 min-w-8" /><PlantComponent label="HPP" icon={<Zap size={32} className="text-white" />} health={assetHealth.hpp.health} statusColor={assetHealth.hpp.health < 50 ? 'bg-red-700' : 'bg-slate-500 dark:bg-slate-600'} isProcessing={isRunning && !isLowProduction && !isHppTripped} animationType="pulse" isTripped={isHppTripped} /><AnimatedPipe horizontal flow={isRunning && !isLowProduction} color={getWaterColor('pre-treatment')} className="flex-1 min-w-8" /><PlantComponent label="RO Membranes" icon={<Layers size={32} className="text-white" />} health={assetHealth.membranes.health} statusColor={assetHealth.membranes.health < 50 ? 'bg-red-700' : 'bg-teal-600'} isProcessing={isRunning && !isLowProduction} animationType="pulse-slow" /><AnimatedPipe horizontal flow={isRunning && !isLowProduction} color={getWaterColor('post-ro')} className="flex-1 min-w-8" /><TankComponent label="Product Tank" level={isLowProduction ? 10 : 80} statusColor={getWaterColor('post-ro')} /><AnimatedPipe horizontal flow={isRunning && !isLowProduction} color={getWaterColor('post-ro')} className="flex-1 min-w-8" /><PlantComponent label="Distribution" icon={<Network size={32} className="text-white" />} health={assetHealth.pipes.health} statusColor={getWaterColor('post-ro')} isProcessing={isRunning && !isLowProduction} animationType="pulse-slow" /></div></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6"><h4 className="col-span-full text-center font-semibold text-slate-500 dark:text-slate-400 tracking-wider">Monitored Values (Operator View)</h4><Gauge theme={theme} label="Turbidity" value={operatorView.turbidity} min={0} max={5} unit="NTU" severity={operatorView.turbidity > 1 ? 'critical' : operatorView.turbidity > 0.5 ? 'warning' : 'normal'} /><Gauge theme={theme} label="HPP Pressure" value={operatorView.hppPressure} min={40} max={100} unit="bar" severity={getParamSeverity('hppPressure', operatorView.hppPressure)} /><Gauge theme={theme} label="Chlorine" value={operatorView.chlorine} min={0} max={3} unit="ppm" severity={spoof.chlorine && params.chlorineResidual < 0.5 ? 'critical' : 'normal'} isSpoofed={spoof.chlorine} /><Gauge theme={theme} label="pH Level" value={operatorView.ph} min={5} max={10} unit="" severity={spoof.ph && params.finalPh < 6.5 ? 'critical' : 'normal'} isSpoofed={spoof.ph} /></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-2xl border-t-4 border-red-500"><h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-3">Impact Assessment (Ground Truth)</h3><div className="space-y-3"><StatusIndicator label="Water Safety" value={publicImpact.waterSafety.status} icon={<Biohazard />} severity={getStatusSeverity(publicImpact.waterSafety.status)} reasoning={publicImpact.waterSafety.reasoning} /><StatusIndicator label="Personnel Safety" value={publicImpact.personnelSafety.status} icon={<HeartPulse />} severity={getStatusSeverity(publicImpact.personnelSafety.status)} reasoning={publicImpact.personnelSafety.reasoning} /><StatusIndicator label="HPP Health" value={`${assetHealth.hpp.health.toFixed(0)}%`} icon={<Wrench />} severity={assetHealth.hpp.health < 50 ? 'critical' : assetHealth.hpp.health < 80 ? 'warning' : 'normal'} reasoning={assetHealth.hpp.reasoning} /><StatusIndicator label="Membrane Health" value={`${assetHealth.membranes.health.toFixed(0)}%`} icon={<Layers />} severity={assetHealth.membranes.health < 50 ? 'critical' : assetHealth.membranes.health < 80 ? 'warning' : 'normal'} reasoning={assetHealth.membranes.reasoning} /><StatusIndicator label="Pipe Health" value={`${assetHealth.pipes.health.toFixed(0)}%`} icon={<Network />} severity={assetHealth.pipes.health < 80 ? 'warning' : 'normal'} reasoning={assetHealth.pipes.reasoning} /></div></div>
              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-2xl border-t-4 border-yellow-400"><h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 mb-3 flex items-center"><AlertTriangle className="text-yellow-500 dark:text-yellow-400 mr-2" />Active Alerts</h3><div className="space-y-2 text-sm h-40 overflow-y-auto pr-2">{alerts.length === 0 && <p className="text-slate-500 dark:text-slate-400">No active alerts.</p>}{alerts.map((alert, i) => <p key={i} className={`p-2 rounded-md font-semibold ${alert.includes('WARNING') ? 'text-yellow-700 bg-yellow-500/10 dark:text-yellow-300' : 'text-red-700 bg-red-500/10 dark:text-red-300 animate-pulse'}`}>{alert}</p>)}</div></div>
            </div>
          </div>
        </div>
        <Disclaimer />
      </div>
    </div>
  );
};

const container = document.getElementById('root');
if (container) ReactDOM.createRoot(container).render(<React.StrictMode><App /></React.StrictMode>);
