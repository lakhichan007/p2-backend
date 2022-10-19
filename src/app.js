const express = require("express")
const bodyparser = require("body-parser")
const cors = require("cors")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const {validateToken} =require("../middleware/authentication")
const app = express()
app.use(express.json())
app.use(cors())
const UserDetails = require("../module/userschema")
const ContactDetails = require("../module/contatctScema")

const port = process.env.PORT || 8000

app.post("/login",async (req, res) => {
    const { userEmail, password } = req.body
    try {

        const isuser = await UserDetails.findOne({ userEmail: userEmail })
        if (isuser) {
            const ispassword = await bcrypt.compare(password, isuser.password)

            if (ispassword) {
                const id = isuser._id;
                token = jwt.sign({ id: id }, "process.env.SECRET_KEY")
                res.json({ message:"success", token:token })
                
            }
            else{
                res.json({message:"Invalid"})
            }
        }
        else {
            res.json({ message: "Unregistered" })
        }
    }
    catch (e) {
        res.send({
            message: e.message
        })
    }

})

app.post("/signUp", async (req, res) => {
    const { userEmail, password } = req.body
    try {

        const data = await UserDetails.findOne({ userEmail: userEmail })
        if (data) {
            res.send({ message: "user already Exist!" })
        }
        else {
            bcrypt.hash(password, 10, async function (err, hash) {
                if (err) {
                    return res.json({ message: err.message })
                }

                const dta = await UserDetails.create({
                    userEmail,
                    password: hash
                })
                res.json({ message: "Congratulations signUp sucessfull!" })
            })
        }
    }

    catch (e) {
        res.send({
            message: e.message
        })
    }
})

app.post("/addContact",async (req, res) => {
    const {contact,mytoken}=req.body
  const verifiedtoken=  jwt.verify(mytoken,"process.env.SECRET_KEY")
    try {
        contact.map(async(usercontact)=>{
            const data = await ContactDetails.create({
                name:usercontact.name,
                designation:usercontact.designation,
                company:usercontact.company,
                industry:usercontact.industry,
                email:usercontact.email,
                phone:usercontact.phone,
                country:usercontact.country,
                userRef:verifiedtoken.id
            })

        })
        res.json({
            message: "contact added Sucessfully!"
        })
    }
    catch (e) {
        res.send({
            message: e.rror
        })
    }
})

app.post("/show_contacts", async (req, res) => {
    const {mytoken}=req.body
    const verifiedtoken=  jwt.verify(mytoken,"process.env.SECRET_KEY")
    const data = await ContactDetails.find({userRef:verifiedtoken.id}).limit(10)
    res.json({
        data: data
    })
})

app.delete("/delete/:id", async (req, res) => {
    try {
        const todelete = await ContactDetails.findByIdAndDelete({ _id: req.params.id })
        res.json({
            message: "Deleted sucessfully",
            todelete
        })
    }
    catch (e) {
        res.json({
            message: e.message
        })
    }
})



app.listen(port, () => {
    console.log(`your server is running at ${port}`)
})