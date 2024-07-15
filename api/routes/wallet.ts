import express from 'express';
const router = express.Router();
import wallet from '../controllers/wallet.js';

router.post('/deposit', wallet.deposit);
router.post('/withdraw', wallet.withdraw);
router.get('/balance', wallet.balance);

export default router;