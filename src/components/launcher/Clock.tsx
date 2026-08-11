import React, { useEffect, useState } from 'react';
import { useClock } from '../../hooks/useClock';
import { useSettings } from '../../hooks/useSettings';
import styles from './Clock.module.css';

export function Clock() {
  const { time, date, greeting } = useClock();
  const { settings } = useSettings();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className={styles.container}>
      {settings.clock.showGreeting && <div className={styles.greeting}>{greeting}</div>}
      <div className={styles.time}>{time}</div>
      {settings.clock.showDate && <div className={styles.date}>{date}</div>}
    </div>
  );
}
