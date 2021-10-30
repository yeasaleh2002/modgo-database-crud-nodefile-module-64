const express = require('express');
const { MongoClient } = require('mongodb');

var cors = require('cors');
// niddisto id onosare data delete korte hole ObjectId id import korte hobe - karon holo mongodb te _id ar por ObjectId onosare ase. such as , _id:ObjectId("032djos3993ndse09u3")
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port =  5000;

// middle ware
app.use(cors());
app.use(express.json());

/* 
userName:  newUsers1
password:  LEwaWkaFETrxqbWS

*/

// connect your application from mongo db atlas

const uri = "mongodb+srv://newUsers1:LEwaWkaFETrxqbWS@cluster0.y6afp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


/* client.connect(err => {
  const collection = client.db("FoodMaster").collection("users");
  // perform actions on the collection object
  console.log('hitting the database');

 // data insert
  const user = {name: 'Rani', email: 'Rani@gmail.com', phone: '0199999999999'};
  collection.insertOne(user)
  .then(() => {
        console.log('insert success');
  }) 



//  console.error(err);
 
 // client.close();
});
*/
/* 

// data insert using async await  (await use korle obossoi async use korte hobe)
async function run() {
  try {
    await client.connect();
    const database = client.db("FoodMaster");
    const usersCollection = database.collection("users");
    // create a document to insert
    const doc = {
      name: "special one",
      email: "special@hotmail.com",
    }
    const result = await usersCollection.insertOne(doc);
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
  } finally {
    await client.close();
  }
}
run().catch(console.dir);

 */

//  Setup client side React App to send data to the server
async function run() {
  try {
    await client.connect();
    const database = client.db("FoodMaster");
    const usersCollection = database.collection("users");
    

    // GET API
    app.get('/users', async(req, res) => {
       // Find Multiple Documents  from mongodb
       const cursor = usersCollection.find({}); 

       
       const users = await cursor.toArray(); // jehuto  data array hisebe dorkar tai forEach ar poriborte toArray use kora hoise.
       res.send(users);
    })



    // get user  by users id
    app.get('/users/:id', async (req, res) => {

      // id wise data access
     const id = req.params.id;
     const query = { _id: ObjectId(id) };
     const user = await usersCollection.findOne(query);
     console.log('load user with id:' , id);
   
  
      res.send(user);

    } ) 



    // POST api method route
        app.post('/users', async (req, res) =>  {

          // insert mongodb
          const newUser = req.body;           
          const result = await usersCollection.insertOne(newUser);


          console.log('hitting the post', req.body);

          console.log('added user', result);

          // ata jehuto post tai json hisebe pura result ta k client side a pathai dewya jabe.
           res.json(result);

          // res.send('POST request to the userspage') 
        });


        // UPDATE API (update k put bola hoy)
          app.put('/users/:id', async(req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;

            // update user from mongobd
            const filter = {_id: ObjectId(id)};
            const options = {upsert: true};

            // create a document that sets the plot 
              const updateDoc = {
                $set: {
                     name: updatedUser.name,
                     email: updatedUser.email

                },
              };

              const result = await usersCollection.updateOne(filter, updateDoc, options)

            console.log( 'updating user' ,req)
            // json hisebe client side a data pathano
            res.json(result)
          })


        // DELETE API
        app.delete('/users/:id', async(req, res) => {
          const id = req.params.id;
      
      
         const query = {_id: ObjectId(id)};

          const result = await usersCollection.deleteOne(query);

      
          console.log('deleting user with id', result);
          res.json(result);
        })



  } 
  finally {
    // -----client.close(); ---comment korar karon holo(error ti lekha holo)--  MongoNotConnectedError: MongoClient must be connected to perform this operation

   // await client.close();
  }
}
run().catch(console.dir);






app.get('/', (req, res) => {
  res.send('Running My CURD Server!')
})



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})