"use strict";

const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const JSZip = require("jszip");

const PLUGIN_NAME = "epub-zip";
const ignoreFiles = /^(\.DS_Store|Thumbs\.db|desktop\.ini|_MACOSX)$/;


function readDirResursive(root, files, base) {
  base  = base  || "";
  files = files || [];

  const dir = path.join(root, base);

  if (fs.lstatSync(dir).isDirectory()) {
  	fs.readdirSync(dir)
    .forEach(function (file) {
      if(!file.match(ignoreFiles)) {
        readDirResursive(root, files, path.join(base, file));
      }
    })
  } else {
  	files.push(base);
  }

  return files;
}

function validateContainer(files) {
  
  if(!_.includes(files, "mimetype")) {
    console.warn(PLUGIN_NAME + ": mimetype file is missing in root directory");
  } else {
  	// omit mimetype
  	files = _.without(files, "mimetype");
  }

  let container = "META-INF/container.xml";
  if (process.platform === "win32") {
    container = "META-INF\\container.xml";
  }

  if(!_.includes(files, container)) {
    throw new Error(PLUGIN_NAME + ": META-INF/container.xml is missing");
  }

  return files;
}

function epubZip(dir) {

  if(!dir) {
    //throw new Error(PLUGIN_NAME + ": source directory must be specified");
    throw new Error("Wrong value");
  }
  
  let files = readDirResursive(dir);
  files = validateContainer(files);

  const zip = new JSZip();

  // add mimetype first 
  zip.file("mimetype", "application/epub+zip", {compression: "STORE"});

  files.forEach(function(file) {
  	zip.file(file, fs.readFileSync(path.join(dir, file)), {compression: "DEFLATE"});
  });

  const content = zip.generate({type:"nodebuffer"});
  
  // return Bufffer
  return content;
  cb();
}

module.exports = epubZip;