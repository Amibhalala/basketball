const  Player  = require('../../models/player');
import { Response, Request } from "express";
import { IPlayer } from "../../types/player";

const getPagination = (page:number, size:number) => {
  const limit = size ? +size : 5;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

const getPagingData = (data:any, page: number, limit:number) => {
  const { count: totalItems, rows: players } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, players, totalPages, currentPage };
};
export const getPlayers = async(req: Request, res: Response): Promise<void>=> {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(Number.parseInt(page), Number.parseInt(size));

  Player.findAndCountAll({ limit, offset, order: [
    ['player_id', 'ASC'],
],})
  .then((data) => {
    const result = getPagingData(data, page, limit);
    res.status(200).json(result);
  })
  .catch((error) => {
    res.status(500).send({
      message:
      error.message || "Some error occurred while retrieving players."
    });
  });
}

  
export const createPlayer = async (req: Request, res: Response): Promise<void> => {
    try {
      const body = req.body as Pick<IPlayer,"name" |"height" |"width" |"college" |"born" |"birth_city" |"birth_state" |"year_start" |"year_end" |"position" |"weight" |"birth_date">
      if (!req.body.name) {
        res.status(400).send({
          message: "Content create empty data!"
        });
        return;
      }
      const player:IPlayer = {
        name:body?.name,
        height: body?.height ??  null,
        width: body?.width ??  null,
        college: body?.college ??  null,
        born: body?.born ??  null,
        birth_city: body?.birth_city ??  null,
        birth_state: body?.birth_state ??  null,
        year_start: body?.year_start ??  null,
        year_end: body?.year_end ??  null,
        position: body?.position ??  null,
        weight: body.weight ??  null,
        birth_date: body?.birth_date ??  null
      };
      Player.create(player)
      .then((data:any) => {
        res.status(201).send({
          status: "success",
          message: "player created!",
          player:data
        })
      })
    } catch (error) {
      res.status(400).json({
        error: "Some error occurred while creating the player.",
      });
      throw error
    }
};


export const deletePlayer = async (req: Request, res: Response): Promise<void> => {
    try {
      const playerId=Number.parseInt(req?.params?.id)
      if (!playerId) {
        res.status(400).send({
          message: "Player Id is required!"
        });
        return;
      }

      Player.destroy({
        where: { player_id: playerId }
      })
        .then((status) => {
          if (status == 1) {
            res.status(201).json({
              status: "success",
              message: "Player was deleted successfully!"
            });
          } else {
            res.status(201).json({
              status: "fail",
              message: `Cannot delete Player with id=${playerId}. Maybe Player was not found!`
            });
          }
        })
     
    } catch (error) {
      res.status(400).json({
        error: "Error in deleting Player",
      });
      throw error
    }
};
  