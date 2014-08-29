var fs       = require('fs');
var path     = require('path');
var fileList = {};
var settings = JSON.parse(fs.readFileSync('./data/setting.json', {encoding: 'utf8'}));

settings.path.forEach(function(p) {
    find(p, true);
});

fs.writeFileSync('./data/indexes.json', JSON.stringify(fileList), {encoding: 'utf8'});
process.exit(0);

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
