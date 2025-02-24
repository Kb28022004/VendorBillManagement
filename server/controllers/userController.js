const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendMail = require("../utils/sendMail");

// register

const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber, cfpassword } = req.body;

    if (!fullName || !email || !password || !phoneNumber || !cfpassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide all the required fields",
      });
    }

    if (cfpassword !== password) {
      return res.status(400).json({
        success: false,
        message: " confirm password should match",
      });
    }

    // check if user already exits
    const user = await User.findOne({ email });
    if (user) {
      return res.status(404).json({
        success: false,
        message: "User already exists with this email ",
      });
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create a new user
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      phoneNumber,
      cfpassword,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      newUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Unable to register the user due to some internal server error",
    });
  }
};

// login

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check the field not empty
    if (!email || !password) {
      return res.status(400).json({
        message: "Please provide all the required credentials",
        success: false,
      });
    }

    // check if user already exits or not
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid credential" });
    }

    // check password is matched or not
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    console.log(isPasswordMatched);

    if (!isPasswordMatched) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid credential" });
    }

    const tokenId = {
      id: user._id,
    };

    // create token

    const token = await jwt.sign(tokenId, process.env.SECRET_KEY, {
      expiresIn: "30d",
    });
    
    res
      .status(200)
      .cookie("token", token, {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      })
      .json({
        success: true,
        user,
        message: `${user.fullName} logged in successfull`,
        token,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Unable to login the user due to some internal server error",
    });
  }
};

// logout

const logoutUser = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", null, { expires: new Date(Date.now()), httpOnly: true })
      .json({ success: true, message: "You are logged out successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Unable to logout the user due to some internal server error",
    });
  }
};

// get user details

const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message:
        "Unable to load users details  due to some internal server error",
    });
  }
};

// update user details

const updateUserDetails = async (req, res) => {
  try {
    const { name, email, password, phone, admission, enroll } = req.body;
    const profilePicture = req.file ? `/uploads/${req.file.filename}` : null;

    // Check if at least one field is provided
    if (!(name || email || password || phone || admission || enroll)) {
      return res
        .status(400)
        .json({ success: false, message: "No fields to update" });
    }

    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const updatedDetails = {
      ...(name && { name }),
      ...(email && { email }),
      ...(password && { password: hashedPassword }),
      ...(phone && { phone }),
      ...(enroll && { enroll }),
      ...(admission && { admission }),
      ...(profilePicture && { profilePicture }),
    };

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updatedDetails },
      { new: true, runValidators: true }
    );
    return res.status(200).json({
      success: true,
      message: "Your details have been successfully updated.",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message:
        "Unable to update users details  due to some internal server error",
    });
  }
};

// get all user --- access by admin

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      return res
        .status(404)
        .json({ success: false, message: "Users not found" });
    }
    res.status(200).json({ nbHits: users.length, success: true, users });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Unable to load all  users  due to some internal server error",
    });
  }
};

// update user --- access by an admin

const updateUser = async (req, res) => {
  const { role, phone, enroll, admission, email, name } = req.body;

  const { id } = req.params;

  const updatedUserDetails = {
    ...(role && { role }),
    ...(phone && { phone }),
    ...(enroll && { enroll }),
    ...(admission && { admission }),
    ...(email && { email }),
    ...(name && { name }),
  };

  const user = await User.findByIdAndUpdate(
    id,
    { $set: updatedUserDetails },
    { new: true, runValidators: true }
  );

  res
    .status(200)
    .json({ message: "User detail updated successfully", success: true, user });

  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message:
        "Unable to update users details  due to some internal server error",
    });
  }
};

// get user by id --- access by an admin

const getSingleUser = async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ success: false, message: "uesr not found" });
  }

  res.status(200).json({ success: true, user });

  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Unable to get single user  due to some internal server error",
    });
  }
};

// delete user --- access by an admin

const delteUser = async (req, res) => {
  const { id } = req.params;

  const user = await User.findByIdAndDelete(id);

  if (!user) {
    return res.status(404).json({ success: false, message: "uesr not found" });
  }

  res
    .status(200)
    .json({ success: true, message: "User has been deleted successfully" });

  try {
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Unable to get single user  due to some internal server error",
    });
  }
};

// .................................................. FORGET PASSWORD...................................................

const forgetPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const findUser = await User.findOne({ email });
    if (!findUser) {
      const error = new Error("no user found");
      error.statusCode = 404;
      throw error;
    }

    if (
      findUser.otp.otp &&
      new Date(findUser.otp.sendTime).getTime() > new Date().getTime()
    ) {
      const error = new Error(
        `please wait until ${new Date(
          findUser.otp.sendTime
        ).toLocaleTimeString()} `
      );
      error.statusCode = 404;
      throw error;
    }

    const otp = Math.floor(Math.random() * 90000) + 100000;
    console.log(otp);

    const token = crypto.randomBytes(32).toString("hex");

    findUser.otp.otp = otp;
    findUser.otp.sendTime = new Date().getTime() + 1 * 60 * 1000;
    findUser.otp.token = token;

    await findUser.save();

    sendMail(otp, email);

    res.status(200).json({
      message: "Please check your email for otp",
      status: true,
      token,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUserDetails,
  updateUserDetails,
  getAllUsers,
  updateUser,
  getSingleUser,
  delteUser,
  forgetPassword
};
