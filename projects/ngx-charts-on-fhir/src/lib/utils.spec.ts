import { errorStatusCheck, formatDate, formatTime } from './utils';

describe('utils', () => {
  it('should convert timestamp in expected timeformat for different time zones', () => {
    const date = new Date(1676547182000);
    const estTime = formatTime(date.toLocaleString('en-US', { timeZone: 'America/New_York' }));
    const pstTime = formatTime(date.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
    const cetTime = formatTime(date.toLocaleString('en-US', { timeZone: 'Europe/Paris' }));
    expect(estTime).toBe('6:33 AM');
    expect(pstTime).toBe('3:33 AM');
    expect(cetTime).toBe('12:33 PM');
  });

  it('should convert timestamp in expected dateformat', () => {
    const expectedDate = formatDate(1676547182000);
    expect(expectedDate).toEqual('16 Feb 2023');
  });
});

describe('errorStatusCheck function', () => {
  it('should return true for HTTP 500 status code', () => {
    const error = { status: 500 };
    const result = errorStatusCheck(error);
    expect(result).toBeTrue();
  });
  it('should return true for HTTP 501 status code', () => {
    const error = { status: 501 };
    const result = errorStatusCheck(error);
    expect(result).toBeTrue();
  });

  it('should return true for HTTP 502 status code', () => {
    const error = { status: 502 };
    const result = errorStatusCheck(error);
    expect(result).toBeTrue();
  });

  it('should return true for HTTP 503 status code', () => {
    const error = { status: 503 };
    const result = errorStatusCheck(error);
    expect(result).toBeTrue();
  });

  it('should return true for HTTP 504 status code', () => {
    const error = { status: 504 };
    const result = errorStatusCheck(error);
    expect(result).toBeTrue();
  });

  it('should return false for HTTP 400 status code', () => {
    const error = { status: 400 };
    const result = errorStatusCheck(error);
    expect(result).toBeFalse();
  });
});
