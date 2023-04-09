import { Router } from "express";
import { getPlayers,createPlayer, deletePlayer } from "../controllers/players";
import {validateParam} from "../validator";
const router: Router = Router();

router.get("/players", getPlayers);
router.post("/player/create", createPlayer);
router.delete("/player/:id/delete",[validateParam], deletePlayer);

export default router;