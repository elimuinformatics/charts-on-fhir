import { formatDate, formatTime } from './utils';

describe('utils', () => {

    it('should convert timestamp in expected timeformat', () => {
        const expectedTime = formatTime(1676547182000);
        expect(expectedTime).toEqual('11:33 AM')
    });

    it('should convert timestamp in expected dateformat', () => {
        const expectedDate = formatDate(1676547182000);
        expect(expectedDate).toEqual('16 Feb 2023')
    });
});
