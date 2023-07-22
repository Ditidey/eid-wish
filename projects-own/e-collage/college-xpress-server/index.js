const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(express.json());
app.use(cors())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kos6m2u.mongodb.net/?retryWrites=true&w=majority`;
 
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // await client.connect();
    const collegeCollections = client.db('college-xpress').collection('colleges');
    const studentsCollections = client.db('college-xpress').collection('students');
    const reviewsCollections = client.db('college-xpress').collection('reviews');
    const usersCollections = client.db('college-xpress').collection('users');
    const researchCollections = client.db('college-xpress').collection('researchs');

// students collection
    app.post('/enroll', async (req, res) => {
        const student = req.body;
        const result = await  studentsCollections.insertOne(student);
        res.send(result);
      })

    app.get('/students', async (req, res) => {
        let query = {};
        if (req?.query.email) {
          query = {email: req.query.email }
        }   
        const result = await   studentsCollections.find(query).toArray();
       
        res.send(result)
      })
    //   college collections
    app.get('/colleges', async (req, res) => {
        let query = {};
        if (req?.query.email) {
          query = { student_email: req.query.email }
        }
  
        const result = await  collegeCollections.find(query).toArray();
       
        res.send(result)
      })
    app.get('/college/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await  collegeCollections.findOne(query);
       
        res.send(result)
      })
// reviews collection
      app.post('/reviews', async (req, res) => {
        const student = req.body;
        const result = await reviewsCollections.insertOne(student);
        res.send(result);
      })

    app.get('/reviews', async (req, res) => {
        let query = {};
        if (req?.query.email) {
          query = {email: req.query.email }
        }   
        const result = await reviewsCollections.find(query).toArray();
       
        res.send(result)
      })
    //   users collection
    app.put('/users/:email', async (req, res) => {
        const email = req.params.email;
        const info = req.body;
        const query = { email: email };
        const options = { upsert: true };
        const updateInfo = {
          $set: info
        }
        const result = await  usersCollections.updateOne(query, updateInfo, options)
        res.send(result)
      })

      app.get('/users', async (req, res) => {
        let query = {};
        if (req?.query.email) {
          query = {email: req.query.email }
        }   
        const result = await  usersCollections.find(query).toArray();
       
        res.send(result)
      })
      app.get('/researchs', async (req, res) => {
        let query = {};
        if (req?.query.email) {
          query = {email: req.query.email }
        }   
        const result = await   researchCollections.find(query).toArray();
       
        res.send(result)
      })



    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('college xpress is talking')
  })
  app.listen(port, () => {
    console.log(`college xpress running on ${port}`)
  })