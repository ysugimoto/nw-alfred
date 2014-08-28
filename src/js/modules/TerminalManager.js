var _terminalManager;

function TerminalManager(element) {
    this.element = element;
    this.pre     = element.querySelector('pre');
}

TerminalManager.getInstance = function() {
    var element;

    if ( ! _terminalManager ) {
        element = document.querySelector('launcher-list');
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
