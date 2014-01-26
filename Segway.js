function segway(world){
	'use strict';
	//create two bodies and link them together
	var box = new Box2D.b2PolygonShape();
	box.SetAsBox(0.25,1.0);

	var upperBoxDef = new Box2D.b2BodyDef();
	upperBoxDef.set_type(Box2D.b2_dynamicBody);
	upperBoxDef.set_position(new Box2D.b2Vec2(0.0, 1.6));
	var vehicleBody = world.CreateBody(upperBoxDef);
	
	vehicleBody.CreateFixture(box, 10.0);

	var wheel = new Box2D.b2CircleShape();
	wheel.set_m_radius(0.3);
	
	var wheelDef = new Box2D.b2BodyDef();
	wheelDef.set_type(Box2D.b2_dynamicBody);
	wheelDef.set_position(new Box2D.b2Vec2(0,0.3));
	
	var wheelBody = world.CreateBody(wheelDef);
	wheelBody.CreateFixture(wheel, 10.0);

	var revJointDef = new Box2D.b2RevoluteJointDef();
	revJointDef.set_enableMotor(true);
	revJointDef.set_maxMotorTorque(1000000);
	revJointDef.set_motorSpeed(0);
	
	var anchor = new Box2D.b2Vec2(0.0, 0.3);
	revJointDef.Initialize(vehicleBody, wheelBody, anchor);
	var revJoint = Box2D.castObject(world.CreateJoint(revJointDef),Box2D.b2RevoluteJoint);
	
	var that = {};
	
	that.setWheelSpeed = function(speed){
		revJoint.SetMotorSpeed(speed);
	};
	that.getWheelSpeed = function(){
		return revJoint.GetMotorSpeed();
	};
	that.getBodyAngle = function(){
		return vehicleBody.GetAngle();
	};
	that.getBodyAngleSpeed = function(){
		return vehicleBody.GetAngularVelocity();
	};
	
	return that;
}