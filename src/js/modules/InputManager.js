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
