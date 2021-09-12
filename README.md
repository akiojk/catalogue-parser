# catalogue-parser
A typescript solution for [this](https://github.com/tosumitagrawal/codingskills) that runs as a CLI with node.

## Installation
```bash
yarn install
```

## Run
```bash
yarn build && yarn start catalogue --inputDir input --outputDir output
```
 
## Thoughts
Suppliers data for this particular task does not seem to matter. It can be left empty and still yield correct results.
Barcodes are the primary keys for identifying unique products, which are further filtered down by SKUs/Source to form consolidated catalogue items.