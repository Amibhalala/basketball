import http from "../http-common";
import { Player } from "../types";

class PlayerService {
    getPlayers(params?:any) {
      return http.get("/players",{params});
    }
    deletePlayer(playerId:number) {
      return http.delete(`player/${playerId}/delete`);
    }
    createPlayer(player:Omit<Player , "player_id">) {
      return http.post('player/create',player);
    }
  
  }
  
export default new PlayerService();