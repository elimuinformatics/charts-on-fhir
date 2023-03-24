import { SortByPipe } from "./sort-by.pipe";

describe('sortByPipe', () => {
    it('should sort the dataset for multiple legend  using Y value', () => {
        const pipe = new SortByPipe();
        const dataset: any = [{
            data: [{
                x: 1677841517844,
                y: 110
            }],
            label: "Diastolic Blood Pressure (Home)",
        },
        {
            data: [{
                x: 1677841517844,
                y: 140
            }],
            label: "Systolic Blood Pressure (Home)",
        },
        {
            data: [{
                x: 1678355029160,
                y: 90
            }],
            label: "Diastolic Blood Pressure",
        },
        {
            data: [{
                x: 1678355029160,
                y: 120
            }],
            label: "Systolic Blood Pressure",
        }]
        const result = pipe.transform(dataset);

        expect(result).toEqual([
            {
                data: [{
                    x: 1677841517844,
                    y: 140
                }],
                label: "Systolic Blood Pressure (Home)",
            },
            {
                data: [{
                    x: 1678355029160,
                    y: 120
                }],
                label: "Systolic Blood Pressure",
            },
            {
                data: [{
                    x: 1677841517844,
                    y: 110
                }],
                label: "Diastolic Blood Pressure (Home)",
            }, {
                data: [{
                    x: 1678355029160,
                    y: 90
                }],
                label: "Diastolic Blood Pressure",
            },]);
    })

    it('should sort the dataset for single legend using Y value', () => {
        const pipe = new SortByPipe();
        const dataset: any = [{
            data: [{
                x: 1677841517844,
                y: 110
            }],
            label: "Diastolic Blood Pressure (Home)",
        }]
        const result = pipe.transform(dataset);

        expect(result).toEqual([
            {
                data: [{
                    x: 1677841517844,
                    y: 110
                }],
                label: "Diastolic Blood Pressure (Home)",
            }]);
    })

    it('should sort the empty dataset', () => {
        const pipe = new SortByPipe();
        const dataset: any = []

        const result = pipe.transform(dataset);

        expect(result).toEqual([]);
    })
});