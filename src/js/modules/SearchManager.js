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
        element = document.querySelector('launcher-list');
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
