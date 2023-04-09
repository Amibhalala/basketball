import { usePlayersReducer } from '../usePlayersReducer';
import React, { useContext } from 'react'

import { Player, PlayersAction } from '../../types';

type PlayerContextType = {
    players: Player[]
    count:number,
    playersDispatch: React.Dispatch<PlayersAction>
}

export const PlayerContext = React.createContext<PlayerContextType | undefined>(undefined);

type PlayerProviderProps = {
    children: React.ReactNode
}

export const PlayerProvider: React.FC<PlayerProviderProps> = ({ children }) => {
    const [{ initialized, players, count }, playersDispatch] = usePlayersReducer();
    return (
        <PlayerContext.Provider value={{ players, playersDispatch,count }}>
            { initialized ? children : <div>loading...</div>}
        </PlayerContext.Provider>
    )
}

export const usePlayers = () => {
    const playersCtx = useContext(PlayerContext);
    if (!playersCtx) {
        throw new Error("Component beyond PlayerContext!")
    }
    return playersCtx;
}
