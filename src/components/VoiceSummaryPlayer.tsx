import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Square, Sparkles, X, FastForward } from 'lucide-react';
import { LanguageCode } from '../types/health';
import { translations } from '../data/translations';

interface VoiceSummaryPlayerProps {
  language: LanguageCode;
  isOpen: boolean;
  onClose: () => void;
  isSpeaking: boolean;
  setIsSpeaking: (speaking: boolean) => void;
}

export const VoiceSummaryPlayer: React.FC<VoiceSummaryPlayerProps> = ({
  language,
  isOpen,
  onClose,
  isSpeaking,
  setIsSpeaking,
}) => {
  const t = translations[language];
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [speechSupported, setSpeechSupported] = useState(true);

  const speechText = t.audioSpeechText;

  // Language mapping for browser speech synthesis
  const langCodeMap: Record<LanguageCode, string> = {
    en: 'en-IN',
    hi: 'hi-IN',
    kn: 'kn-IN',
    ta: 'ta-IN',
  };

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setSpeechSupported(false);
    }
  }, []);

  const startSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any pending speech

      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.lang = langCodeMap[language] || 'en-IN';
      utterance.rate = playbackRate;

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback simulation for unsupported browsers
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 8000);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  const toggleRate = () => {
    const rates = [1.0, 1.25, 1.5];
    const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length;
    setPlaybackRate(rates[nextIdx]);
    if (isSpeaking) {
      stopSpeaking();
      setTimeout(startSpeaking, 100);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-xl p-5 relative overflow-hidden animate-in slide-in-from-top-4 duration-300">
      {/* Decorative pulse blur */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
            isSpeaking
              ? 'bg-amber-400 text-slate-900 shadow-lg shadow-amber-400/30'
              : 'bg-white/10 text-sky-300 border border-white/20'
          }`}>
            {isSpeaking ? (
              <Volume2 className="w-6 h-6 animate-bounce" />
            ) : (
              <Sparkles className="w-6 h-6" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-sky-400/20 text-sky-300 border border-sky-400/30 px-2 py-0.5 rounded">
                AI Voice Readout
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                Language: {language.toUpperCase()}
              </span>
            </div>
            <h3 className="font-heading font-bold text-base sm:text-lg text-white mt-0.5">
              {t.voiceSummary}
            </h3>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Spoken Text Card */}
      <div className="mt-4 bg-black/40 rounded-xl p-4 border border-white/10 backdrop-blur-md">
        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
          "{speechText}"
        </p>

        {/* Audio Visualizer Waves when speaking */}
        {isSpeaking && (
          <div className="flex items-center justify-center gap-1.5 pt-3">
            {[40, 75, 55, 90, 60, 85, 45, 95, 70, 50, 80, 65].map((height, idx) => (
              <span
                key={idx}
                className="w-1 bg-amber-400 rounded-full animate-pulse transition-all duration-200"
                style={{
                  height: `${height * 0.28}px`,
                  animationDelay: `${idx * 0.08}s`,
                }}
              />
            ))}
            <span className="text-[11px] font-semibold text-amber-300 ml-2">
              {t.playingAudio}
            </span>
          </div>
        )}
      </div>

      {/* Audio Player Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-white/10">
        
        <div className="flex items-center gap-2">
          {!isSpeaking ? (
            <button
              onClick={startSpeaking}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-amber-400/20 transition-all active:scale-95"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>{t.readAloud}</span>
            </button>
          ) : (
            <button
              onClick={stopSpeaking}
              className="bg-red-500 hover:bg-red-600 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-red-500/20 transition-all active:scale-95"
            >
              <Square className="w-4 h-4 fill-white" />
              <span>{t.pauseAudio}</span>
            </button>
          )}

          <button
            onClick={toggleRate}
            className="bg-white/10 hover:bg-white/20 text-slate-200 font-mono text-xs px-2.5 py-2 rounded-xl border border-white/15 flex items-center gap-1 transition-colors"
            title="Change voice playback speed"
          >
            <FastForward className="w-3.5 h-3.5 text-sky-400" />
            <span>{playbackRate}x</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center gap-1">
          <span>Multilingual Natural Neural Voice</span>
        </div>

      </div>
    </div>
  );
};
