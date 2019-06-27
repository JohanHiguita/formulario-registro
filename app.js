const express = require("express")
const app = express()
const mongoose = require("mongoose")

app.set("view engine", "ejs")
app.use(express.urlencoded())

mongoose.connect(
  process.env.MONGODB_URL || "mongodb://localhost:27017/mongo-1",
  { useNewUrlParser: true }
)
mongoose.connection.on("error", function(e) {
  console.error(e)
})

// definimos el schema
const userSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String
})

// definimos el modelo
const User = mongoose.model("User", userSchema)

app.get("/", async (req, res) => {
  try {
    const users = await User.find()
    res.render("index", { users })
  } catch (err) {
    console.log(`error getting users list. msg: ${err}`)
  }
})

app.get("/register", async (req, res) => {
  res.render("new")
})

app.post("/register", async (req, res) => {
  //console.log(req.body)
  const new_user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  })
  await new_user.save()
  const users = await User.find()
  res.render("index", { users })
})

app.listen(3000, () => console.log("Listening on port 3000 ..."))
