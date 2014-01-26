//to replace original C++ operator =
function copyVec2(vec) {
	return new Box2D.b2Vec2(vec.get_x(), vec.get_y());
}

function scaleVec2(vec, scale) {
	vec.set_x( scale * vec.get_x() );
	vec.set_y( scale * vec.get_y() );            
}

//to replace original C++ operator *= (float)
function scaledVec2(vec, scale) {
	return new Box2D.b2Vec2(scale * vec.get_x(), scale * vec.get_y());
}