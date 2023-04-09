import './App.css';
import { PlayerList } from './players/components/PlayerList';
import { PlayerProvider } from './players/components/PlayerProvider';
function App() {
  return (
    <div className="App">
      <PlayerProvider>
      <PlayerList/>
      </PlayerProvider>
      {/* {
       playerList?.length>0 && playerList?.map((item) =>
        <div key={item.player_id}>
          {item}
          </div>
        )
      } */}
    </div>
  );
}

export default App;
