const PROFILE = require("../models/profile");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Create account

const handleRegister = async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  try {
    const userExist = await PROFILE.findOne({ email });
    if (userExist) {
      return res
        .status(400)
        .json({ err: "The email address is already in use" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await PROFILE.create({
      firstName,
      lastName,
      email,
      role,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      user: {
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ err: "Please enter all fields" });
    }

    const user = await PROFILE.findOne({ email });

    if (!user) {
      return res.status(400).json({ err: "Email hasn't been registered" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ err: "Email or password do not match" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        email: user.email,
      },
      process.env.SECRET_KEY,
      { expiresIn: "2d" }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};

module.exports = { handleRegister, handleLogin };
