'use strict';
const fs = require('fs');
const upath = require('upath');
const pug = require('pug');
const sh = require('shelljs');
const prettier = require('prettier');

let renderData = {};

module.exports = function renderPug(filePath, data) {
    const destPath = filePath.replace(/src\/pug\//, 'dist/').replace(/\.pug$/, '.html');
    const srcPath = upath.resolve(upath.dirname(__filename), '../src');
    if (data) {
        console.log("### INFO: Updated data in memory");
        renderData = data;
    }

    console.log(`### INFO: Rendering ${filePath} to ${destPath}`);
    const options = {
        doctype: 'html',
        filename: filePath,
        basedir: srcPath,
        data: renderData
    }
    const html = pug.renderFile(filePath, options);

    const destPathDirname = upath.dirname(destPath);
    if (!sh.test('-e', destPathDirname)) {
        sh.mkdir('-p', destPathDirname);
    }

    const prettified = prettier.format(html, {
        printWidth: 1000,
        tabWidth: 4,
        singleQuote: true,
        proseWrap: 'preserve',
        endOfLine: 'lf',
        parser: 'html',
        htmlWhitespaceSensitivity: 'ignore'
    });

    fs.writeFileSync(destPath, prettified);
};
