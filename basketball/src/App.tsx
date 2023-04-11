import './App.css';
import OptimalTeamMenu from './players/components/OptimalTeamMenu';
import { PlayerList } from './players/components/PlayerList';
import { PlayerProvider } from './players/components/PlayerProvider';
import Container from '@mui/material/Container';
function App() {
  return (
    <div className="App">
      <PlayerProvider>
        <Container>
        <OptimalTeamMenu/>        
        <PlayerList/>
      </Container>
      </PlayerProvider>
    </div>
  );
}

export default App;
