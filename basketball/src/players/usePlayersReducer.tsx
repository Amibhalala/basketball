import React, { useReducer, useEffect } from 'react';
import { Player,PlayersAction } from '../types';
import PlayerService from '../services/player';

interface PlayersState {
  players: Player[]
  initialized: boolean,
  count: number
}

export function usePlayersReducer(): [PlayersState, React.Dispatch<PlayersAction>] {

  const playerReducer =  (state: PlayersState, action: PlayersAction): PlayersState => {
    switch (action.type) {
      case 'fetch':
        return { ...state,initialized:true,players:action.payload.add ?  [...state.players,...action.payload.data] :[...action.payload.data]  ,count:action.payload.count };

      case 'add':
        return { ...state, players:[...state.players,{...action.payload.player}] };

      case 'delete':
        const players = state.players.filter((player)=> player.player_id !== action.payload.playerId)
        return { ...state, players:players };

      default:
        return state
    }
  };

  const [state, dispatch] = useReducer(playerReducer, {
    players: [],
    initialized: false,
    count:0
  });

  useEffect(() => {
    PlayerService.getPlayers().then((response)=>{
      const data = response.data;
      const players: Player[]=data?.players ?? [];
      const count: number=data?.totalPages ?? 0;
    dispatch({type:'fetch',payload:{data:players,count}})
   });

  }, []);

  return [state, dispatch];
}
