const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const resetPasswordRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: 'ramazasbashkai123@gmail.com',
    pass: 'iokiwlwxtiayjbkm'
  }
});

resetPasswordRouter.post('/', async (req, res) => {
  const { email } = req.body

  // Check if user exists with the provided email
  const user = await User.findOne({ email })
  if (!user) {
    return res.status(404).json({
      error: 'User not found'
    })
  }

  // Generate a random token
  const token = uuidv4()

  // Save the token in the database
  user.resetPasswordToken = token
  user.resetPasswordExpires = Date.now() + 3600000 // Token will expire in 1 hour
  await user.save()

  // Send an email to the user with a link to the password reset page
  const resetUrl = `https://your-frontend-app.com/reset-password?token=${token}`
  
  // Create the email message
  const mailOptions = {
    from: 'ramazasbashkai123@gmail.com',
    to: email,
    subject: 'Password reset request',
    text: `Please click on the following link to reset your password: ${resetUrl}`
  }

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  res.status(200).json({
    message: 'An email has been sent to your email address with further instructions'
  })
});

resetPasswordRouter.post('/reset', async (req, res) => {
  const { token, newPassword } = req.body

  console.log('Token:', token);
  console.log('New password:', newPassword);

  // Find the user with the provided token
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() } // Check if the token is still valid
  })

  console.log('User:', user);

  if (!user) {
    console.log('Invalid or expired token');
    return res.status(400).json({
      error: 'Invalid or expired token'
    })
  }
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(newPassword, saltRounds)

  user.passwordHash = passwordHash
  user.resetPasswordToken = undefined
  user.resetPasswordExpires = undefined
  await user.save()

  console.log('Password reset for user:', user.email);

  res.status(200).json({
    message: 'Your password has been reset'
  })
})

module.exports = resetPasswordRouter
