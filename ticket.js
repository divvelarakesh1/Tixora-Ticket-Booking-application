import db from './db.js'
import crypto from 'bcryptjs'
const ticket_info=async(t)=>{
  const [rows]= await db.connection.query('SELECT * from BOOKINGS where USERNAME=?',[t]);

  return rows;
}
const  insert_into_table=async(t)=>{
  const input=t.username+t.eventid+new Date().toLocaleTimeString();
  const salt = crypto.genSaltSync(10);
  const hash = crypto.hashSync(input, salt);
  const bookingId= hash.replace(/[^a-fA-F0-9]/g, '').toLowerCase().slice(0, 10);
  await db.connection.query('CALL BOOK(?,?,?,?,?,?)', 
    [t.uname, t.class_id, bookingId, t.evenId,'USER TO ADMIN', t.ticket_count]);
    console.log(bookingId);
  return bookingId;
}
const transaction_details=async(t)=>{
const [rows]=await db.connection.query('SELECT * from TRANSACTION_DETAILS where TRANSACTION_ID=?',[t]);
return rows[0];
}
const cancellation=async(t)=>{
  
  await db.connection.query('CALL CANCEL(?)',[t]);
}

export default{ticket_info,insert_into_table,transaction_details,cancellation};