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
        let isindb =await conn.query("SELECT * FROM untis.wecker_users WHERE chatID=?",attributes[0])
        console.log(isindb);
        if(isindb[0]==undefined){
        await conn.query("INSERT INTO untis.wecker_users (chatID,name,webhook1,enabeled) VALUES (?,?,?,?);",attributes);
        } else{
            attributes.push(attributes[0])
            await conn.query("UPDATE untis.wecker_users SET chatID=?,name=?,webhook1=?,enabeled=? WHERE chatID=?;",attributes)
        }
    } catch (err) {
	    throw err;
    } finally {
	    if (conn) return conn.end();
    }
}