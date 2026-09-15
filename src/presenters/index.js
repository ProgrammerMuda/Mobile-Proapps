import { useState } from 'react';
import { InitialAppState } from '../models';

/**
 * Presenter Layer (Business Logic & State Manager)
 * Mediates between Model (Data/Services) and View (UI/Screens).
 */
export const useHomePresenter = () => {
  const [appState, setAppState] = useState(InitialAppState);
  const [count, setCount] = useState(0);

  const incrementCount = () => {
    setCount((prev) => prev + 1);
  };

  const resetCount = () => {
    setCount(0);
  };

  return {
    appState,
    count,
    incrementCount,
    resetCount,
  };
};
