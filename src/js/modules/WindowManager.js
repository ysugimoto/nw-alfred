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

