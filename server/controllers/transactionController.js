const Transaction = require('../models/Transaction');
const Payment = require('../models/Payment');
const User = require('../models/User');

const today = () => new Date().toISOString().slice(0, 10);

const processScan = async (req, res, next) => {
  try {
    const { studentId, items, totalAmount } = req.body;

    if (!studentId || !items || !Array.isArray(items) || items.length === 0 || totalAmount === undefined) {
      return res.status(400).json({ success: false, message: 'Invalid transaction payload.' });
    }

    // Verify student exists
    const student = await User.findById(studentId);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    // Create the transaction
    const transaction = await Transaction.create({
      student: studentId,
      items: items.map(item => ({
        itemId: item.itemId || item._id, // Handle both payload formats
        name: item.name,
        price: Number(item.price),
      })),
      totalAmount: Number(totalAmount),
      date: today(),
      scannedBy: req.user.id,
    });

    // Update or create payment record for the student
    let payment = await Payment.findOne({ student: studentId });
    if (!payment) {
      payment = new Payment({
        student: studentId,
        totalFees: 25000,
        paidAmount: 25000,
        status: 'paid',
      });
    } else {
      payment.totalFees = 25000;
      payment.paidAmount = 25000;
      payment.status = 'paid';
    }
    await payment.save();

    res.status(201).json({
      success: true,
      message: 'Transaction successfully processed and added to student bill.',
      transaction,
      updatedBilling: {
        totalFees: payment.totalFees,
        status: payment.status,
      }
    });
  } catch (error) {
    next(error);
  }
};

const getStudentTransactions = async (req, res, next) => {
  try {
    const studentId = req.user.id;
    const transactions = await Transaction.find({ student: studentId }).sort({ createdAt: -1 });
    res.json({ success: true, transactions });
  } catch (error) {
    next(error);
  }
};

const getAdminTransactions = async (req, res, next) => {
  try {
    const adminId = req.user.id;
    const transactions = await Transaction.find({ scannedBy: adminId })
      .populate('student', 'username email')
      .sort({ createdAt: -1 });
    res.json({ success: true, transactions });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  processScan,
  getStudentTransactions,
  getAdminTransactions,
};
