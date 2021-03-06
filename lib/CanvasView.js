/*
	CanvasView.js
	View of model using the canvas element
*/

function CanvasView(id,width,height){
	this.domelement = document.createElement('canvas');
	this.domelement.setAttribute('id',id);

	//Fit initial view to model size
	this.domelement.setAttribute('width',width);
	this.domelement.setAttribute('height',height);
	this.translation = new Vector(width/2.0,height/2.0,0);
	this.scale = 2;

	//Callbacks when resizing view
	var that = this;
	this.oldwidth = width;
	this.oldheight = height;
	var resize = function(e){
		var width = that.domelement.clientWidth;
		var height = that.domelement.clientHeight;
		that.domelement.setAttribute('width',width);
		that.domelement.setAttribute('height',height);

		//Add difference of new and old to translation
		that.translation = that.translation.add(new Vector(width-that.oldwidth,height-that.oldheight,0).division(2));
		//Scale by a factor of new area / old area
		that.scale *= Math.min(width,height) / Math.min(that.oldwidth,that.oldheight);

		//Save the new size
		that.oldwidth = width;
		that.oldheight = height;
	};
	window.addEventListener('load', resize, false);
	window.addEventListener('resize', resize, false);
	window.addEventListener('orientationchange', resize, false);
}

//Callback for drawing model
CanvasView.prototype.redraw=function(model){
	var width = this.domelement.getAttribute('width');
	var height = this.domelement.getAttribute('height');

	var cxt = this.domelement.getContext('2d');
	cxt.save();
	cxt.clearRect(0,0,width,height);
	cxt.translate(this.translation.x,this.translation.y);
	cxt.scale(this.scale,this.scale);

	cxt.textAlign="center";
	cxt.textBaseline="middle";
	cxt.strokeStyle="rgb(186,180,163)";

	cxt.font=".5em Arial";
	cxt.fillStyle="rgb(0,0,0)";
	for(var edge in model.edges){
		var e = model.edges[edge];
		cxt.beginPath();
		cxt.moveTo(e.origin.position.x, e.origin.position.y);
		cxt.lineTo(e.destination.position.x, e.destination.position.y);
		cxt.stroke();
		if(typeof e.content !== 'undefined' && e.content !== null){
			var midpos = e.origin.position.plus(e.destination.position.minus(e.origin.position).division(2));
			cxt.fillText(e.content, midpos.x, midpos.y);
		}
	}

	cxt.font=".7em Arial";
	for(var node in model.nodes){
		var n = model.nodes[node];
		cxt.beginPath();
		cxt.arc(n.position.x, n.position.y, n.radius, 0, Math.PI*2, true);
		cxt.fillStyle="rgb(217,147,61)";
		cxt.stroke();
		cxt.fill();
		cxt.fillStyle="rgb(0,0,0)";
		cxt.fillText(n, n.position.x, n.position.y);
	}
	cxt.restore();
};
