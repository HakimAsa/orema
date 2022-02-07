const request = require('supertest');
const { Image } = require('../../../routes/models/image');
const { User } = require('../../../routes/models/user')
let server;
const endpoint = '/api/images';

describe('api/images', () => {
    beforeEach(() => { server = require('../../../index'); });

    afterEach(async () => {
        server.close();
        await Image.deleteMany({});
    });

    describe('GET /', () => {
        it('should return all images', async () => {
            await Image.collection.insertMany([
                {
                    name: "akim.jpg",
                    description: "my profile pic"
                },
                {
                    name: "akiakm.jpg",
                    description: "my avatar pic"
                }
            ])
            const res = await request(server).get(endpoint);
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(3);
            expect(res.body.some(c => c.name === "akim.jpg")).toBeTruthy();
            expect(res.body.some(c => c.name === "akiakm.jpg")).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        it('should return an image if valid id is passed', async () => {
            const image = new Image({

                name: 'akim.jpg',
                description: 'avatar'
            })

            await image.save();
            const res = await request(server).get(endpoint + '/' + image._id);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', image.name);
        });

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server).get(`${endpoint}/1`);
            expect(res.status).toBe(404);
        });
    });

    describe('POST /', () => {

        let token;
        let name;
        let description

        const exec = async () => {
            return await request(server)
                .post(endpoint)
                .set('x-auth-token', token)
                .send({
                    name,
                    description

                });
        };

        beforeEach(async () => {
            const user = await User.findOne({ firstName: "devtest" });
            token = user.generateAuthToken();
            name = 'akime.jpg';
            description = 'avatar';
        });

        it('should return 401 if client is not logged in', async () => {
            token = ''
            const res = await exec();
            expect(res.status).toBe(401);
        });

        it('should return 400 if image name is more than 20 characters', async () => {
            name = new Array(22).join('a.jpg');
            const res = await exec();
            expect(res.status).toBe(400);
        });
    });

});
