const { expect } = require('chai')
const request = require('supertest')
const app = require('../app')
const { connect, disconnect, clearDatabase } = require('./testHelper')

describe('Education API', () => {
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

    describe('GET /api/education', () => {
        it('returns empty array when there are no entries', async () => {
            const res = await request(app)
                .get('/api/education')
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).to.equal(200)
            expect(res.body).to.be.an('array').with.lengthOf(0)
        })

        it('returns 401 without a token', async () => {
            const res = await request(app).get('/api/education')
            expect(res.status).to.equal(401)
        })
    })

    describe('POST /api/education', () => {
        it('creates an education entry', async () => {
            const res = await request(app)
                .post('/api/education')
                .set('Authorization', `Bearer ${token}`)
                .send({ institution: 'MIT', qualification: 'BSc Computer Science', startYear: '2018' })
            expect(res.status).to.equal(201)
            expect(res.body.institution).to.equal('MIT')
            expect(res.body.qualification).to.equal('BSc Computer Science')
            expect(res.body).to.have.property('_id')
        })

        it('returns 400 when required fields are missing', async () => {
            const res = await request(app)
                .post('/api/education')
                .set('Authorization', `Bearer ${token}`)
                .send({ institution: 'MIT' })
            expect(res.status).to.equal(400)
        })

        it('only returns entries belonging to the authenticated user', async () => {
            await request(app)
                .post('/api/education')
                .set('Authorization', `Bearer ${token}`)
                .send({ institution: 'My Uni', qualification: 'BSc', startYear: '2018' })

            const otherUser = await request(app)
                .post('/api/users')
                .send({ name: 'Other User', email: 'other@example.com', password: 'pass' })
            await request(app)
                .post('/api/education')
                .set('Authorization', `Bearer ${otherUser.body.token}`)
                .send({ institution: 'Their Uni', qualification: 'MSc', startYear: '2020' })

            const res = await request(app)
                .get('/api/education')
                .set('Authorization', `Bearer ${token}`)
            expect(res.body).to.have.lengthOf(1)
            expect(res.body[0].institution).to.equal('My Uni')
        })
    })

    describe('PUT /api/education/:id', () => {
        let educationId

        beforeEach(async () => {
            const res = await request(app)
                .post('/api/education')
                .set('Authorization', `Bearer ${token}`)
                .send({ institution: 'Old Uni', qualification: 'BSc', startYear: '2015' })
            educationId = res.body._id
        })

        it('updates an education entry', async () => {
            const res = await request(app)
                .put(`/api/education/${educationId}`)
                .set('Authorization', `Bearer ${token}`)
                .send({ institution: 'New Uni' })
            expect(res.status).to.equal(200)
            expect(res.body.institution).to.equal('New Uni')
            expect(res.body.qualification).to.equal('BSc')
        })

        it('returns 400 for a non-existent id', async () => {
            const res = await request(app)
                .put('/api/education/507f1f77bcf86cd799439011')
                .set('Authorization', `Bearer ${token}`)
                .send({ institution: 'New Uni' })
            expect(res.status).to.equal(400)
        })
    })

    describe('DELETE /api/education/:id', () => {
        let educationId

        beforeEach(async () => {
            const res = await request(app)
                .post('/api/education')
                .set('Authorization', `Bearer ${token}`)
                .send({ institution: 'Delete Uni', qualification: 'BSc', startYear: '2016' })
            educationId = res.body._id
        })

        it('deletes an education entry and returns its id', async () => {
            const res = await request(app)
                .delete(`/api/education/${educationId}`)
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).to.equal(200)
            expect(res.body.id).to.equal(educationId)

            const listRes = await request(app)
                .get('/api/education')
                .set('Authorization', `Bearer ${token}`)
            expect(listRes.body).to.have.lengthOf(0)
        })

        it('returns 400 for a non-existent id', async () => {
            const res = await request(app)
                .delete('/api/education/507f1f77bcf86cd799439011')
                .set('Authorization', `Bearer ${token}`)
            expect(res.status).to.equal(400)
        })
    })
})
