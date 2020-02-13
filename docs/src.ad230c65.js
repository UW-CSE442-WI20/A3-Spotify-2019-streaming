parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"Focm":[function(require,module,exports) {
var t,e,a=["ca","dk","gr","is","mx","ph","sv","ar","ch","do","gt","it","my","pl","th","at","cl","ec","hk","jp","pt","tr","au","co","hn","nl","py","tw","be","cr","es","hu","no","ro","us","fi","id","nz","se","uy","bo","cz","fr","ie","pa","sg","vn","br","de","gb","il","pe","sk","global"],n=["Canada","Denmark","Greece","Iceland","Mexico","Philippines","El Salvador","Argentina","Switzerland","Dominican Republic","Guatemala","Italy","Malaysia","Poland","Thailand","Austria","Chile","Ecuador","Hong Kong","Japan","Portugal","Turkey","Australia","Columbia","Honduras","Netherlands","Paraguay","Taiwan","Belgium","Costa Rica","Spain","Hungary","Norway","Romania","United States","Finland","Indonesia","New Zealand","Sweden","Uruguay","Bolivia","Czech Republic","France","Ireland","Panama","Singapore","Vietnam","Brazil","Germany","United Kingdom","Israel","Peru","Slovakia","global"],r=n.slice(0).sort(),i=1,l={top:15,right:25,bottom:30,left:10},s=800-l.left-l.right,o=460-l.top-l.bottom,d=d3.scaleBand().range([o-10,0]).padding(.1),c=d3.scaleLinear().range([0,s]),u=[];function g(){d3.csv("streamsglobal10.csv").then(function(t){slider.initSlider(),u=t;var e=t.filter(function(t){return t.date===slider.getDate()});m(),v(e),d3.select("#vis-container-country").insert("select","svg").on("change",function(){var t=d3.select(this).property("value"),e=n.indexOf(t),r="streams"+a[e]+"10.csv";"global"==a[e]?document.getElementById("flag").style.visibility="hidden":(document.getElementById("flag").src=a[e]+".svg",document.getElementById("flag").style.visibility="visible"),d3.csv(r).then(function(t){u=t,v(t.filter(function(t){return t.date===slider.getDate()}))})}).selectAll("option").data(r).enter().append("option").attr("value",function(t){return t}).attr("selected",function(t){return"Global"===t}).text(function(t){return t[0].toUpperCase()+t.slice(1,t.length)})})}function m(){svg=d3.select("div#graph").append("svg").attr("width",s+l.left+l.right).attr("height",o+l.top+l.bottom).append("g").attr("transform","translate("+l.left+","+l.top+")")}function f(t,e,a,n){svg.selectAll("text").remove(),svg.selectAll("g").remove(),svg.append("g").attr("transform","translate(0,"+(o-10)+")").attr("color","white").call(d3.axisBottom(c)),svg.append("text").attr("transform","translate("+s/2+" ,"+(o+l.top+10)+")").attr("fill","white").attr("font-family","sans-serif").attr("font-size","12px").style("text-anchor","middle").text("Streams"),svg.append("g").call(d3.axisLeft(d).tickSize(0).tickFormat("")),svg.selectAll("title").remove(),svg.selectAll("rect").append("title").text(function(e){var n=10-parseInt(e[1]);return'"'+t[n]+'" by '+a[n]+": "+e[0]+" streams on "+slider.getDate()}),svg.selectAll("text.value").data(e).enter().append("text").text(function(t){return n[parseInt(t[1])-1]}).attr("text-anchor","end").attr("y",function(t,a){return(9-a)*((o-14)/e.length)+26}).attr("x",function(t){var a=t[1],n=e[a-1][0];return c(n)-8}).attr("font-family","sans-serif").attr("font-size","12px").attr("font-weight",550).attr("fill","rgb(35, 35, 35)")}function p(t){var e=svg.selectAll("rect").data(t);e.enter().append("rect").attr("class","bar").attr("fill",function(){return"rgb(30, 215, 96)"}).merge(e).attr("x",function(t){return c(t[1])}).attr("y",function(t){return d(t[1])}).attr("width",function(t){return c(t[0])}).attr("height",d.bandwidth())}function v(a){t=[[]],e=[""];var n=[""];artistNames=[""];for(var r=0;r<a.length;r++){var i=[parseInt(a[r].Streams),10-r+""],l=a[r]["Track Name"];n[r]=l,a[r]["Track Name"].length>30&&(l=l.substring(0,31)+"..."),e[r]=l,artistNames[r]=a[r].Artist,t[r]=i}c.domain([0,d3.max(t,function(t){return t[0]})]),d.domain(d3.range(1,t.length+1)),p(t),f(n,t,artistNames,e)}slider=function(){var t,e;return{getDate:function(){return d3.timeFormat("%Y-%m-%d")(t.value())},initSlider:function(){var a=d3.range(0,53).map(function(t){return new Date(2019,0,1+7*t)}),n=d3.range(0,12).map(function(t){return new Date(2019,t,1)});t=d3.sliderBottom().min(d3.min(a)).max(d3.max(a)).step(12).width(770-l.left-l.right).tickValues(n).tickFormat(d3.timeFormat("%b")).displayValue(!1).on("onchange",function(t){d3.select("div#date-display").text(d3.timeFormat("%Y-%m-%d")(t)),e=d3.timeFormat("%Y-%m-%d")(t),v(u.filter(function(t){for(var a=0;a<u.length;a++)return t.date===e}))});var r=d3.select("div#slider").append("svg").attr("width",900-l.left-l.right).attr("height",100-l.top-l.bottom).append("g").attr("transform","translate(30,10)");r.call(t),r.selectAll("text").attr("dx","-10px").attr("dy","-16px"),d3.select("div#date-display").text(d3.timeFormat("%Y-%m-%d")(t.value()))}}}(),g();
},{}]},{},["Focm"], null)
//# sourceMappingURL=https://uw-cse442-wi20.github.io/A3-Spotify-2019-streaming/src.ad230c65.js.map