import { MysqlError } from 'mysql';
import GameLogic from '../models/gameLogic.js';
import { Request, Response } from 'express';
import { Sim, SimResponse } from '../types/gameLogic.js';
import { Rtp } from '../types/bets.js';

const play = (req: Request, res: Response) => {
    const bet: number = req.body.bet;
    GameLogic.play(bet, (err: MysqlError | null, results?: any) => {
        if(err) {
            console.log('Error creating bets: ', err);
            res.status(500).json({ error: 'Failed to create new bet' });
        } else {
            console.log(results);
            res.status(200).json(results);
        }
    });
}

const sim = (req: Request, res: Response) => {
    const data: Sim = {
        count: req.body.count,
        bet: req.body.bet
    }
    GameLogic.sim(data, (err: MysqlError | null, results?: SimResponse) => {
        if(err) {
            console.log('Error creating bets: ', err);
            res.status(500).json({ error: 'Failed to create new bet' });
        } else {
            console.log(results);
            res.status(200).json(results);
        }
    });
}

const rtp = (req: Request, res: Response) => {
    GameLogic.rtp((err: MysqlError | null, rtpResult?: Rtp) => {
        if(err) {
            console.log('Error: ', err);
            res.status(500).json(err);
        } else {
            res.status(200).json({rtp: rtpResult});
        }
    })
}

export default {
    play,
    sim,
    rtp
}
