jsfuzz
======

A javascript fuzzy logic controller implementation.

To create a controller.
------------------------

First create some input variables.  The following code creates 
two variables 'varX' and 'varDX'. 

Each variable consists of 1 or more fuzzy sets.  A fuzzy set define a variable
value like LOW (or L) 


	FuzzySet s = new FuzzySet(0.0,0.5,1.0);

	
This fuzzy set is a sawtooth function where the set value is zero outside [0,1] and increases 
linearly from 0 to 1 in the interval [0,0.5] and decreases linearly from 1 to 0 in the interval
[0.5,1].

The following code defines the input fuzzy variable for a temperature fvTemp over the range [0,1] 


	fvTemp = new FuzzyVariable();
	fvTemp.VL = new FuzzySet(-0.25,0.0,0.25);
	fvTemp.L = new FuzzySet(0.0,0.25,0.5);
	fvTemp.M = new FuzzySet(0.25,0.5,0.75);
	fvTemp.H = new FuzzySet(0.5,0.75,1.0);
	fvTemp.VH = new FuzzySet(0.75,1.0,1.25);


Note that VL (very low) and VH (very high) overlap the [0,1] boundaries.   Those values represent
the 0 and 1 values of the input real value.  The most important thing is that those values are 1 
at 0 and 1





