import './App.css';
import { PlayerList } from './players/components/PlayerList';
import { PlayerProvider } from './players/components/PlayerProvider';
function App() {
  return (
    <div className="App">
      <PlayerProvider>
      <PlayerList/>
      </PlayerProvider>
    </div>
  );
}

export default App;
