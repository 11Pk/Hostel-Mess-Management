const DailyItem = require('../models/DailyItem');

const today = () => new Date().toISOString().slice(0, 10);

const addDailyItem = async (req, res, next) => {
  try {
    const { name, price, category, date } = req.body;
    
    if (!name || price === undefined) {
      return res.status(400).json({ success: false, message: 'Name and price are required.' });
    }

    const itemDate = date || today();

    // Check if item already exists for this date
    const existing = await DailyItem.findOne({ 
      name: name.trim(), 
      date: itemDate 
    });

    if (existing) {
      return res.status(400).json({ 
        success: false, 
        message: `An item named "${name}" is already listed for ${itemDate}.` 
      });
    }

    const newItem = await DailyItem.create({
      name: name.trim(),
      price: Number(price),
      category: category || 'extra',
      date: itemDate,
      isAvailable: true,
    });

    res.status(201).json({ success: true, item: newItem });
  } catch (error) {
    next(error);
  }
};

const getDailyItems = async (req, res, next) => {
  try {
    const queryDate = req.query.date || today();
    const items = await DailyItem.find({ date: queryDate }).sort({ category: 1, name: 1 });
    res.json({ success: true, date: queryDate, items });
  } catch (error) {
    next(error);
  }
};

const toggleDailyItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await DailyItem.findById(id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found.' });
    }

    item.isAvailable = !item.isAvailable;
    await item.save();

    res.json({ success: true, item });
  } catch (error) {
    next(error);
  }
};

const deleteDailyItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await DailyItem.findByIdAndDelete(id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found.' });
    }

    res.json({ success: true, message: 'Item deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addDailyItem,
  getDailyItems,
  toggleDailyItem,
  deleteDailyItem,
};
