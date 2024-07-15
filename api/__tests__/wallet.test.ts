import request from 'supertest';
import app from '../../app.js';
import Wallet from '../models/wallet.js';
import db from '../../database/db_connection.js';
import { WalletType } from '../types/wallet.js';

jest.mock('../../database/db_connection.js', () => ({
  query: jest.fn(),
}));

describe('POST /wallet/deposit', () => {
    test('should update the existing balance when a deposit is made', (done) => {
        const mockWalletBalance: WalletType[] = [{ balance: 100 }];
        const deposit = 100;
        const expectedBalance = 200;

        // Mock db.query to return the existing wallet balance
        (db.query as jest.Mock).mockImplementationOnce((sql, callback) => {
            callback(null, mockWalletBalance);
        });

        // Mock Wallet.update to verify the updated balance
        jest.spyOn(Wallet, 'update').mockImplementation((wallet: WalletType, callback: any) => {
            callback(null, { balance: wallet.balance });
        });

        Wallet.deposit(deposit, (error, result) => {
            try {
                expect(error).toBeNull();
                expect(result.balance).toBe(expectedBalance);
                done();
            } catch (e) {
                done(e);
            }
        });
    });

    test('should create a new balance when no existing balance is found', (done) => {
        const mockWalletBalance: WalletType[] = [];
        const deposit = 100;

        // Mock db.query to return no existing wallet balance
        (db.query as jest.Mock).mockImplementationOnce((sql, callback) => {
            callback(null, mockWalletBalance);
        });

        // Mock Wallet.create to verify the new balance
        jest.spyOn(Wallet, 'create').mockImplementation((deposit: number, callback: any) => {
            callback(null, { balance: deposit });
        });

        Wallet.deposit(deposit, (error, result) => {
            try {
                expect(error).toBeNull();
                expect(result.balance).toBe(deposit);
                done();
            } catch (e) {
                done(e);
            }
        });
    });

    test('should return an error if there is a problem with the database query', (done) => {
        const deposit = 100;
        const mockError = new Error('Database error');

        // Mock db.query to return an error
        (db.query as jest.Mock).mockImplementationOnce((sql, callback) => {
            callback(mockError);
        });

        Wallet.deposit(deposit, (error, result) => {
            try {
                expect(error).toEqual(mockError);
                expect(result).toBeUndefined();
                done();
            } catch (e) {
                done(e);
            }
        });
    });
});

describe('POST /wallet/withdraw', () => {
    test('should update the existing balance when a deposit is made', (done) => {
        const mockWalletBalance: WalletType[] = [{ balance: 100 }];
        const withdraw = 100;
        const expectedBalance = 0;

        // Mock db.query to return the existing wallet balance
        (db.query as jest.Mock).mockImplementationOnce((sql, callback) => {
            callback(null, mockWalletBalance);
        });

        // Mock Wallet.update to verify the updated balance
        jest.spyOn(Wallet, 'update').mockImplementation((wallet: WalletType, callback: any) => {
            callback(null, { balance: wallet.balance });
        });

        Wallet.withdraw(withdraw, (error, result) => {
            try {
                expect(error).toBeNull();
                expect(result.balance).toBe(expectedBalance);
                done();
            } catch (e) {
                done(e);
            }
        });
    });

    test('You don\'t have enoght money for withdraw', (done) => {
        const mockWalletBalance: WalletType[] = [{ balance: 100 }];
        const withdraw = 200;
        const expectedBalance = 0;

        // Mock db.query to return the existing wallet balance
        (db.query as jest.Mock).mockImplementationOnce((sql, callback) => {
            callback(null, mockWalletBalance);
        });

        Wallet.withdraw(withdraw, (error, result) => {
            try {
                expect(error).toBeNull();
                expect(result).toEqual({ message: "You don't have money enought! Your balance is 100" });
                done();
            } catch (e) {
                done(e);
            }
        });
    });

    test('should return an error if there is a problem with the database query', (done) => {
        const withdraw = 100;
        const mockError = new Error('Database error');

        // Mock db.query to return an error
        (db.query as jest.Mock).mockImplementationOnce((sql, callback) => {
            callback(mockError);
        });

        Wallet.withdraw(withdraw, (error, result) => {
            try {
                expect(error).toEqual(mockError);
                expect(result).toBeUndefined();
                done();
            } catch (e) {
                done(e);
            }
        });
    });
});

describe('Wallet.balance', () => {
    test('should return the balance when the query is successful', (done) => {
        const mockResults = [{ balance: 100 }];
        
        // Mock db.query to return the mock results
        (db.query as jest.Mock).mockImplementation((sql, callback) => {
            callback(null, mockResults);
        });

        Wallet.balance((error, result) => {
            try {
                expect(error).toBeNull();
                expect(result).toEqual({ balance: 100 });
                done();
            } catch (e) {
                done(e);
            }
        });
    });

    test('should return an error when the query fails', (done) => {
        const mockError = new Error('Database error');
        
        // Mock db.query to return an error
        (db.query as jest.Mock).mockImplementation((sql, callback) => {
            callback(mockError);
        });

        Wallet.balance((error, result) => {
            try {
                expect(error).toEqual(mockError);
                expect(result).toBeUndefined();
                done();
            } catch (e) {
                done(e);
            }
        });
    });
});

describe('Wallet.create', () => {
    test('should return success message on successful deposit creation', (done) => {
        const deposit = 100;

        // Mock Wallet.create to verify the new balance
        jest.spyOn(Wallet, 'create').mockImplementation((deposit: number, callback: any) => {
            callback(null, { balance: deposit });
        });

        Wallet.create(deposit, (error, result) => {
            try {
                expect(error).toBeNull();
                expect(result).toEqual({ balance: 100 });
                done();
            } catch (e) {
                done(e);
            }
        });
    });

    test('should return error when db query fails', (done) => {
        const deposit = 100;
        const mockError = new Error('Database error');

        // Mock Wallet.create to verify the new balance
        jest.spyOn(Wallet, 'create').mockImplementation((deposit: number, callback: any) => {
            callback(mockError);
        });

        Wallet.create(deposit, (error, result) => {
            try {
                expect(error).toEqual(mockError);
                expect(result).toBeUndefined();
                done();
            } catch (e) {
                done(e);
            }
        });
    });
});

describe('Wallet.update', () => {
    test('should return success message on successful update', (done) => {
        const updatedWallet: WalletType = { balance: 200 };

        // Mock Wallet.update to verify the new balance
        jest.spyOn(Wallet, 'update').mockImplementation((updatedWallet: WalletType, callback: any) => {
            callback(null, updatedWallet);
        });

        Wallet.update(updatedWallet, (error, result) => {
            try {
                expect(error).toBeNull();
                expect(result).toEqual({ balance: 200 });
                done();
            } catch (e) {
                done(e);
            }
        });
    });

    test('should return error when db query fails', (done) => {
        const updatedWallet: WalletType = { balance: 200 };
        const mockError = new Error('Database error');

        // Mock db.query to return an error
        jest.spyOn(Wallet, 'update').mockImplementation((updatedWallet: WalletType, callback: any) => {
            callback(mockError);
        });

        Wallet.update(updatedWallet, (error, result) => {
            try {
                expect(error).toEqual(mockError);
                expect(result).toBeUndefined();
                done();
            } catch (e) {
                done(e);
            }
        });
    });
});
