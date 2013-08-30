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
        ,   tmpl:       "../node_modules/respec/js/tmpl"
        ,   handlebars: "../node_modules/respec/js/handlebars"
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
        console.log("[OK] Bootstrap for Beryl built");
        cb();
    });
}

function mungeHeaders (content) {
    var inject =    "\n    <script src='js/beryl.min.js' async class='remove'></script>\n" +
                    // "\n    <script src='node_modules/respec/js/require.js' data-main='beryl/beryl' async class='remove'></script>\n" +
                    "\n    <link rel='stylesheet' href='css/beryl.css'>\n" +
                    "  </head>";
    return content.replace(/\n {2}<\/head>/g, inject);
}

function buildDocs (cb) {
    var sources = "index guide dev ref".split(" ");
    for (var i = 0, n = sources.length; i < n; i++) {
        var src = sources[i]
        ,   fileName = src + ".html"
        ,   content = fs.readFileSync(pth.join(srcPath, fileName), "utf8")
        ,   out = pth.join(outPath, fileName)
        ;
        content = mungeHeaders(content);
        if (src === "ref") {
            var incs = "conf els attrs classes".split(" ")
            ,   refs = {}
            ;
            for (var j = 0, m = incs.length; j < m; j++) {
                var incDir = incs[j]
                ,   files = fs.readdirSync(pth.join(srcPath, incDir))
                ,   insert = ""
                ;
                for (var k = 0, o = files.length; k < o; k++) {
                    refs[files[k].replace(".html", "")] = true;
                    insert += fs.readFileSync(pth.join(srcPath, incDir, files[k]), "utf8") + "\n";
                }
                content = content.replace("<!-- " + incDir.toUpperCase() + " -->", insert);
            }
            fs.writeFileSync(pth.join(outPath, "js/refs.json"), JSON.stringify(refs), "utf8");
        }
        fs.writeFileSync(out, content, "utf8");
    }
    // copy the JS
    fs.writeFileSync(pth.join(outPath, "js/beryl-config.js")
                ,    fs.readFileSync(pth.join(srcPath, "js/beryl-config.js"), "utf8")
                ,    "utf8");
    console.log("[OK] Docs built");
    cb();
}

async.series([buildDocs, buildBeryl, buildBootstrap], function (err) {
    if (err) return console.log("ERROR:", err);
    console.log("OK!");
});
