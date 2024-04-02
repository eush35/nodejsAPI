require(process.env.MODULE_PATH + '/dotenv').config();
const mysql = require(process.env.MODULE_PATH + '/mysql2');
const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS;
const dbDatabase = process.env.DB_DATABASE;

const pool = mysql.createPool({
    host: dbHost,
    user: dbUser,
    password: dbPassword,
    database: dbDatabase,
    charset: 'utf8mb4',
    dateStrings: true,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Veritabanına bağlanırken hata oluştu:', err);
        return;
    }
    console.log('Veritabanı bağlantısı yapıldı');

    // Bağlantıyı serbest bırak
    connection.release();
});

module.exports = pool.promise();
