import 'mocha'
import { expect } from 'chai'
import sinon = require('sinon')
import { Show } from '../src/common/models'

describe('ShowSchema', () => {
  it('should be invalid if show is empty', () => {
    const newShow = new Show()

    newShow.validate(err => {
      expect(err.errors.name).to.exist
    })
  })
})



describe('Get all Shows', () => {
 it('should return all shows', (done) => {
     const ShowMock = sinon.mock(Show)
     const expectedResult = {status: true, shows: []}
     ShowMock.expects('find').yields(null, expectedResult)
     Show.find( (err, result) => {
       ShowMock.verify()
       ShowMock.restore()
       expect(result.status).to.be.true
       done()
     })
 })

 it('should return error', done => {
     const ShowMock = sinon.mock(Show)
     const expectedResult = {status: false, error: 'Something went wrong'}
     ShowMock.expects('find').yields(expectedResult, null)
     Show.find((err, result)  => {
       ShowMock.verify()
       ShowMock.restore()
       expect(err.status).to.not.be.true
       done()
     })
 })
})
