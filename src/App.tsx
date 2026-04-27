import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Settings, Type, MoveVertical, X } from 'lucide-react';

const App = () => {
  const [step, setStep] = useState<'intro' | 'setup' | 'play'>('intro');
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState(60);
  const [speed, setSpeed] = useState(5);
  const [isPlaying, setIsPlaying] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();

  // 인트로 타이핑 효과 자동 종료
  useEffect(() => {
    if (step === 'intro') {
      const timer = setTimeout(() => setStep('setup'), 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // 오토 스크롤 로직
  const scroll = () => {
    if (scrollRef.current && isPlaying) {
      scrollRef.current.scrollTop += speed / 2;
      requestRef.current = requestAnimationFrame(scroll);
    }
  };

  useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(scroll);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, speed]);

  // 스페이스바 제어
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && step === 'play') {
        e.preventDefault();
        setIsPlaying(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30">
      <AnimatePresence mode="wait">
        
        {/* STEP 1: INTRO ANIMATION */}
        {step === 'intro' && (
          <motion.div 
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            className="fixed inset-0 flex items-center justify-center bg-black z-50"
          >
            <motion.div className="text-center">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="overflow-hidden whitespace-nowrap border-r-4 border-blue-500 mx-auto"
              >
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">
                  당신의 발표를 완벽하게
                </h1>
              </motion.div>
              <p className="mt-4 text-blue-400 font-mono tracking-widest opacity-60">PRO BROADCAST SYSTEM v1.0</p>
            </motion.div>
          </motion.div>
        )}

        {/* STEP 2: SETUP UI */}
        {step === 'setup' && (
          <motion.div 
            key="setup"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto p-6 pt-20"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-3 h-8 bg-blue-600 rounded-full animate-pulse" />
              <h2 className="text-3xl font-bold uppercase">스크립트 설정</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-4">
                <label className="block text-sm font-medium text-slate-400">대본 입력 (모든 언어 지원)</label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="여기에 발표할 내용을 입력하세요. 영문, 한글, 일어 등 모든 언어가 가능합니다."
                  className="w-full h-[400px] bg-slate-900 border border-slate-800 rounded-2xl p-6 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none text-lg"
                />
              </div>

              <div className="space-y-8 bg-slate-900/50 p-6 rounded-2xl border border-slate-800/50">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-400 mb-4">
                    <Type size={18} /> 글자 크기: {fontSize}px
                  </label>
                  <input 
                    type="range" min="20" max="150" value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-400 mb-4">
                    <MoveVertical size={18} /> 스크롤 속도: {speed}
                  </label>
                  <input 
                    type="range" min="1" max="20" value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                <button
                  onClick={() => setStep('play')}
                  disabled={!text}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 rounded-xl font-bold flex items-center justify-center gap-2 transition-all group"
                >
                  <Play size={20} className="group-hover:scale-110 transition-transform" />
                  프롬프트 시작
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 3: TELEPROMPTER PLAY MODE */}
        {step === 'play' && (
          <motion.div 
            key="play"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black z-[100] flex flex-col"
          >
            {/* 가이드 라인 (현재 읽는 위치) */}
            <div className="fixed top-1/2 left-0 right-0 h-24 -translate-y-1/2 bg-blue-500/10 border-y border-blue-500/20 pointer-events-none z-10" />
            
            {/* 스크롤 영역 */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-[10%] py-[50vh] no-scrollbar"
              style={{ scrollBehavior: 'auto' }}
            >
              <div 
                style={{ fontSize: `${fontSize}px`, lineHeight: '1.6' }}
                className="font-bold text-center whitespace-pre-wrap break-words"
              >
                {text}
              </div>
            </div>

            {/* 하단 제어 바 */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-slate-900/80 backdrop-blur-xl px-8 py-4 rounded-full border border-white/10 opacity-20 hover:opacity-100 transition-opacity">
              <button onClick={() => {
                if(scrollRef.current) scrollRef.current.scrollTop = 0;
                setIsPlaying(false);
              }} className="p-2 hover:text-blue-400 transition-colors">
                <RotateCcw size={24} />
              </button>
              
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
              >
                {isPlaying ? <Pause size={32} fill="white" /> : <Play size={32} fill="white" className="ml-1" />}
              </button>

              <button onClick={() => {
                setIsPlaying(false);
                setStep('setup');
              }} className="p-2 hover:text-red-400 transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="absolute top-6 right-8 text-slate-500 font-mono text-sm uppercase tracking-widest">
              {isPlaying ? '● On Air' : 'Paused'} | Press Space to Toggle
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default App;