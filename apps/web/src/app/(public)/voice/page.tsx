/* eslint-disable */
"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mic, MicOff, ArrowLeft, Volume2, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Polyfill for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function VoiceAssistant() {
  const router = useRouter();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState("Tap the microphone and speak your emergency.");
  const [hasError, setHasError] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Initialize Speech Recognition
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        // Support Hindi, Marathi, English
        recognitionRef.current.lang = "hi-IN"; // Can also dynamically switch

        recognitionRef.current.onresult = (event: any) => {
          const current = event.resultIndex;
          const text = event.results[current][0].transcript;
          setTranscript(text);
          analyzeIntent(text);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setHasError(true);
          setIsListening(false);
          if (event.error === "not-allowed") {
            setFeedback("Microphone access denied. Please enable permissions.");
          } else {
            setFeedback("Could not understand. Please try again or tap SOS.");
          }
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      } else {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setHasError(true);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFeedback("Speech recognition is not supported in this browser. Please use the SOS button.");
      }

      synthRef.current = window.speechSynthesis;
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const speak = (text: string) => {
    if (synthRef.current) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-IN"; // English Indian accent
      utterance.rate = 0.9;
      synthRef.current.speak(utterance);
    }
  };

  const analyzeIntent = (text: string) => {
    const lower = text.toLowerCase();
    
    // Emergency Keywords in Hindi/Marathi/English
    const emergencyKeywords = [
      "emergency", "help", "attack", "gir gaye", "bachao", "madat", 
      "heart", "pain", "accident", "accident zhala", "blood", "fire", 
      "heatstroke", "faint", "behosh"
    ];

    const isEmergency = emergencyKeywords.some(kw => lower.includes(kw));

    if (isEmergency && transcript.length > 5) {
      // If we detect a firm emergency, stop listening and trigger
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      setFeedback("Emergency detected. Dispatching help to your location.");
      speak("Emergency detected. Sending an ambulance to your location now. Please stay calm.");
      
      // Auto redirect to SOS tracking page after a short delay
      setTimeout(() => {
        router.push("/sos");
      }, 3500);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setHasError(false);
      setTranscript("");
      setFeedback("Listening...");
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col bg-ink-950" data-theme="ink">
      <header className="glass sticky top-0 z-30 px-4 py-3 flex items-center justify-between border-b border-ink-800">
        <Link href="/emergency" className="w-9 h-9 rounded-xl bg-ink-900 flex items-center justify-center border border-ink-800">
          <ArrowLeft className="w-5 h-5 text-ink-300" />
        </Link>
        <span className="font-display font-bold text-white text-sm">AI Voice Assistant</span>
        <div className="w-9 h-9 flex items-center justify-center">
          <Volume2 className="w-5 h-5 text-accent-500" />
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 relative overflow-hidden">
        
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
           <div className="w-64 h-64 rounded-full bg-accent-600 blur-[100px] mix-blend-screen" />
           <div className="w-64 h-64 rounded-full bg-primary-600 blur-[100px] mix-blend-screen -ml-32 mt-32" />
        </div>

        <div className="text-center z-10 w-full max-w-sm mb-12">
          <p className="text-sm font-semibold text-accent-400 mb-2 uppercase tracking-widest">
            {isListening ? "Listening Mode Active" : "Standby Mode"}
          </p>
          <h2 className="text-2xl font-display font-bold text-white mb-4 min-h-[64px] transition-all">
            {transcript || "Speak clearly into your microphone."}
          </h2>
          <p className={`text-sm ${hasError ? "text-alert-400" : "text-ink-400"}`}>
            {feedback}
          </p>
        </div>

        {/* Voice Visualizer / Button */}
        <div className="relative z-10 mt-8 mb-16">
          <AnimatePresence>
            {isListening && (
              <>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 bg-accent-500 rounded-full"
                />
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                  className="absolute inset-0 bg-accent-400 rounded-full"
                />
              </>
            )}
          </AnimatePresence>

          <button
            onClick={toggleListening}
            className={`relative w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all
              ${isListening 
                ? "bg-accent-600 text-white shadow-glow-accent" 
                : "bg-ink-900 border border-ink-800 text-ink-300 hover:text-white hover:border-ink-700"
              }`}
          >
            {isListening ? (
              <Mic className="w-10 h-10 animate-pulse" />
            ) : (
              <MicOff className="w-10 h-10" />
            )}
          </button>
        </div>

        {/* Examples */}
        <div className="z-10 w-full max-w-sm p-4 rounded-2xl bg-ink-900 border border-ink-800 flex items-start gap-3">
           <Info className="w-5 h-5 text-ink-500 shrink-0 mt-0.5" />
           <div>
             <p className="text-xs text-ink-300 mb-2">Try saying things like:</p>
             <ul className="text-sm font-semibold text-white space-y-1.5">
               <li>&quot;Emergency, send an ambulance.&quot;</li>
               <li>&quot;Mere papa gir gaye hain.&quot;</li>
               <li>&quot;Accident zhala ahe.&quot;</li>
             </ul>
           </div>
        </div>

      </main>
    </div>
  );
}
