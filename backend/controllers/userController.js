const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require("nodemailer");

exports.getUser = async (req, res) =>{
  res.json({success: true, message: 'Protected route accessed successfully', user: req.user });
}
// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ errors: { email: { msg: 'User already exists with this email!' } } });
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      phone,
      address
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user to database
    await user.save();

    // sent mail using nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: `${process.env.EMAIL_USER}`,
        pass: `${process.env.EMAIL_PASS}`,
      },
    });

    async function main() {
      const info = await transporter.sendMail({
        from: {
          name : 'Panilagbe', 
          address : `${process.env.EMAIL_USER}`
        },
        to: user.email,
        subject: "পানিলাগবে - আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে",
        text: "প্রিয় গ্রাহক,\n\nপানিলাগবে-তে আপনাকে স্বাগতম! আপনার অ্যাকাউন্ট সফলভাবে তৈরি করা হয়েছে। আমরা আপনাকে বিশুদ্ধ পানি সরবরাহ করতে প্রতিশ্রুতিবদ্ধ।\n\nআপনার সেবা শুরু করতে, আমাদের ওয়েবসাইটে লগইন করুন এবং আপনার প্রয়োজন অনুযায়ী পানি সরবরাহের অর্ডার দিন।\n\nযেকোনো প্রশ্ন বা সহায়তার জন্য, অনুগ্রহ করে আমাদের সাথে যোগাযোগ করুন।\n\nধন্যবাদান্তে,\nপানিলাগবে টিম",
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #0066cc;">পানিলাগবে</h1>
            <p style="font-size: 18px; color: #333;">আপনার বিশ্বস্ত পানি সরবরাহকারী</p>
          </div>
          <div style="margin-bottom: 20px; border-top: 2px solid #0066cc; padding-top: 20px;">
            <h2 style="color: #0066cc;">আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!</h2>
            <p>প্রিয় গ্রাহক,</p>
            <p>পানিলাগবে-তে আপনাকে স্বাগতম! আপনার অ্যাকাউন্ট সফলভাবে তৈরি করা হয়েছে। আমরা আপনাকে বিশুদ্ধ ও নিরাপদ পানি সরবরাহ করতে প্রতিশ্রুতিবদ্ধ।</p>
            <p>আপনার সেবা শুরু করতে, আমাদের ওয়েবসাইটে লগইন করুন এবং আপনার প্রয়োজন অনুযায়ী পানি সরবরাহের অর্ডার দিন।</p>
          </div>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
            <h3 style="color: #0066cc;">আমাদের সেবাসমূহ:</h3>
            <ul style="padding-left: 20px;">
              <li>নিয়মিত পানি সরবরাহ</li>
              <li>বিশুদ্ধ ও নিরাপদ পানি</li>
              <li>সময়মত ডেলিভারি</li>
              <li>সহজ অর্ডার প্রক্রিয়া</li>
            </ul>
          </div>
          <div style="text-align: center; margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px;">
            <p>যেকোনো প্রশ্ন বা সহায়তার জন্য, অনুগ্রহ করে আমাদের সাথে যোগাযোগ করুন।</p>
            <p style="color: #0066cc;">ধন্যবাদান্তে,<br>পানিলাগবে টিম</p>
          </div>
        </div>
        `,
      });

      console.log("Message sent: %s", info.messageId);
    }
    main().catch(console.error);

    // Create JWT
    const payload = {
      id: user.id,
      role: user.role
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'panilagbe_secret_key',
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({
          success: true,
          token: 'Bearer ' + token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            language: user.language
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT
    const payload = {
      id: user.id,
      role: user.role
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'panilagbe_secret_key',
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({
          success: true,
          token: 'Bearer ' + token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            language: user.language
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, phone, address, language } = req.body;
    
    // Build update object
    const updateFields = {};
    if (name) updateFields.name = name;
    if (phone) updateFields.phone = phone;
    if (address) updateFields.address = address;
    if (language) updateFields.language = language;
    
    // Update user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
}; 