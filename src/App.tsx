import { ModuleList } from './components/ModuleList';
import { Rack } from './components/Rack';
import { RackProvider } from './contexts/RackContext';

import './App.css';
import 'overlayscrollbars/overlayscrollbars.css';

function App() {
  return (
    <RackProvider>
      <h2>Hello APp</h2>
      <div className="app">
        <ModuleList />
        <Rack />
      </div>
    </RackProvider>
  );
}

export default App;
