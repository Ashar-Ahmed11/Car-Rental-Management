const express = require("express")
const router = express.Router()
const { body, validationResult } = require('express-validator');
const User = require("../Models/User")
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const authenticateUser = require('../middleware/authenticateUser');
const JWT_SECRET = 'Rentaca$r'


router.post(
  "/createuser",
  [
    body('firstName', 'First name must be at least 2 characters').isLength({ min: 2 }),
    body('lastName', 'Last name must be at least 2 characters').isLength({ min: 2 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  ],
  async (req, res) => {
    let success = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }

    const { firstName, lastName, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ success, errors: "User already exists with this email" });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(password, salt);

      user = await User.create({
        firstName,
        lastName,
        password: secPass,
        email,
      });

      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);




router.post("/login", async (req, res)=>{
    let succes;
const {email, password} = req.body;
try {
    let user = await User.findOne({email})
    if(!user){
        succes = false;
        return res.status(400).json({succes, errors: "Please try to login with correct credentials" })
    }
// user.password is the password of above user email password for comparing
    const passCompare = await bcrypt.compare(password, user.password)
    if(!passCompare){
        succes = false;
        return res.status(400).json({succes, errors: "Please try to login with correct credentials" })
    }

    const data = {
        user:{
            id: user.id
        }
    }
    const authToken = jwt.sign(data, JWT_SECRET)
    succes = true;
    res.json({succes, authToken: authToken})
} catch (error) {
    console.error(error.message)
    res.status(500).send("Internal Server Error")
}
})



router.get("/getuser", authenticateUser, async (req, res)=>{
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        succes = true;
        res.json({succes, user})
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server Error")
    }
})

router.get("/getallusers", async (req, res) => {
  try {
    const users = await User.find().select("-password"); // exclude passwords
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});



module.exports = router