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
var _inputManager;

function InputManager(element) {
    this.input = element;
}

InputManager.getInstance = function() {
    var element;

    if ( ! _inputManager ) {
        element = document.getElementById('q');
        _inputManager = new InputManager(element);
        _inputManager.init();
    }

    return _inputManager;
};

InputManager.prototype.init = function() {
    this.input.addEventListener('keydown', this.handleKeyDown.bind(this));
    this.input.addEventListener('keyup', this.handleKeyup.bind(this));
};

InputManager.prototype.handleKeyDown = function(evt) {
    if ( evt.keyCode === 9 ) {
        evt.preventDefault();
        SearchManager.getInstance().setSelectIndex(0);
        this.input.blur();
    } else if ( evt.keyCode == 86 && evt.metaKey === true ) {
        this.input.value = app.clipboard.get();
        // todo handle keyup immidiataly
    }
};

InputManager.prototype.handleKeyup = function() {
    var value    = this.input.value,
        search   = SearchManager.getInstance(),
        terminal = TerminalManager.getInstance(),
        win      = WindowManager.getInstance(),
        height;

    if ( value === "" ) {
        search.hide();
        terminal.hide();
        win.resizeMin();
        return;
    }

    if ( value.charAt(0) === ':' ) {
        search.hide();
        terminal.show();
        win.resizeMax();
    } else {
        search.show();
        terminal.hide();
        height = search.exec(value);
        win.resizeTo(height);
    }
};
var _searchManager;

function SearchManager(element) {
    this.element = element;
    this.results = element.querySelectorAll('.list-item');
}

SearchManager.dict     = {};
SearchManager.itemSize = 59;

SearchManager.getInstance = function() {
    var element;

    if ( ! _searchManager ) {
        element = document.querySelector('.launcher-list');
        _searchManager = new SearchManager(element);
    }

    return _searchManager;
};

SearchManager.prototype.setDict = function(dict) {
    SearchManager.dict = dict;
};

SearchManager.prototype.exec = function(name) {
    var dict  = SearchManager.dict,
        regex = new RegExp(name, 'i'),
        files = Object.keys(dict),
        max   = WindowManager.maxHeight,
        size  = SearchManager.itemSize,
        hits  = [],
        i     = -1;

    while ( files[++i] ) {
        if ( regex.test(files[i]) ) {
            hits[hits.length] = dict[files[i]];
        }

        if ( hits.length === 6 ) {
            break;
        }
    }

    for ( i = 0; i < 6; ++i ) {
        if ( ! hits[i] ) {
            break;
        }
        this.results[i].innerHTML = '<strong>' + hits[i].name + '</strong><em>' + hits[i].absPath + '</em>';
        this.results[i].classList.remove('notfound');
    }
    for ( ; i < 6; ++i ) {
        this.results[i].classList.add('notfound');
        max -= size;
    }

    if ( hits.length === 0 ) {
        max = WindowManager.minHeight;
        SearchManager.getInstance().hide();
    }

    return max;
};

SearchManager.prototype.show = function() {
    this.element.classList.add('show');
};

SearchManager.prototype.hide = function() {
    this.element.classList.remove('show');
};
var _terminalManager;

function TerminalManager(element) {
    this.element = element;
    this.pre     = element.querySelector('pre');
}

TerminalManager.getInstance = function() {
    var element;

    if ( ! _terminalManager ) {
        element = document.querySelector('.terminal');
        _terminalManager = new TerminalManager(element);
    }

    return _terminalManager;
};

TerminalManager.prototype.write = function(buffer) {
    this.pre.innerHTML += buffer;
};

TerminalManager.prototype.show = function() {
    this.element.classList.add('show');
};

TerminalManager.prototype.hide = function() {
    this.element.classList.remove('show');
};
var _windowManager;

function WindowManager(win) {
    this.win = win; // gui.Window.get() returnso

    this.hidden  = true;
    this.onFocus = null;
}

WindowManager.width     = 742;
WindowManager.minHeight = 168;
WindowManager.maxHeight = 532;

WindowManager.getInstance = function() {
    if ( ! _windowManager ) {
        _windowManager = new WindowManager(gui.Window.get());
    }

    return _windowManager;
};

WindowManager.prototype.show = function() {
    this.win.show();
    this.win.setPosition('center');
    this.win.focus();
    if ( typeof this.onFocus === 'function' ) {
        this.onFocus();
    }
    this.hidden = false;
};

WindowManager.prototype.hide = function() {
    this.win.hide();
    this.hidden = true;
};

WindowManager.prototype.isHidden = function() {
    return this.hidden;
};

WindowManager.prototype.toggleShow = function() {
    ( this.hidden === true ) ? this.show() : this.hide();
};

WindowManager.prototype.resizeMin = function() {
    this.win.resizeTo(WindowManager.width, WindowManager.minHeight);
};

WindowManager.prototype.resizeMax = function() {
    this.win.resizeTo(WindowManager.width, WindowManager.maxHeight);
};

WindowManager.prototype.resizeTo = function(y) {
    this.win.resizeTo(WindowManager.width, y);
};



var app = new ApplicationManager();

app.run();
