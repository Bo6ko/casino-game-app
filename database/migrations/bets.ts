const create_bets_table = `CREATE table IF NOT EXISTS bets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    bet DECIMAL(10, 2) NOT NULL,
    winnings DECIMAL(10, 2) NOT NULL,
	created_at DATETIME DEFAULT NOW(),
	updated_at TIMESTAMP
)`;

export default create_bets_table;
