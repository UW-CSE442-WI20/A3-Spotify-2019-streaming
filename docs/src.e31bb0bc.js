// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"index.js":[function(require,module,exports) {
// globals
var countriesList = ["ca", "dk", "gr", "is", "mx", "ph", "sv", "ar", "ch", "do", "gt", "it", "my", "pl", "th", "at", "cl", "ec", "hk", "jp", "pt", "tr", "au", "co", "hn", "nl", "py", "tw", "be", "cr", "es", "hu", "no", "ro", "us", "fi", "id", "nz", "se", "uy", "bo", "cz", "fr", "ie", "pa", "sg", "vn", "br", "de", "gb", "il", "pe", "sk", "global"];
var countriesName = ["Canada", "Denmark", "Greece", "Iceland", "Mexico", "Philippines", "El Salvador", "Argentina", "Switzerland", "Dominican Republic", "Guatemala", "Italy", "Malaysia", "Poland", "Thailand", "Austria", "Chile", "Ecuador", "Hong Kong", "Japan", "Portugal", "Turkey", "Australia", "Columbia", "Honduras", "Netherlands", "Paraguay", "Taiwan", "Belgium", "Costa Rica", "Spain", "Hungary", "Norway", "Romania", "United States", "Finland", "Indonesia", "New Zealand", "Sweden", "Uruguay", "Bolivia", "Czech Republic", "France", "Ireland", "Panama", "Singapore", "Vietnam", "Brazil", "Germany", "United Kingdom", "Israel", "Peru", "Slovakia", "global"];
var Countries = countriesName.slice(0).sort();
var barPadding = 1;
var margin = {
  top: 15,
  right: 25,
  bottom: 30,
  left: 10
};
var w = 800 - margin.left - margin.right;
var h = 460 - margin.top - margin.bottom; //set x and y ranges

var y = d3.scaleBand().range([h - 10, 0]).padding(0.1);
var x = d3.scaleLinear().range([0, w]);
var dataset = [];
var barDataset;
var songNames; //--------------------------------// end globals

function init() {
  // load global data
  console.log("init begin");
  d3.csv("streamsglobal10.csv").then(function (data) {
    console.log("load global data begin");
    slider.initSlider();
    dataset = data;
    var filtered = data.filter(function (d) {
      return d["date"] === slider.getDate();
    });
    initGraph();
    updateGraph(filtered); // update graph based on country dropdown

    var countryDropdown = d3.select("#vis-container-country").insert("select", "svg").on("change", function () {
      var country = d3.select(this).property("value");
      var index = countriesName.indexOf(country);
      var fileName = "streams" + countriesList[index] + "10.csv";

      if (countriesList[index] == "global") {
        document.getElementById("flag").style.visibility = "hidden";
      } else {
        document.getElementById("flag").src = "https://cdn.ip2location.com/assets/img/flags/" + countriesList[index] + ".png";
        document.getElementById("flag").style.visibility = "visible";
      } // load new csv, and update graph


      d3.csv(fileName).then(function (data) {
        dataset = data;
        var filtered = data.filter(function (d) {
          return d["date"] === slider.getDate();
        });
        updateGraph(filtered);
      });
    }); // populate the country dropdown

    countryDropdown.selectAll("option").data(Countries).enter().append("option").attr("value", function (d) {
      return d;
    }).attr("selected", function (d) {
      return d === "Global";
    }).text(function (d) {
      return d[0].toUpperCase() + d.slice(1, d.length); // capitalize 1st letter
    });
    console.log("load global data end");
  });
  console.log("init end");
}

function initGraph() {
  svg = d3.select("div#graph").append("svg").attr("width", w + margin.left + margin.right).attr("height", h + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
}

function updateSVG(fullSongNames, barDataset, artistNames, songNames) {
  svg.selectAll("text").remove(); // update and add the x Axis

  svg.selectAll("g").remove();
  svg.append("g").attr("transform", "translate(0," + (h - 10) + ")").attr("color", "white").call(d3.axisBottom(x)); // add axis label

  svg.append("text").attr("transform", "translate(" + w / 2 + " ," + (h + margin.top + 10) + ")").attr("fill", "white").attr("font-family", "sans-serif").attr("font-size", "12px").style("text-anchor", "middle").text("Streams"); // add the y Axis

  svg.append("g").call(d3.axisLeft(y).tickSize(0).tickFormat(""));
  svg.selectAll("title").remove();
  svg.selectAll("rect").append("title").text(function (d) {
    var i = 10 - parseInt(d[1]);
    return "\"" + fullSongNames[i] + "\" by " + artistNames[i] + ": " + d[0] + " streams on " + slider.getDate();
  });
  svg.selectAll("text.value").data(barDataset).enter().append("text").text(function (d) {
    return songNames[parseInt(d[1]) - 1];
  }).attr("text-anchor", "end").attr("y", function (d, i) {
    return (9 - i) * ((h - 14) / barDataset.length) + 26;
  }).attr("x", function (d) {
    var index = d[1];
    var streams = barDataset[index - 1][0];
    return x(streams) - 8;
  }).attr("font-family", "sans-serif").attr("font-size", "12px").attr("font-weight", 550).attr("fill", "black");
}

function updateBars(barDataset) {
  var bars = svg.selectAll("rect").data(barDataset);
  bars.enter().append("rect").attr("class", "bar").attr("fill", function () {
    return "rgb(30, 215, 96)";
  }).merge(bars).attr("x", function (d) {
    return x(d[1]);
  }).attr("y", function (d) {
    console.log(y);
    console.log(d);
    return y(d[1]);
  }).attr("width", function (d) {
    return x(d[0]);
  }).attr("height", y.bandwidth());
}

function updateGraph(filtered) {
  barDataset = [[]];
  songNames = [""];
  var fullSongNames = [""];
  artistNames = [""];

  for (var i = 0; i < filtered.length; i++) {
    var arrayObj = [parseInt(filtered[i].Streams), 10 - i + ""];
    var name = filtered[i]["Track Name"];
    fullSongNames[i] = name;

    if (filtered[i]["Track Name"].length > 30) {
      name = name.substring(0, 31) + "...";
    }

    songNames[i] = name;
    artistNames[i] = filtered[i]["Artist"];
    barDataset[i] = arrayObj;
  } // Scale the range of the data in the domains


  x.domain([0, d3.max(barDataset, function (d) {
    return d[0];
  })]);
  y.domain(d3.range(1, barDataset.length + 1));
  updateBars(barDataset);
  updateSVG(fullSongNames, barDataset, artistNames, songNames);
}

slider = function () {
  var sliderTime;
  var date;

  function playSlider() {}

  function getDate() {
    return d3.timeFormat("%Y-%m-%d")(sliderTime.value());
  } // Code inspired/provided by https://github.com/johnwalley/d3-simple-slider v1.5.4 Copyright 2019 John Walley


  function initSlider() {
    var weeks2019 = d3.range(0, 53).map(function (d) {
      return new Date(2019, 0, 1 + 7 * d);
    });
    var months = d3.range(0, 12).map(function (d) {
      return new Date(2019, d, 1);
    });
    sliderTime = d3.sliderBottom().min(d3.min(weeks2019)).max(d3.max(weeks2019)).step(12).width(770 - margin.left - margin.right).tickValues(months).tickFormat(d3.timeFormat("%b")).displayValue(false).on("onchange", function (val) {
      d3.select("div#date-display").text(d3.timeFormat("%Y-%m-%d")(val));
      date = d3.timeFormat("%Y-%m-%d")(val);
      var filtered = dataset.filter(function (d) {
        for (var i = 0; i < dataset.length; i++) {
          return d["date"] === date;
        }
      });
      updateGraph(filtered);
    });
    var gTime = d3.select("div#slider").append("svg").attr("width", 900 - margin.left - margin.right).attr("height", 100 - margin.top - margin.bottom).append("g").attr("transform", "translate(30,10)");
    gTime.call(sliderTime);
    gTime.selectAll("text").attr("dx", "-10px").attr("dy", "-16px"); // show date at very beginning

    d3.select("div#date-display").text(d3.timeFormat("%Y-%m-%d")(sliderTime.value()));
  }

  return {
    getDate: getDate,
    initSlider: initSlider
  };
}();

init();
},{}],"../../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "53211" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/src.e31bb0bc.js.map