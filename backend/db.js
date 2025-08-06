const oracledb = require('oracledb');

async function connectDB() {
  try {
    const connection = await oracledb.getConnection({
      user: 'COMP214_M25_zor_90',
      password: 'password',  // ← ⚠️ 記得改做你真實密碼
      connectString: 'oracle1.centennialcollege.ca:1521/SQLD'
    });

    console.log('✅ Connected to Oracle DB');
    return connection;

  } catch (err) {
    console.error('❌ Oracle DB connection error:', err.message);
  }
}

module.exports = connectDB;