export const parse = (
  barcodesA: any[],
  barcodesB: any[],
  catalogA: any[],
  catalogB: any[],
  suppliersA: any[],
  suppliersB: any[]
): any[] => {
  const catalogASet = keyValue(catalogA, 'SKU', 'Description');
  const catalogBSet = keyValue(catalogB, 'SKU', 'Description');
  const suppliersASet = keyValue(suppliersA, 'ID', 'Name');
  const suppliersBSet = keyValue(suppliersB, 'ID', 'Name');

  const recordsA = parseRecords(barcodesA, suppliersASet, catalogASet, 'A');
  const recordsB = parseRecords(barcodesB, suppliersBSet, catalogBSet, 'B');

  const barcodesOfA = barcodesA.map(a => a['Barcode']);
  const records = recordsA.concat(
    recordsB.filter(b => barcodesOfA.indexOf(b['Barcode']) < 0)
  );

  return records.reduce((catalogItems: any[], record) => {
    if (
      !catalogItems.some(
        item =>
          item['SKU'] == record['SKU'] && item['Source'] == record['Source']
      )
    ) {
      catalogItems.push({
        SKU: record['SKU'],
        Description: record['Description'],
        Source: record['Source']
      });
    }
    return catalogItems;
  }, []);
};

const keyValue = (arr: any[], keyProp: string, valueProp: string): any => {
  return arr.reduce((pairs, item) => {
    pairs[item[keyProp]] = item[valueProp];
    return pairs;
  }, {});
};

const parseRecords = (
  barcodes: any[],
  suppliers: any[],
  catalog: any[],
  source: string
) => {
  return barcodes.map(item => ({
    ...item,
    Supplier: suppliers[item['ID']],
    Description: catalog[item['SKU']],
    Source: source
  }));
};
