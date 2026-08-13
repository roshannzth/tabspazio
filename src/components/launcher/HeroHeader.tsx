import React from 'react';
import { useClock } from '../../hooks/useClock';
import styles from './HeroHeader.module.css';

export const HeroHeader: React.FC = () => {
  const { greeting } = useClock();

  return (
    <div className={styles.heroSection}>
      <div className={styles.helloText}>Hello,</div>
      <h1 className={styles.greeting}>{greeting}</h1>
      <p className={styles.subtitle}>What will you watch today?</p>
    </div>
  );
};
