const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { MongoClient, ObjectId } = require('mongodb');
const port = process.env.PORT ||5055
require('dotenv').config();
const app = express()
app.use(cors())
app.use(bodyParser.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ujudf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log("connection errr",err)
  const collection = client.db("volunteer").collection("events");

  app.post('/addEvent',(req,res)=>{
    const eventData = req.body;
    collection.insertOne(eventData)
    .then(result=>{
      console.log(result)
      res.send(result.insertedCount>0)
    })
  })

  app.get('/events',(req,res)=>{
    collection.find()
    .toArray((err,doc)=>{
      console.log(doc)
      res.send(doc)
    })
  })
  app.delete('/delete/:id',(req,res)=>{
    const id = ObjectId(req.params.id)
    collection.deleteOne({_id:id})
    .then(doc=>{
      res.send(doc.deletedCount>0)
    })
  })

  // perform actions on the collection object

});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)
