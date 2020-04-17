"use strict";

const path = require("path");
const assert = require("chai").assert;
const JSZip = require("jszip");
const epubZip = require("../index");

const inputDir = path.join(__dirname , "fixtures");

let testFiles = {
  container: "META-INF/container.xml",
  opf: "item/standard.opf",
  image: "item/image/cover.jpg",
  css: "item/style/book-style.css",
  xhtml: "item/xhtml/p-001.xhtml"
}

if (process.platform === "win32") {
  testFiles = {
    container: "META-INF\\container.xml",
    opf: "item\\standard.opf",
    image: "item\\image\\cover.jpg",
    css: "item\\style\\book-style.css",
    xhtml: "item\\xhtml\\p-001.xhtml"
  }
}

describe("epub-zip", function() {

  describe("normal case", function () {

    const zip = new JSZip();
    const content = epubZip( path.join(inputDir, "pub00") );
    const actual = zip.load(content);

    it ("should have an uncompressed mimetype in the archive.", function (done) {
      assert.propertyVal(actual.files.mimetype, "name", "mimetype");
      assert.equal(actual.files.mimetype._data.compressedSize, actual.files.mimetype._data.uncompressedSize);
      done();
    });

    it ("should have container.xml in the archive.", function (done) {
      assert.propertyVal(actual.files[testFiles.container], "name", testFiles.container);
      done();
    });

    it ("should have an opf file in the archive.", function (done) {
      assert.propertyVal(actual.files[testFiles.opf], "name", testFiles.opf);
      done();
    });

    it ("should have an image file in the archive.", function (done) {
      assert.propertyVal(actual.files[testFiles.image], "name", testFiles.image);
      done();
    });

    it ("should have a css file in the archive.", function (done) {
      assert.propertyVal(actual.files[testFiles.css], "name", testFiles.css);
      done();
    });

    it ("should have an xhtml file in the archive.", function (done) {
      assert.propertyVal(actual.files[testFiles.xhtml], "name", testFiles.xhtml);
      done();
    });

  });

  it ("should throw an error if source directory is missing.", function (done) {
    assert.throws(
      function() {epubZip()}, Error
    );
    done();
  });

  it ("should throw an error if META-INF/container.xml is missing.", function (done) {
    assert.throws(
      function() {epubZip( path.join(inputDir, "pub01") )}, Error
    );
    done();
  });

  it ("should have a mimetype in the archive even if mimetype is missing in the source directory.", function (done) {
    const zip = new JSZip();
    const content = epubZip( path.join(inputDir, "pub02") );
    const actual = zip.load(content);
    assert.propertyVal(actual.files.mimetype, "name", "mimetype");
    done();
  });

  describe("ignore files", function () {
    const zip = new JSZip();
    const content = epubZip( path.join(inputDir, "pub03") );
    const actual = zip.load(content);

    it ("should not have a .DS_Store in the archive.", function (done) {
      assert.notProperty(actual.files, ".DS_Store");
      done();
    });

    it ("should not have a Thumbs.db in the archive.", function (done) {
      assert.notProperty(actual.files, "Thumbs.db");
      done();
    });

    it ("should not have a desktop.ini in the archive.", function (done) {
      assert.notProperty(actual.files, "desktop.ini");
      done();
    });

    it ("should not have a _MACOSX in the archive.", function (done) {
      assert.notProperty(actual.files, "_MACOSX/.gitkeep");
      done();
    });

  });

});
