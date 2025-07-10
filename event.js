
import db from './db.js'


const events= async (t)=>{

    const rows= await db.connection.query('select * from  EVENTS WHERE EVENT_ID=?',[t]);
    console.log(rows[0]);
    return rows[0][0];
}
const seatAvailablity=async(t)=>{
     const rows=await db.connection.query('select  count(*) from SEAT_INFO WHERE EVENTNAME=?',[t]);
     return rows[0]['count(*)']; 
}
const events_in_location=async(t)=>{
    const rows=await db.connection.query('select * from EVENTS WHERE LOCATION =?',[t]);
    return rows[0];
}
const events_of_type=async(t)=>{
    const rows=await db.connection.query('select * from EVENTS WHERE EVENT_TYPE =?',[t]);
  //  console.log(rows[0]);
 return rows[0];
}
const events_of_type_date=async(t)=>{
    const rows=await db.connection.query('select * from EVENTS WHERE EVENT_TYPE =? and DATE(DATE_AND_TIME)=? ',[t.eventType],[t.location]);
  //  console.log(rows[0]);
 return rows[0];
}
const events_of_type_in_location=async(t)=>{
    const rows=await db.connection.query('select * from EVENTS WHERE EVENT_TYPE =? and LOCATION=?',[t.eventType,t.location]);
 return rows[0];
}
const events_of_type_in_location_date=async(t)=>{
    const rows=await db.connection.query('select * from EVENTS WHERE EVENT_TYPE =? and LOCATION=? and DATE(DATE_AND_TIME)',[t.eventType],[t.location],[t.date]);
 return rows[0];
}
const no_of_seats_in_Class= async (t)=>{
    const rows=await db.connection.query('select  count(*) from SEAT_INFO WHERE EVENTNAME=?and CLASS_ID=?',[t.event_name],[t.class]);

}
const GET_EVENT_ID=async(t)=>{
    const rows=await db.connection.query('select EVENT_ID from EVENTS WHERE EVENT_NAME=?',[t]);
    console.log(rows[0]);
    console.log(rows[0][0].EVENT_ID);
    return rows[0][0].EVENT_ID;
}


export default{events,seatAvailablity,events_in_location,events_of_type,events_of_type_in_location,no_of_seats_in_Class,GET_EVENT_ID,events_of_type_in_location_date,events_of_type_date};