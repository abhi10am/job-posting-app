const responseHelper = require('../helpers/ResponseHelper');
const genericHelper = require('../helpers/GenericHelper');
const userService = require('../services/UserService');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const sendResetPasswordEmail = require('../mail/SendResetPasswordEmail');

class AuthController {

  async register (req, res) {
    try {
      
      // get user input
      const { name, email, phone, password, role } = req.body;
      
      // check if user already exists
      if (await userService.findUserByEmail(email)) {
        return responseHelper.error(res, 'User already exists with this email!');
      }
  
      // encrypt password
      const encryptedPassword = await bcrypt.hash(password, 10);
  
      // create user in the database
      const user = await prisma.user.create({ 
        data: { name, email, phone, password: encryptedPassword, role }
      })
  
      if (user) {
        return responseHelper.success(res, 'User registered successfully');
      }
  
      return responseHelper.error(res, 'Failed to register user');
    }
    catch (err) {
      console.log(err);
      return responseHelper.error(res, 'Something went wrong', 500);
    }
  }

  async login (req, res) {
    try {
      // get user input
      const { email, password } = req.body;

      const user = await userService.findUserByEmail(email);

      if (!user) {
        return responseHelper.error(res, 'User not found!');
      }

      if (await bcrypt.compare(password, user.password)) {
        // create token
        const token = jwt.sign(
          {
            userId: user.id,
            email: user.email,
            role: user.role
          },
          process.env.TOKEN_KEY,
          {
            expiresIn: 86400 // 24 hours
          }
        )

        return responseHelper.success(res, 'User logged in successfully', { user, token });
      }

      return responseHelper.error(res, 'Invalid credentials', 500);
    }
    catch (err) {
      console.log(err)
      return responseHelper.error(res, 'Something went wrong', 500);
    }
  }

  async forgotPassword (req, res) {
    try {
      const { email } = req.body;
      let resetRequest = null;
      
      const userExists = await userService.findUserByEmail(email);

      if (!userExists) {
        return responseHelper.error(res, 'User not found', 404);
      }

      // create random token
      const token = genericHelper.randomString(50);

      // create password reset request
      const requestExists = await prisma.passwordReset.findFirst({
        where: { email }
      });

      if (requestExists) {
        resetRequest = await prisma.passwordReset.update({
          where: { email },
          data: { token }
        })
      }
      else {
        resetRequest = await prisma.passwordReset.create({
          data: { email, token }
        })
      }

      // send email to user with password reset link 
      sendResetPasswordEmail(userExists, token);

      if (resetRequest) {
        return responseHelper.success(res, 'Reset password link has been sent to your email');
      }
      
      return responseHelper.error(res, 'Something went wrong', 500);
    }
    catch (err) {
      console.log(err);
      return responseHelper.error(res, 'Somthing went wrong', 500);
    }
  }

  async resetPassword (req, res) {
    try {
      const { password } = req.body;
      const token = req.params.token;

      // check for request by token
      const resetRequest = await prisma.passwordReset.findFirst({
        where: { token }
      });

      if (!resetRequest) {
        return responseHelper.error(res, 'Password reset token is invalid');
      }

      // encrypt password
      const encryptedPassword = await bcrypt.hash(password, 10);

      // update password in the database
      const udpatePassword = await prisma.user.update({ 
        where: { email: resetRequest.email },
        data: { password: encryptedPassword }
      })

      // delete reset request
      await prisma.passwordReset.deleteMany({
        where: { email: resetRequest.email }
      });

      if (udpatePassword) {
        return responseHelper.success(res, 'Password updated successfully. Please login with your new password.');
      }

      return responseHelper.error(res, 'Failed to update password');
    }
    catch (err) {
      console.log(err);
      return responseHelper.error(res, 'Something went wrong', 500);
    }
  }

}

module.exports = new AuthController();