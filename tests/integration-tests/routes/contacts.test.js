const request = require('supertest');
const { Contact } = require('../../../routes/models/contact');
let server;

describe('api/contacts', () => {

    beforeEach(() => { server = require('../../../index'); })

    afterEach(async () => {
        server.close();
        await Contact.deleteMany({});
    })

    describe('GET /', () => {
        it('should return all contacts', async () => {
            await Contact.collection.insertMany([
                {
                    name: "akim",
                    subjectId: "helll",
                    message: "hey there",
                    email: "igbo7777@gmail.com"
                },
                {
                    name: "akimesco",
                    subjectId: "heaven",
                    message: "hey there",
                    email: "igbo7777@gmail.com"
                }
            ])
            const res = await request(server).get('/api/contacts');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(c => c.name === "akim")).toBeTruthy();
            expect(res.body.some(c => c.name === "akimesco")).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        it('should return a contact if valid id is passed', async () => {
            const contact = new Contact({

                name: "asa",
                subjectId: "hello",
                message: "hey there",
                email: "igbo7777@gmail.com"
            })

            await contact.save();
            const res = await request(server).get('/api/contacts/' + contact._id);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', contact.name);
        });

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server).get('/api/contacts/1');
            expect(res.status).toBe(404);
        });
    });

    describe('POST /', () => {

        const exec = async () => {
            return await request(server)
                .post('/api/contacts')
                .send({
                    name: "asa",
                    subjectId: "hello",
                    message: "aaaaa",
                    email: "@.co"

                });
        }
        it('should return 200 if client has sent a message successfully', async () => {
            const res = await request(server)
                .post('/api/contacts')
                .send({
                    name: "asa",
                    subjectId: "hello",
                    message: "hey there",
                    email: "asa@gmail.com"

                });
            expect(res.status).toBe(200);
        });

        describe("name field validation", () => {
            it('should return 400 if  contact name is less than 3 characters ', async () => {
                const res = await request(server)
                    .post('/api/contacts')
                    .send({
                        name: "a",
                        subjectId: "hello",
                        message: "hey there",
                        email: "asa@gmail.com"

                    });
                expect(res.status).toBe(400);
            });

            it('should return 400 if  contact name is more than 50 characters ', async () => {
                const res = await request(server)
                    .post('/api/contacts')
                    .send({
                        name: new Array(52).join('a'),
                        subjectId: "hello",
                        message: "hey there",
                        email: "asa@gmail.com"

                    });
                expect(res.status).toBe(400);
            });
        });

        describe("subjectId field validation", () => {
            it('should return 400 if  contact subjectId is less than 5 characters ', async () => {
                const res = await request(server)
                    .post('/api/contacts')
                    .send({
                        name: "asa",
                        subjectId: "hell",
                        message: "hey there",
                        email: "asa@gmail.com"

                    });
                expect(res.status).toBe(400);
            });

            it('should return 400 if  contact subjectId is more than 255 characters ', async () => {
                const res = await request(server)
                    .post('/api/contacts')
                    .send({
                        name: "asa",
                        subjectId: new Array(257).join('a'),
                        message: "hey there",
                        email: "asa@gmail.com"

                    });
                expect(res.status).toBe(400);
            });
        });

        describe('message field validation', () => {
            it('should return 400 if  contact body message is an empty string ', async () => {
                const res = await request(server)
                    .post('/api/contacts')
                    .send({
                        name: "asa",
                        subjectId: "hello",
                        message: "",
                        email: "asa@gmail.com"

                    });
                expect(res.status).toBe(400);
            });

            it('should return 400 if  contact body message is more than 1020 characters', async () => {
                const res = await request(server)
                    .post('/api/contacts')
                    .send({
                        name: "asa",
                        subjectId: "hello",
                        message: new Array(1022).join('a'),
                        email: "asa@gmail.com"

                    });
                expect(res.status).toBe(400);
            });
        });

        describe("email field validation", () => {
            it('should return 400 if invalid contact email is submitted ', async () => {
                const res = await request(server)
                    .post('/api/contacts')
                    .send({
                        name: "asa",
                        subjectId: "hello",
                        message: "aaaaa",
                        email: "asagmail.com"

                    });
                expect(res.status).toBe(400);
            });

            it('should return 400 if invalid contact email is less than 5 characters ', async () => {
                const res = await request(server)
                    .post('/api/contacts')
                    .send({
                        name: "asa",
                        subjectId: "hello",
                        message: "aaaaa",
                        email: "@.co"

                    });
                expect(res.status).toBe(400);
            });

            it('should return 400 if invalid contact email is more than 255 characters ', async () => {
                const res = await request(server)
                    .post('/api/contacts')
                    .send({
                        name: "asa",
                        subjectId: "hello",
                        message: "aaaaa",
                        email: new Array(257).join('a@g.co')

                    });
                expect(res.status).toBe(400);
            });
        });

        it('should save contact if it is valid', async () => {
            await exec();
            const contact = await Contact.find({ name: "asa" });

            expect(contact).not.toBeNull();
        });

        it('should return contact if it is valid', async () => {
            const res = await request(server)
                .post('/api/contacts')
                .send({
                    name: "asa",
                    subjectId: "hello",
                    message: "hey there",
                    email: "asa@gmail.com"

                });

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'asa');
        });

    });
});