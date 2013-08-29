
// Module beryl/boilerplate
// Header and footers

define(
    ["tmpl!beryl/templates/headers.html"
    ,"tmpl!beryl/templates/footer.html"
    ],
    function (headersTmpl, footerTmpl) {
        return {
            run:    function (conf, doc, cb, msg) {
                msg.pub("start", "beryl/boilerplate");
                conf.title = doc.title || "No Title";
                $("body", doc).prepend(headersTmpl(conf));
                $("body", doc).append(footerTmpl(conf));
                msg.pub("end", "beryl/boilerplate");
                cb();
            }
        };
    }
);
