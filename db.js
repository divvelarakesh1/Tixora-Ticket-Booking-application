import mysql from 'mysql2';
import fs from 'fs/promises';
import dotenv from 'dotenv';
dotenv.config();
const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  multipleStatements: process.env.DB_MULTIPLE_STATEMENTS === 'true'
}).promise();
/*const connectToDatabase = async () => {
  try {
    await connection.connect();
    console.log("Connected to database");
  
  }
  catch (err) {
    console.error('Error connecting to database:', err);
    process.exit(1);
  }
};
*/
const exec = async () => {
  try {
    const schemaSQL = await fs.readFile('./database/schema.sql', 'utf8');
    const fst = await fs.readFile('./database/fst.sql', 'utf8');
    
    await connection.query(schemaSQL);
    console.log('schema.sql executed successfully');
    
    await connection.query(fst);
    console.log('fst.sql executed successfully');
    
  } catch (err) {
    console.error('Error executing SQL files:', err);
  }
};


export default {connection,exec};