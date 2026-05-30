const mongoose = require('mongoose');
const uri = 'mongodb+srv://avengers4368_db_user:helix_448@syncboard.b1nwvqr.mongodb.net/hmmsDB';
async function test() {
  try {
    await mongoose.connect(uri);
    console.log('SUCCESS');
    process.exit(0);
  } catch(e) {
    console.log('ERROR:', e.message);
    process.exit(1);
  }
}
test();
