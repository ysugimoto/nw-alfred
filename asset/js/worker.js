var fs       = require('fs');
var path     = require('path');
var fileList = {};

onmessage = function(message) {
    var json = JSON.parse(message);

    switch ( json.operation ) {
        case 'index':
            fileList = {};
            json.paths.forEach(function(p) {
                find(p, true);
            });
            localStorage.setItem('indexes', JSON.stringify(fileList));
            postMessage('done.index');
            break;
    }
};

function find(detectPath, isApp) {
    if ( ! fs.existsSync(detectPath) ) {
        return;
    }
    var stat = fs.statSync(detectPath);
    var base = path.basename(detectPath);

    if ( stat.isFile() && ! isApp && !(base in fileList) ) {
        fileList[base] = {
            name: base,
            absPath: detectPath,
            type: 'file'
        };
    } else if ( stat.isDirectory() ) {
        if ( /\.app$/.test(detectPath) && !(detectPath in fileList) ) {
            var reg = /\.icns$/;
            var icns = fs.readdirSync(detectPath).filter(function(file) {
                return reg.test(file);
            });
            if ( icns.length > 0 ) {
                icns = icns[0];
            }
            base = path.basename(detectPath);
            fileList[base] = {
                name: base,
                absPath: detectPath,
                type: 'app',
                icon: icns
            };
        } else {
            fs.readdirSync(detectPath).forEach(function(subPath) {
                find(detectPath + '/' + subPath, isApp);
            });
        }
    }
}
