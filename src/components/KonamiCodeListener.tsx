import { useEffect, useCallback } from "react";
import { useGamification } from "@/hooks/useGamification";

const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a'
];

export const KonamiCodeListener = () => {
  const { konamiProgress, updateKonamiProgress, resetKonamiProgress, activateDevMode, devModeActive } = useGamification();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const key = e.key;
    const expectedKey = KONAMI_CODE[konamiProgress];
    
    if (key.toLowerCase() === expectedKey.toLowerCase()) {
      const newProgress = konamiProgress + 1;
      
      if (newProgress === KONAMI_CODE.length) {
        activateDevMode();
        resetKonamiProgress();
      } else {
        updateKonamiProgress(newProgress);
      }
    } else {
      resetKonamiProgress();
    }
  }, [konamiProgress, updateKonamiProgress, resetKonamiProgress, activateDevMode]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Show hint when progress is being made
  if (konamiProgress > 3 && konamiProgress < KONAMI_CODE.length) {
    return (
      <div className="fixed bottom-4 left-4 z-[60] px-3 py-2 bg-card/90 border border-primary/30 rounded-lg backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-body text-muted-foreground">Secret code:</span>
          <div className="flex gap-1">
            {KONAMI_CODE.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i < konamiProgress ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
};
