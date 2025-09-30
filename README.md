# FRCL

FRCL is Fake Reactivity Component oriented Libray (! FRancium ChLoride && ! Frequent Replacement Contact Lens)

## Examples build and run

In some directory

```shell-session
$ clone https://github.com/s3mat3/frcl.git
$ cd frcl
$ cmake -DCMAKE_BUILD_TYPE=Release -S . -B build
$ cmake --build build -- install-dep
$ cmake --build build -- run
```

* make taget "install-dep" is install js dependencies
* make target "run" is run develop server. How to view in browser, http://localhost:5174/examples/\*\*\*
  * examples/small1 => incremental/decremental button
  * examples/small2 => timer
  * examples/sc0 => message dialogs
  * examples/sc1 => editable dialog
  * examples/sc2 => simple table
  * examples/sc3 => editable CRUD table planning imagee
* make target "build" build release mode library in "dist" directory
* make target "develop" build debug mode library in "dist" directory
* make target "unit" run test

## Document build

In some directory

```shell-session
$ clone https://github.com/s3mat3/frcl.git
$ cd frcl
$ cmake -DCMAKE_BUILD_TYPE=Release -S . -B build
$ cmake --build build -- install-dep
$ cmake --build build -- core_doc
```

There will be a lot of errors!



## Global functions and variable

* functions
  * $$(s) Shorthand of document.querySelector
  * $a(s) Shorthand of document.querySelectorAll(s)
  * $nop() mean NO operation () => {}
  * $toast(m, c, t) effect show toast notification (popup window) on browser
	* m: String Message displayed on the tost.
	* c: Class selector name that determines the background color.
	* t: Display time (in second).
* variable
  * $d Shorthand of window.document

