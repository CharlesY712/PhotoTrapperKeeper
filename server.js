const express = require('express');
const app = express();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

const bodyParser = require('body-parser');
app.use(express.static('public'));
app.use(bodyParser.json());

app.set('port', process.env.PORT || 3000);

app.locals.title = 'Photo Trapper Keeper';

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}`); // eslint-disable-line
});

app.get('/api/v1/photos', (request, response) => {
  database('photos').select()
    .then((photos) => {
      response.status(200).json(photos);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.post('/api/v1/photos', (req, res) => {
  const photo = req.body;

  for (let requiredParameter of ['title', 'url']) {
    if (!photo[requiredParameter]) {
      return res.status(422)
        .send(`You are missing a ${requiredParameter}`);
    }
  }

  database('photos').insert(photo, 'title')
    .then(photoID => {
      return res.status(201)
        .json(`Successfully added ${photoID} to database.`);
    })
    .catch(err => {
      return res.status(500).json({err});
    });
});