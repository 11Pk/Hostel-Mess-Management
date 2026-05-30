const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const { getMyPayment, payNow, listPayments, markPaidByAdmin } = require('../controllers/paymentController');
const { processScan, getStudentTransactions } = require('../controllers/transactionController');

const router = express.Router();

router.use(protect);
router.get('/me', authorize('student'), getMyPayment);
router.post('/pay', authorize('student'), payNow);
router.get('/all', authorize('admin'), listPayments);
router.post('/mark-paid', authorize('admin'), markPaidByAdmin);

// Scanning & Purchase Billing
router.post('/scan-transaction', authorize('admin'), processScan);
router.get('/transactions/me', authorize('student'), getStudentTransactions);

module.exports = router;
