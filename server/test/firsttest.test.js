const { expect } = require('chai')
const request = require('supertest')
const app = require('../app')
const { connect, disconnect } = require('./testHelper')

describe('App', () => {
    before(async () => await connect())
    after(async () => await disconnect())

    it('returns 404 for unknown routes', async () => {
        const res = await request(app).get('/nonexistent')
        expect(res.status).to.equal(404)
    })
})
