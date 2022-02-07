const request = require('supertest');
const { User } = require('../../../routes/models/user');

let server;
const path = '/api/users';

describe(`endpoint  ${path}`, () => {
  beforeEach(() => {
    server = require('../../../index');
  });

  afterEach(async () => {
    server.close();
    await User.deleteOne({ firstName: 'aasaasasa' });
  });

  it('mock tess', () => {
    expect(path).toBe('/api/users');
  });

  describe(`API POST ${path}`, () => {
    const exec = async () => {
      return await request(server).post(path).send(
        {
          name: 'aasaasasa',
          password: 'Ak!im7777',
          email: 'akim7777@gmail.com',
        },
        {
          name: 'devtest',
          password: 'Ak!im7777',
          email: 'igbo7777@gmail.com',
        }
      );
    };

    it('should create a user an save it to db if it is valid', async () => {
      await exec();
      const user = User.find({ firstname: 'devtest' });
      expect(user).not.toBeNull();
    });
  });
});
