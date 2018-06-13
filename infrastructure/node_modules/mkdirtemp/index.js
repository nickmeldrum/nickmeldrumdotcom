'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');

const mkdirtemp = (cwd) => {
    const prefix = path.join(cwd || os.tmpdir(), path.sep);
    return new Promise((resolve, reject) => {
        fs.mkdtemp(prefix, (err, dirPath) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(dirPath);
        });
    });
};

module.exports = mkdirtemp;
