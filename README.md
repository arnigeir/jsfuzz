jsfuzz
======

A javascript fuzzy logic controller implementation.

To create a controller.
------------------------

First create some input variables.  The following code creates 
two variables 'varX' and 'varDX'. 

Each variable consists of 1 or more fuzzy sets.  A fuzzy set is a variable
 like LOW (or L) 

	FuzzySet s = new FuzzySet(0.0,0.5,1.0);
	
This fuzzy set is a sawtooth function where the set value is zero outside [0.0 , 1.0] and increases 
linearly from 0.0 to 1.0 in the interval [0.0 , 0.5] and decreases linearly from 1 to 0 in the interval
[0.5 , 1.0].

The following code defines the input fuzzy variable fv1 for a input value over the range [0.0 , 1.0]. 

	fvI1 = new FuzzyVariable();
	fvI1.VL = new FuzzySet(-0.25,0.0,0.25);
	fvI1.L = new FuzzySet(0.0,0.25,0.5);
	fvI1.M = new FuzzySet(0.25,0.5,0.75);
	fvI1.H = new FuzzySet(0.5,0.75,1.0);
	fvI1.VH = new FuzzySet(0.75,1.0,1.25);

This variable has five fuzzy sets (VL,L,M,H,VH) with different values.	
	
Note that VL (very low) and VH (very high) overlap the [0.0 , 1.0]  boundaries.   Those values represent
the 0.0 and 1.0 values of the input real value.  The most important thing is that the fuzzy set  values are 1.0 
at points 0.0 and 1.0.

If the controller has another control input then define another fuzzy variable fv2

	fvI2= new FuzzyVariable();
	fvI2.L = new FuzzySet(-0.5,0.0,0.5);
	fvI2.M = new FuzzySet(0.0,0.5,1.0);
	fvI2.H = new FuzzySet(0.5,1.0,1.5);

Note that this input fuzzy variable has only 3 fuzzy sets (L,M,H) for Low,Medium and High.

The output variable for the controller is defined in the same manner.   

	fvO= new FuzzyVariable();
	fvO.L = new FuzzySet(-0.5,0.0,0.5);
	fvO.M = new FuzzySet(0.0,0.5,1.0);
	fvO.H = new FuzzySet(0.5,1.0,1.5);
	
Then define the fuzzy controller rules for each output set (L,M,H).  Given a rule matrix

<table>
	<tr>
		<th></th>
		<th>VL</th>
		<th>L</th>
		<th>M</th>
		<th>H</th>
		<th>VH</th>
	</tr>
	<tr>	
		<td>L</td>
		<td>L</td>
		<td>M</td>
		<td>M</td>
		<td>H</td>
		<td>H</td>
	</tr>
	<tr>	
		<td>L</td>
		<td>M</td>
		<td>M</td>
		<td>H</td>
		<td>H</td>
		<td>H</td>
	</tr>
		<tr>	
		<td>M</td>
		<td>M</td>
		<td>H</td>
		<td>H</td>
		<td>H</td>
		<td>H</td>
	</tr>
	
	
</table>


	fvO.L.rule = new FuzzyRule();
	fvO.L.rule.addExpr([fvI1.L,fvI2.L]);




