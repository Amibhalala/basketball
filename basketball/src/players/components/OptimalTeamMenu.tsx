import { useState } from 'react';
import PlayerService from '../../services/player';
import Button from '@material-ui/core/Button';
import { Player } from "../../types";
import TextField from "@material-ui/core/TextField";
import { DataGrid, GridColDef } from '@material-ui/data-grid';
const OptimalTeamMenu = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [pointsSum, setPointsSum] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleBuildTeam = async () => {
    setIsLoading(true)
    await PlayerService.getPlayers({ points_sum: pointsSum })
      .then((response: any) => {
        const players: Player[] = response?.data;
        setPlayers(players)
      })
      .catch((error) => {
        console.error('Error in fetching players', error);
      })
      .finally(() => {
        setIsLoading(false)
      });
  };
  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 130, align: "left", headerAlign: "left", sortable: false, filterable: false },
    { field: 'height', headerName: 'Height', width: 130, type: 'number', align: "left", headerAlign: "left", sortable: false, filterable: false },
    { field: 'width', headerName: 'Width', width: 130, type: 'number', align: "left", headerAlign: "left", sortable: false, filterable: false },
    { field: 'weight', headerName: 'Weight', width: 130, type: 'number', align: "left", headerAlign: "left", sortable: false, filterable: false },
    { field: 'position', headerName: 'Position', width: 130, align: "left", headerAlign: "left", sortable: false, filterable: false },
    { field: 'points', headerName: 'Points', width: 140, align: "left", headerAlign: "left", sortable: false, filterable: false },
  ]
  return (
    <div className="optimal-player-list">
      <h1>Optimal Team</h1>
      <div style={{ margin: '50px 0' }}>
        <TextField
          id="points-sum"
          label="Total Points"
          value={pointsSum}
          type="number"
          placeholder="Enter total points"
          onChange={(event) => setPointsSum(Number.parseInt(event?.target?.value))} />
        <Button variant="contained" color="primary" onClick={handleBuildTeam}>CTA</Button>
      </div>
      <DataGrid
        style={{ height: 400, width: '100%' }}
        rows={players.map((item, index) => (
          {
            id: index,
            ...item
          }
        ))}
        columns={columns}
        loading={isLoading}
      />
    </div>
  );
};

export default OptimalTeamMenu;
