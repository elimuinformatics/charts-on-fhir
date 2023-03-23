import { SortByPipe } from "./sort-by.pipe";

describe('sortByPipe', () => {
    it('should sort in ascending order', () => {
        const pipe = new SortByPipe();
        const result = pipe.transform([4,3,2,1], 'asc');
    
        expect(result).toEqual([1,2,3,4]);
    })

    it('should sort in descending order', () => {
        const pipe = new SortByPipe();
        const result = pipe.transform([1,2,3,4], 'desc');
    
        expect(result).toEqual([4,3,2,1]);
    })
  });