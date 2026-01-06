import React, { useState, useRef, useEffect } from 'react';
import { evolveImage } from './services/geminiService';
import { GenerationStatus, GeneratedImage } from './types';

const App: React.FC = () => {
  const [baseImage, setBaseImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('Cinematic tech lab workspace, professional engineering desk with a clean Mac setup, warm lighting on a dark Louisiana evening, SB logo visible on high-end screens.');
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [results, setResults] = useState<GeneratedImage[]>([]);
  const [logs, setLogs] = useState<string[]>(['> SYSTEM_IDLE: Awaiting operator input...', '> ENCRYPTION: SECURE', '> LOCATION: LOUISIANA_HQ']);
  const [currentStep, setCurrentStep] = useState<string>('Ready');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-15), `> ${new Date().toLocaleTimeString()}: ${msg}`]);
  };

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      addLog(`UPLOADING_BLUEPRINT: ${file.name}`);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBaseImage(reader.result as string);
        addLog('BLUEPRINT_STABILIZED: Ready for evolution.');
      };
      reader.readAsDataURL(file);
    }
  };

  const generate = async () => {
    if (status === GenerationStatus.LOADING) return;
    
    setStatus(GenerationStatus.LOADING);
    addLog('EXECUTION_STARTED: Initiating evolution sequence.');
    
    const pipelineSteps = [
      'ANALYZING_BLUEPRINT_GEOMETRY',
      'INJECTING_BRAND_DNA_V2 (Burgundy/Gold)',
      'ESTABLISHING_LOUISIANA_ATMOSPHERICS',
      'RENDERING_HIGH_PERFORMANCE_INFRASTRUCTURE',
      'FINALIZING_ASSET_STABILIZATION'
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < pipelineSteps.length) {
        setCurrentStep(pipelineSteps[i]);
        addLog(pipelineSteps[i]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 800);

    try {
      const imageUrl = await evolveImage(baseImage, prompt);
      setResults(prev => [{ url: imageUrl, prompt, timestamp: Date.now() }, ...prev]);
      setStatus(GenerationStatus.SUCCESS);
      setCurrentStep('Evolution Complete');
      addLog('DEPLOYMENT_SUCCESSFUL: Asset ready for export.');
    } catch (err: any) {
      setStatus(GenerationStatus.ERROR);
      setCurrentStep('System Error');
      addLog(`CRITICAL_FAILURE: ${err.message}`);
    } finally {
      clearInterval(interval);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-gray-200 selection:bg-[#facc15]/30 font-mono text-xs">
      
      {/* Infrastructure Pulse Bar */}
      <div className="bg-[#facc15] text-black px-4 py-1 flex justify-between items-center font-black tracking-tighter overflow-hidden whitespace-nowrap">
        <div className="flex gap-8 items-center">
          <span className="animate-pulse">● LIVE_INFRASTRUCTURE_PULSE</span>
          <span>UPTIME: 99.9%</span>
          <span>LOC: 31.3070° N, 92.4451° W</span>
          <span className="hidden md:inline">NODE_STatus: OPERATIONAL</span>
        </div>
        <div className="flex gap-4">
          <span>{new Date().toLocaleDateString()}</span>
          <span>S_BIDNESS_TECH_LAB</span>
        </div>
      </div>

      <div className="p-4 md:p-8 max-w-[1600px] mx-auto">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start mb-10 border-b border-gray-900 pb-8 gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-[#facc15] flex items-center justify-center rounded-xl shadow-lg shadow-[#facc15]/20">
              <span className="text-black text-2xl font-black italic">SB</span>
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">
                Studio <span className="text-[#facc15]">Control.</span>
              </h1>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-1">
                Quiet Infrastructure // Veteran-Led Execution
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
             {['BRAND_CORE', 'AI_ENGINE', 'OPS_CENTER'].map(label => (
               <div key={label} className="border border-gray-800 px-4 py-2 rounded-lg bg-black/40">
                  <span className="block text-gray-600 text-[8px] font-black">{label}</span>
                  <span className="text-white font-bold tracking-tight">ONLINE</span>
               </div>
             ))}
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Input Console */}
          <aside className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-black/40 border border-gray-800 rounded-2xl p-6 relative">
              <div className="flex items-center justify-between mb-4">
                 <h2 className="font-black uppercase tracking-widest text-[#facc15]">01_Blueprint</h2>
                 <span className="text-gray-700">IMAGE_V.01</span>
              </div>
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="group border border-gray-800 rounded-xl aspect-video flex flex-col items-center justify-center cursor-pointer hover:border-[#facc15]/50 transition-all overflow-hidden bg-[#020617]"
              >
                {baseImage ? (
                  <img src={baseImage} className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity" alt="Source" />
                ) : (
                  <div className="text-center p-6">
                    <p className="text-gray-600 font-black uppercase tracking-widest group-hover:text-[#facc15] transition-colors">Load Reference File</p>
                  </div>
                )}
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              </div>

              <div className="mt-6">
                <label className="text-gray-600 font-black uppercase tracking-widest block mb-2">02_Mission_Parameters</label>
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full bg-black/60 border border-gray-800 rounded-xl p-4 text-[11px] focus:border-[#facc15] outline-none h-32 resize-none text-gray-400 font-mono"
                  placeholder="Define the visual infrastructure goal..."
                />
              </div>

              <button 
                onClick={generate}
                disabled={status === GenerationStatus.LOADING}
                className="w-full mt-6 bg-[#facc15] text-black font-black py-4 rounded-xl uppercase tracking-[0.2em] hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Execute Deployment
              </button>
            </div>

            {/* Scrolling Terminal Log */}
            <div className="bg-black border border-gray-900 rounded-2xl p-4 h-64 flex flex-col overflow-hidden">
               <h3 className="text-[10px] font-black text-gray-700 uppercase mb-3 flex justify-between">
                 <span>System_Logs</span>
                 <span className="animate-pulse">● REC</span>
               </h3>
               <div className="flex-1 overflow-y-auto space-y-1 font-mono text-[10px] text-gray-500 custom-scrollbar">
                  {logs.map((log, i) => (
                    <div key={i} className={log.includes('SUCCESS') ? 'text-green-500' : log.includes('FAILURE') ? 'text-red-500' : ''}>
                      {log}
                    </div>
                  ))}
                  <div ref={logEndRef} />
               </div>
            </div>
          </aside>

          {/* Right: Output Array */}
          <section className="lg:col-span-8 flex flex-col gap-6">
            <div className="flex items-center gap-4 text-gray-600">
               <span className="font-black uppercase tracking-widest">03_Deployment_Array</span>
               <div className="h-px flex-1 bg-gray-900"></div>
               <span className="font-black uppercase tracking-widest text-[#facc15]">{status}</span>
            </div>

            {results.length > 0 ? (
              <div className="grid grid-cols-1 gap-8">
                {results.map((res, i) => (
                  <div key={i} className="bg-black/20 border border-gray-800 rounded-3xl overflow-hidden group">
                    <div className="aspect-[1.91/1] relative bg-[#020617] p-2">
                       {/* Grid Overlay for "Blueprint" feel */}
                       <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                       
                       <img src={res.url} className="w-full h-full object-cover rounded-2xl border border-gray-900 shadow-2xl relative z-10" alt="Asset" />
                       
                       <div className="absolute top-6 right-6 z-20 flex gap-2">
                          <span className="bg-black/80 backdrop-blur border border-white/10 px-3 py-1 rounded-full text-[9px] font-black uppercase text-white tracking-widest">
                            {new Date(res.timestamp).toLocaleTimeString()}
                          </span>
                       </div>
                    </div>

                    <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-4 bg-black/40 border-t border-gray-900">
                      <div className="flex items-center gap-8">
                        <div className="flex flex-col">
                          <span className="text-gray-600 font-black uppercase mb-1">Asset_Class</span>
                          <span className="text-white font-bold uppercase tracking-tight">OG_IMAGE_1200x630</span>
                        </div>
                        <div className="w-px h-10 bg-gray-800"></div>
                        <div className="flex flex-col">
                          <span className="text-gray-600 font-black uppercase mb-1">Status</span>
                          <span className="text-green-500 font-bold uppercase tracking-tight italic">Verified</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                         <button 
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = res.url;
                            link.download = `SB_TECHLAB_DEPLOY_${results.length - i}.png`;
                            link.click();
                          }}
                          className="bg-white text-black px-8 py-3 rounded-lg font-black uppercase tracking-widest hover:bg-[#facc15] transition-all"
                        >
                          Export_Asset
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 border border-gray-900 border-dashed rounded-[3rem] flex flex-col items-center justify-center p-20 text-center opacity-30">
                 <div className="w-20 h-20 border-2 border-gray-800 rounded-full flex items-center justify-center mb-6 relative">
                    <div className="absolute inset-0 border-t-2 border-[#facc15] rounded-full animate-spin"></div>
                    <span className="text-[#facc15] font-black italic">SB</span>
                 </div>
                 <p className="font-black uppercase tracking-[0.4em] mb-2 text-white">Execution_Engine_Idle</p>
                 <p className="text-xs max-w-sm font-bold uppercase tracking-widest leading-loose">
                   The Tech Lab Studio is ready for deployment. Upload a blueprint to begin infrastructure evolution.
                 </p>
              </div>
            )}
          </section>
        </main>

        <footer className="mt-20 border-t border-gray-900 pt-8 pb-12 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex gap-10">
              <div className="flex flex-col">
                 <span className="text-gray-600 font-black uppercase text-[9px] tracking-widest mb-1 italic">Principles</span>
                 <span className="text-gray-400 font-bold uppercase">Business Done Right</span>
              </div>
              <div className="flex flex-col">
                 <span className="text-gray-600 font-black uppercase text-[9px] tracking-widest mb-1 italic">Motto</span>
                 <span className="text-gray-400 font-bold uppercase italic">Quietly Installed</span>
              </div>
           </div>
           <div className="text-gray-700 font-black uppercase text-[10px] tracking-widest">
              © 2026 Square Bidness Tech Lab // Louisiana Division
           </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
