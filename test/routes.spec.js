const chai = require('chai');
const should = chai.should(); // eslint-disable-line
const { app, database } = require('../server');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

describe('Endpoint tests', () => {

  beforeEach((done) => {
    database.migrate.rollback()
      .then(() => {
        database.migrate.latest()
          .then(() => {
            return database.seed.run()
              .then(() => {
                done();
              });
          });
      });
  });

  it('should GET all the photos', (done) => {
    chai.request(app)
      .get('/api/v1/photos')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.an('array');
        response.body[0].should.have.property('title');
        response.body[0].should.have.property('url');
        done();
      });
  });



  it('should POST a photo to photos database', (done) => {
    chai.request(app)
      .post('/api/v1/photos')
      .send({
        title: 'WRC Subaru',
        url: 'https://i.redd.it/k0g6d09smzaz.jpg'
      })
      .end((err, response) => {
        response.should.have.status(201);
        response.body.should.be.a('string');
        done();
      });
  });

  it('should not POST a photo to photos database if missing a title', (done) => {
    chai.request(app)
      .post('/api/v1/photos')
      .send({
        url: 'https://i.redd.it/k0g6d09smzaz.jpg'
      })
      .end((err, response) => {
        response.should.have.status(422);
        done();
      });
  });

  it('should not POST a photo to photos database if missing a url', (done) => {
    chai.request(app)
      .post('/api/v1/photos')
      .send({
        title: 'Sexy Subaru'
      })
      .end((err, response) => {
        response.should.have.status(422);
        done();
      });
  });

  it('should DELETE photo from photo database', (done) => {
    chai.request(app)
      .delete('/api/v1/photos/1')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.an('object');
        done();
      });
  });

  it('should not DELETE photo from photo database when the wrong ID is sent', (done) => {
    chai.request(app)
      .delete('/api/v1/photos/5')
      .end((error, response) => {
        response.should.have.status(422);
        response.should.be.json;
        response.body.should.be.an('object');
        done();
      });
  });

  it('should not DELETE photo from photo database when ID is not an integer', (done) => {
    chai.request(app)
      .delete('/api/v1/photos/7.5')
      .end((error, response) => {
        response.should.have.status(500);
        response.should.be.json;
        response.body.should.be.an('object');
        done();
      });
  });
});