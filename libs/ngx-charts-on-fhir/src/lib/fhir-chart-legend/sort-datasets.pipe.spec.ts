import { SortDatasets } from './sort-datasets.pipe';

describe('sortDatasets', () => {
  it('should sort the dataset for multiple legend  using Y value', () => {
    const pipe = new SortDatasets();
    const dataset: any = [
      {
        data: [
          {
            x: 1677841517844,
            y: 110,
          },
        ],
        label: 'Diastolic Blood Pressure (Home)',
      },
      {
        data: [
          {
            x: 1677841517844,
            y: 140,
          },
        ],
        label: 'Systolic Blood Pressure (Home)',
      },
      {
        data: [
          {
            x: 1678355029160,
            y: 90,
          },
        ],
        label: 'Diastolic Blood Pressure',
      },
      {
        data: [
          {
            x: 1678355029160,
            y: 120,
          },
        ],
        label: 'Systolic Blood Pressure',
      },
    ];
    const result = pipe.transform(dataset);

    expect(result).toEqual([
      {
        data: [
          {
            x: 1677841517844,
            y: 140,
          },
        ],
        label: 'Systolic Blood Pressure (Home)',
      },
      {
        data: [
          {
            x: 1678355029160,
            y: 120,
          },
        ],
        label: 'Systolic Blood Pressure',
      },
      {
        data: [
          {
            x: 1677841517844,
            y: 110,
          },
        ],
        label: 'Diastolic Blood Pressure (Home)',
      },
      {
        data: [
          {
            x: 1678355029160,
            y: 90,
          },
        ],
        label: 'Diastolic Blood Pressure',
      },
    ]);
  });

  it('should sort the dataset for single legend using Y value', () => {
    const pipe = new SortDatasets();
    const dataset: any = [
      {
        data: [
          {
            x: 1677841517844,
            y: 110,
          },
        ],
        label: 'Diastolic Blood Pressure (Home)',
      },
    ];
    const result = pipe.transform(dataset);

    expect(result).toEqual([
      {
        data: [
          {
            x: 1677841517844,
            y: 110,
          },
        ],
        label: 'Diastolic Blood Pressure (Home)',
      },
    ]);
  });

  it('should sort the empty dataset', () => {
    const pipe = new SortDatasets();
    const dataset: any = [];

    const result = pipe.transform(dataset);

    expect(result).toEqual([]);
  });

  it('should sort the medication dataset for multiple legend', () => {
    const pipe = new SortDatasets();
    const dataset: any = [
      {
        data: [
          {
            x: 1581959027000,
            y: '1 ML heparin sodium, porcine 1000 UNT/ML Injection',
          },
        ],
        label: '1 ML heparin sodium, porcine 1000 UNT/ML Injection *',
      },
      {
        data: [
          {
            x: 1627319027000,
            y: 'insulin human, isophane 70 UNT/ML / Regular Insulin, Human 30 UNT/ML Injectable Suspension [Humulin]',
          },
        ],
        label: 'insulin human, isophane 70 UNT/ML / Regular Insulin, Human 30 UNT/ML Injectable Suspension [Humulin] *',
      },
      {
        data: [
          {
            x: 1627319027000,
            y: '24 HR Metformin hydrochloride 500 MG Extended Release Oral Tablet',
          },
        ],
        label: '24 HR Metformin hydrochloride 500 MG Extended Release Oral Tablet *',
      },
    ];
    const result = pipe.transform(dataset);

    expect(result).toEqual([
      {
        data: [
          {
            x: 1581959027000,
            y: '1 ML heparin sodium, porcine 1000 UNT/ML Injection',
          },
        ],
        label: '1 ML heparin sodium, porcine 1000 UNT/ML Injection *',
      },
      {
        data: [
          {
            x: 1627319027000,
            y: 'insulin human, isophane 70 UNT/ML / Regular Insulin, Human 30 UNT/ML Injectable Suspension [Humulin]',
          },
        ],
        label: 'insulin human, isophane 70 UNT/ML / Regular Insulin, Human 30 UNT/ML Injectable Suspension [Humulin] *',
      },
      {
        data: [
          {
            x: 1627319027000,
            y: '24 HR Metformin hydrochloride 500 MG Extended Release Oral Tablet',
          },
        ],
        label: '24 HR Metformin hydrochloride 500 MG Extended Release Oral Tablet *',
      },
    ]);
  });
});
