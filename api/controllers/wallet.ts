import { MysqlError } from 'mysql';
import { Request, Response, NextFunction } from 'express';
import Wallet from '../models/wallet.js';

const deposit = (req: Request, res: Response, next: NextFunction) => {
    const deposit: number = req.body.deposit;
    Wallet.deposit(deposit, (err: MysqlError | null, results?: any) => {
        if(err) {
            console.log('Error deposit: ', err);
            res.status(500).json({ error: 'Failed to deposit!' });
        } else {
            console.log(results);
            res.status(200).json(results);
        }
    });
}

const withdraw = (req: Request, res: Response, next: NextFunction) => {
	const withdraw: number = req.body.withdraw;
    Wallet.withdraw(withdraw, (err: MysqlError | null, results?: any) => {
        if(err) {
            console.log('Error withdraw: ', err);
            res.status(500).json({ error: 'Failed to withdraw!' });
        } else {
            console.log(results);
            res.status(200).json(results);
        }
    });
}

const balance = (req: Request, res: Response, next: NextFunction) => {
    Wallet.balance((err: MysqlError | null, results?: any) => {
        if(err) {
            console.log('Error: ', err);
            res.status(500).json({ error: 'Failed!' });
        } else {
            console.log(results);
            res.status(200).json(results);
        }
    });
}

export default {
    deposit,
    withdraw,
    balance
}
