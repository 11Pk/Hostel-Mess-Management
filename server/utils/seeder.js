const Menu = require('../models/Menu');
const DailyItem = require('../models/DailyItem');

// Calculate current week's Monday date as YYYY-MM-DD
const getMonday = (d) => {
  d = new Date(d);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff)).toISOString().slice(0, 10);
};

const menuData = {
  monday: {
    breakfast: 'Aloo Pyaz Paratha, Butter, Tea',
    lunch: 'Rajma, Jeera Rice, Masala Mix Raita, Roti',
    snacks: 'Bhelpuri',
    dinner: 'Chana Masala, Arhar Dal, Roti, Rice, Icecream',
  },
  tuesday: {
    breakfast: 'Poha, Daliya, Tea',
    lunch: 'Paneer Do Pyaza, Panchratan Dal, Rice, Roti',
    snacks: 'Banana Shake',
    dinner: 'Mix Veg., Dal Makhani, Rice, Roti, Rasmalai',
  },
  wednesday: {
    breakfast: 'Nutri Kulcha, Tea',
    lunch: 'Kadhi Pakoda, Rice, Roti',
    snacks: 'Chips/Biscuits',
    dinner: 'Kadhai Chicken/Paneer Tikka Masala, Lachha Paratha, Rice, Dal Tadka',
  },
  thursday: {
    breakfast: 'Idli Vada, Sambhar Chutney, TEA',
    lunch: 'Gobi Aloo, Boondi Raita, Veg Pulao, Arhar Dal, Roti',
    snacks: 'Patties',
    dinner: 'Lauki Chana, Panchratan Dal, Roti, Jeera Rice, Icecream',
  },
  friday: {
    breakfast: 'Mix Paratha, Butter, Tea',
    lunch: 'Aloo Matar Sabji, Rice, Roti, Cucumber Raita',
    snacks: 'Papaya Shake',
    dinner: 'Egg Cury/Matar Paneer, Roti, Rice, Masoor Dal',
  },
  saturday: {
    breakfast: 'Dosa, Uttapam, Sambhar, Chutney, Tea',
    lunch: 'Chole, Boondi Pudina Raita, Roti, Jeera Rice',
    snacks: 'Veg. Sandwich',
    dinner: 'Bhindi Pyaz, Dal Tadka, Roti, Rice, Sponge Rasgulla',
  },
  sunday: {
    breakfast: 'AMRITSARI NAAN CHHOLE, BUTTER, TEA',
    lunch: 'Aloo Jeera, Chana Dal, Roti, Rice',
    snacks: 'Tea',
    dinner: 'Chilly Paneer, Dal Makhni, Roti, Jeera Rice',
  },
};

const seedMenuAndDailyItems = async () => {
  try {
    const weekStartDate = getMonday(new Date());
    const todayDate = new Date().toISOString().slice(0, 10);
    
    console.log(`🌱 Running database seeder for week: ${weekStartDate} & date: ${todayDate}`);

    // 1. Seed Weekly Menu for today's date (since backend defaults to today's date)
    await Menu.findOneAndUpdate(
      { weekStartDate: todayDate },
      { weekStartDate: todayDate, days: menuData },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // 2. Seed Weekly Menu for Monday of the current week (to support Monday alignment queries)
    await Menu.findOneAndUpdate(
      { weekStartDate },
      { weekStartDate, days: menuData },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    
    console.log('✅ Weekly Menu successfully seeded/updated for both today and Monday.');

    // 2. Seed Daily Base & Extra Items for Today
    const dailyItems = [
      // DAILY Base items
      { name: 'Sprouts', price: 10, category: 'meal', date: todayDate },
      { name: 'Pickle', price: 2, category: 'meal', date: todayDate },
      { name: 'Sauce', price: 2, category: 'meal', date: todayDate },
      { name: 'Jam', price: 5, category: 'meal', date: todayDate },
      { name: 'Bread & Butter', price: 15, category: 'meal', date: todayDate },
      { name: 'Peanut Butter', price: 10, category: 'meal', date: todayDate },
      { name: 'Corn Flakes with Milk', price: 20, category: 'meal', date: todayDate },
      { name: 'Salad (Khiera, Onion, Lemon, Beetroot)', price: 10, category: 'meal', date: todayDate },
      { name: 'Saunf', price: 1, category: 'meal', date: todayDate },
      { name: 'Tea', price: 7, category: 'meal', date: todayDate },

      // EXTRA add-on items (breakfast, lunch, dinner extras)
      { name: 'Butter Packet', price: 5, category: 'extra', date: todayDate },
      { name: 'Curd Packet', price: 10, category: 'extra', date: todayDate },
      { name: 'Extra Bread Slices', price: 5, category: 'extra', date: todayDate },
      { name: 'Fresh Fruits', price: 20, category: 'extra', date: todayDate },
      { name: 'Boiled Eggs (2)', price: 15, category: 'extra', date: todayDate },
      { name: 'Omelette', price: 15, category: 'extra', date: todayDate },
      { name: 'Egg Bhurji', price: 20, category: 'extra', date: todayDate },
      { name: 'Lassi', price: 20, category: 'extra', date: todayDate },
      { name: 'Fruits Bowl', price: 20, category: 'extra', date: todayDate },
      { name: 'Milk Packet', price: 25, category: 'extra', date: todayDate },
      { name: 'Hot Milk Glass', price: 15, category: 'extra', date: todayDate },
    ];

    // Seed daily items by upserting on name + date combo to avoid duplications
    const promises = dailyItems.map((item) =>
      DailyItem.findOneAndUpdate(
        { name: item.name, date: item.date },
        item,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      )
    );
    await Promise.all(promises);
    console.log(`✅ Daily Items and Extras successfully seeded/updated for ${todayDate}.`);

  } catch (error) {
    console.error('❌ Seeder failed:', error);
  }
};

module.exports = seedMenuAndDailyItems;
