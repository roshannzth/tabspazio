import React from 'react';
import { useClock } from '../../hooks/useClock';
import { useSettings } from '../../hooks/useSettings';
import styles from './HeroHeader.module.css';

export const HeroHeader: React.FC = () => {
  const { greeting } = useClock();
  const { settings } = useSettings();
  const { clock } = settings;

  if (!clock.showGreeting) return null;

  const prefix = clock.greetingPrefix !== undefined ? clock.greetingPrefix : 'Hello,';
  const title = clock.greetingTitle?.trim() ? clock.greetingTitle.trim() : greeting;
  const subtitle = clock.greetingSubtitle !== undefined ? clock.greetingSubtitle : 'What will you watch today?';

  return (
    <div className={styles.heroSection}>
      {prefix && <div className={styles.helloText}>{prefix}</div>}
      {title && <h1 className={styles.greeting}>{title}</h1>}
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
};
