import React, { useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import { Delete } from '@material-ui/icons';
import { DataGrid, GridColDef } from '@material-ui/data-grid';
import { playerQueryParams, Player } from "../../types";
import { AddPlayerButton } from './AddPlayerButton';
import AddPlayerForm from './AddPlayerForm';

import { usePlayers } from '../components/PlayerProvider';
import PlayerService from '../../services/player';
interface IPagination {
  page: number,
  pageSize: number
}
export const PlayerList = () => {
  const { players, count, playersDispatch } = usePlayers();
  const [open, setOpen] = useState<boolean>(false);
  const [pagination, setPagination] = useState<IPagination>({
    page: 0,
    pageSize: 5,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCreateLoading, setIsCreateLoading] = useState<boolean>(false);

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 130, align: "left", headerAlign: "left", sortable: false, filterable: false },
    { field: 'height', headerName: 'Height', width: 130, type: 'number', align: "left", headerAlign: "left", sortable: false, filterable: false },
    { field: 'width', headerName: 'Width', width: 130, type: 'number', align: "left", headerAlign: "left", sortable: false, filterable: false },
    { field: 'weight', headerName: 'Weight', width: 130, type: 'number', align: "left", headerAlign: "left", sortable: false, filterable: false },
    { field: 'college', headerName: 'College', width: 250, type: 'number', align: "left", headerAlign: "left", sortable: false, filterable: false },
    { field: 'position', headerName: 'Position', width: 130, align: "left", headerAlign: "left", sortable: false, filterable: false },
    {
      field: 'born',
      headerName: 'Born',
      type: 'number',
      width: 130,
      align: "left", headerAlign: "left",
      sortable: false,
      filterable: false
    },
    { field: 'birth_city', headerName: 'Birth City', width: 150, align: "left", headerAlign: "left", sortable: false, filterable: false },
    { field: 'birth_state', headerName: 'Birth State', width: 150, align: "left", headerAlign: "left", sortable: false, filterable: false },
    { field: 'year_start', headerName: 'Year Start', width: 140, align: "left", headerAlign: "left", sortable: false, filterable: false },
    { field: 'year_end', headerName: 'Year End', width: 140, align: "left", headerAlign: "left", sortable: false, filterable: false },
    {
      field: 'action',
      headerName: 'Action',
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {

          deleteUser(params, event)

        };

        return <IconButton color="primary" onClick={onClick}>
          <Delete />
        </IconButton>;
      },
    },
  ];
  const deleteUser = React.useCallback(
    (params: any, event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      setTimeout(() => {
        deletePlayer(params)
      });
    },
    [],
  );
  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false);
  };
  const getRequestParams = (page: number, pageSize: number): playerQueryParams => {
    let params: playerQueryParams = { page: 0, size: 5 };

    if (page) {
      params.page = page;
    }

    if (pageSize) {
      params.size = pageSize;
    }

    return params;
  }

  const deletePlayer = (params: any) => {
    const playerId: number = params?.row?.player_id
    PlayerService.deletePlayer(playerId)
      .then((response: any) => {
        playersDispatch({ type: "delete", payload: { playerId } })
        fetchPlayers(pagination.page, pagination.pageSize, false)
      })
      .catch((error) => {
        console.error('Error in deleting player', error);
      })
  }
  const fetchPlayers = async (page: number, pageSize: number, add: boolean) => {

    const params = getRequestParams(page, pageSize);
    setIsLoading(true)
    await PlayerService.getPlayers(params)
      .then((response: any) => {
        const data = response.data;
        const players: Player[] = data?.players ?? [];
        const count: number = data?.totalPages ?? 0;
        playersDispatch({ type: 'fetch', payload: { add, data: players, count } })
      })
      .catch((error) => {
        console.error('Error in fetching player data', error);
      })
      .finally(() => {
        setIsLoading(false)
      });
  }

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, page })
    fetchPlayers(page, pagination.pageSize, true);
  }
  const createPlayer = async (data: any) => {
    setIsCreateLoading(true)
    await PlayerService.createPlayer(data?.player)
      .then(async (response: any) => {
        await fetchPlayers(pagination.page, pagination.pageSize, true);
        handleClose()
      })
      .catch((error) => {
        console.error('Error in creating player', error);
      })
      .finally(() => {
        setIsCreateLoading(false)
      })

  }
  return (
    <div className="player-list">
      <h1>Player List</h1>
      <div style={{ margin: '40px 10px', textAlign: 'right' }}>
        <AddPlayerButton onClick={handleClickOpen} />
      </div>
      <DataGrid
        style={{ height: 400, width: '100%' }}
        rows={players.map((item, index) => (
          {
            id: index,
            ...item
          }
        ))}
        rowCount={count} columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        page={pagination.page}
        loading={isLoading}
        paginationMode="server"
        onPageChange={handlePageChange}
      />
      <AddPlayerForm onCancel={handleClose} onSubmit={createPlayer} open={open} isLoading={isCreateLoading} />
    </div>
  );
}
