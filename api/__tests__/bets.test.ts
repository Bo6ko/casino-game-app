import Bets from '../models/bets.js';
import db from '../../database/db_connection.js';

// Mock the db.query method
jest.mock('../../database/db_connection.js', () => ({
  query: jest.fn(),
}));

describe('Bets.create', () => {
  test('should insert a bet and return the insertId on success', (done) => {
    // Arrange
    const bet = { bet: 10, winning: 0 };
    const mockInsertId = 1;
    const mockResults = { insertId: mockInsertId };

    // Mock db.query to call the callback with no error and mock results
    (db.query as jest.Mock).mockImplementation((query, values, callback) => {
      callback(null, mockResults);
    });

    // Act
    Bets.create(bet, (error, result) => {
      // Assert
      expect(error).toBeNull();
      expect(result).toEqual({ success: true, results: mockInsertId });
      done();
    });
  });

  test('should return an error if the insertion fails', (done) => {
    // Arrange
    const bet = { bet: 10, winning: 0 };
    const mockError = new Error('Insertion failed');

    // Mock db.query to call the callback with an error
    (db.query as jest.Mock).mockImplementation((query, values, callback) => {
      callback(mockError);
    });

    // Act
    Bets.create(bet, (error, result) => {
      // Assert
      expect(error).toEqual(mockError);
      expect(result).toBeUndefined();
      done();
    });
  });
});

describe('Bets.getTotalFromAllBets', () => {
    test('should return the total bet and total winning', (done) => {
      // Arrange
      const mockResult = [{ totalBet: 100, totalWinning: 0 }];
  
      // Mock db.query to call the callback with no error and mock results
      (db.query as jest.Mock).mockImplementation((sql, callback) => {
        callback(null, mockResult);
      });
  
      // Act
      Bets.getTotalFromAllBets((error, result) => {
        // Assert
        expect(error).toBeNull();
        expect(result).toEqual(mockResult[0]);
        done();
      });
    });
  
    test('should return an error if the insertion fails', (done) => {
      // Arrange
      const bet = { bet: 10, winning: 0 };
      const mockError = new Error('Insertion failed');
  
      // Mock db.query to call the callback with an error
      (db.query as jest.Mock).mockImplementation((sql, callback) => {
        callback(mockError);
      });
  
      // Act
      Bets.getTotalFromAllBets((error, result) => {
        // Assert
        expect(error).toEqual(mockError);
        expect(result).toBeUndefined();
        done();
      });
    });
  });
