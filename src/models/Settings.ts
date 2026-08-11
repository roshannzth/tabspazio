export interface ClockSettings {
  format: '12h' | '24h';
  showSeconds: boolean;
  showDate: boolean;
  showGreeting: boolean;
}

export interface AppearanceSettings {
  background: string;
  backgroundType: 'solid' | 'gradient' | 'image';
  backgroundImage?: string;
  backgroundBlur: number;
  backgroundOpacity: number;
  cardSize: 'small' | 'medium' | 'large';
  borderRadius: number;
  theme: 'dark' | 'midnight' | 'amoled';
}

export interface LauncherSettings {
  columns: number;
  animations: boolean;
  showCategoryLabels: boolean;
}

export interface Settings {
  clock: ClockSettings;
  appearance: AppearanceSettings;
  launcher: LauncherSettings;
}

export const DEFAULT_SETTINGS: Settings = {
  clock: { format: '12h', showSeconds: false, showDate: true, showGreeting: true },
  appearance: {
    background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
    backgroundType: 'gradient',
    backgroundBlur: 0,
    backgroundOpacity: 1,
    cardSize: 'medium',
    borderRadius: 16,
    theme: 'dark',
  },
  launcher: { columns: 6, animations: true, showCategoryLabels: true },
};
