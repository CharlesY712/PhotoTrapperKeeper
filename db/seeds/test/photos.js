const photoData = require('../../../photoData');

exports.seed = function(knex) {
  return knex('photos').del()
    .then(() => {
      return knex('photos').insert(photoData, 'id');
    })
    .then(() => console.log('Seeding complete!')) // eslint-disable-line
    .catch(error => console.log(`Error seeding data: ${error}`)); // eslint-disable-line
};
