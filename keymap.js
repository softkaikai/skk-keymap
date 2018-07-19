(function() {
    var MAP = {
        48: '0',
        49: '1',
        50: '2',
        51: '3',
        52: '4',
        53: '5',
        54: '6',
        55: '7',
        56: '8',
        57: '9',
    };

    // map keycode from a to z
    for (var i = 97; i < 123; i++) {
        MAP[i] = String.fromCharCode(i);
    }
    for (var i = 65; i < 90; i++) {
        MAP[i] = String.fromCharCode(i);
    }

    function getKey(e) {
        var keyArr = [];
        var keyCode = e.which || e.keyCode;
        if (e.shiftKey) {
            keyArr.push('shift');
        }
        if (e.altKey) {
            keyArr.push('alt');
        }
        if (e.ctrlKey) {
            keyArr.push('ctrl');
        }
        if (MAP[keyCode]) {
            keyArr.push(MAP[keyCode].toLowerCase());
        }
        keyArr.sort();

        return keyArr.join('+')
    }

    function formatKeys(key) {
        var keyArr = key.split('+');
        keyArr.sort();
        return keyArr.join('+');
    }

    function forEach(arr, fn) {
        if (!Array.isArray(arr)) {
            throw new Error('The first argument is expected a array in forEach');
        }
        for (var i = 0; i < arr.length; i++) {
            var result = fn(arr[i], i, arr);
            if (result === 'break') {
                break;
            } else if (result === 'continue') {
                continue;
            }
        }
    }

    var Keymap = function(el) {
        var that = this;
        this.el = el || document;

        // if Keymap is not called as a constructor function
        // return a instance of Keymap
        if (!(this instanceof Keymap)) {
            return new Keymap();
        }

        this.events = ['keypress', 'keydown', 'keyup'];
        for (var i = 0; i < this.events.length; i++) {
            this['_callBacks' + this.events[i]] = {};
        }

        this._initEvent();
    };

    Keymap.prototype._initEvent = function() {
        var that = this;
        if (this.el.addEventListener) {
            forEach(this.events, function(eventType) {
                that.el.addEventListener(eventType, function(e) {
                    var eventCallBacks = that['_callBacks' + eventType];
                    var keyStr = getKey(e);
                    if (!keyStr) {
                        return;
                    }
                    keyCallBacks = eventCallBacks[keyStr] || [];
                    forEach(keyCallBacks, function(callBack) {
                        if (typeof callBack === 'function') {
                            callBack(e);
                        }
                    })
                }, false);
            })
        } else {
            throw new Error(this.el + ' do not have function addEventListener');
        }
    };

    Keymap.prototype.init = function() {

    };

    Keymap.prototype.bind = function(key, fn, eventType) {
        var that = this;
        if (!key) {
            throw new Error('The first argument must be pass in bind');
        }
        fn = fn || function() {};
        eventType = eventType || ['keydown'];
        if (typeof eventType === 'string') {
            eventType = [eventType];
        }
        var keys = Array.isArray(key) ? key: [key];
        forEach(keys, function(key) {
            var keyStr = formatKeys(key);
            if (!keyStr) {
                return;
            }
            forEach(eventType, function(type) {
                if (that.events.indexOf(type) === -1) {
                    return false;
                }
                that['_callBacks' + type][keyStr] = that['_callBacks' + type][keyStr] || [];
                var hasSameFn = false;
                forEach(that['_callBacks' + type][keyStr], function(callBack) {
                    if (callBack === fn) {
                        hasSameFn = true;
                        return 'break';
                    }
                });
                if (!hasSameFn) {
                    that['_callBacks' + type][keyStr].push(fn);
                }
            })
        });

        return this;
    };

    Keymap.prototype.unbind = function(key, fn, eventType) {
        var that = this;
        if (!key) {
            return;
        }
        eventType = eventType || this.events;
        if (typeof eventType === 'string') {
            eventType = [eventType];
        }
        var keys = Array.isArray(key) ? key: [key];
        forEach(keys, function(key) {
            var keyStr = formatKeys(key);
            if (!keyStr) {
                return;
            }
            forEach(eventType, function(type) {
                if (that.events.indexOf(type) === -1) {
                    return false;
                }
                // if fn is not passed, clear all related callbacks
                if (!fn) {
                    delete that['_callBacks' + type][keyStr];
                } else {
                    var callBacks = that['_callBacks' + type][keyStr];
                    if (!callBacks || callBacks.length === 0) {
                        return;
                    }
                    forEach(callBacks, function(callBack, index) {
                        if (fn === callBack) {
                            that['_callBacks' + type][keyStr].splice(index, 1);
                            return 'break';
                        }
                    })
                }
            })
        });

        return this;
    };

    window.Keymap = Keymap;
})();