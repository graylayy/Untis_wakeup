const WebUntisLib = require('webuntis');
const axios = require('axios');
var schedule = require('node-schedule');
const config=require("./config");

const my_lessons=["CH G2","D  G2","E  G2","PXE2","EK L2","IF G1","M  L2","MU G2","SW G2","SP G4","KR G4"]
const today=new Date();

const untis = new WebUntisLib.WebUntisAnonymousAuth(
	'mallinckrodt-gym',
	'nessa.webuntis.com'
);

untis
	.login()
    .then(() => {
        return untis.getTimetableFor(new Date(today.getFullYear(),today.getMonth(),today.getDate()),209, WebUntisLib.TYPES.CLASS);
    })
	.then(timetable => {
        let starttime=0;
        timetable.forEach(element => {
            //console.log(element);
            if(element.code!="irregular"&&element.code!="cancelled"){
                if(my_lessons.includes(element.su[0].name)){
                    if(starttime>element.startTime||starttime==0){
                        starttime=element.startTime
                        //console.log(element);
                    }
                }
            }
        });
        return starttime;
    })
    .then(starttime =>{
        setTimer(starttime);
    })

function setTimer(starttime){
    if(starttime>0){
        const wakeup_hours=1
        const wakeup_minutes=40+10
        const startdate=new Date(today.getFullYear(), today.getMonth(), today.getDate(), WebUntisLib.convertUntisTime(starttime).getHours()-wakeup_hours, WebUntisLib.convertUntisTime(starttime).getMinutes()-wakeup_minutes, 0);
        console.log("Weker fängt um: "+startdate.getHours()+":"+startdate.getMinutes()+" Uhr an zu wecken!");
        var j = schedule.scheduleJob(startdate, function(){
            axios.get(config.lampencall);
            setTimeout(function(){axios.get(config.alarmcall);},570000)
        });
   }else{
       console.log("Kein Wecker für morgen gestellt!");
   }
}
