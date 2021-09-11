export function parse(barcodesA: any[], barcodesB: any[], catalogA: any[], catalogB: any[],
    suppliersA: any[], suppliersB: any[]): any[] {

    const catalogASet = keyValue(catalogA, 'SKU', 'Description');
    const catalogBSet = keyValue(catalogB, 'SKU', 'Description');
    const suppliersASet = keyValue(suppliersA, 'ID', 'Name');
    const suppliersBSet = keyValue(suppliersB, 'ID', 'Name');

    const recordsA = barcodesA.map(item => ({
        ...item,
        'Supplier': suppliersASet[item['ID']],
        'Description': catalogASet[item['SKU']],
        'Source': 'A'
    }));

    const recordsB = barcodesB.map(item => ({
        ...item,
        'Supplier': suppliersBSet[item['ID']],
        'Description': catalogBSet[item['SKU']],
        'Source': 'B'
    }));

    const records = recordsA.concat(
        recordsB.filter(
            b => barcodesA.map(a => a['Barcode']).indexOf(b['Barcode']) < 0))

    return records.reduce((catalogItems: any[], record) => {
        if (!catalogItems.some(item => item['SKU'] == record['SKU']
            && item['Source'] == record['Source'])) {
            catalogItems.push({
                'SKU': record['SKU'],
                'Description': record['Description'],
                'Source': record['Source']
            });
        }
        return catalogItems;
    }, []);
}

function keyValue(arr: any[], keyProp: string, valueProp: string): any {
    return arr.reduce((pairs, item) => {
        pairs[item[keyProp]] = item[valueProp];
        return pairs;
    }, {});
}