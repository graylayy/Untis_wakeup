//CREATE TABLE wecker_users (id int,chatID int,name TINYTEXT,webhook1 TEXT,webhook2 TEXT,PRIMARY KEY(id));
const mariadb = require('mariadb');
const config=require("./config");

const pool = mariadb.createPool({
    host: 'localhost', 
    user: config.dbusername, 
    password: config.dbpass,
    connectionLimit: 5
});
module.exports.newUser =async function newUser(attributes){
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.query("INSERT INTO untis.wecker_users (chatID,name,webhook1,enabeled) VALUES (?,?,?,?);",attributes);
    } catch (err) {
	    throw err;
    } finally {
	    if (conn) return conn.end();
    }
}