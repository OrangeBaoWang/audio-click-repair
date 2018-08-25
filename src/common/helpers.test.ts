import {
  getAverage,
  transpose,
  makeXEmptyArrs,
  averageFloat32s
} from './helpers'
describe('helpers', () => {
  describe('getAverage', () => {
    it('should pass a basic example', () => {
      expect(getAverage([1, 2, 3])).toBe(2)
    })
  })

  describe('transpose', () => {
    it('should do something easy', () => {
      expect(
        transpose([new Float32Array([1, 2, 3]), new Float32Array([2, 3, 4])])
      ).toEqual([[1, 2], [2, 3], [3, 4]])
    })
  })

  describe('makeXEmptyArrs', () => {
    it('should pass happy path', () => {
      expect(makeXEmptyArrs(3, 2)).toEqual([
        new Float32Array([0, 0, 0]),
        new Float32Array([0, 0, 0])
      ])
    })
  })

  describe('averageFloat32s', () => {
    it('should average a few simple arrays', () => {
      expect(
        averageFloat32s([
          new Float32Array([2, 4, 6]),
          new Float32Array([1, 3, 5])
        ])
      ).toEqual(new Float32Array([1.5, 3.5, 5.5]))
    })
  })
})
