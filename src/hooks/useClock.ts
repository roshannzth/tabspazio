import { useState, useEffect } from 'react';
import { useSettings } from './useSettings';

export function useClock() {
  const { settings } = useSettings();
  const [timeState, setTimeState] = useState({
    time: '',
    date: '',
    greeting: ''
  });

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      
      let timeString = '';
      if (settings.clock.format === '12h') {
        const options: Intl.DateTimeFormatOptions = { 
          hour: 'numeric', 
          minute: '2-digit', 
          second: settings.clock.showSeconds ? '2-digit' : undefined,
          hour12: true 
        };
        timeString = now.toLocaleTimeString([], options);
      } else {
        const options: Intl.DateTimeFormatOptions = { 
          hour: '2-digit', 
          minute: '2-digit', 
          second: settings.clock.showSeconds ? '2-digit' : undefined,
          hour12: false 
        };
        timeString = now.toLocaleTimeString([], options);
      }
      
      let dateString = '';
      if (settings.clock.showDate) {
        dateString = now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });
      }
      
      let greetingString = '';
      if (settings.clock.showGreeting) {
        const hour = now.getHours();
        if (hour >= 5 && hour < 12) {
          greetingString = 'Good Morning';
        } else if (hour >= 12 && hour < 17) {
          greetingString = 'Good Afternoon';
        } else if (hour >= 17 && hour < 21) {
          greetingString = 'Good Evening';
        } else {
          greetingString = 'Good Night';
        }
      }
      
      setTimeState({
        time: timeString,
        date: dateString,
        greeting: greetingString
      });
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [settings.clock]);

  return timeState;
}
