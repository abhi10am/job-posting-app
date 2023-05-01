const cors = require('cors');
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const { engine } = require('express-handlebars');

const authRoutes = require('./routes/auth.js')
const adminRoutes = require('./routes/admin.js')
const userRoutes = require('./routes/user.js');
const multer = require('multer');

app.use(cors());
app.use(express.json());

app.engine("handlebars", engine());
app.set("view engine", "hbs");
app.set("views", "./views");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})

const upload = multer({
  storage,
  limits: { fieldSize: 2 * 1024 * 1024 } // 2MB
});

app.use(upload.fields([
  { name: 'resume' }
]))

app.get('/', (req, res) => {
  res.status(200).send("Job Posting App APIs");
});

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);

app.listen(port, () => console.log(`Express app running on port ${port}!`));