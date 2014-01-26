
function segwayWorld(){
	var globalStep = 0;

	function printStatus(){
		document.getElementById('status').innerHtml = "hello...";
	}

	//create world with gravity y=-10
	var gravity = new Box2D.b2Vec2(0.0, -10.0) ;
	var world = new Box2D.b2World( gravity );	
	
	var shape = new Box2D.b2EdgeShape();
	shape.Set(new Box2D.b2Vec2(-30.0, 0.0), new Box2D.b2Vec2(30.0, 0.0));
	ground = world.CreateBody(new Box2D.b2BodyDef());
	ground.CreateFixture(shape, 0.0);

	return world;
}