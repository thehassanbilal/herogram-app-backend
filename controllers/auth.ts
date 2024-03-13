import express from "express";
const User = require("../models/User");

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isMatch = user.password === password;

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Login successful (optional: generate a token)
    // ... (implement token generation logic if needed)

    res.json({ message: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
