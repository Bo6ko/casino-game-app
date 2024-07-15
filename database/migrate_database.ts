import dotenv from 'dotenv';
dotenv.config();
import db from './db_connection.js';

import create_bets_table from './migrations/bets.js';
import create_wallet_table from './migrations/wallet.js';

console.log(create_bets_table);
db.query(create_bets_table);

console.log(create_wallet_table);
db.query(create_wallet_table);
