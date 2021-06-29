const CronParser = require('../cronParser.js');

const parser = new CronParser();

test('validates range', () => {
  expect(parser.range(1, 6)).toEqual([1, 2, 3, 4, 5, 6]);
  expect(parser.range(0, 5)).toEqual([0, 1, 2, 3, 4, 5])
});

test('validates allOf', () => {
  expect(parser.allOf('DAYSOFWEEK')).toEqual([1, 2, 3, 4, 5, 6, 7])
});

describe('#step', () => {
  test('validates days when */5', () => {
    expect(parser.step(['*', '5'], 'MINUTE')).toEqual([0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55])
  });

  test('validates days when 6/5', () => {
    expect(parser.step(['6', '5'], 'MINUTE')).toEqual([6, 11, 16, 21, 26, 31, 36, 41, 46, 51, 56])
  });

  test('errors if first argument length is not 2', () => {
    expect(() => parser.step([6], 'MINUTE')).toThrow(Error)
  });

  test('errors if increment is greater than max', () => {
    expect(() => parser.step(['*', '665'], 'MINUTE')).toThrow(Error)
  });
});

describe('#validateRange', () => {
  test('errors when range is greater than max', () => {
    let range = [1, 2, 3, 4, 5, 6, 7, 8]
    expect(() => parser.validateRange(range, 'DAYSOFWEEK')).toThrow(Error)
  });
  
  test('errors when range is less than start', () => {
    let range = [0, 1, 2, 3, 4, 5, 6]
    expect(() => parser.validateRange(range, 'DAYSOFWEEK')).toThrow(Error)
  });

  test('errors when range is empty', () => {
    expect(() => parser.validateRange([], 'DAYSOFWEEK')).toThrow(Error)
  });
});
