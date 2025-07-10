import db from './db.js'

import dotenv from 'dotenv'
dotenv.config();
const present = async (t) => {
    try {
        //console.log("entered present function");
        const [rows] = await db.connection.query('select count(*) from USERS where USERNAME=? ', [t]);
        console.log(rows[0]);
      //  console.log("completed");
        return rows[0]['count(*)'];
    }
    catch (err) {

    }
};
const insert = async ({ username, name, age, email, password, phonenumber }) => {
    try {

        await db.connection.query("Insert into USERS VALUES(?,?,?,?,?,?)"
            , [username, name, phonenumber, age, email, password]);
        //     const user={ name:username}
        //    const token= jwt.sign(user,process.env.ACCESS_TOKEN_SECRET)
    }
    catch (err) {
        console.log("Error in inserting into database");
    }
};
const userdata=async (t)=>{
    console.log(t);
    const [rows]=await db.connection.query('select * from USERS where USERNAME=?',[t]);
    console.log(rows[0]);
    return rows[0];
}
const uservalidation=async(t)=>{
    const [rows]=await db.connection.query('select PASSWORD from USERS where USERNAME =?',[t.username]);
    if(t.password===rows[0].PASSWORD){
      return 1;
    }
    else{
         return 0;
    }
}
export default { present, insert,uservalidation,userdata };