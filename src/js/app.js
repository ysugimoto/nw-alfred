//= require_tree modules

var app = new ApplicationManager();

app.run();
/*
            var gui    = require('nw.gui');
            var fs     = require('fs');
            var path   = require('path');
            var clip   = gui.Clipboard.get();
            var win    = gui.Window.get();
            var hidden = true;
            var tray   = new gui.Tray({
                alticon: 'asset/images/alticon.white.png',
                icon:    'asset/images/alticon.png'
            });

            tray.on('click', function() {
                win.setPosition('center');
                win.show();
                win.focus();
                input.focus();
                hidden = false;
            });

            var input    = document.getElementById('q');
            var list     = document.querySelector('.launcher-list');
            var terminal = document.querySelector('.terminal');
            var hitList  = document.querySelectorAll('.list-item');

            input.addEventListener('keydown', function(evt) {
                console.log(evt);
                if ( evt.keyCode === 9 ) {
                    evt.preventDefault();
                    document.querySelector('.list-item:first-child').setAttribute('data-selected', 1);
                    input.blur();
                } else if ( evt.keyCode == 86 && evt.metaKey === true ) {
                    input.value = clip.get();
                    // todo handle keyup immidiataly
                }

            });

            input.addEventListener('keyup', function() {
                if ( input.value === "" ) {
                    list.classList.remove('show');
                    terminal.classList.remove('show');
                    win.resizeTo(742, 168);
                    return;
                }

                if ( input.value.charAt(0) === ':' ) {
                    list.classList.remove('show');
                    terminal.classList.add('show');
                    win.resizeTo(742, 532);
                } else {
                    list.classList.add('show');
                    terminal.classList.remove('show');
                    var hits = [];
                    var regex = new RegExp(input.value, 'i');
                    var max = 532;
                    var files = Object.keys(fileList);
                    var i = -1;

                    while ( files[++i] ) {
                        if ( regex.test(files[i]) ) {
                            hits[hits.length] = fileList[files[i]];
                        }

                        if ( hits.length === 6 ) {
                            break;
                        }
                    }

                    for ( i = 0; i < 6; ++i ) {
                        if ( ! hits[i] ) {
                            break;
                        }
                        hitList[i].innerHTML = '<strong>' + hits[i].name + '</strong><em>' + hits[i].absPath + '</em>';
                        hitList[i].classList.remove('notfound');
                    }
                    for ( ; i < 6; ++i ) {
                        hitList[i].classList.add('notfound');
                        max -= 59;
                    }
                    console.log(hits.length);
                    if ( hits.length === 0 ) {
                        max = 168;
                        list.classList.remove('show');
                    }
                    console.log('resize to ' + max);
                    win.resizeTo(742, max);
                }
            });

            var shortcut = new gui.Shortcut({
                key: "Ctrl+Period"
            });

            gui.App.registerGlobalHotKey(shortcut);
            shortcut.on('active', function() {
                console.log('shortcut activated');
                if ( hidden === true ) {
                    win.show();
                    win.setPosition('center');
                    win.focus();
                    input.focus();
                } else {
                    win.hide();
                }
                hidden = !hidden;
            });

            //win.on('blur', function() {
            //    console.log('blured');
            //    win.hide();
            //    hidden = true;
            //});

            new Notification('Application Launched background');
            win.resizeTo(742, 168);

            document.addEventListener('keydown', function(evt) {
                if ( evt.keyCode === 27 ) {
                    win.hide();
                    hidden = true;
                } else if ( evt.keyCode === 13 ) {
                    console.log('enter');
                }
            });

            var rcFile   = process.env.HOME + '/.alfredrc';
            var settings = ( fs.existsSync(rcFile) ) ? fs.readFileSync(rcFile) : {};

            if ( ! settings.path ) {
                settings.path = [];
            }
            settings.path.unshift('/Applications');
            if ( ! settings.shell ) {
                settings.shell = '/bin/bash';
            }

            localStorage.setItem('setting', JSON.stringify(settings));
            localStorage.setItem('indexes', JSON.stringify(fileList));

            console.log(JSON.stringify(fileList).length);
            console.log(fileList);
*/
