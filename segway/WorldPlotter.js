//object to plot the world
function worldPlotter(world,canvas){

	var e_shapeBit = 0x0001;
	var e_jointBit = 0x0002;
	var e_aabbBit = 0x0004;
	var e_pairBit = 0x0008;
	var e_centerOfMassBit = 0x0010;
	

	PTM=20;


	var context = canvas.getContext( '2d' );
	var canvasOffset = {x: canvas.width/2,y: canvas.height/2};   
	var viewCenterPixel = {x:320,y:24};
	
	canvasOffset.y = 480-10;


	//define the debug draw function
	function drawAxes(ctx) {
		ctx.strokeStyle = 'rgb(192,0,0)';
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(1, 0);
		ctx.stroke();
		ctx.strokeStyle = 'rgb(0,192,0)';
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(0, 1);
		ctx.stroke();
	}	
	
	function draw() {
		
		//black background
		context.fillStyle = 'rgb(0,0,0)';
		context.fillRect( 0, 0, canvas.width, canvas.height );
		
		context.save();            
			context.translate(canvasOffset.x, canvasOffset.y);
			context.scale(1,-1);                
			context.scale(PTM,PTM);
			context.lineWidth /= PTM;
			
			drawAxes(context);
			
			context.fillStyle = 'rgb(255,255,0)';
			world.DrawDebugData();
							
		context.restore();
	}	

	function setColorFromDebugDrawCallback( colorPtr ) {
		var color = Box2D.wrapPointer( colorPtr, Box2D.b2Color );
		var red = (color.get_r() * 255) | 0;
		var green = (color.get_g() * 255) | 0;
		var blue = (color.get_b() * 255) | 0;

		var colorStr = red + "," + green + "," + blue;
		context.fillStyle = "rgba(" + colorStr + ",0.5)";
		context.strokeStyle = "rgb(" + colorStr + ")";
	}	

	function drawSegment( vert1Ptr, vert2Ptr ) {
		var vert1 = Box2D.wrapPointer( vert1Ptr, Box2D.b2Vec2 );
		var vert2 = Box2D.wrapPointer( vert2Ptr, Box2D.b2Vec2 );

		context.beginPath();
		context.moveTo( vert1.get_x(), vert1.get_y() );
		context.lineTo( vert2.get_x(), vert2.get_y() );
		context.stroke();
	}
	function drawPolygon(vertices, vertexCount, fill) {
		context.beginPath();
		var i=0;
		for(i=0;i<vertexCount;i += 1) {
			var vert = Box2D.wrapPointer(vertices+(i*8), Box2D.b2Vec2);
			if ( i == 0 )
				context.moveTo(vert.get_x(),vert.get_y());
			else
				context.lineTo(vert.get_x(),vert.get_y());
		}
		context.closePath();
		if (fill)
			context.fill();
		context.stroke();
	}
	
	function drawCircle(center, radius, axis, fill) {                    
		var centerV = Box2D.wrapPointer(center, Box2D.b2Vec2);
		var axisV = Box2D.wrapPointer(axis, Box2D.b2Vec2);
		
		context.beginPath();
		context.arc(centerV.get_x(),centerV.get_y(), radius, 0, 2 * Math.PI, false);
		if (fill)
			context.fill();
		context.stroke();
		
		if (fill) {
			//render axis marker
			var vert2V = copyVec2(centerV);
			vert2V.op_add( scaledVec2(axisV, radius) );
			context.beginPath();
			context.moveTo(centerV.get_x(),centerV.get_y());
			context.lineTo(vert2V.get_x(),vert2V.get_y());
			context.stroke();
		}
	}	
	
	var debugDraw = new Box2D.b2Draw();		

	debugDraw.SetFlags(e_shapeBit | e_jointBit);

	Box2D.customizeVTable(debugDraw, [{
		original: Box2D.b2Draw.prototype.DrawSegment,
		replacement:
			function(thsPtr, vert1Ptr, vert2Ptr, colorPtr ) {
				setColorFromDebugDrawCallback( colorPtr );
				drawSegment(vert1Ptr, vert2Ptr );
			}
	}]);
	Box2D.customizeVTable(debugDraw, [{
		original: Box2D.b2Draw.prototype.DrawPolygon,
		replacement:
			function(ths, vertices, vertexCount, color) {                    
				setColorFromDebugDrawCallback(color);
				drawPolygon(vertices, vertexCount, false);                    
			}
	}]);
	Box2D.customizeVTable(debugDraw, [{
		original: Box2D.b2Draw.prototype.DrawSolidPolygon,
		replacement:
			function(ths, vertices, vertexCount, color) {                    
				setColorFromDebugDrawCallback(color);
				drawPolygon(vertices, vertexCount, true);                    
			}
	}]);
	
	Box2D.customizeVTable(debugDraw, [{
		original: Box2D.b2Draw.prototype.DrawCircle,
		replacement:
			function(ths, center, radius, color) {                    
				setColorFromDebugDrawCallback(color);
				var dummyAxis = Box2D.b2Vec2(0,0);
				drawCircle(center, radius, dummyAxis, false);
			}
		}]);
		
		Box2D.customizeVTable(debugDraw, [{
		original: Box2D.b2Draw.prototype.DrawSolidCircle,
		replacement:
			function(ths, center, radius, axis, color) {                    
				setColorFromDebugDrawCallback(color);
				drawCircle(center, radius, axis, true);
			}
		}]);
	
	
	
	world.SetDebugDraw( debugDraw );	


	that = {};
	
	that.drawWorld = draw;
	
	return that;
}