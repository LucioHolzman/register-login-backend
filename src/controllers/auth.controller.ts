import { Request, Response } from "express";
import User, { IUser } from "../models/User";

import jwt from "jsonwebtoken";

export const signup = async (req: Request, res: Response) => {
  try {
    // Saving a new user
    const user: IUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    user.password = await user.encryptPassword(user.password);
    const savedUser = await user.save();

    // Generating the token
    const token: string = jwt.sign(
      { _id: savedUser._id },
      process.env.JWT_SECRET || "tokentest"
    );
    res.header("auth-token", token).json(savedUser);
  } catch (error) {
    console.log(error);
    res.status(400).send("bad resquest");
  }
};

export const signin = async (req: Request, res: Response) => {
  // Checking if the user exists
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(401).send("User not found");
    }
    // Checking if the password is correct
    if (user) {
      const correctPassword: boolean = await user.validatePassword(
        req.body.password
      );
      if (!correctPassword) {
        return res.status(400).send("Incorrect password");
      }
      // Generating the token
      if (correctPassword) {
        const token: string = jwt.sign(
          { _id: user._id },
          process.env.JWT_SECRET || "tokentest",
          { expiresIn: "1d" }
        );
        res.header("auth-token", token).json(user);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).send("bad resquest");
  }
};

export const profile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.userId, { password: 0 });
    if (!user) return res.status(404).send("User not found");
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(400).send("bad resquest");
  }
};
