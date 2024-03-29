const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

const registerUser = asyncHandler(async (req, res) => {
  const { email, password, name, cpassword } = req.body;

  if (!email || !password || !name || !cpassword) {
    res.status(400).json({message: "Please Enter all the Feilds"});
  }

  if(password !== cpassword){
    res.status(400).json({message: "Password do not match"});
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({message: "User already exists"});
  }

  const user = await User.create({
    email,
    password,
    name
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({message: "Invalid Email or Password"});
  }
});

module.exports = {registerUser, authUser};