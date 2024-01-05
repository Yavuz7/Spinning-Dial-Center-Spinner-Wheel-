// Code Derived From : https://codepen.io/deab/pen/gObXawr Spin Wheel Using JS - Dee
var spinner;

var padding = { top: 0, right: 0, bottom: 0, left: 0 },
  // Media Query to resize w and h
  w = 700 - padding.left - padding.right,
  h = 700 - padding.top - padding.bottom,
  r = Math.min(w, h) / 2,
  rotation = 0,
  oldrotation = 0,
  picked = 100000,
  oldpick = [],
  color = d3.scale.category20();
//Set Data From Files?
var data = [
  {
    label: "1",
    value: 1,
    content: "You rolled a 1, bazinga!",
  },
  {
    label: "2",
    value: 2,
    content: "You got a 2, nice job!",
  },
  {
    label: "3",
    value: 3,
    content: "You got a 3, that's a real number.",
  },
  {
    label: "4",
    value: 4,
    content: "You got a 4, smore!",
  },
  {
    label: "5",
    value: 5,
    content: "You got a 5, what a surprise!",
  },
  {
    label: "6",
    value: 6,
    content: "You got a 6, epix",
  },
  {
    label: "7",
    value: 7,
    content: "You got a 7, woohoo",
  },
  {
    label: "8",
    value: 8,
    content: "You got a 8, great!",
  },
];
var svg = d3
  .select("#chart")
  .append("svg")
  .data([data])
  .attr("width", w + padding.left + padding.right)
  .attr("height", h + padding.top + padding.bottom);
var container = svg
  .append("g")
  .attr("class", "chartholder")
  .attr(
    "transform",
    "translate(" + (w / 2 + padding.left) + "," + (h / 2 + padding.top) + ")"
  );
var vis = container.append("g");

var pie = d3.layout
  .pie()
  .sort(null)
  .value(function (d) {
    return 1;
  });
// declare an arc generator function
var arc = d3.svg.arc().outerRadius(r);
// select paths, use arc generator to draw
var arcs = vis
  .selectAll("g.slice")
  .data(pie)
  .enter()
  .append("g")
  .attr("class", "slice");

arcs
  .append("path")
  .attr("fill", function (d, i) {
    return color(i);
  })
  .attr("d", function (d) {
    return arc(d);
  });
// add the text
arcs
  .append("text")
  .attr("transform", function (d) {
    //Change This Number To Move Numbers On Wheel
    d.innerRadius = r / 1.6;
    // d.outerRadius = r;
    return (
      // "rotate(" +
      // ((d.angle * 180) / Math.PI - 90) +
      "translate(" +
      arc.outerRadius(r - 40).centroid(d)[0] +
      "," +
      //Arbitrary addition to center it better, I don't know what's wrong with it in the first place
      (arc.outerRadius(r - 40).centroid(d)[1] + 33) +
      ")"
    );
  })
  .attr("text-anchor", "middle")
  .text(function (d, i) {
    return data[i].label;
  });

d3.xml("images/arrow.svg")
  .mimeType("image/svg+xml")
  .get(function (error, xml) {
    if (error) throw error;
    var arrow = xml.documentElement;
    arrow.setAttribute("id", "spinner_arrow");
    // arrow.style.fill = "red";
    var wheel = document.querySelector("#chart");
    wheel.appendChild(arrow);
    spinner = d3.select("#spinner_arrow");
    spinner.on("click", spin);

    // document.body.appendChild(arrow);
  });

container.on("click", spin);
function spin(d) {
  container.on("click", null);
  spinner.on("click", null);
  //all slices have been seen, all done
  console.log("OldPick: " + oldpick.length, "Data length: " + data.length);
  //   if (oldpick.length == data.length) {
  //     console.log("done");
  //     container.on("click", null);
  //     return;
  //   }
  var ps = 360 / data.length,
    rng = Math.floor(Math.random() * 1440 + 720);

  rotation = Math.round(rng / ps) * ps;
  console.log("rotation" + (rotation % 360));
  //Picked is equal to modulation of the arrows position so it's under 360,
  //then you just divide to get how many pie slices it's passed around
  picked = Math.round((rotation % 360) / ps);
  picked = picked > data.length ? picked % data.length : picked;
  //   if (oldpick.indexOf(picked) !== -1) {
  //     d3.select(this).call(spin);
  //     return;
  //   } else {
  //     oldpick.push(picked);
  //   }
  rotation += Math.round(ps / 2);
  //   d3.select("#spinner_arrow")
  d3.select("#spinner_arrow")
    .transition()
    .duration(3500)
    .attrTween("transform", rotTween)
    .each("end", function () {
      //mark question as seen
      //   d3.select(".slice:nth-child(" + (picked + 1) + ") path").attr(
      //     "fill",
      //     "#111"
      //   );
      //populate question
      d3.select("#spinner_content h1").text(data[picked].content);
      oldrotation = rotation;

      /* Get the result value from object "data" */
      console.log(data[picked].value);

      /* Comment the below line for restrict spin to sngle time */
      spinner.on("click", spin);
      container.on("click", spin);
    });
}

function rotTween(to) {
  var i = d3.interpolate(oldrotation % 360, rotation);
  return function (t) {
    return "rotate(" + i(t) + ")";
  };
}
