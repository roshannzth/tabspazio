export interface ClockSettings {
  format: '12h' | '24h';
  showSeconds: boolean;
  showDate: boolean;
  showGreeting: boolean;
  greetingPrefix?: string;
  greetingTitle?: string;
  greetingSubtitle?: string;
}

export interface AppearanceSettings {
  background: string;
  backgroundType: 'solid' | 'gradient' | 'image';
  backgroundImage?: string;
  backgroundBlur: number;
  backgroundOpacity: number;
  borderRadius: number;
  theme: 'dark' | 'darker';
  accentColor?: string;
}

export interface Settings {
  clock: ClockSettings;
  appearance: AppearanceSettings;
}

export const DEFAULT_SETTINGS: Settings = {
  clock: {
    format: '12h',
    showSeconds: false,
    showDate: false,
    showGreeting: true,
    greetingPrefix: 'Hello,',
    greetingTitle: '',
    greetingSubtitle: 'What will you watch today?',
  },
  appearance: {
    background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
    backgroundType: 'gradient',
    backgroundImage: './backgrounds/bg_unsplash.jpg',
    backgroundBlur: 0,
    backgroundOpacity: 1,
    borderRadius: 22,
    theme: 'dark',
    accentColor: '#6366f1',
  },
};
