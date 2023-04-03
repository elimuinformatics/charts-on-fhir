import { formatDate, formatTime } from './utils';

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
