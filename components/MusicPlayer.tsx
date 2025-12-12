import React, { useState, useRef, useEffect } from 'react';

const PLAYLIST = [
  'please.mp3',
  'ophelia.mp3',
  'take.mp3',
  'rhapsody.mp3'
];

export const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.3);
  const [hasError, setHasError] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  // Reset error state when track changes
  useEffect(() => {
    setHasError(false);
  }, [currentTrackIndex]);

  // Efeito para garantir que o volume persista e tocar ao trocar de faixa
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (isPlaying && !hasError) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(e => {
            // Erros de reprodução automática (Autoplay policy) são comuns, apenas logamos
            console.log("Aguardando interação do usuário para tocar.");
          });
        }
      }
    }
  }, [currentTrackIndex, volume]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              setHasError(false);
            })
            .catch(e => {
              console.error("Erro ao tentar tocar:", e);
              setIsPlaying(false);
            });
        }
      }
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
  };

  const handleError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    const error = e.currentTarget.error;
    console.warn(
      `⚠️ Arquivo de áudio não encontrado ou formato inválido: "${PLAYLIST[currentTrackIndex]}"\n` +
      `Certifique-se de que o arquivo "${PLAYLIST[currentTrackIndex]}" está na pasta 'public' do projeto.`
    );
    setHasError(true);
    setIsPlaying(false);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end">
      <audio 
        ref={audioRef} 
        src={PLAYLIST[currentTrackIndex]} 
        onEnded={handleNext}
        onError={handleError}
      />

      {/* Capsule Container */}
      <div 
        className={`
          flex items-center bg-white/80 backdrop-blur-md border-2 shadow-lg 
          rounded-full transition-all duration-500 ease-in-out overflow-hidden
          ${hasError ? 'border-red-200' : 'border-pink-200'}
          ${isExpanded ? 'p-1.5 pr-4 gap-2 max-w-[280px]' : 'p-1.5 max-w-[48px]'}
        `}
      >
        {/* Toggle/Icon Button (Always Visible) */}
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className={`
            w-9 h-9 flex-shrink-0 rounded-full flex items-center justify-center 
            border-2 shadow-sm transition-all duration-300 z-10
            ${hasError 
              ? 'bg-red-100 text-red-400 border-red-200' 
              : isPlaying 
                ? 'bg-pink-400 text-white border-pink-300' 
                : 'bg-white text-pink-300 hover:bg-pink-50 border-pink-100'
            }
          `}
        >
          {/* Icon */}
          <span className={`text-sm ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }}>
            {hasError ? '⚠️' : (isPlaying ? '💿' : '🎵')}
          </span>
        </button>

        {/* Hidden Controls (Slide Reveal) */}
        <div className={`
            flex items-center gap-2 transition-all duration-500
            ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 pointer-events-none w-0'}
        `}>
          
          {/* Prev Button */}
          <button onClick={handlePrev} className="text-pink-300 hover:text-pink-500 transition-colors p-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M9.195 18.44c1.25.713 2.805-.19 2.805-1.629v-2.34l6.945 3.968c1.25.714 2.805-.188 2.805-1.628V8.688c0-1.44-1.555-2.342-2.805-1.628L12 11.03v-2.34c0-1.44-1.555-2.343-2.805-1.629l-7.108 4.062c-1.26.72-1.26 2.536 0 3.256l7.108 4.061z" />
            </svg>
          </button>

          {/* Play/Pause Mini Button */}
          <button 
            onClick={togglePlay}
            disabled={hasError}
            className={`transition-colors p-1 focus:outline-none ${hasError ? 'text-gray-300 cursor-not-allowed' : 'text-pink-400 hover:text-pink-600'}`}
          >
             {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                  <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
                </svg>
             ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                  <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                </svg>
             )}
          </button>

          {/* Next Button */}
          <button onClick={handleNext} className="text-pink-300 hover:text-pink-500 transition-colors p-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M5.055 7.06c-1.25-.714-2.805.189-2.805 1.628v8.123c0 1.44 1.555 2.342 2.805 1.628L12 14.471v2.34c0 1.44 1.555 2.342 2.805 1.628l7.108-4.061c1.26-.72 1.26-2.536 0-3.256l-7.108-4.061c-1.25-.714-2.805.188-2.805 1.628v2.34L5.055 7.06z" />
            </svg>
          </button>

          {/* Volume Slider */}
          <div className="flex items-center gap-1 group ml-1 pl-2 border-l border-pink-100">
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="w-14 h-1.5 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-pink-400 hover:accent-pink-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};