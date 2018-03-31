"use strict";

const shell = require('shelljs');
const chalk = require('chalk');

const PACKAGE = `ca-users`;
const NPM_DIR = `dist/src/library`;
const ESM2015_DIR = `${NPM_DIR}/esm2015`;
const ESM6_DIR = `${NPM_DIR}/esm6`;
const BUNDLES_DIR = `bundles`;
const OUT_DIR_ESM6 = `${NPM_DIR}/package/esm6`;

shell.echo(`Start building...`);

shell.rm(`-Rf`, `${NPM_DIR}/*`);
shell.mkdir(`-p`, `./${ESM2015_DIR}`);
shell.mkdir(`-p`, `./${ESM6_DIR}`);
shell.mkdir(`-p`, `./${BUNDLES_DIR}`);

/* TSLint with Codelyzer */
// https://github.com/palantir/tslint/blob/master/src/configs/recommended.ts
// https://github.com/mgechev/codelyzer
shell.echo(`Start TSLint`);
shell.exec(`tslint -c tslint.json -t stylish src/**/*.ts`);
shell.echo(chalk.green(`TSLint completed`));

/* AoT compilation */
shell.echo(`Start AoT compilation`);
if (shell.exec(`ngc -p tsconfig.json`).code !== 0) {
  shell.echo(chalk.red(`Error: AoT compilation failed`));
  shell.exit(1);
}
shell.echo(chalk.green(`AoT compilation completed`));

/* BUNDLING PACKAGE */
shell.echo(`Start bundling`);
shell.echo(`Rollup package`);
if (shell.exec(`rollup -c rollup.es.config.js -i ${NPM_DIR}/${PACKAGE}.js -o ${ESM2015_DIR}/${PACKAGE}.js`).code !== 0) {
  shell.echo(chalk.red(`Error: Rollup package failed`));
  shell.exit(1);
}

shell.echo(`Produce ESM6 version`);
shell.exec(`ngc -p tsconfig.json --target es6 -d true --outDir ${OUT_DIR_ESM6} --importHelpers true --sourceMap`);
if (shell.exec(`rollup -c rollup.es.config.js -i ${OUT_DIR_ESM6}/${PACKAGE}.js -o ${ESM6_DIR}/${PACKAGE}.js`).code !== 0) {
  shell.echo(chalk.red(`Error: ESM6 version failed`));
  shell.exit(1);
}

shell.echo(`Run Rollup conversion on package`);
shell.cp('-R', './src/library/**/*.{html,css}', NPM_DIR+'/esm6');
if (shell.exec(`rollup -c rollup.config.js -i ${ESM6_DIR}/${PACKAGE}.js -o ${BUNDLES_DIR}/${PACKAGE}.umd.js`).code !== 0) {
  shell.echo(chalk.red(`Error: Rollup conversion failed`));
  shell.exit(1);
}

shell.echo(`Minifying`);
shell.cd(`${BUNDLES_DIR}`);
shell.exec(`uglifyjs ${PACKAGE}.umd.js -c --comments -o ${PACKAGE}.umd.min.js --source-map "filename='${PACKAGE}.umd.min.js.map', includeSources"`);
shell.cd(`..`);
shell.cd(`..`);

shell.echo(chalk.green(`Bundling completed`));

shell.rm(`-Rf`, `${NPM_DIR}/package`);
shell.rm(`-Rf`, `${NPM_DIR}/node_modules`);
shell.rm(`-Rf`, `${NPM_DIR}/*.js`);
shell.rm(`-Rf`, `${NPM_DIR}/*.js.map`);
shell.rm(`-Rf`, `${NPM_DIR}/src/**/*.js`);
shell.rm(`-Rf`, `${NPM_DIR}/src/**/*.js.map`);

shell.cp(`-Rf`, [`package.json`, `LICENSE`, `README.md`], `${NPM_DIR}`);

shell.echo(chalk.green(`End building`));
