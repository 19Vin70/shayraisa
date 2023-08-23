const express = require('express');
const cors = require('cors');
const db = require('./firebase');
const { JWT } = require('./jwt');
const app = express();
const port = process.env.PORT || 3000;
const jwt = new JWT('supot-pa-ako-2874');

  
db.readData('users').then(r => console.log(r))


//Middlewares 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello, Dadahbook!');
})

//Authentication 
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body)
  try {
    let users = await db.readData('users') || [];
    let usr = users.find((user) => user.username === username);
    if(!usr) {
      res.send({ code: 404, message: "not found" })
    } else {
      if(!usr.password === password) {
        res.send({ code: 400, message: "wrong password" })
      } else {
        const token = jwt.generate(usr);
        res.send({ code: 200, message: "success", token: token })
      }
    }
  } catch (err) {
    res.send({ code: 500, message: "server error" })
  }
})

app.post('/api/new-acc', async (req, res) => {
  const { username, firstName, lastName, email, password } = req.body;
  try {
    let isCreated = await db.writeData("users", {
      username, 
      firstName, 
      lastName, 
      email, 
      password
    })
    res.send({ code: 200, message: "account created" })
  } catch (err) {
    res.send({ code: 400, message: "account not created" })
  }
})
//// create acc
app.post('/api/verify-token', (req, res) => {
  const tkStatus = jwt.verify(req.body.token);
  if(tkStatus.verified) {
    res.send({ code: 200, data: JSON.parse(tkStatus.data) });
  } else {
    res.send({ code: 401 })
  }
})

app.listen(port, () => console.log(`App is listening on port ${port}`));