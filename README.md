## skk-keymap
Keymap is a brief and convenient library for handling keyboard shortcut using javascript.  
It supports for keydown, keypress, keyup events on specific keys and keys
combinations.  
## How to use
``` HTML
  <div class="box">
      <input type="text" id="inp">
  </div>
  <script src="keymap.js"></script>
```
``` javascript
  var keymap = new Keymap(document.getElementById('inp'));
  // create two test function
  function test(e) {
      console.log(e.type, e);
  }
  function test1(e) {
      console.log(e.type, e);
  }
  // default bind event is keydown
  keymap.bind('a', test)
  // you can pass a string or array as third argument, specifing response events
  keymap.bind('a', test, ['keydown', 'keyup'])
  // or
  keymap.bind('a', test, 'keyup')
  // you can bind events on keys combinations
  keymap.bind('shift + a', test)
  // a key can bind mutiple response functions
  keymap.bind('a', [test, test1], 'keyup')
  // support chain call
  keymap.bind('a', test).bind('a', test1)

  // if you want to remove all function and events, like the following
  keymap.unbind('a')
  // if you want to remove a specific function
  keymap.unbind('a', test)
  // if you want to remove a specific function on a specific eventType
  keymap.unbind('a', test, ['keyup'])
  // also support chain call
  keymap.unbind('a', test).unbind('a', test1)
```
## Support keys
Usual keys: a,b,c......z  
Combination keys: shift, alt, ctrl  
## Api
bind(keys, fns, events)  
param: keys  required
  need to binded keys, such as 'a', 'b', 'shift + a', 'shift + ctrl + a' or 'shift + ctrl + alt + a'  
param: fns  (function or array) required
  if event is triggered, the fns will be called  
param: events (string or array) default keydown
  binded events in keydown, keyup, keypress  

unbind(keys, fns, events)  
param: keys  required
  need to unbinded keys, such as 'a', 'b', 'shift + a', 'shift + ctrl + a' or 'shift + ctrl + alt + a'  
param: fns  (function or array) required
  if fns is not passed, remove all binded functions  
param: events (string or array) default keydown
  if events is not passed, remove all function on keypress, keydown, keyup
