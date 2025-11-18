const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 3000
// middle wire
app.use(cors())
app.use(express.json())

// 58juOSQEpaznWsJQ
// SmartHome1
const uri = "mongodb+srv://SmartHome1:58juOSQEpaznWsJQ@cluster.cqq5n0v.mongodb.net/?appName=Cluster";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.get('/',( req,res) =>{
    res.send('simple home server is running')
})
app.listen(port, ()=>{
    console.log(`simple home server is running on ${port}`);
})
async function run() {
  try {
    
    await client.connect();
    const db = client.db('home_db');
    const propertiesCollection = db.collection('properties')


    app.get('/properties',async(req,res) =>{
      const cursor = propertiesCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    });

    app.get('/latest-properties',async(req,res)=>{
      const cursor = propertiesCollection.find().sort({createdAt:-1}).limit(6)
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/properties/:id',async (req,res)=>{
      const id = req.params.id;
      const query = {_id:new ObjectId(id)}
      const result = await propertiesCollection.findOne(query);
      res.send(result);
    })

    app.post('/newProperty',async(req,res) =>{
      const newProperty = req.body
      const result = await propertiesCollection.insertOne(newProperty)
      res.send(result);
      
    })

    app.get("/properties/:id", async (req, res) => {
      const id = req.params.id;
      if (!ObjectId.isValid(id)) {
        return res.send(null);
      }
      const query = { _id: new ObjectId(id) };
      const result = await propertiesCollection.findOne(query);
      res.send(result);
    });

    app.get('/myProperties', async (req,res) =>{
      const email = req.query.email
      // const query = {};
      // if(query.email){
      //   query.email = email;
      // }
      // const query =userEmail

      // console.log(query)
      const cursor = propertiesCollection.find({userEmail:email});
      const result = await cursor.toArray();
      res.send(result);

    })




    app.post('/properties',async (req,res)=>{
      const newProperty = req.body;
      const result = await propertiesCollection.insertOne(newProperty)
      res.send(result);
    })

    app.patch('/properties/:id',async(req,res)=>{
      const id = req.params.id;
      const updatedProperties = req.body;
      const query = {_id:new ObjectId(id)}
      const update = {
        $set:updatedProperties
      }
      const result = await propertiesCollection.updateOne(query,update)
      res.send(result)
    })




    app.delete('/properties/:id',async(req,res) =>{
      const id = req.params.id;
      const query = {_id:new ObjectId(id) }
      const result = await propertiesCollection.deleteOne(query);
      res.send(result);
    })

    app.delete('/myProperties/:id',async(req,res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await propertiesCollection.deleteOne(query);
      res.send(result);
    })

    
    
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
    // await client.close();
  }
}
run().catch(console.dir);








// Create a MongoClient with a MongoClientOptions object to set the Stable API version



