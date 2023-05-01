const mailHelper = require("../helpers/MailHelper");

const sendApplicationSubmissionEmail = (type, application) => {
  const user = application.user;
  const admin = application.job.admin;
  const job = application.job;

  const to = (type === "ADMIN") ? admin.email : user.email;

  mailHelper.to(to)
    .subject("Job Application Submitted")
    .view("application-submission")
    .context({
      user: user,
      job: job,
      isAdmin: (type === "ADMIN")
    })
    .send();
}

module.exports = sendApplicationSubmissionEmail;