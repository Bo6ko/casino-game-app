import { MysqlError } from "mysql";

import db from '../../database/db_connection.js';
import { WalletType } from "../types/wallet.js";

const TABLE = 'wallet';

type Callback = (
    err: MysqlError | null, 
    results?: any
) => void;

const Wallet = {
    deposit: (deposit: number, callback: Callback) => {

        // not included users - I have only one deposit (only one row in table wallet)
        // if task description include users authentification this query will be restricted by user_id
        const checkExistingDeposit = `SELECT * FROM ${TABLE}`;
        db.query(checkExistingDeposit, (error: MysqlError, walletResults: WalletType[]) => {
            if (error) {
                callback(error);
                return;
            }
            if (walletResults.length > 0) {
                const balanceUpdate: number = Number(walletResults[0].balance) + Number(deposit);
                const wallet: WalletType = {balance: balanceUpdate}
                Wallet.update(wallet, (error, result) => {
                    if (error) {
                        callback(error);
                        return;
                    }
                    callback(null, result);
                })
            } else {
                Wallet.create(deposit, (error, result) => {
                    if (error) {
                        callback(error);
                        return;
                    }
                    callback(null, result);
                })
            }
        });
    },
    withdraw: (withdraw: number, callback: Callback) => {
        const checkExistingDeposit = `SELECT * FROM ${TABLE}`;
        db.query(checkExistingDeposit, (error: MysqlError, walletResults: WalletType[]) => {
            if (error) {
                callback(error);
                return;
            }
            if (walletResults.length > 0) {
                if (Number(walletResults[0].balance) >= Number(withdraw)) {
                    const balanceUpdate: number = Number(walletResults[0].balance) - Number(withdraw);
                    const wallet: WalletType = {balance: balanceUpdate}
                    Wallet.update(wallet, (error, result) => {
                        if (error) {
                            callback(error);
                            return;
                        }
                        callback(null, result);
                    })
                } else {
                    callback(null, {message: `You don't have money enought! Your balance is ${walletResults[0].balance}`})
                }
            }
        });
    },
    balance: (callback: Callback) => {
        const sql = `select * from ${TABLE}`;
        db.query(sql, (error, results) => {
            if (error) {
                callback(error);
                return;
            }
            callback(null, {balance: results[0].balance});
        });
    },
    create: (deposit: number, callback: Callback) => {
        const insertQuery = `INSERT INTO ${TABLE} (balance) VALUES (?) `;
        db.query(insertQuery, [deposit], (error) => {
            if (error) {
                callback(error);
                return;
            }
            callback(null, {success: true, message: `you create new deposit: ${deposit}`});
        });
    },
    update: (updatedWallet: WalletType, callback: Callback) => {
        const updateUserQuery = `UPDATE ${TABLE} SET balance = ?, updated_at = ?`;
        db.query(
            updateUserQuery, 
            [updatedWallet.balance, new Date()], 
            (error) => {
                if (error) {
                    callback(error);
                    return;
                }
                callback(null, {success: true, message: `Your balance is updated!`});
            }
        );
    }
}

export default Wallet;