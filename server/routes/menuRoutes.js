const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getWeeklyMenu,
  saveWeeklyMenu,
  getActivePreferenceForm,
  createPreferenceForm,
  submitPreferenceResponse,
  getSuggestedMenu,
} = require('../controllers/menuController');
const {
  addDailyItem,
  getDailyItems,
  toggleDailyItem,
  deleteDailyItem,
} = require('../controllers/dailyItemController');

const router = express.Router();

router.use(protect);
router.get('/weekly', getWeeklyMenu);
router.post('/weekly', authorize('admin'), saveWeeklyMenu);
router.get('/preferences/form', getActivePreferenceForm);
router.post('/preferences/form', authorize('admin'), createPreferenceForm);
router.post('/preferences/submit', authorize('student'), submitPreferenceResponse);
router.get('/preferences/suggestions', authorize('admin'), getSuggestedMenu);

// Daily items routes
router.get('/daily-items', getDailyItems);
router.post('/daily-items', authorize('admin'), addDailyItem);
router.patch('/daily-items/:id/toggle', authorize('admin'), toggleDailyItem);
router.delete('/daily-items/:id', authorize('admin'), deleteDailyItem);

module.exports = router;
