const mongoose = require('mongoose');

const uri = 'mongodb+srv://avengers4368_db_user:helix_448@syncboard.b1nwvqr.mongodb.net/hmmsDB';

async function main() {
  try {
    await mongoose.connect(uri);
    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    console.log('--- ALL REGISTERED USERS ---');
    console.log(JSON.stringify(users, null, 2));
    console.log('---------------------------');
    process.exit(0);
  } catch (error) {
    console.error('Error connecting or querying:', error);
    process.exit(1);
  }
}

main();
