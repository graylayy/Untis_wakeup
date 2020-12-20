const WebUntisLib = require('webuntis');
const db=require("./database");

const untis = new WebUntisLib.WebUntisAnonymousAuth(
	'mallinckrodt-gym',
	'nessa.webuntis.com'
);

module.exports.isClass= function isClass(klasse,chatID){
    return new Promise(function(resolve, reject) {
    untis
	.login()
    .then(() => {
        return untis.getClasses();
    })
    .then((classes)=>{
        classes.forEach(element => {
            if(element.name===klasse){
                db.insertclass(element.id,chatID);
                return resolve(true);
            }
        });
        return resolve(false);
        
        })
    })
}

module.exports.isKurs = async function isKurs(chatID){
    return new Promise(function(resolve, reject) {
    let classID=db.getclasID(chatID);
    untis
	.login()
    .then(() => {
        return untis.getSubjects();
    })
    .then((subjects)=>{
        console.log(subjects);
    })
    )}
}
