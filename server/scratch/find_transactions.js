const mongoose = require('mongoose');

const uri = 'mongodb+srv://avengers4368_db_user:helix_448@syncboard.b1nwvqr.mongodb.net/hmmsDB';

async function main() {
  try {
    await mongoose.connect(uri);
    const transactions = await mongoose.connection.db.collection('transactions').find({}).toArray();
    console.log('--- ALL TRANSACTIONS ---');
    console.log(JSON.stringify(transactions, null, 2));
    console.log('------------------------');
    process.exit(0);
  } catch (error) {
    console.error('Error connecting or querying:', error);
    process.exit(1);
  }
}

main();
