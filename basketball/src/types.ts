export interface Player {
    player_id:number
    name: string
    height: number | null
    width: number | null
    college: string | null
    born: number | null
    birth_city:string | null
    birth_state: string | null
    year_start:number | null
    year_end:number | null
    position:string | null
    weight: number | null
    birth_date: Date | null
}
export interface PlayerFetchAction {
    type: 'fetch',
    payload: {
        data: Player[],
        count:number,
        add?:boolean
    }
}

export interface PlayerAddAction {
    type: 'add',
    payload: {
        player: Player
    }
}

export interface PlayerDeleteAction {
    type: 'delete',
    payload: {
        playerId: Player['player_id']
    }
}

export type playerQueryParams ={
    page:Number,
    size:Number
}

export type PlayersAction =
    | PlayerFetchAction
    | PlayerAddAction
    | PlayerDeleteAction
