jsfuzz
======

A javascript fuzzy logic controller implementation.

To create a controller.
------------------------

First create some input variables.  The following code creates 
two variables 'i1' and 'i2'. 



Each fuzzy variable consists of 1 or more fuzzy sets.  A fuzzy set is a value like LOW (or L) 

	FuzzySet s = new FuzzySet(0.0,0.5,1.0);
	
This fuzzy set is a sawtooth function where the set value is zero outside [0.0 , 1.0] and increases 
linearly from 0.0 to 1.0 in the interval [0.0 , 0.5] and decreases linearly from 1 to 0 in the interval
[0.5 , 1.0].

The following code defines the input fuzzy variable i1 for a input value over the range [0.0 , 1.0]. 

	i1 = new FuzzyVariable();
	i1.VL = new FuzzySet(-0.25,0.0,0.25);
	i1.L = new FuzzySet(0.0,0.25,0.5);
	i1.M = new FuzzySet(0.25,0.5,0.75);
	i1.H = new FuzzySet(0.5,0.75,1.0);
	i1.VH = new FuzzySet(0.75,1.0,1.25);

This variable has five fuzzy sets (VL,L,M,H,VH) that represents different fuzzy values.	
	
Note that VL (very low) and VH (very high) overlap the [0.0 , 1.0]  boundaries.   Those values represent
the 0.0 and 1.0 values of the input real value.  The most important thing is that the fuzzy set  values are 1.0 
at points 0.0 and 1.0.

If the controller has another control input then define another fuzzy variable i2

	i2= new FuzzyVariable();
	i2.L = new FuzzySet(-0.5,0.0,0.5);
	i2.M = new FuzzySet(0.0,0.5,1.0);
	i2.H = new FuzzySet(0.5,1.0,1.5);

Note that this input fuzzy variable has only 3 fuzzy sets (L,M,H) for Low,Medium and High fuzzy values.

The output variable o for the controller is defined in the same manner.   

	o = new FuzzyVariable();
	o.L = new FuzzySet(-0.5,0.0,0.5);
	o.M = new FuzzySet(0.0,0.5,1.0);
	o.H = new FuzzySet(0.5,1.0,1.5);
	
We must then define the fuzzy controller rules for each output set (L,M,H).  

The table below shows all the possible output values in term of the imput values i1 and i2.  The
input values for fuzzy variable i1 are listed in the top row in bold and the input values for the 
fuzzy variable i2 are shown in bold in the first columns.    

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
		<td><b>L</b></td>
		<td>L</td>
		<td>M</td>
		<td>M</td>
		<td>H</td>
		<td>H</td>
	</tr>
	<tr>	
		<td><b>M</b></td>
		<td>M</td>
		<td>M</td>
		<td>H</td>
		<td>H</td>
		<td>H</td>
	</tr>
		<tr>	
		<td><b>H</b></td>
		<td>M</td>
		<td>H</td>
		<td>H</td>
		<td>H</td>
		<td>H</td>
	</tr>
	
	
</table>

We can then construct the rules from the above matrix by first AND-ing all input values pairs for each row/column for each
output value.   The output value L for example is only triggered if i1 is VL and i2 is L.  The rule is then 

    if ((i1 is L  and i2 is L) then o = L

or in more compact form

    o.L = i1.VL & i2.L    
    
The rule for the output M is  

    o.M = i1.L & i2.L | i1.M & i2.L | i1.VL & i2.M | i1.L & i2.M | i1.VL & i2.H  

and the rule for output L   

    o.H = i1.H & i2.L | i1.VH & i1.H | i1.M & i2.M | i1.H & i2.M | i1.VH & i2.M | i1.L & i2.H | i1.M & i2.H | i1.H & i2.H | i1.VH & i2.H
    
We convert the above rules to code as 

	o.L.rule = new FuzzyRule();
	o.L.rule.addExpr([i1.VL,i2.L]);

	o.M.rule = new FuzzyRule();
	o.M.rule.addExpr([i1.L,i2.L]);
	o.M.rule.addExpr([i1.M,i2.L]);
	o.M.rule.addExpr([i1.VL,i2.M]);
	o.M.rule.addExpr([i1.L,i2.M]);
	o.M.rule.addExpr([i1.VL,i2.H]);
	...
    
Where each AND expression is added to the rule attribute with addExpr(list) where list is a list of values for each fuzzy variable input (i1 and i2 in this example). 

	
Real input values inputValue1 and inputValue2 must be normalized and fuzzified:

	i1.fuzzyfy(inputValue1/maxInputValue1);
	i2.fuzzyfy(inputValue2/maxInputValue2);
	
This will calculate the fuzzy set value for each and every fuzzy set defined by those variables.
	
And to calculate the fuzzy output variable use the fireRules() method of the output fuzzy variable

	o.fireRules();
	
This will internally calculate all the output fuzzy sets of the output fuzzy variable 'o'.  

The real output value is then calculated with the defuzzify() method of the output fuzzy variable

	var outputValue = o.defuzzify();
	
See [FuzzyController.html](https://github.com/arnigeir/jsfuzz/blob/master/FuzzyController.html) to see example of a inverted pendulum controller that takes the normalized pendulum 
angle with vertical and angular velocity of the pendulum as inputs and outputs a normalized speed for 
a pendulum carriage. See inverted pendulum on [Wikipedia](http://en.wikipedia.org/wiki/Inverted_pendulum)

A Segway simulation.
------------------------	
	
A inverted pendulum is a complicated system to model and control.  The fuzzy controller makes it possible
to model such a controller with 5 fuzzy rules, see [FuzzyPendulum.html](https://github.com/arnigeir/jsfuzz/blob/master/segway/fuzzyPendulum.js)

A [Box2D](http://box2d.org/) simulation of such system is implemented in  [Segway.html](https://github.com/arnigeir/jsfuzz/blob/master/segway/segway.html).
	

