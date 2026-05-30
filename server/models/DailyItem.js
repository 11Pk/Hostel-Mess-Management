const mongoose = require('mongoose');

const dailyItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
      default: 0,
    },
    category: {
      type: String,
      enum: ['meal', 'extra'],
      default: 'extra',
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true,
    },
  },
  { timestamps: true }
);

// Compound index to ensure item name is unique per date and category
dailyItemSchema.index({ name: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyItem', dailyItemSchema);
