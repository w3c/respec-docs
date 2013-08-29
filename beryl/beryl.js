
require.config({
    paths:  {
        domReady:   "../node_modules/respec/js/domReady"
    ,   core:       "../node_modules/respec/js/core/"
    ,   text:       "../node_modules/respec/js/text"
    }
});

define([
            "domReady"
        ,   "core/base-runner"
        ,   "core/override-configuration"
        ,   "core/default-root-attr"
        ,   "core/data-include"
        ,   "core/inlines"
        ,   "core/examples"
        ,   "core/issues-notes"
        ,   "core/highlight"
        ,   "core/fix-headers"
        ,   "core/structure"
        ,   "core/section-refs"
        ,   "core/id-headers"
        ,   "beryl/container"
        ,   "core/remove-respec"
        ,   "core/location-hash"
        ],
        function (domReady, runner) {
            var args = Array.prototype.slice.call(arguments)
            ,   hasRun = false;
            domReady(function () {
                hasRun = true;
                runner.runAll(args);
            });
        }
);
