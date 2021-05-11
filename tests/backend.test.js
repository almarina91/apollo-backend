const request = require('supertest');

const app = require('../app');

const User = require('../src/models/user')

beforeAll(async()=>{
    await User.deleteMany()
})

test('should signup a new user',async () => {
    await request(app)
        .post('/users').send({
            username: 'Test',
            email: 'test@live.com',
            password: '12345Test!',
            language: 'english',
            role: 'user'
        }).expect(201)
})

test('should not log in non existing user', async ()=> {
    await request(app)
        .post('/users/login').send({
            email: 'notexisting@gmail.com',
            password: '1234Nonexisting!'
        }).expect(400)
})

test('should log in existing user', async ()=> {
    await request(app)
        .post('/users/login').send({
            email: 'test@live.com',
            password:'12345Test!'
        }).expect(200)
})
