import { MysqlError } from "mysql";

import { MatrixResponse, Sim, SimResponse, Symbols } from "../types/gameLogic.js";
import { getRandomNumber } from "../utils/utils.js";
import Bets from "./bets.js";
import { BetsType, Rtp } from "../types/bets.js";
import Wallet from "./wallet.js";
import { WalletType } from "../types/wallet.js";

type Callback = (
    err: MysqlError | null, 
    results?: any
) => void;

const GameLogic = {
    play: (bet: number, callback: Callback) => {
        const matrix: MatrixResponse = getMatrix(bet);
        const bets: BetsType = {
            bet: bet,
            winning: matrix.winning
        }
        Bets.create(bets, (err: MysqlError | null) => {
            if(err) {
                callback(err);
            } else {
                Wallet.balance((err: MysqlError | null, wallet: WalletType) => {
                    if(err) {
                        callback(err);
                    }
                    if ( wallet.balance >= bet ) {
                        const balanceUpdated: number = Number(wallet.balance) - Number(bet) + Number(matrix.winning);
                        wallet.balance = balanceUpdated;
                        Wallet.update(wallet, (err: MysqlError | null, wallet: WalletType) => {
                            if(err) {
                                callback(err);
                            }
                        })
                        callback(null, matrix);
                    } else {
                        callback(null, {message: `Your balance ${wallet.balance} is smaller than your ${bet}`});
                    }
                })
            }
        });
    },
    sim: (sim: Sim, callback: Callback) => {
        let totalWinning = 0
        Wallet.balance((err: MysqlError | null, wallet: WalletType) => {
            if(err) {
                callback(err);
            }
            if ( wallet.balance >= (sim.count * sim.bet) ) {
                for (let i = 0; i < sim.count; i++) {
                    const winning = getMatrix(sim.bet).winning;
                    totalWinning += winning;

                    const bets: BetsType = {
                        bet: sim.bet,
                        winning: winning
                    }
                    Bets.create(bets, (err: MysqlError | null) => {
                        if(err) {
                            callback(err);
                        }
                    });
                }

                const balanceUpdated: number = Number(wallet.balance) - Number(sim.count * sim.bet) + Number(totalWinning);
                wallet.balance = balanceUpdated;
                Wallet.update(wallet, (err: MysqlError | null, wallet: WalletType) => {
                    if(err) {
                        callback(err);
                    }
                })

                const simResponse: SimResponse = {
                    totalWinnings: totalWinning,
                    netResult: sim.count * sim.bet
                }
                callback(null, simResponse);
            } else {
                callback(null, {message: `Your balance ${wallet.balance} is smaller than your ${(sim.count * sim.bet)}`});
            }
        })
    },
    rtp: (callback: Callback) => {
        Bets.getTotalFromAllBets((err: MysqlError | null, rtpResult: Rtp) => {
            if(err) {
                callback(err);
            } else {
                console.log(rtpResult)
                callback(null, (rtpResult.totalWinning / rtpResult.totalBet * 100) - 100);
            }
        });
    }
}

//Отговор:   Общо символите са 5 (например - череша, круша, ябълка, диня, пъпеш)
const symbols: Symbols[] = ['череша', 'круша', 'ябълка', 'диня', 'пъпеш'];

//Отговор:   Всеки барабан се състои от Х на брой символа - да кажем 30. Всеки барабан е редица от случайно избрани символи 
const createBaraban = (count: number = 30): Symbols[] => {
    const arr: Symbols[] = []
    for (let i = 0; i < count; i++) {
        const getSymbolIndex = getRandomNumber(symbols.length);
        arr.push(symbols[getSymbolIndex]);
    }
    return arr;
}

// Отговор:    Не точно. Всеки барабан спира на случайна позиция от дължината му (рандъм 0, 30 да кажем). В матрицата влизат символа на този индекс + следващите 2.
const getCow = (): Symbols[] => {
    const baraban: Symbols[] = createBaraban();
    let index: number = getRandomNumber(baraban.length);

    const col: Symbols[] = []; 
    for (let i = 0; i < 3; i++) {
        const element = baraban[index];
        index = ( index + 1 === baraban.length ) ? 0 : index+=1;
        col.push(element);
    }
    
    return col;
}

const checkForWinningRow = (el1: string, el2: string, el3: string) => {
    const isWinning = (el1 === el2 && el2 === el3) ? true : false;
    return isWinning;
}

const getMatrix = (bet: number): MatrixResponse => {
    const matrix: any = [];
    const col1 = getCow();
    const col2 = getCow();
    const col3 = getCow();

    let winning = 0;
    // понеже барабаните мисля, че са по вертикалата образувам редовете на матрицата по тази логика.
    for (let i = 0; i < 3; i++) {
        const row = [col1[i], col2[i], col3[i]];
        winning += checkForWinningRow(col1[i], col2[i], col3[i]) ? winning = bet * 5 : 0;
        matrix.push(row);
    }

    return { matrix, winning };
}

const getMultipleMatrixWin = (sim: Sim): number => {
    let winning = 0
    for (let i = 0; i < sim.count; i++) {
        winning += getMatrix(sim.bet).winning;
    }

    return winning;
}

export default GameLogic;