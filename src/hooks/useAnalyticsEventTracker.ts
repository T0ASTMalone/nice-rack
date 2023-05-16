import ReactGA from 'react-ga';

export function useAnalyticsEventTracker(category: string = 'test category') {
  const eventTracker = (action: string = 'test action', label: string = 'test label') => {
    ReactGA.event({ category, action, label });
  }
  return eventTracker;
};
