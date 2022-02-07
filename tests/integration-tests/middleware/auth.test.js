import resquest from 'supertest';
import { User } from '../../../backend/routes/models/user.js';
let server;

describe('auth middleware', () => {
  beforeEach(() => {
    server = import('../../../backend/app.js');
  });

  afterEach(async () => {
    server.close();
  });
  let token;

  const exec = () => {
    return resquest(server)
      .post('/api/images')
      .set('x-auth-token', token)
      .send({
        name: 'logo',
        description: 'aamasmdsfdsj',
      });
  };

  beforeEach(async () => {
    const user = await User.findOne({ name: 'devtest' });
    token = user.generateAuthToken();
  });

  it('should return 401 if no token is provided', async () => {
    token = '';
    const res = await exec();
    expect(res.status).toBe(401);
  });

  it('should return 400 if token is invalid', async () => {
    token = null; // null to a string null ('null');
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it('should return 200 if token is valid', async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });
});
