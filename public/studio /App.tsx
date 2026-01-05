import React, { useState, useRef } from 'react';
import { evolveImage } from './services/geminiService';
import { GenerationStatus, GeneratedImage } from './types';

const App: React.FC = () => {
  const [baseImage, setBaseImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('Cinematic tech lab workspace, professional engineering desk with a clean Mac setup, warm lighting on a dark Louisiana evening, SB logo visible on high-end screens.');
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [results, setResults] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<string>('Ready');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setBaseImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const generate = async () => {
    if (status === GenerationStatus.LOADING) return;
    
    setStatus(GenerationStatus.LOADING);
    setError(null);
    
    // Simulating the pipeline steps for visual feedback
    setCurrentStep('Analyzing Blueprint');
    setTimeout(() => setCurrentStep('Injecting Brand DNA'), 1500);
    setTimeout(() => setCurrentStep('Rendering Infrastructure'), 3000);

    try {
      const imageUrl = await evolveImage(baseImage, prompt);
      setResults(prev => [{ url: imageUrl, prompt, timestamp: Date.now() }, ...prev]);
      setStatus(GenerationStatus.SUCCESS);
      setCurrentStep('Evolution Complete');
    } catch (err: any) {
      setError(err.message || 'Evolution failed.');
      setStatus(GenerationStatus.ERROR);
      setCurrentStep('System Error');
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-gray-200 selection:bg-[#facc15]/30 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-gray-900 pb-8 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 bg-[#facc15] rounded-full animate-pulse"></span>
              <p className="text-[#facc15] font-black text-[10px] tracking-widest uppercase">Tech Lab // Internal Logic v1.2</p>
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight italic">STUDIO CONTROL<span className="text-[#facc15] not-italic">.</span></h1>
          </div>
          
          {/* Brand DNA Cheat Sheet */}
          <div className="flex gap-4 p-3 bg-black/40 rounded-2xl border border-gray-800">
            <div className="flex flex-col items-center gap-1">
              <div className="w-6 h-6 rounded-full bg-[#facc15]"></div>
              <span className="text-[8px] font-bold text-gray-500 uppercase">Gold</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-6 h-6 rounded-full bg-[#800020]"></div>
              <span className="text-[8px] font-bold text-gray-500 uppercase">Burgundy</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-6 h-6 rounded-full bg-[#020617] border border-gray-700"></div>
              <span className="text-[8px] font-bold text-gray-500 uppercase">Midnight</span>
            </div>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Input & Logic */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-[#030a1f]/60 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="text-4xl font-black italic">SB</span>
              </div>
              
              <div className="relative z-10">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-4">01. Blueprint (Upload)</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="group border-2 border-dashed border-gray-800 rounded-3xl aspect-video flex flex-col items-center justify-center cursor-pointer hover:border-[#facc15] transition-all overflow-hidden bg-black/40"
                >
                  {baseImage ? (
                    <img src={baseImage} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="Source" />
                  ) : (
                    <div className="text-center p-4">
                      <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest group-hover:text-[#facc15] transition-colors">Drop Workspace Photo</p>
                    </div>
                  )}
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                </div>

                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-4 mt-10">02. Instructions</label>
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full bg-black/40 border border-gray-800 rounded-2xl p-5 text-xs font-medium focus:ring-1 focus:ring-[#facc15] outline-none h-32 resize-none transition-all text-gray-300"
                />

                <div className="mt-8 space-y-4">
                   <div className="flex items-center justify-between px-1">
                      <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Status: {currentStep}</span>
                      {status === GenerationStatus.LOADING && <span className="w-3 h-3 bg-[#facc15] rounded-full animate-ping"></span>}
                   </div>
                   <button 
                    onClick={generate}
                    disabled={status === GenerationStatus.LOADING}
                    className="w-full bg-[#facc15] text-black font-black py-5 rounded-2xl uppercase tracking-[0.2em] text-[10px] hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-[#facc15]/10 disabled:opacity-50"
                  >
                    Execute Evolution
                  </button>
                </div>
              </div>
            </div>

            {/* Visual Logic Board */}
            <div className="bg-black/20 border border-gray-900 rounded-[2rem] p-6">
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Conceptual Flow</h3>
              <div className="space-y-4 text-[9px] font-bold text-gray-500 uppercase">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${baseImage ? 'bg-green-500' : 'bg-gray-800'}`}></div>
                  <span>Source Loaded</span>
                </div>
                <div className="w-px h-4 bg-gray-800 ml-1"></div>
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${status === GenerationStatus.LOADING ? 'bg-[#facc15] animate-pulse' : 'bg-gray-800'}`}></div>
                  <span>Injecting Brand DNA</span>
                </div>
                <div className="w-px h-4 bg-gray-800 ml-1"></div>
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${results.length > 0 ? 'bg-green-500' : 'bg-gray-800'}`}></div>
                  <span>Asset Stabilized</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Column: Results */}
          <section className="lg:col-span-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">03. High-Performance Output</h2>
              <div className="h-px flex-1 mx-6 bg-gray-900"></div>
              <span className="text-[10px] font-bold text-[#facc15] tracking-widest uppercase">{results.length} Revisions</span>
            </div>

            {results.length > 0 ? (
              <div className="grid grid-cols-1 gap-12">
                {results.map((res, i) => (
                  <div key={i} className="group bg-[#030a1f] p-4 rounded-[2.5rem] border border-white/5 animate-in slide-in-from-bottom-4 duration-500 shadow-3xl">
                    <div className="aspect-[1.91/1] rounded-[2rem] overflow-hidden border border-gray-900 shadow-inner mb-6 relative">
                      <img src={res.url} className="w-full h-full object-cover" alt="Result" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-10">
                         <div className="max-w-xl">
                            <p className="text-[10px] text-[#facc15] font-black uppercase tracking-[0.2em] mb-2">Intent:</p>
                            <p className="text-sm text-gray-300 font-medium italic leading-relaxed">"{res.prompt}"</p>
                         </div>
                      </div>
                    </div>
                    <div className="px-6 pb-4 flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Asset ID</span>
                          <span className="text-xs font-bold text-white">SB-LAB-OG-00{results.length - i}</span>
                        </div>
                        <div className="w-px h-8 bg-gray-800"></div>
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1">Timestamp</span>
                          <span className="text-xs font-bold text-gray-400">{new Date(res.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = res.url;
                          link.download = `SB_TechLab_OG_Revision_${results.length - i}.png`;
                          link.click();
                        }}
                        className="bg-white/5 hover:bg-[#facc15] hover:text-black text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                      >
                        Export Asset
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[500px] border border-gray-900 rounded-[3rem] border-dashed flex flex-col items-center justify-center text-gray-700 bg-black/10">
                 <div className="w-16 h-16 mb-8 relative">
                    <div className="absolute inset-0 border border-[#facc15]/20 rounded-full animate-ping"></div>
                    <div className="absolute inset-2 border-2 border-gray-800 rounded-full"></div>
                    <div className="absolute inset-4 border border-gray-800 rounded-full flex items-center justify-center">
                       <span className="text-[#facc15] text-[8px] font-black">AI</span>
                    </div>
                 </div>
                 <p className="text-[10px] font-black uppercase tracking-[0.3em]">Execution Engine Standby</p>
                 <p className="text-[9px] mt-4 text-gray-800 max-w-xs text-center leading-loose">
                    Upload a reference photo to begin the brand evolution process.
                 </p>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default App;
