// ******* create the fuzzy variables ********
//normalized  fuzzy variable x with 4 fuzzy values (sets) low,medlow,medhigh and high
//for input X
varX = new FuzzyVariable();
//add some fuzzy sets to it
varX.NH = new FuzzySet(-1.5,-1.0,-0.5);
varX.NL = new FuzzySet(-1.0,-0.5,0.0);
varX.Z = new FuzzySet(-0.5,0.0,0.5);
varX.PL = new FuzzySet(0.0,0.5,1.0);
varX.PH = new FuzzySet(0.5,1.0,1.5);

varDX = new FuzzyVariable();
//add some fuzzy sets to it
varDX.NH = new FuzzySet(-1.5,-1.0,-0.5);
varDX.NL = new FuzzySet(-1.0,-0.5,0.0);
varDX.Z = new FuzzySet(-0.5,0.0,0.5);
varDX.PL = new FuzzySet(0.0,0.5,1.0);
varDX.PH = new FuzzySet(0.5,1.0,1.5);


varY = new FuzzyVariable();
//add some fuzzy sets to it
varY.NH = new FuzzySet(-1.5,-1.0,-0.5);
varY.NL = new FuzzySet(-1.0,-0.5,0.0);
varY.Z = new FuzzySet(-0.5,0.0,0.5);
varY.PL = new FuzzySet(0.0,0.5,1.0);
varY.PH = new FuzzySet(0.5,1.0,1.5);

/*
Create folowing rule matrix:
			X
DX	|	NH	NL	Z	PL	PH
--------------------------		
NH 	|  	PH  PH  PH  PH  NH   
NL	| 	PH  PL  PL  NL  NH
Z	|	PH  PL  Z   NL  NH
PL	| 	PH  NL  NL  NL  NH
PH	|	PH  NH  NH  NH  NH

The pendulum angle is X, positive to the right
The angular velocity is DX, positive clockvise
The values in the matrix is the horizontal speed of the pendulum carriage
*/
varY.NH.rule = new FuzzyRule();
varY.NH.rule.addExpr([varX.PH,varDX.NH]);
varY.NH.rule.addExpr([varX.PH,varDX.NL]);
varY.NH.rule.addExpr([varX.PH,varDX.Z]);
varY.NH.rule.addExpr([varX.PH,varDX.PL]);
varY.NH.rule.addExpr([varX.PH,varDX.PH]);
varY.NH.rule.addExpr([varX.PL,varDX.PH]);
varY.NH.rule.addExpr([varX.Z,varDX.PH]);
varY.NH.rule.addExpr([varX.NL,varDX.PH]);

varY.NL.rule = new FuzzyRule();
varY.NL.rule.addExpr([varX.PL,varDX.NL]);
varY.NL.rule.addExpr([varX.PL,varDX.Z]);
varY.NL.rule.addExpr([varX.NL,varDX.PL]);
varY.NL.rule.addExpr([varX.Z,varDX.PL]);
varY.NL.rule.addExpr([varX.NL,varDX.PL]);

varY.Z.rule = new FuzzyRule();
varY.Z.rule.addExpr([varX.Z,varDX.Z]);

varY.PL.rule = new FuzzyRule();
varY.PL.rule.addExpr([varX.NL,varDX.NL]);
varY.PL.rule.addExpr([varX.Z,varDX.NL]);
varY.PL.rule.addExpr([varX.NL,varDX.Z]);

varY.PH.rule = new FuzzyRule();
varY.PH.rule.addExpr([varX.NH,varDX.NH]);
varY.PH.rule.addExpr([varX.NH,varDX.NL]);
varY.PH.rule.addExpr([varX.NH,varDX.Z]);
varY.PH.rule.addExpr([varX.NH,varDX.PL]);
varY.PH.rule.addExpr([varX.NH,varDX.PH]);
varY.PH.rule.addExpr([varX.NL,varDX.NH]);
varY.PH.rule.addExpr([varX.Z,varDX.NH]);
varY.PH.rule.addExpr([varX.PL,varDX.NH]);



