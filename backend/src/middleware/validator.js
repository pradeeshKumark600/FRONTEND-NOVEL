import { body, param, query, validationResult } from 'express-validator';

// Validation error handler
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// Auth validations
export const validateSignup = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  validate
];

export const validateLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  validate
];

// Novel validations
export const validateNovelId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid novel ID'),
  validate
];

export const validateChapterId = [
  param('novelId')
    .isMongoId()
    .withMessage('Invalid novel ID'),
  param('chapterId')
    .isMongoId()
    .withMessage('Invalid chapter ID'),
  validate
];

// Reading progress validation
export const validateReadingProgress = [
  body('novelId')
    .isMongoId()
    .withMessage('Invalid novel ID'),
  body('chapterId')
    .optional()
    .isMongoId()
    .withMessage('Invalid chapter ID'),
  body('progress')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Progress must be between 0 and 100'),
  validate
];
