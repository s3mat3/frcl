# FRCL

FRCL is Fake Reactivity Component oriented Libray (! FRancium ChLoride && ! Frequent Replacement Contact Lens)

## build and run

In some directory

```shell-session
$ clone https://github.com/s3mat3/frcl.git
$ cd frcl
$ mkdir build
$ cd build
$ cmake -DCMAKE_BUILD_TYPE=Release ..
$ make install-dep
$ make run
```

* "make install-dep" is install js dependencies
* "make run" is run develop server. How to view in browser, http://localhost:5174/examples/small1 | small2 | showcase/index.html
* "make build" build release mode library in ../dist/frcl.em.js | frcl.umd.js
* "make develop" build debug mode library
* "make unit" run test

> [!NOTE]
> When testing reactive.test.js, change the _invoke_reactions in ./core/reactive.js as follows. Because I don't know how to delay the execution of vitest...

`with test`
```diff
function _invoke_reactions(t, k, d = {}) {
    const reactionsList = _reactions_list_map.get(t);
    // console.log(reactionsList, t);
    if (reactionsList) {
        const reactions = reactionsList.get(k);
        reactions?.forEach((reaction) => {
+            reaction(d); // when reactive.test.js I don't know how to deleay on vitetest
-            if (! _is_pending) { // when release
-                 _is_pending = true;
-                 queueMicrotask(() => { // sched in before nextTick
-                     _is_pending = false;
-                     reaction(d);
-                 });
-             }
         });
    }
}
```

`without test`
```diff
function _invoke_reactions(t, k, d = {}) {
    const reactionsList = _reactions_list_map.get(t);
    // console.log(reactionsList, t);
    if (reactionsList) {
        const reactions = reactionsList.get(k);
        reactions?.forEach((reaction) => {
-            reaction(d); // when reactive.test.js I don't know how to deleay on vitetest
+            if (! _is_pending) { // when release
+                 _is_pending = true;
+                 queueMicrotask(() => { // sched in before nextTick
+                     _is_pending = false;
+                     reaction(d);
+                 });
+             }
         });
    }
}
```
