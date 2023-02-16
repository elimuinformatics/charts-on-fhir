import { formatDate,formatTime } from './utils';

describe('utils', () => {

    it('should convert timestamp in expected timeformat', () => {
        const expectedTime =formatTime(1676547182000);
        expect(expectedTime).toEqual('5:03 PM')
     });

    it('should convert timestamp in expected dateformat', () => {
       const expectedDate =formatDate(1676547182000);
       expect(expectedDate).toEqual('16 Feb 2023')
    });
});
