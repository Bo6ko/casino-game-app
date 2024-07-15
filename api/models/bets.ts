import { MysqlError } from "mysql";

import db from '../../database/db_connection.js';
import { BetsType } from "../types/bets.js";

const TABLE = 'bets';

type Callback = (
    err: MysqlError | null, 
    results?: any
) => void;

const Bets = {
    getTotalFromAllBets: (callback: Callback) => {
        const sql = `SELECT SUM(bet) as totalBet, SUM(winning) as totalWinning FROM ${TABLE}`;
        db.query(sql, (error, results) => {
            if (error) {
                callback(error);
                return;
            }
            callback(null, results[0]);
        });
    },
    create: (bets: BetsType, callback: Callback) => {
        const insertQuery = `INSERT INTO ${TABLE} (bet, winning) VALUES (?, ?) `;
        db.query(insertQuery, [bets.bet, bets.winning], (error, results) => {
            if (error) {
                callback(error);
                return;
            }
            callback(null, {success: true, results: results.insertId});
        });
    }
}

export default Bets;