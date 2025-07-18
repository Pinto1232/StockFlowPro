import { useState, useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export const useAppState = () => {
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);
  const [isActive, setIsActive] = useState(AppState.currentState === 'active');
  const [isBackground, setIsBackground] = useState(AppState.currentState === 'background');
  const [isInactive, setIsInactive] = useState(AppState.currentState === 'inactive');
  
  const appStateRef = useRef(AppState.currentState);
  const backgroundTime = useRef<Date | null>(null);
  const [timeInBackground, setTimeInBackground] = useState<number>(0);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      const previousState = appStateRef.current;

      if (previousState === 'active' && nextAppState.match(/inactive|background/)) {
        backgroundTime.current = new Date();
      }
      
      if (previousState.match(/inactive|background/) && nextAppState === 'active') {
        if (backgroundTime.current) {
          const timeSpent = new Date().getTime() - backgroundTime.current.getTime();
          setTimeInBackground(timeSpent);
          backgroundTime.current = null;
        }
      }

      appStateRef.current = nextAppState;
      setAppState(nextAppState);
      setIsActive(nextAppState === 'active');
      setIsBackground(nextAppState === 'background');
      setIsInactive(nextAppState === 'inactive');
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
    };
  }, []);

  const getAppStateInfo = () => ({
    current: appState,
    isActive,
    isBackground,
    isInactive,
    timeInBackground,
  });

  return {
    appState,
    isActive,
    isBackground,
    isInactive,
    timeInBackground,
    getAppStateInfo,
  };
};