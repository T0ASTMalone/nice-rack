import { AnimatePresence } from 'framer-motion';
import { ModuleList } from './components/ModuleList';
import { Rack } from './components/Rack';
import { RackProvider } from './contexts/RackContext';

import './App.css';
import 'overlayscrollbars/overlayscrollbars.css';

function App() {
  return (
    <AnimatePresence>
      <RackProvider>
        <div className="app">
          <ModuleList />
          <Rack />
        </div>
      </RackProvider>
    </AnimatePresence>
  );
}

export default App;
