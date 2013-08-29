
// Module beryl/container
// Wrap the body's content in div.container

define(
    [],
    function () {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "beryl/container");
                $("body > *", doc).wrapAll("<div class='container'></div>");
                msg.pub("end", "beryl/container");
                cb();
            }
        };
    }
);
