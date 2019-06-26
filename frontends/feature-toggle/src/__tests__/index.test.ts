import index from '../index';

describe('Index', () => {
  const expectedResultValue = 'hello';
  it(`should return ${expectedResultValue}`, () => {
    const result = index();
    expect(result).toBe(expectedResultValue);
  });
});
