const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const tokenFor = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || "kitabghar-development-secret", {
    expiresIn: "7d",
  });

const safeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  profileImage: user.profileImage,
});

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password || password.length < 6)
      return res.status(400).json({
        message: "Name, email and a 6-character password are required.",
      });
    if (await User.findOne({ email }))
      return res
        .status(409)
        .json({ message: "An account with that email already exists." });
    const user = await User.create({
      name,
      email,
      phone: phone?.trim() || "",
      password: await bcrypt.hash(password, 10),
    });
    res.cookie("kitabghar_token", tokenFor(user._id), cookieOptions);
    res.status(201).json({ user: safeUser(user) });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email }).select(
      "+password",
    );
    if (
      !user ||
      !(await bcrypt.compare(req.body.password || "", user.password))
    )
      return res
        .status(401)
        .json({ message: "Email or password is incorrect." });
    res.cookie("kitabghar_token", tokenFor(user._id), cookieOptions);
    res.json({ user: safeUser(user) });
  } catch (error) {
    next(error);
  }
};

exports.logout = (_req, res) => {
  res.clearCookie("kitabghar_token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  res.status(204).end();
};

exports.me = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user)
      return res.status(404).json({ message: "User account was not found." });
    res.json({ user: safeUser(user) });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        name: req.body.name,
        phone: req.body.phone,
        profileImage: req.body.profileImage,
      },
      { new: true, runValidators: true },
    );
    res.json({ user: safeUser(user) });
  } catch (error) {
    next(error);
  }
};
