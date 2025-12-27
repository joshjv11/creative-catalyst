import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
}

interface GamificationState {
  scrollProgress: number;
  unlockedProjects: string[];
  expandedProjects: string[];
  sectionsViewed: string[];
  achievements: Achievement[];
  devModeActive: boolean;
  konamiProgress: number;
  
  // Actions
  setScrollProgress: (progress: number) => void;
  unlockProject: (projectId: string) => void;
  toggleExpandProject: (projectId: string) => void;
  viewSection: (sectionId: string) => void;
  unlockAchievement: (achievementId: string) => void;
  activateDevMode: () => void;
  updateKonamiProgress: (progress: number) => void;
  resetKonamiProgress: () => void;
}

const initialAchievements: Achievement[] = [
  {
    id: 'explorer',
    name: 'Explorer',
    description: 'Scrolled through 90% of the portfolio',
    icon: '🗺️',
    unlocked: false,
  },
  {
    id: 'deep-diver',
    name: 'Deep Diver',
    description: 'Opened 3+ full case studies',
    icon: '🤿',
    unlocked: false,
  },
  {
    id: 'completionist',
    name: 'Completionist',
    description: 'Viewed all sections',
    icon: '⭐',
    unlocked: false,
  },
  {
    id: 'secret-finder',
    name: 'Secret Finder',
    description: 'Discovered a hidden Easter egg',
    icon: '🥚',
    unlocked: false,
  },
  {
    id: 'tech-enthusiast',
    name: 'Tech Enthusiast',
    description: 'Explored the tech stack details',
    icon: '💻',
    unlocked: false,
  },
];

export const useGamification = create<GamificationState>()(
  persist(
    (set, get) => ({
      scrollProgress: 0,
      unlockedProjects: [],
      expandedProjects: [],
      sectionsViewed: [],
      achievements: initialAchievements,
      devModeActive: false,
      konamiProgress: 0,

      setScrollProgress: (progress) => {
        set({ scrollProgress: progress });
        
        // Check explorer achievement
        if (progress >= 90 && !get().achievements.find(a => a.id === 'explorer')?.unlocked) {
          get().unlockAchievement('explorer');
        }
      },

      unlockProject: (projectId) => {
        const { unlockedProjects } = get();
        if (!unlockedProjects.includes(projectId)) {
          set({ unlockedProjects: [...unlockedProjects, projectId] });
        }
      },

      toggleExpandProject: (projectId) => {
        const { expandedProjects, achievements, unlockAchievement } = get();
        let newExpanded: string[];
        
        if (expandedProjects.includes(projectId)) {
          newExpanded = expandedProjects.filter(id => id !== projectId);
        } else {
          newExpanded = [...expandedProjects, projectId];
          
          // Check deep diver achievement
          if (newExpanded.length >= 3 && !achievements.find(a => a.id === 'deep-diver')?.unlocked) {
            unlockAchievement('deep-diver');
          }
        }
        
        set({ expandedProjects: newExpanded });
      },

      viewSection: (sectionId) => {
        const { sectionsViewed, achievements, unlockAchievement } = get();
        if (!sectionsViewed.includes(sectionId)) {
          const newSections = [...sectionsViewed, sectionId];
          set({ sectionsViewed: newSections });
          
          // Check completionist achievement (6 main sections)
          if (newSections.length >= 6 && !achievements.find(a => a.id === 'completionist')?.unlocked) {
            unlockAchievement('completionist');
          }
        }
      },

      unlockAchievement: (achievementId) => {
        set((state) => ({
          achievements: state.achievements.map((a) =>
            a.id === achievementId
              ? { ...a, unlocked: true, unlockedAt: Date.now() }
              : a
          ),
        }));
      },

      activateDevMode: () => {
        const { achievements, unlockAchievement } = get();
        set({ devModeActive: true });
        
        // Unlock secret finder achievement
        if (!achievements.find(a => a.id === 'secret-finder')?.unlocked) {
          unlockAchievement('secret-finder');
        }
      },

      updateKonamiProgress: (progress) => set({ konamiProgress: progress }),
      resetKonamiProgress: () => set({ konamiProgress: 0 }),
    }),
    {
      name: 'portfolio-gamification',
      partialize: (state) => ({
        achievements: state.achievements,
        sectionsViewed: state.sectionsViewed,
      }),
    }
  )
);
