import { parse } from '../utils/catalogue-parser';
import * as yargs from 'yargs';
import { json2csvAsync, csv2jsonAsync } from 'json-2-csv';
const fs = require('fs').promises;

export async function handler() {
  const args = yargs
    .option('inputDir', {
      demand: true,
      description: 'Directory with catalogue, suppliers and barcode CSVs'
    })
    .option('outputDir', {
      demand: true,
      description: 'Directory for generating result_output.csv'
    }).argv;

  const outputFile: string = `${args['outputDir']}/result_output.csv`;

  Promise.all(
    [
      'barcodesA',
      'barcodesB',
      'catalogA',
      'catalogB',
      'suppliersA',
      'suppliersB'
    ].map(filename => loadCsvFile(args['inputDir'], filename))
  )
    .then((csvData: any[]) => {
      const contents: any = {};
      csvData.forEach(item => (contents[item['filename']] = item['content']));
      const results = parse(
        contents['barcodesA'],
        contents['barcodesB'],
        contents['catalogA'],
        contents['catalogB'],
        contents['suppliersA'],
        contents['suppliersB']
      );
      return Promise.resolve(results);
    })
    .then(results => json2csvAsync(results))
    .then(output => {
      console.log(output);
      return fs.writeFile(outputFile, output);
    })
    .catch((err: Error) => {
      console.error(err);
    });
}

const loadCsvFile = (directory: string, filename: string) => {
  const inputFile: string = `${directory}/${filename}.csv`;
  return fs
    .readFile(inputFile, 'utf8')
    .then((data: string) => csv2jsonAsync(data.trim()))
    .then((csvArray: object[]) => {
      return { filename: filename, content: csvArray };
    });
};
