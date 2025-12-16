import User from '../models/User.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwtUtils.js';

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
export const signup = async (req, res, next) => {
  try {
    const { username, email, password, displayName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email ? 'Email already registered' : 'Username already taken'
      });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      displayName: displayName || username
    });

    // Generate tokens
    const token = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token to user
    user.refreshTokens.push({ token: refreshToken });
    user.lastLogin = new Date();
    await user.save();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        preferredLanguage: user.preferredLanguage
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Check password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate tokens
    const token = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token and update last login
    user.refreshTokens.push({ token: refreshToken });
    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      refreshToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        preferredLanguage: user.preferredLanguage,
        avatar: user.avatar
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    // Clear all refresh tokens
    user.refreshTokens = [];
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token'
      });
    }

    // Find user and check if refresh token exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    const tokenExists = user.refreshTokens.some(t => t.token === refreshToken);
    if (!tokenExists) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user._id);

    res.status(200).json({
      success: true,
      token: newAccessToken
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify token
// @route   GET /api/auth/verify
// @access  Private
export const verifyToken = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
};

// @desc    Get current user profile
// @route   GET /api/user/profile
// @access  Private
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('bookmarkedNovels', 'title slug coverImage author')
      .populate('likedNovels', 'title slug coverImage author');

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const { displayName, preferredLanguage, avatar } = req.body;

    const user = await User.findById(req.user._id);

    if (displayName) user.displayName = displayName;
    if (preferredLanguage) user.preferredLanguage = preferredLanguage;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    next(error);
  }
};
