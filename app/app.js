(function () {
  var KEY = { LEFT: 37, RIGHT: 39, ENTER: 13, BACK: 461 };
  var row = document.getElementById("row");
  var label = document.getElementById("label");
  var tiles = [];
  var index = 0;

  function luna(uri, params, done) {
    if (typeof PalmServiceBridge === "undefined") {
      console.log("luna", uri, params);
      return;
    }
    var bridge = new PalmServiceBridge();
    bridge.onservicecallback = function (msg) {
      if (done) done(JSON.parse(msg));
    };
    bridge.call(uri, JSON.stringify(params));
  }

  function launch(id) {
    luna("luna://com.webos.applicationManager/launch", { id: id });
  }

  function setFocus(next) {
    if (!tiles.length) return;
    index = Math.max(0, Math.min(tiles.length - 1, next));
    tiles.forEach(function (t, i) { t.classList.toggle("focus", i === index); });
    label.textContent = tiles[index].dataset.name;

    var step = 360 + 40;
    var maxShift = Math.max(0, tiles.length * step - 40 - (1920 - 192));
    var shift = Math.min(maxShift, Math.max(0, (index - 2) * step));
    row.style.transform = "translateX(" + -shift + "px)";
  }

  function build(apps) {
    apps.forEach(function (app) {
      var el = document.createElement("div");
      el.className = "tile";
      el.textContent = app.name;
      el.dataset.id = app.id;
      el.dataset.name = app.name;
      el.style.setProperty("--from", app.from);
      el.style.setProperty("--to", app.to);
      el.addEventListener("click", function () { launch(app.id); });
      row.appendChild(el);
      tiles.push(el);
    });
    setFocus(0);
  }

  function tick() {
    var d = new Date();
    var h = d.getHours();
    var m = ("0" + d.getMinutes()).slice(-2);
    document.getElementById("clock").textContent =
      d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }) +
      "   " + (h % 12 || 12) + ":" + m + " " + (h < 12 ? "AM" : "PM");
    var greet = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
    document.getElementById("greeting").textContent = greet;
  }

  document.addEventListener("keydown", function (e) {
    if (e.keyCode === KEY.LEFT) setFocus(index - 1);
    else if (e.keyCode === KEY.RIGHT) setFocus(index + 1);
    else if (e.keyCode === KEY.ENTER && tiles[index]) launch(tiles[index].dataset.id);
  });

  tick();
  setInterval(tick, 30000);

  var xhr = new XMLHttpRequest();
  xhr.open("GET", "apps.json");
  xhr.onload = function () { build(JSON.parse(xhr.responseText)); };
  xhr.send();
})();
