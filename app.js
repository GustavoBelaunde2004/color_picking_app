const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

mongoose.connect('mongodb://localhost:27017/demoApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const Data = require('./models/Data');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/submit', async (req, res) => {
  const { name, favoriteColor } = req.body;
  const existing = await Data.findOne({ name });

  if (!existing) {
    const newData = new Data({ name, favoriteColor });
    await newData.save();
    res.json({ type: 'new', message: `Thanks ${name}, we saved your favorite color: ${favoriteColor}` });
  } else if (existing.favoriteColor === favoriteColor) {
    res.json({
      type: 'same',
      message: `Hey ${name}, you already said your favorite color is "${favoriteColor}"!`
    });
  } else {
    res.json({
      type: 'exists',
      name,
      oldColor: existing.favoriteColor,
      newColor: favoriteColor
    });
  }
});

app.post('/update', async (req, res) => {
  const { name, newColor } = req.body;
  const updated = await Data.findOneAndUpdate({ name }, { favoriteColor: newColor });
  res.json({ message: `Updated ${name}'s favorite color to ${newColor}` });
});

app.get('/users', async (req, res) => {
  const users = await Data.find({}, 'name');
  res.json(users);
});

app.get('/color/:name', async (req, res) => {
  const { name } = req.params;
  const user = await Data.findOne({ name });
  if (user) {
    res.json({ color: user.favoriteColor });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));