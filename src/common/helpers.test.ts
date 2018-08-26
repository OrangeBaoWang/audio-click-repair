import {
  getAverage,
  transpose,
  makeXEmptyArrs,
  averageFloat32s,
  containsAnException,
  getDifferenceArray
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

  describe('getDifferenceArray', () => {
    it('should produce a difference array give a basic setup', () => {
      expect(getDifferenceArray([1, 2, 3, 4])).toEqual([1, 1, 1])
    })
    it('should produce a difference array give a slightly more complicated setup', () => {
      expect(getDifferenceArray([1, -1, -3, 55])).toEqual([2, 2, 58])
    })
  })

  describe('containsAnException', () => {
    it('should pass false in areas where it is not that exceptional 1', () => {
      expect(containsAnException([1, 2, 3, 4, 5])).toBe(false)
    })
    it('should pass false in areas where it is not that exceptional 2', () => {
      expect(containsAnException([5, 4, 3, 2, 1])).toBe(false)
    })
    it('should pass false in areas where it is not that exceptional 3', () => {
      expect(containsAnException([0, 0.1, 0.2, 0.3, 0.4])).toBe(false)
    })
    it('should pass true when obvious exception exists', () => {
      expect(containsAnException([1, 2, 300, 2, 1])).toBe(true)
    })
    it('should pass true when somewhat obvious exception exists', () => {
      expect(containsAnException([1, 2, 1, -6, -7])).toBe(true)
    })
    it('should pass true when subtle exception exists', () => {
      expect(containsAnException([1, 2, 6, 7])).toBe(true)
    })
  })
})
