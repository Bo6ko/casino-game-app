import express from 'express';
const router = express.Router();
import GameLogic from '../controllers/gameLogic.js';

router.post('/play', GameLogic.play);
router.post('/sim', GameLogic.sim);
router.get('/rtp', GameLogic.rtp);

export default router;