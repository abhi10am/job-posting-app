const path = require("path");
const nodemailer = require("nodemailer");
const exphbs = require("express-handlebars");
const nodehbs = require("nodemailer-express-handlebars");

class MailHelper {
  _to = null;
  _subject = null;
  _view = null;
  _context = null;

  to(to) {
    this._to = to;
    return this;
  }

  subject(subject) {
    this._subject = subject;
    return this;
  }

  view(view) {
    this._view = view;
    return this;
  }

  context(context) {
    this._context = context;
    return this;
  }

  send() {
    if (!this._to || !this._subject || !this._view || !this._context) return false;

    const mailOptions = {
      from: "Job Posting App",
      to: this._to,
      subject: this._subject,
      template: this._view,
      context: this._context,
    };

    const transporter = nodemailer.createTransport({
      host: "smtp.googlemail.com",
      port: 465,
      secure: true,
      auth: {
        user: 'abhishekmankar10.am@gmail.com',
        pass: 'reemlpxdvatkoqkz'
      }
    });

    const viewEngineOptions = {
      extname: ".hbs",
      layoutsDir: path.resolve("src/views/email/"),
      defaultLayout: "main",
      // partialsDir: "views/partials/",
    };

    var hbsViewEngine = exphbs.create(viewEngineOptions);

    const options = {
      viewEngine: hbsViewEngine,
      viewPath: path.resolve("src/views/email/"),
      extName: ".hbs",
    };

    transporter.use("compile", nodehbs(options));

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        // console.log(info);
      }
    });

    return true;
  }
}

module.exports = new MailHelper();