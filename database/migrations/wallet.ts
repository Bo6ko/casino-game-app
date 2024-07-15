const create_wallet_table = `CREATE table IF NOT EXISTS wallet (
    id INT PRIMARY KEY AUTO_INCREMENT,
    balance DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
	created_at DATETIME DEFAULT NOW(),
	updated_at TIMESTAMP
)`;

export default create_wallet_table;
