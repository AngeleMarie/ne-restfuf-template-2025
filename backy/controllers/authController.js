import _ from 'lodash';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import generateCode from '../utils/codeGenerator.js';
import { sendEmail } from '../config/emailConfig.js';
import path from 'path';
import jwt from 'jsonwebtoken'
import userValidation from '../validators/userValidation.js'; 
import { loadTemplate } from '../utils/loadTemplate.js';
import { blacklistToken, generateToken } from '../middlewares/tokenService.js';
import { initializeSession, clearSession } from '../middlewares/sessionTimeout.js';

const createUser = async (req, res) => {
  try {
    const value = await userValidation.validateAsync(req.body);
    const { firstName, lastName, email, password, address, phoneNumber } = _.pick(req.body, ['firstName', 'lastName', 'email', 'password', 'address', 'phoneNumber']);
    
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { email },
          { phoneNumber }
        ]
      }
    });
    
    if (existingUser) {
      let errorMessage = '';
      if (existingUser.email === email) {
        errorMessage = `Email ${email} is already registered. `;
      }
      if (existingUser.phoneNumber === phoneNumber) {
        errorMessage += `Phone number ${phoneNumber} is already registered.`;
      }
      return res.status(400).json({ message: errorMessage });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const activationCode = generateCode();
    
    const newUser = await User.create({ 
      firstName,
      lastName, 
      email, 
      password: hashedPassword,
      address,
      phoneNumber,
      status: 'pending', 
      activationCode
    });

    const html = loadTemplate(path.resolve('templates', 'activationEmail.html'), {
      fullName: `${newUser.firstName} ${newUser.lastName}`,
      activationCode: `${newUser.activationCode.split('').join(' ')}`,
    });
    await sendEmail({ to: email, subject: 'Activate Your Account', html });

    return res.status(201).json({
      message: "User created successfully. Activation code sent to email.",
      data: _.omit(newUser.toJSON(), ['password', 'activationCode']),
    });

  } catch (error) {
    console.error("Error in creating user:", error);
    if (error.isJoi) {
      return res.status(400).json({ error: `Validation error: ${error.details.map(detail => detail.message).join(', ')}` });
    }
    return res.status(500).json({ error: "An error occurred while creating the user." });
  }
};

const activateAccount = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || user.activationCode !== code) {
      return res.status(400).json({ message: "Invalid activation code." });
    }

    user.status = 'active';
    user.activationCode = null;
    await user.save();

    const html = loadTemplate(path.resolve('templates', 'activationSuccess.html'), {
      fullName: `${user.firstName} ${user.lastName}`,
    });
    await sendEmail({
      to: email,
      subject: 'Your Account Has Been Activated 🎉',
      html,
    });

    res.status(200).json({ message: "Account activated successfully." });
  } catch (error) {
    console.error("Error activating account:", error);
    res.status(500).json({ error: "Error activating account." });
  }
};


const initiateResetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(404).json({ message: "User not found." });

    const activationCode = generateCode();
    user.activationCode = activationCode;
    user.status = 'reset';
    await user.save();

    const html = loadTemplate(path.resolve('templates', 'resetPasswordEmail.html'), {
      fullName: `${user.firstName} ${user.lastName}`,
      activationCode: `${user.activationCode.split('').join(' ')}`,
    });
    await sendEmail({ to: email, subject: 'Reset Your Password', html });

    res.status(200).json({ message: "Password reset email sent." });
  } catch (error) {
    console.error("Error sending reset password email:", error);
    res.status(500).json({ error: "Error sending reset password email." });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, resetCode, newPassword } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || user.activationCode !== resetCode || user.status !== 'reset') {
      return res.status(400).json({ message: "Invalid reset code or user status." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.status = 'active';
    user.activationCode = null;
    await user.save();

    const html = loadTemplate(path.resolve('templates', 'resetSuccess.html'), {
      fullName: `${user.firstName} ${user.lastName}`,
    });
    await sendEmail({
      to: email,
      subject: 'Password Reset Successful',
      html,
    });

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ error: "Error resetting password." });
  }
};

const resendActivationCode = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(404).json({ message: 'User not found.' });
    if (user.status === 'active') return res.status(400).json({ message: 'Account is already activated.' });

    const now = new Date();

    if (user.resendLockUntil && now < new Date(user.resendLockUntil)) {
      const waitMinutes = Math.ceil((new Date(user.resendLockUntil) - now) / 60000);
      return res.status(429).json({ message: `Too many attempts. Please try again in ${waitMinutes} minutes.` });
    }

    if (user.lastResendAt && now - new Date(user.lastResendAt) < 60000) {
      const secondsLeft = Math.ceil((60000 - (now - new Date(user.lastResendAt))) / 1000);
      return res.status(429).json({ message: `Please wait ${secondsLeft} seconds before resending the code.` });
    }

    // Update resend attempt count
    let resendCount = user.resendCount || 0;

    if (resendCount >= 2) {
      // Lock for 10 minutes
      user.resendLockUntil = new Date(now.getTime() + 10 * 60000);
      user.resendCount = 0;
      await user.save();
      return res.status(429).json({ message: "Too many attempts. You must wait 10 minutes before retrying." });
    }

    // Generate new code and send
    const activationCode = generateCode();
    user.activationCode = activationCode;
    user.lastResendAt = now;
    user.resendCount = resendCount + 1;
    await user.save();

    const html = loadTemplate(path.resolve('templates', 'activationEmail.html'), {
      fullName: `${user.firstName} ${user.lastName}`,
      activationCode: `${activationCode.split('').join(' ')}`,
    });

    await sendEmail({
      to: email,
      subject: 'Your New Activation Code',
      html,
    });

    return res.status(200).json({ message: 'Activation code resent successfully. Check your email.' });
  } catch (error) {
    console.error("Error resending activation code:", error);
    res.status(500).json({ error: 'Failed to resend activation code.' });
  }
};


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(403).json({ message: "User not found. Please register." });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ message: "Please activate your account first." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Password incorrect." });
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateToken(payload, '1h');  
    const refreshToken = generateToken(payload, '7d'); 

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    
    res.status(200).json({
      message: `User logged in successfully as ${user.role}`,
      accessToken,
      user: {
        id: user.id,
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("An error occurred while logging in", error);
    res.status(500).json({ error: "An error occurred while logging in." });
  }
};


const logoutUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; 

    if (!token) {
      return res.status(400).json({ message: "No token provided." });
    }
    await blacklistToken(token);

    clearSession(req, res);

    return res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    console.error("Error during logout:", error);
    return res.status(500).json({ message: "Error during logout." });
  }
};

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    jwt.verify(refreshToken, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid refresh token" }); 
      }

    
      const payload = { id: decoded.id, email: decoded.email, role: decoded.role };
      const newAccessToken = generateToken(payload, '1h');  

      // Respond with the new access token
      res.status(200).json({
        accessToken: newAccessToken,
      });
    });
  } catch (error) {
    console.error("Error refreshing token:", error);
    res.status(500).json({ error: "Failed to refresh token" });
  }
};



export default {
  createUser,
  activateAccount,
  initiateResetPassword,
  resetPassword,
  loginUser,
  logoutUser,
  resendActivationCode,
  refreshToken
};