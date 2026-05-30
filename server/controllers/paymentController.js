const Payment = require('../models/Payment');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

const ensurePayment = async (studentId) => {
  let payment = await Payment.findOne({ student: studentId });
  if (!payment) {
    payment = await Payment.create({
      student: studentId,
      totalFees: 25000,
      paidAmount: 25000, // Students pay 25000 upfront for the semester
      status: 'paid',
    });
  }
  return payment;
};

const getMyPayment = async (req, res, next) => {
  try {
    const paymentDoc = await ensurePayment(req.user.id);
    
    // Dynamically calculate food budget usage
    const transactions = await Transaction.find({ student: req.user.id });
    const usedFoodBudget = transactions.reduce((acc, t) => acc + t.totalAmount, 0);
    const leftFoodBudget = Math.max(0, 15000 - usedFoodBudget);
    
    const payment = {
      ...paymentDoc.toJSON(),
      totalFees: 25000,
      paidAmount: 25000,
      status: 'paid',
      usedFoodBudget,
      leftFoodBudget,
    };
    
    res.json({ success: true, payment });
  } catch (error) {
    next(error);
  }
};

const payNow = async (req, res, next) => {
  try {
    const paymentDoc = await ensurePayment(req.user.id);
    paymentDoc.paidAmount = 25000;
    paymentDoc.status = 'paid';
    paymentDoc.lastPaidAt = new Date();
    await paymentDoc.save();
    
    const transactions = await Transaction.find({ student: req.user.id });
    const usedFoodBudget = transactions.reduce((acc, t) => acc + t.totalAmount, 0);
    const leftFoodBudget = Math.max(0, 15000 - usedFoodBudget);
    
    const payment = {
      ...paymentDoc.toJSON(),
      totalFees: 25000,
      paidAmount: 25000,
      status: 'paid',
      usedFoodBudget,
      leftFoodBudget,
    };
    
    res.json({ success: true, payment, message: 'Payment simulated successfully.' });
  } catch (error) {
    next(error);
  }
};

const listPayments = async (_req, res, next) => {
  try {
    const students = await User.find({ role: 'student' }).select('_id username email');
    const payments = await Payment.find().populate('student', 'username email');
    const transactions = await Transaction.find();
    
    // Map of studentId -> sum(totalAmount)
    const transactionTally = {};
    transactions.forEach(t => {
      const sId = String(t.student);
      transactionTally[sId] = (transactionTally[sId] || 0) + t.totalAmount;
    });

    const byStudent = new Map(payments.map((p) => [String(p.student?._id || p.student), p]));
    const result = students.map((student) => {
      const usedFoodBudget = transactionTally[String(student._id)] || 0;
      const leftFoodBudget = Math.max(0, 15000 - usedFoodBudget);
      
      return {
        student,
        totalFees: 25000,
        paidAmount: 25000,
        status: 'paid',
        usedFoodBudget,
        leftFoodBudget,
      };
    });
    res.json({ success: true, payments: result });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMyPayment, payNow, listPayments, markPaidByAdmin };

async function markPaidByAdmin(req, res, next) {
  try {
    const { studentId } = req.body;
    const paymentDoc = await ensurePayment(studentId);
    paymentDoc.paidAmount = 25000;
    paymentDoc.status = 'paid';
    paymentDoc.lastPaidAt = new Date();
    await paymentDoc.save();
    
    const transactions = await Transaction.find({ student: studentId });
    const usedFoodBudget = transactions.reduce((acc, t) => acc + t.totalAmount, 0);
    const leftFoodBudget = Math.max(0, 15000 - usedFoodBudget);
    
    const payment = {
      ...paymentDoc.toJSON(),
      totalFees: 25000,
      paidAmount: 25000,
      status: 'paid',
      usedFoodBudget,
      leftFoodBudget,
    };
    
    res.json({ success: true, payment });
  } catch (error) {
    next(error);
  }
}
