import db from './db.js'
const class_details=async(t)=>{
    const [rows]= await db.connection.query('SELECT * from CLASS where EVENT_ID=?',[t]);
    return rows;
    }
;
const get_class_name=async(t)=>{
    const [rows]=await db.connection.query('SELECT  CLASS_NAME from CLASS  where CLASS_ID=?',[t]);
    return rows[0];
}
    export default {class_details,get_class_name};