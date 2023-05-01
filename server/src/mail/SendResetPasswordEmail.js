const mailHelper = require("../helpers/MailHelper");

const sendResetPasswordEmail = (user, token) => {
  mailHelper.to(user.email)
    .subject("Password Reset Request")
    .view("reset-password")
    .context({
      user: user,
      resetLink: process.env.CLIENT_URL + "/reset-password/" + token,
    })
    .send();
}

module.exports = sendResetPasswordEmail;