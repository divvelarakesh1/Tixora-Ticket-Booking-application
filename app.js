import express from 'express';
import path from 'path';
import jwt from 'jsonwebtoken'
import bodyParser from 'body-parser';
import dotenv from 'dotenv'
dotenv.config();
import { fileURLToPath } from 'url';
import db from './db.js';
import route from './routes/route.js';
import Users from './userinfo.js';
import Events from './event.js'
import Venue from './venue.js'
import Ticket from './ticket.js'
import Class from './Class.js'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = 5000;
const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET;
app.use(bodyParser.json());
app.use('/', route);
app.use(express.static(path.join(__dirname, 'Views')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
db.exec();
app.post('/signup', async (req, res) => {
  const { username, name, age, email, password, phonenumber } = req.body;
  //console.log(username);
  const isthere = await Users.present(username);
  //console.log(isthere);
  if (username && name && age && email && password && phonenumber) {
    if (!isthere) {
      await Users.insert({ username, name, age, email, password, phonenumber });
      res.send({ message: "sucessfully signed up" });
    }
    else {
      res.send({ message: "username already exixts choose another" });
    }
  }
  else {
    console.log("hi");
    res.send({ message: " please enter all fields to signup" });
  }
}
);
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const isthere = await Users.present(username);
  if (username && password && isthere) {
    const valid = await Users.uservalidation({ username, password });
    if (valid) {
      const token = jwt.sign({ name: username }, SECRET_KEY, { expiresIn: "10d" });
      res.send({ message: "succesfully logged in", token });

    }
    else {
      res.send({ message: "Incorrect username or password" })
    }
  }
  else {
    res.send({ message: "Enter Valid Username or password" });
  }
})
app.post('/user', async (req, res) => {
  const { username } = req.body;
  const data = await Users.userdata(username);
  res.send(data);
})
app.post('/search', async (req, res) => {
  const { eventname } = req.body;
  const event_ID = await Events.GET_EVENT_ID(eventname);
  const data = { Event_ID: event_ID }
  res.send(data);
})
app.get('/event/:eventId', async (req, res) => {
  const event_ID = req.params.eventId;
  const data = await Events.events(event_ID);
  const venue_id = data.VENUE_ID;
  const ven_name = await Venue.venue_name(venue_id);
  console.log(ven_name);
  const capacit= await Venue.Total_capacity(venue_id);
  data.venue_name = ven_name;
  //console.log(capacit[0].TOTAL_CAPACITY);
  data.capacity=capacit[0].TOTAL_CAPACITY;
  res.send(data);
});
app.get('/events/:eventType', async (req, res) => {
  const event_Type = req.params.eventType;
  const data = await Events.events_of_type(event_Type);
  res.send(data);
});
app.post('/eventsfilter', async (req, res) => {
  const { EventType, loc, dat } = req.body;
  const data = {
    eventType: EventType,
    location: loc,
    date: dat
  }
  if (loc && dat) {
    const res1 = await Events.events_of_type_in_location_date(data);
    res.send(res1)
  }
  else {
    if (data.location) {
      const res2 = await Events.events_of_type_in_location({
        eventType: EventType,
        location: loc
      });
      console.log(res2);
      res.send(res2);
    }
    else {
      if (data.date) {
        const res3 = Events.events_of_type_date({
          eventType: EventType,
          date: dat
        });
        res.send(res3);
      }
    }
  }
});
app.get('/bookingdetails/:eventId', async (req, res) => {
  const event_ID = req.params.eventId;
  const data = await Class.class_details(event_ID);
  console.log(data)
  res.send(data);
});
app.post('/book', async (req, res) => {
  const {
    uname,
    class_id,
    evenId,
    ticket_count,

  } = req.body;
  const booku = await Ticket.insert_into_table({
    uname,
    class_id,
    evenId,
    ticket_count,

  });
  console.log(booku);
  res.send({booking:booku})
});
app.get('/transaction/:transaction_id',async(req,res)=>{
  const transactionid=req.params.transaction_id;
  const data=await Ticket.transaction_details(transactionid);
  //console.log(data);
  res.send(data);
});
app.get('/Mytickets/:username',async(req,res)=>{
const username=req.params.username;
const data=await Ticket.ticket_info(username);
for(let i=0;i<data.length;i++){
  const events1 = await Events.events(data[i].EVENT_ID);
  const class1=await Class.get_class_name(data[i].CLASS_ID);
  data[i].EVENT_NAME=events1.EVENT_NAME;
  data[i].CLASS_NAME=class1.CLASS_NAME;
}
res.send(data);
});
app.post('/cancel',async(req,res)=>{
const {bookingId}=req.body;
await Ticket.cancellation(bookingId);
res.send({message: "succesfully cancelled" });
});
app.listen(PORT, () => {
  console.log(`Server is on ${PORT}`);
});
