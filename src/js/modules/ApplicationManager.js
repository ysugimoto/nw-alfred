var gui  = require('nw.gui');
var fs   = require('fs');
var child = require('child_process');
var _instance;

function ApplicationManager() {
    if ( _instance ) {
        return _instance;
    }

    this.clipboard = gui.Clipboard.get();
    this.tray      = null;
    this.win       = null;
    this.shortcut  = null;
    this.settings  = {};
    this.search    = null;

    _instance = this;
}

ApplicationManager.prototype.run = function() {
    console.log('Application init');
    this.win = WindowManager.getInstance();
    this.initSettings();
    this.initTray();
    this.initShortcut();
    this.findIndex();

    this.search = InputManager.getInstance();

};

ApplicationManager.prototype.initTray = function() {
    this.tray = new gui.Tray({
        alticon: 'asset/images/alticon.white.png',
        icon:    'asset/images/alticon.png'
    });

    this.tray.on('click', function() {
        this.win.show();
    }.bind(this));
};

ApplicationManager.prototype.initShortcut = function() {
    this.shortcut = new gui.Shortcut({
        key: 'Ctrl+Period'
    });

    gui.App.registerGlobalHotKey(this.shortcut);
    this.shortcut.on('active', function() {
        this.win.toggleShow();
    }.bind(this));
};

ApplicationManager.prototype.initSettings = function() {
    // Do you have .alfredrc?
    var rcFile   = process.env.HOME + '/.alfredrc';
    var settings = ( fs.existsSync(rcFile) ) ? fs.readFileSync(rcFile) : {};

    if ( ! settings.path ) {
        settings.path = [];
    }
    settings.path.unshift('/Applications');
    if ( ! settings.shell ) {
        settings.shell = '/bin/bash';
    }

    this.settings = settings;
    fs.writeFileSync('./data/setting.json', JSON.stringify(settings), {encoding: 'utf8'});
};
ApplicationManager.prototype.findIndex = function() {
    var proc = child.spawn('node', ['./asset/js/proc.js'], {cwd: process.cwd()});

    proc.on('exit', function(code) {
        if ( code === 0 ) {
            var indexes = fs.readFileSync('./data/indexes.json', {encoding: 'utf8'});

            SearchManager.getInstance().setDict(JSON.stringify(indexes));
            new Notification('Index finished');
        }
    });
};
