
About
=====

This is the website that powers trees.rit.edu, the community-created tree map.


Usage (Local Development)
=========================

- Install [Meteor].
- Copy `settings.json.sample` to `settings.json` and edit appropriately.
- From the root directory, run `meteor --settings settings.json`.


Dependencies
============

- Download [GraphicsMagick]
- Download [JPEG and PNG delegates] (Preferably jpegsrc.v9a.tar.gz, openjpeg-2.0.0.tar.gz and libpng-1.6.24.tar.gz)
- Install delegates through <code>./configure</code> and <code>sudo make && make install</code>
- Install GraphicsMagick through <code>./configure LDFLAGS=-L/usr/local/lib CPPFLAGS=-I/usr/local/include</code> and <code>sudo make && make install</code>
- Add to Meteor <code>meteor add cfs:graphicsmagick</code>

License
=======

MIT

[Meteor]:https://www.meteor.com/
[GraphicsMagick]:http://www.graphicsmagick.org/download.html
[JPEG and PNG delegates]:http://www.imagemagick.org/download/delegates/
