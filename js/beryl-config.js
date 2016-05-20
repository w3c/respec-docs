var respecConfig = {
  nav: [
    { url: "index.html", label: "Home", },
    { url: "guide.html", label: "User's Guide", },
    { url: "dev.html", label: "Developers", },
  ],
  afterEnd: function() {
    $.getJSON("js/refs.json", function(data) {
      $("a:not([href])").each(function() {
        var $a = $(this),
          opt = $a.text();
        if (data[opt]) $a.attr("href", "ref.html#" + opt.toLowerCase());
        else console.log("Reference to unknown configuration option: " + opt);
      });
    });
  }
};
window.mungeConf = function(utils, source) {
  return source.replace("<section>", "<section class='well conf'>");
};
