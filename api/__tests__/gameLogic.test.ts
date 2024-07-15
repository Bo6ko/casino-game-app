import request from 'supertest';
import app from '../../app.js';
import Wallet from '../models/wallet.js';
import Bets from '../models/bets.js';
import { WalletType } from '../types/wallet.js';
import { BetsType } from '../types/bets.js';

jest.mock('../models/wallet');
jest.mock('../models/bets');


describe('POST /play', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    // integration test from controller file:
    test('Should return response status 200 and balance to be updated', async () => {   
        
        // Mock Bets.create
        (Bets.create as jest.Mock).mockImplementation((bets: BetsType, callback) => {
            callback(null);
        });

        // Mock Wallet.balance
        (Wallet.balance as jest.Mock).mockImplementation((callback) => {
            callback(null, { balance: 100 });
        });

        // Mock Wallet.update
        let walletBalance: number = 0;
        (Wallet.update as jest.Mock).mockImplementation(async (wallet: WalletType, callback) => {
            await callback(null, wallet);
            walletBalance = wallet.balance;
        });

        const response = await request(app)
            .post('/play')
            .send({ bet: 10 });

        expect(response.statusCode).toBe(200);    

        console.log(response.body)
        let lines = 0
        const matrix = response.body.matrix;
        for ( let i = 0; i < matrix.length; i++ ) {
            if ( matrix[i][0] === matrix[i][1] && matrix[i][1] === matrix[i][2] ) {
                lines++;
            }
        }

        switch(lines) {
            case 1: 
                expect(walletBalance).toBe(140); 
                expect(response.body.winning).toBe(50); 
                break;
            case 2: 
                expect(walletBalance).toBe(190); 
                expect(response.body.winning).toBe(100); 
                break;
            case 3: 
                expect(walletBalance).toBe(240); 
                expect(response.body.winning).toBe(150); 
                break;

            default:
                expect(walletBalance).toBe(90); 
                break;
        }
    });
});

describe('POST /sim', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    // integration test from controller file:
    test('Should return response status 200 and balance to be updated', async () => {   
        // Mock Wallet.balance
        (Wallet.balance as jest.Mock).mockImplementation((callback) => {
            callback(null, { balance: 300 });
        });

        // Mock Bets.create
        (Bets.create as jest.Mock).mockImplementation((bets: BetsType, callback) => {
            callback(null);
        });

        // Mock Wallet.update
        let walletBalance: number = 0;
        (Wallet.update as jest.Mock).mockImplementation(async (wallet: WalletType, callback) => {
            await callback(null, wallet);
            walletBalance = wallet.balance;
        });

        const response = await request(app)
            .post('/sim')
            .send({ 
                count: 10,
                bet: 10
            });

        expect(response.statusCode).toBe(200);    

        const totalWinning = response.body.totalWinning;
        const netResult = response.body.netResult;
        expect(netResult).toBe(100); 

        // some cases for balance, depend on totalWinning:
        switch(totalWinning) {
            case 50: 
                expect(walletBalance).toBe(250); 
                break;
            case 100: 
                expect(walletBalance).toBe(300); 
                break;
            case 150: 
                expect(walletBalance).toBe(350); 
                break;
        }
    });
});

describe('GET /rtp', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    // integration test from controller file:
    test('Should return response status 200', async () => {   
        // Mock Bets.create
        (Bets.getTotalFromAllBets as jest.Mock).mockImplementation((callback) => {
            callback(null, { totalBet: 100, totalWinning: 50 });
        });

        const response = await request(app)
            .get('/rtp');

        expect(response.statusCode).toBe(200);    
    });
});

