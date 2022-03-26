const fs = require('fs');

const deleteFile = async(filePath) => {
    return new Promise(function(resolve, reject) {
        fs.unlink('./' + filePath, (err) => {
            if (err) resolve(true);
            else resolve(true);
        });
    });
}

module.exports = { deleteFile };