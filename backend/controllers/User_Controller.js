import User from "../modules/UserMOdel.js";
import generateToken from "../config/generateToken.js";
import bcrypt from "bcrypt";

// http://localhost:4000/api/v1/user/search-users?search=himanshu&lastname=golani'
export const getAllUsers = async (req, res) => {
  console.log(req.body);
  const reqUsers = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  console.log(req.user);
  const users = await User.find({ ...reqUsers, _id: { $ne: req.user._id } });

  res.send(users);
};

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body);
  if (!name || !email || !password) {
    return (
      res.status(400),
      json({
        message: "Please fill all the necessary details correctly",
      })
    );
  }
  try {
    const existingUser = await User.findOne({ email });
    // if the user exits he can't Signup
    if (existingUser) {
      return res.status(300).json({
        meessage: "The user already exists Please login ..",
      });
    }
    // else mak the user register
    else {
      const hashedPassword = await bcrypt.hash(password, 8);

      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
      });

      return res.status(201).json({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        token: generateToken(newUser._id),
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const userLogin = async (req, res) => {
  const { email, password } = req.body;
  // check if the email is present or not
  const validUser = await User.findOne({ email });
  // if the user is not valid then
  // means the email is not present then what .?
  if (!validUser) {
    return res.status(404).json({
      success: false,
      message: "The email is not found please signup",
    });
  }
  // if the user is present thenc ompare its password
  else {
    const comparePass = await bcrypt.compare(password, validUser.password);
    // if the password is correct
    if (comparePass) {
      return res.json({
        success: true,
        _id: validUser._id,
        name: validUser.name,
        email: validUser.email,
        token: generateToken(validUser._id),
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Password does not match",
      });
    }
  }
};
