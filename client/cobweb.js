Template.cobweb.onRendered( function() {
	var svg = d3.select("svg");
	var web = d3.layout.force().linkStrength(1.0).friction(0.9).linkDistance(-10).charge(-50).gravity(0.07).theta(0.8).alpha(0.1).on("tick", tick);
	var webLinks = [];
	var webParticles = [];
	var underlay = svg.append("g");
	var rect = underlay.selectAll("rect").data([1]);
	var colorRect = "#454545";
	var depth = 5;
	var segments = 20;
	var n = segments * depth;
	var rSmall = 6;
	var colorSmall = "#2a2a2a";
	var radius;
	var step = (2 * Math.PI) / segments;
	var points = d3.range(n + 1);
	var height = window.innerHeight;
	var width = window.innerWidth;
	rect.enter().append("rect").style("fill", colorRect);
	web.size([width, height]);
	rect.attr("width", width).attr("height", height);
	radius = Math.min(width, height) / 2;
	var origin = {x: width / 2, y: height / 2};
	var radiusStep = radius / n;

	points.forEach(function (p, i) {
		if (i !== points.length - 1) {
			var angle = i * step;
			var shrinkingRadius = radius - radiusStep * i;

			webParticles.push({
				x: origin.x + Math.cos(angle) * shrinkingRadius,
				y: origin.y + Math.sin(angle) * shrinkingRadius,
				fixed: (i < segments) && (i % 3 === 0)
			});

			if (i < points.length - 1 && i + 1 !== points.length - 1)
				webLinks.push({source: i, target: i + 1});

			var offnow = i + segments;

			if (offnow < n - 1) 
				webLinks.push({source: i, target: offnow});
			else
				webLinks.push({source: i, target: n - 1});
		}
	});

	webLinks.push({source: 0, target: segments - 1});
	var drag = web.drag();
	var svgWebLinks = underlay.selectAll("line").data(webLinks);
	svgWebLinks.enter().append("line");
	var svgWebNodes = underlay.selectAll("circle").data(webParticles);
	svgWebNodes.enter().append("circle").attr("r", rSmall).style("fill", colorSmall).call(drag);
	web.nodes(webParticles).links(webLinks).start();

  
  // Here is where we define the ticks
	function tick() {
		svgWebLinks
			.attr("x1", function (d) { return d.source.x })
			.attr("y1", function (d) { return d.source.y })
			.attr("x2", function (d) { return d.target.x })
			.attr("y2", function (d) { return d.target.y });

		svgWebNodes
			.attr("cx", function (d) { return d.x })
			.attr("cy", function (d) { return d.y });
	};
});
