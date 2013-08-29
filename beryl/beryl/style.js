
// Module beryl/style
// Add the stylesheet

define(
    ["core/utils"],
    function (utils) {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "beryl/style");
                console.log("hi");
                utils.linkCSS(doc, "css/beryl.css");
                msg.pub("end", "beryl/style");
                cb();
            }
        };
    }
);
