import nodemailer, { Transporter } from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response, Router } from 'express';
import User, { UserDoc } from '../models/user';
import bcrypt from 'bcrypt';


const pass: string = process.env.passEmail ? process.env.passEmail : '';

const transporter: Transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: 'ramazasbashkai123@gmail.com',
    pass: 'iokiwlwxtiayjbkm',
  },
});

const resetPasswordRouter: Router = Router();

resetPasswordRouter.post('/', async (req: Request, res: Response<any, Record<string, any>>) => {
  const { email }: { email: string } = req.body;

  // Check if user exists with the provided email
  const user: UserDoc | null = await User.findOne({ email });
  if (!user) {
    res.status(404).json({
      error: 'User not found',
    });
  }

  // Generate a random token
  const token: string = uuidv4();

  // Save the token in the database
  if (user) {
    user.resetPasswordToken = token;
    await user.save();
  }

  // Send an email to the user with a link to the password reset page
  const resetUrl: string = `https://your-frontend-app.com/reset-password?token=${token}`;

  // Create the email message
  const mailOptions: nodemailer.SendMailOptions = {
    from: 'ramazasbashkai123@gmail.com',
    to: email,
    subject: 'Password reset request',
    text: `Please click on the following link to reset your password: ${resetUrl}`,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error: Error | null, info: nodemailer.SentMessageInfo): void => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  res.status(200).json({
    message: 'An email has been sent to your email address with further instructions',
  });
});

resetPasswordRouter.post('/reset', async (req: Request, res: Response): Promise<void> => {
  const { token, newPassword }: { token: string, newPassword: string } = req.body;

  console.log('Token:', token);
  console.log('New password:', newPassword);

  // Find the user with the provided token
  const user: UserDoc | null = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }, // Check if the token is still valid
  });

  console.log('User:', user);

  if (!user) {
    res.status(404).json({
      error: 'User not found',
    });
  }
  const saltRounds: number = 10;
  const passwordHash: string = await bcrypt.hash(newPassword, saltRounds);

  if(user){
    user.passwordHash = passwordHash;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
  }

  res.status(200).json({
    message: 'Your password has been reset',
  });
});

export default resetPasswordRouter;
