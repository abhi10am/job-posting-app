const mailHelper = require("../helpers/MailHelper");

const sendApplicationUpdateEmail = (application) => {
  mailHelper.to(application.user.email)
    .subject("Job Application Update")
    .view("application-update")
    .context({ 
      application,
      isRejected: (application.status === "REJECTED")
    })
    .send();
}

module.exports = sendApplicationUpdateEmail;