#!/usr/local/bin/node

var r    = require("../node_modules/respec/tools/r")
,   fs   = require("fs")
,   pth  = require("path")
,   async = require("async")
,   less = require("less")
,   wrench = require("wrench")
,   outPath = pth.join(__dirname, "..")
,   srcPath = pth.join(__dirname, "../src")
;


// build custom Bootstrap
// build page with all configurations
// copy pages in the right templates


function buildBeryl (cb) {
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
    ,   out:        pth.join(outPath, "js/beryl.min.js")
    ,   inlineText: true
    ,   preserveLicenseComments:    false
    };
    r.optimize(config, function () {
        fs.writeFileSync(config.out,
                        "/* Beryl - Robin Berjon, http://berjon.com/ (@robinberjon) */\n/* See original source for licenses: https://github.com/darobin/respec-docs. */\n" +
                        fs.readFileSync(config.out, "utf8"), "utf8");
        console.log("[OK] Beryl built");
        cb();
    });
}

function buildBootstrap (cb) {
    var bsPath = pth.join(__dirname, "../node_modules/bootstrap/less/")
    ,   input = pth.join(__dirname, "../beryl/beryl.less")
    ,   parser = new less.Parser({
            paths:      [bsPath]
        ,   filename:   input
        })
    ;
    parser.parse(fs.readFileSync(input, "utf8"), function (err, tree) {
        fs.writeFileSync(pth.join(outPath, "css/beryl.css"), tree.toCSS({ compress: true }), "utf8");
        wrench.copyDirSyncRecursive(pth.join(__dirname, "../beryl/fonts"), pth.join(outPath, "css/fonts"), { forceDelete: true });
        wrench.copyDirSyncRecursive(pth.join(__dirname, "../beryl/img"), pth.join(outPath, "css/img"), { forceDelete: true });
        cb();
    });
}

function mungeHeaders (content) {
    var inject =    "\n    <script>var respecConfig = {};</script>\n" +
                    "\n    <script src='js/beryl.min.js' async></script>\n" +
                    "\n    <link rel='stylesheet' href='css/beryl.css'>\n" +
                    "  </head>";
    return content.replace(/\n {2}<\/head>/g, inject);
}

function buildDocs (cb) {
    var sources = "index".split(" ");
    for (var i = 0, n = sources.length; i < n; i++) {
        var src = sources[i]
        ,   fileName = src + ".html"
        ,   content = fs.readFileSync(pth.join(srcPath, fileName), "utf8")
        ,   out = pth.join(outPath, fileName)
        ;
        content = mungeHeaders(content);
        fs.writeFileSync(out, content, "utf8");
    }
    cb();
}

async.series([buildBeryl, buildBootstrap, buildDocs], function (err) {
    if (err) return console.log("ERROR:", err);
    console.log("OK!");
});
