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
      return response.status(200).json(photos);
    })
    .catch((error) => {
      return response.status(500).json({ error });
    });
});

app.post('/api/v1/photos', (request, response) => {
  const photo = request.body;

  for (let requiredParameter of ['title', 'url']) {
    if (!photo[requiredParameter]) {
      return response.status(422).send(`You are missing a ${requiredParameter}`);
    }
  }

  database('photos').insert(photo, 'title')
    .then(photoTitle => {
      return response.status(201).json(`Successfully added ${photoTitle} to photos database.`);
    })
    .catch(err => {
      return response.status(500).json({err});
    });
});

app.delete('/api/v1/photos/:id', (request, response) => {
  database('photos').where('id', request.params.id).del()
    .then(deleteCount => {
      if (deleteCount === 1) {
        return response.status(200).json({success: `Photo with an id of ${request.params.id} deleted.`});
      } else {
        return response.status(422).json({failure: `Photo with an id of ${request.params.id} does not exist.`})
      }
    })
    .catch(err => {
      return response.status(500).json({err});
    });
});

module.exports = { app, database };