// import { makeExpressApp } from './utils'
// import logger from '../utils/logger'
const app =  require('../index.js')
const request = require('supertest')

jest.setTimeout(10_000)

describe('Tests', () => {

	// const app = makeExpressApp()

	beforeAll(() => {
	})

	afterAll(async() => {
		// await repository.close()
		// eventsManager.close()
	})

    it('should get all todos', async() => {
        const res = await request(app).get('/api/v1/')
        expect(res.body.todos).toBeDefined()
    })

   

})