
# ReSpec Documentation

This repository holds the documentation for ReSpec, which is
[published on its own web site](http://w3.org/respec/).

## Contributing

If you wish to contribute to these documents, you may simply clone this repository, make edits,
and file some pull requests. That's all that's really needed.

If your contributions include changes to the look and feel, behaviour, build system, etc. then you
will need a little bit more. First, get the dependencies:

    npm install -d

Building the documentation is simple:

    node tools/build.js

If you are making incremental changes and are getting tired of having to run the build script
every time to see if the result matches your expectations, you can use ```nodemon```. Install it
thusly:

    npm install -g nodemon

And run it with:

    nodemon -w beryl -w src -w tools -e js,css,html,less tools/build.js 

Note that even with ```nodemon``` running, generating the whole build may still take a few seconds
and so if you edit and reload too fast you might not see the changes. Just chill and reload again.
