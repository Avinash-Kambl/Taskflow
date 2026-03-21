const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @desc    Search users by email (for adding to project)
// @route   GET /api/users/search?email=
// @access  Private
router.get('/search', protect, async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ success: false, message: 'Email query required' });

    const users = await User.find({
      email: { $regex: email, $options: 'i' },
      _id: { $ne: req.user._id },
    }).select('name email').limit(5);

    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
