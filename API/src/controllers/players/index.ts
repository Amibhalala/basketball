const  Player  = require('../../models/player');
const { QueryTypes } = require('sequelize');
import { Response, Request, response } from "express";
import { IPlayer } from "../../types/player";
const { sq } = require('../../config/db');
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

//Based on my assumption I have written this query
const getBestPlayesByPointsSumQuery = (pointsSum:number):string=>{
  return   `SELECT p.name, p.height, p.width, p.weight, p.college, p.born, p.birth_city, p.birth_state, s.points, s.position
FROM player p
JOIN season_stats s ON p.name = s.name
WHERE s.points <= ${pointsSum} AND s.position IN ('PG', 'SG', 'SF', 'PF', 'C')
AND (
  s.position = 'PG' AND s.name IN (
    SELECT name FROM season_stats WHERE points <= ${pointsSum} AND position = 'PG' ORDER BY Age ASC, points DESC, Games ASC LIMIT 1
  )
  OR s.position = 'SG' AND s.name IN (
    SELECT name FROM season_stats WHERE points <= ${pointsSum} AND position = 'SG' ORDER BY Age ASC, points DESC, Games ASC LIMIT 1
  )
  OR s.position = 'SF' AND s.name IN (
    SELECT name FROM season_stats WHERE points <= ${pointsSum} AND position = 'SF' ORDER BY Age ASC, points DESC, Games ASC LIMIT 1
  )
  OR s.position = 'PF' AND s.name IN (
    SELECT name FROM season_stats WHERE points <= ${pointsSum} AND position = 'PF' ORDER BY Age ASC, points DESC, Games ASC LIMIT 1
  )
  OR s.position = 'C' AND s.name IN (
    SELECT name FROM season_stats WHERE points <= ${pointsSum} AND position = 'C' ORDER BY Age ASC, points DESC, Games ASC LIMIT 1
  )
)
ORDER BY s.age ASC, s.points DESC, s.games ASC
LIMIT 5`;
}
export const getBestPlayesByPointsSum = async (pointsSum:number, res: Response):Promise<void> => {
  await sq.query(getBestPlayesByPointsSumQuery(pointsSum),{ raw:true,type: QueryTypes.SELECT })
  .then((result:any) => {
    res.status(200).json(result);
  })
  .catch((error:any) => {
    res.status(500).send({
      message:
      error.message || "Some error occurred while retrieving best players."
    });
  });
}
export const getPlayers = async(req: Request, res: Response): Promise<void>=> {
  try{
  const { page, size, points_sum } = req.query;
  const pointsSum = Number(points_sum);
  const { limit, offset } = getPagination(Number(page), Number(size));
  if(points_sum && isNaN(pointsSum)){
    res.status(400).send({
      message: "Points sum is invalid!"
    });
    return;
  }
  if (pointsSum > 0){
    await getBestPlayesByPointsSum(pointsSum,res)
    return;
  }

  await Player.findAndCountAll({ limit, offset, order: [
    ['player_id', 'DESC'],
],})
  .then((data:any) => {
    const result = getPagingData(data, Number(page), limit);
    res.status(200).json(result);
  })
  .catch((error:any) => {
    res.status(500).send({
      message:
      error.message || "Some error occurred while retrieving players."
    });
  });
}
catch(error){
    res.status(400).json({
      error: "Some error occurred while retrieving the player.",
    });
    throw error
  }
}

  
export const createPlayer = async (req: Request, res: Response): Promise<void> => {
    try {
      const body = req.body as Pick<IPlayer,"name" |"height" |"width" |"college" |"born" |"birth_city" |"birth_state" |"year_start" |"year_end" |"position" |"weight" |"birth_date">
      if (!body?.name) {
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
      await Player.create(player)
      .then((data:any) => {
        res.status(201).send({
          status: "success",
          message: "player created!",
          player:data
        })
      })
      .catch((error:any)=> {throw error})
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
      if (isNaN(playerId)) {
        res.status(400).send({
          message: "Player Id is required!"
        });
        return;
      }

      await Player.destroy({
        where: { player_id: playerId }
      })
        .then((status:any) => {
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
  