#!/usr/local/bin/node

var r    = require("../node_modules/respec/tools/r")
,   fs   = require("fs")
,   pth  = require("path")
,   outPath = pth.join(__dirname, "..")
,   srcPath = pth.join(__dirname, "../src")
;


// build custom Bootstrap
// build Beryl ReSpec
// build page with all configurations
// copy pages in the right templates

var config = {
    baseUrl:    pth.join(__dirname, "../beryl")
// ,   optimize:   "none"
,   paths:  {
        requireLib: "../node_modules/respec/js/require"
    ,   simpleNode: "../node_modules/respec/js/simple-node"
    ,   shortcut:   "../node_modules/respec/js/shortcut"
    ,   domReady:   "../node_modules/respec/js/domReady"
    ,   core:       "../node_modules/respec/js/core/"
    ,   text:       "../node_modules/respec/js/text"
    }
,   name:       "beryl"
,   include:    "requireLib simpleNode shortcut".split(" ")
,   out:        pth.join(__dirname, "../beryl.js")
,   inlineText: true
,   preserveLicenseComments:    false
};
r.optimize(config, function () {
    fs.writeFileSync(config.out,
                    "/* Beryl - Robin Berjon, http://berjon.com/ (@robinberjon) */\n/* See original source for licenses: https://github.com/darobin/respec-docs. */\n" +
                    fs.readFileSync(config.out));
    console.log("OK!");
});
