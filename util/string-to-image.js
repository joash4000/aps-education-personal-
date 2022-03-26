const fs = require('fs');
module.exports = async(str, url) => {
    return new Promise(function(resolve, reject) {
        fs.writeFile(('./images/' + url), str, 'base64', function(err) {
            if (err) reject(err);
            else resolve(true);
        });
    });
}