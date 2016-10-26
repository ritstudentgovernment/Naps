
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

1. Download [GraphicsMagick]
2. Download [JPEG and PNG delegates]
  - (JPEG) jpegsrc.v9a.tar.gz
  - (JPEG-2000) openjpeg-2.0.0.tar.gz
  - (PNG) libpng-1.6.24.tar.gz
3. Install delegates through <code>./configure</code> and <code>sudo make && make install</code>
4. Install GraphicsMagick through <code>./configure LDFLAGS=-L/usr/local/lib CPPFLAGS=-I/usr/local/include</code> and <code>sudo make && make install</code>
5. Add to Meteor <code>meteor add cfs:graphicsmagick</code>

(Repeat 3 and for any new delegate included.)

License
=======

MIT

[Meteor]:https://www.meteor.com/
[GraphicsMagick]:http://www.graphicsmagick.org/download.html
[JPEG and PNG delegates]:http://www.imagemagick.org/download/delegates/
