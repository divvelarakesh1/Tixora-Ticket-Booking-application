import db from './db.js'

const venue_name= async (t)=>{
    const [rows]=await db.connection.query('SELECT VENUE_NAME from VENUE where VENUE_ID=?',[t]);
    console.log(rows[0])
    return rows[0].VENUE_NAME;
}
const Total_capacity=async(t)=>{
    const [Total_capacity]=await db.connection.query('SELECT TOTAL_CAPACITY from VENUE where VENUE_ID=?',[t]);
    console.log(Total_capacity);
    return  Total_capacity;
}
export default {venue_name,Total_capacity}