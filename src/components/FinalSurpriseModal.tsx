import React, { useEffect, useState } from 'react';
import { UNIVERSE_CONFIG } from '../config';
import { sound } from '../utils/audio';

interface FinalSurpriseModalProps {
  onClose: () => void;
}

export const FinalSurpriseModal: React.FC<FinalSurpriseModalProps> = ({ onClose }) => {
  const [step, setStep] = useState<number>(1);
  const { finalSurprise, yourName, herName } = UNIVERSE_CONFIG;

  useEffect(() => {
    sound.playHeartUnlock();
    // After 2.5s, reveal line 2 ("I'd still choose you. ❤️")
    const timer = setTimeout(() => {
      setStep(2);
    }, 2400);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#050816]/90 backdrop-blur-2xl animate-fade-in select-none">
      {/* Radiant Cosmic Heart Backlight */}
      <div className="absolute w-[500px] h-[500px] bg-gradient-to-r from-[#7C3AED]/25 via-[#EC4899]/35 to-[#FDE68A]/25 rounded-full blur-[100px] pointer-events-none animate-pulse" />

      {/* Main Surprise Card */}
      <div className="relative max-w-2xl w-full text-center z-10 p-6 sm:p-10">
        {/* Constellation Artwork Frame */}
        <div className="relative w-64 sm:w-80 h-64 sm:h-80 mx-auto mb-8 rounded-full p-2 bg-gradient-to-tr from-[#7C3AED] via-[#EC4899] to-[#FDE68A] shadow-[0_0_60px_rgba(244,114,182,0.5)]">
          <img
            src={finalSurprise.image}
            alt="Heart Constellation"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover rounded-full filter contrast-110"
          />
          <div className="absolute inset-0 rounded-full border border-white/40 pointer-events-none" />
        </div>

        {/* Surprise Text - Step 1 */}
        <h2 className="font-serif text-2xl sm:text-4xl text-[#F8FAFC] tracking-wide font-light transition-all duration-1000 ease-out">
          "{finalSurprise.line1}"
        </h2>

        {/* Surprise Text - Step 2 */}
        <div
          className={`mt-4 transition-all duration-1000 ease-out ${
            step >= 2 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
          }`}
        >
          <p className="font-serif italic text-3xl sm:text-5xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-[#FDE68A] via-[#F472B6] to-[#FFFFFF] font-normal drop-shadow-[0_0_35px_rgba(244,114,182,0.6)]">
            {finalSurprise.line2}
          </p>

          <p className="mt-4 text-xs uppercase tracking-[0.25em] text-[#FDE68A]/90 font-sans font-medium">
            {yourName} & {herName} · In every universe
          </p>

          {/* Stay in our universe button */}
          <div className="mt-8">
            <button
              onClick={() => {
                sound.playTwinkle();
                onClose();
              }}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#7C3AED]/70 via-[#EC4899]/80 to-[#7C3AED]/70 hover:from-[#7C3AED] hover:via-[#EC4899] hover:to-[#7C3AED] border border-[#FDE68A] text-white font-medium text-xs sm:text-sm tracking-widest uppercase transition-all duration-300 shadow-[0_0_40px_rgba(253,230,138,0.5)] hover:scale-105 active:scale-95 cursor-pointer"
            >
              {finalSurprise.buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
