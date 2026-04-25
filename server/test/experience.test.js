const { expect } = require('chai')
const request = require('supertest')
const app = require('../app')
const { connect, disconnect, clearDatabase } = require('./testHelper')

describe('Experience API', () => {
    let token

    before(async () => await connect())
    afterEach(async () => await clearDatabase())
    after(async () => await disconnect())

    beforeEach(async () => {
        const res = await request(app)
            .post('/api/users')
            .send({ name: 'Test User', email: 'test@example.com', password: 'password123' })
        token = res.body.token
    })

    describe('GET /api/experience', () => {
        it('returns empty array when there are no entries', async () => {
            const res = await request(app)
                .get('/api/experience')
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).to.equal(200)
            expect(res.body).to.be.an('array').with.lengthOf(0)
        })

        it('returns 401 without a token', async () => {
            const res = await request(app).get('/api/experience')
            expect(res.status).to.equal(401)
        })
    })

    describe('POST /api/experience', () => {
        it('creates an experience entry', async () => {
            const res = await request(app)
                .post('/api/experience')
                .set('Authorization', `Bearer ${token}`)
                .send({ company: 'Acme Corp', position: 'Engineer', startYear: '2020' })
            expect(res.status).to.equal(200)
            expect(res.body.company).to.equal('Acme Corp')
            expect(res.body.position).to.equal('Engineer')
            expect(res.body).to.have.property('_id')
        })

        it('returns 400 when required fields are missing', async () => {
            const res = await request(app)
                .post('/api/experience')
                .set('Authorization', `Bearer ${token}`)
                .send({ company: 'Acme Corp' })
            expect(res.status).to.equal(400)
        })

        it('only returns entries belonging to the authenticated user', async () => {
            await request(app)
                .post('/api/experience')
                .set('Authorization', `Bearer ${token}`)
                .send({ company: 'My Corp', position: 'Dev', startYear: '2021' })

            const otherUser = await request(app)
                .post('/api/users')
                .send({ name: 'Other User', email: 'other@example.com', password: 'pass' })
            await request(app)
                .post('/api/experience')
                .set('Authorization', `Bearer ${otherUser.body.token}`)
                .send({ company: 'Their Corp', position: 'Manager', startYear: '2022' })

            const res = await request(app)
                .get('/api/experience')
                .set('Authorization', `Bearer ${token}`)
            expect(res.body).to.have.lengthOf(1)
            expect(res.body[0].company).to.equal('My Corp')
        })
    })

    describe('PUT /api/experience/:id', () => {
        let experienceId

        beforeEach(async () => {
            const res = await request(app)
                .post('/api/experience')
                .set('Authorization', `Bearer ${token}`)
                .send({ company: 'Old Corp', position: 'Junior Dev', startYear: '2019' })
            experienceId = res.body._id
        })

        it('updates an experience entry', async () => {
            const res = await request(app)
                .put(`/api/experience/${experienceId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ company: 'New Corp' })
            expect(res.status).to.equal(200)
            expect(res.body.company).to.equal('New Corp')
            expect(res.body.position).to.equal('Junior Dev')
        })

        it('returns 400 for a non-existent id', async () => {
            const res = await request(app)
                .put('/api/experience/507f1f77bcf86cd799439011')
                .set('Authorization', `Bearer ${token}`)
                .send({ company: 'New Corp' })
            expect(res.status).to.equal(400)
        })
    })

    describe('DELETE /api/experience/:id', () => {
        let experienceId

        beforeEach(async () => {
            const res = await request(app)
                .post('/api/experience')
                .set('Authorization', `Bearer ${token}`)
                .send({ company: 'Delete Corp', position: 'Dev', startYear: '2020' })
            experienceId = res.body._id
        })

        it('deletes an experience entry and returns its id', async () => {
            const res = await request(app)
                .delete(`/api/experience/${experienceId}`)
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).to.equal(200)
            expect(res.body.id).to.equal(experienceId)

            const listRes = await request(app)
                .get('/api/experience')
                .set('Authorization', `Bearer ${token}`)
            expect(listRes.body).to.have.lengthOf(0)
        })

        it('returns 400 for a non-existent id', async () => {
            const res = await request(app)
                .delete('/api/experience/507f1f77bcf86cd799439011')
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).to.equal(400)
        })
    })
})
