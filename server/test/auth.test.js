const { expect } = require('chai')
const request = require('supertest')
const app = require('../app')
const { connect, disconnect, clearDatabase } = require('./testHelper')

describe('Auth API', () => {
    before(async () => await connect())
    afterEach(async () => await clearDatabase())
    after(async () => await disconnect())

    describe('POST /api/users - Register', () => {
        it('registers a new user and returns a token', async () => {
            const res = await request(app)
                .post('/api/users')
                .send({ name: 'Test User', email: 'test@example.com', password: 'password123' })
            expect(res.status).to.equal(201)
            expect(res.body).to.have.property('token')
            expect(res.body.email).to.equal('test@example.com')
            expect(res.body).to.not.have.property('password')
        })

        it('returns 400 when fields are missing', async () => {
            const res = await request(app)
                .post('/api/users')
                .send({ email: 'incomplete@example.com' })
            expect(res.status).to.equal(400)
        })

        it('returns 400 for duplicate email', async () => {
            await request(app)
                .post('/api/users')
                .send({ name: 'User One', email: 'dupe@example.com', password: 'pass123' })
            const res = await request(app)
                .post('/api/users')
                .send({ name: 'User Two', email: 'dupe@example.com', password: 'pass456' })
            expect(res.status).to.equal(400)
        })
    })

    describe('POST /api/users/login - Login', () => {
        beforeEach(async () => {
            await request(app)
                .post('/api/users')
                .send({ name: 'Login User', email: 'login@example.com', password: 'password123' })
        })

        it('returns a token with valid credentials', async () => {
            const res = await request(app)
                .post('/api/users/login')
                .send({ email: 'login@example.com', password: 'password123' })
            expect(res.status).to.equal(200)
            expect(res.body).to.have.property('token')
        })

        it('returns 400 with wrong password', async () => {
            const res = await request(app)
                .post('/api/users/login')
                .send({ email: 'login@example.com', password: 'wrongpassword' })
            expect(res.status).to.equal(400)
        })

        it('returns 400 for non-existent user', async () => {
            const res = await request(app)
                .post('/api/users/login')
                .send({ email: 'nobody@example.com', password: 'password123' })
            expect(res.status).to.equal(400)
        })
    })

    describe('GET /api/users/me - Get current user', () => {
        let token

        beforeEach(async () => {
            const res = await request(app)
                .post('/api/users')
                .send({ name: 'Me User', email: 'me@example.com', password: 'password123' })
            token = res.body.token
        })

        it('returns user data with a valid token', async () => {
            const res = await request(app)
                .get('/api/users/me')
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).to.equal(200)
            expect(res.body.email).to.equal('me@example.com')
            expect(res.body).to.not.have.property('password')
        })

        it('returns 401 with no token', async () => {
            const res = await request(app).get('/api/users/me')
            expect(res.status).to.equal(401)
        })

        it('returns 401 with an invalid token', async () => {
            const res = await request(app)
                .get('/api/users/me')
                .set('Authorization', 'Bearer notavalidtoken')
            expect(res.status).to.equal(401)
        })
    })
})
