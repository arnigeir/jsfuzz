/*
Fuzzy set defines a fuzzy value for a fuzzy variable
=========================================================

The fuzzy set is a triangular function 

        ^
       / \
      /   \
     /     \
----|---|---|-------------
    p1  p2  p3

	
Object properties and methods
------------------------------------
className :  returns 'FuzzySet'
area: returns the total area of the fuzzyset
weightedArea : returns the weighed area (1-this.value) * area
value : returns the calculated fuzzy result from the last calculate() method
calculate(x): calculate fuzzy set value  ( this.value  )
 */
var FuzzySet = function (p1, p2, p3) {
	"use strict";
	return {
		className : 'FuzzySet',
		area : function () {
			if (this.totalarea === undefined) {
				if (p3 > p2 && p2 > p1) {
					this.totalarea = (p3 - p1) / 2;
				} else {
					this.totalarea = 0;
				}
			}
			return this.totalarea;
		},
		weightedArea : function(){
			this.weighedArea = 0;
			if(this.value && this.area){
				this.weighedArea = (1 - this.value) * this.area;
			}
			return this.weighedArea;
			
		},
		value : function(){
			return this.value;
		},
		calculate : function (x) {
			//create a new property 'value' to hold the results of the calculations
			this.value = 0;
			if (p3 > p2 && p2 > p1) {
				if (x > p1 && x <= p2) 
				{
					this.value = (x - p1) / (p2 - p1);
				}
				else if (x > p2 && x < p3) {
					this.value = 1.0 - ((x - p2) / (p3 - p2));
				}
			} 
			return this.value;
		}
	};
};

/*
FuzzyVariable defines a list of continious fuzzyset over some  range of crips values
The constructor does not take any parameters

Object properties and methods
------------------------------------
getFuzzySets : returns the list of fuzzy sets
fuzzify(x) :   calculates the fuzzy set values given crisp value x and returns the list of the fuzzysets
defuzzify() :  given a list of fuzzyset values calculates the crisp value x
fireRules() :  loopls through all sets and check if rule is assigned and executes it to update the set value
 */

var FuzzyVariable = function () {
	"use strict";
	var that = this;
	return {
		className : 'FuzzyVariable',
		fuzzyfy : function (v) {
			var fuzzysets = this.getFuzzySets()
			,n = fuzzysets.length
			,i = 0;
			for (i = 0; i < n; i += 1) {
				fuzzysets[i].variable = that;
				fuzzysets[i].calculate(v);
			}
		},
		defuzzify : function () {
			//uses centroid method to calculate the crisp fuzzy value
			//calculates the weighed centroid of fuzzy values ie
			// y = sum(m*c)/N  where m is the fuzzy value (weight) and c is the center of the
			// set  (p2) and N is the number of sets calulated
			//the weight is a function of the fuzzy set value
			var fuzzysets = this.getFuzzySets()
				,n = fuzzysets.length
				,i = 0
				,sum=0;		
			
			for(i=0;i<n;i += 1){
				sum += (1-fuzzysets[i].value)*fuzzysets[i].area();
			}
			return sum/n;
		},
		getFuzzySets : function () {
			var items = [],
				property,
				n;
			for (property in this) {
				if (this.hasOwnProperty(property) &&
					this[property].className === 'FuzzySet') {
					this[property].name = property;
					items.push(this[property]);
				}
			}
			return items;
		},
		fireRules : function () {
			var fuzzysets = this.getFuzzySets(),
				n = fuzzysets.length,
				fuzzyset,
				rule,
				i = 0;
			for (i = 0; i < n; i += 1) {
				fuzzyset = fuzzysets[i];
				rule = fuzzyset.rule;
				//if set has rule then calculate the output value
				if (rule !== undefined && rule.className === 'FuzzyRule') {
					fuzzyset.value = rule.fire();
				}

			}
		}
	};
};

// Represents a AND expression of the form
// exp [AND exp]*
// Methods:
// fire() : returns the expression fuzzy value

var FuzzyRule = function (list) {
	"use strict";
	var i,
		min;
	return {
		className : 'FuzzyRule',
		fire : function () {
			//loops through the list to find the minimum set value
			if (list === undefined){
				return 0;
			}
			min = 1;
			for (i = 0; i < list.length; i += 1) {
				if (list[i] !== undefined && list[i].className === 'FuzzySet' && list[i].value !== 'undefined') {
					if (list[i].value < min)
					{
						min = list[i].value;
					}
				}
			}
			return min;
		}
	};
};

/*

//the derivative of input variable X , dX = dX/dt
var dX = new FuzzyVariable();
dX.L = new FuzzySet(1,2,3);
dX.H = new FuzzySet(2,3,4);

//output variable Y
var y = new FuzzyVariable();
y.L = new FuzzySet(1,2,3);
y.M = new FuzzySet(2,3,4);
y.H = new FuzzySet(3,4,5);

//create the rules "IF X=L AND DX=L THEN Y=L"
var rule1 = new FuzzyRule(y.L,[x.L,dX.L]);
var rule2 = new FuzzyRule(y.M,[x.L,dX.H]);
var rule3 = new FuzzyRule(y.M,[x.H,dX.L]);
var rule4 = new FuzzyRule(y.L,[x.H,dX.H]);

var engine = new FuzzyEngine();
engine.addRule(rule1);
engine.addRule(rule2);
engine.addRule(rule3);
engine.addRule(rule4);



//run the engine for value 3 - the returned value is a defuzzified crisp real number

var y = engine.run(3);

//what happens is that the engine fires all the rules where each rule calculates the fuzzy value
//for the corresponding output fuzzy set value like FuzzyRule(y.L,[x.L,dX.L]) returns y.L.value = 0.5 if x.L.value=0.5 and dx.L.value=0.3
//y fuzzy sets not calculated get the value 0
//the result of firing the rules is a fuzzy variable y with some nonzero fuzzy set values.
//the engine then uses the fuzzy variable defuzzify method to calculate a crisp output value
 */

/*

Rules have the form [y,x1,x2,...] where y is the fuzzy output value and x1..xn
are the fuzzy input values


 */

/*
FuzzyEngine takes two fuzzy input variables x and dx (derivative of x)
y output fuzzy variable and rules for each fuzzy set of the input variables and
resulting output fuzzy set

Object properties and methods
------------------------------------
setRules  sets the rules matrix in the engine
setXVariable  sets the input x fuzzy variable
setDXVariable sets the input dx fuzzy variable
setYVariable sets the output y fuzzy variable
run(x,dx)  runs the engine and outputs the crisp y value

var FuzzyEngine = function()
{
var rules,xVariable,dxVariable,yVariable;
return {
setRules : function(r){
rules = r;
},
setXVariable : function(v){
xVariable = v;
},
setDXVariable : function(v){
dxVariable = v;
},
setYVariable : function(v){
yVariable = v;
},
//runs the input values x,dx and returns a output y
run: function(x,dx){
var i,j;
//fuzzyfy the input variables
//fx and fdx are arrays of numbers with set values
var fx = xVariable.fuzzyfy(x);
var fdx = dxVariable.fuzzyfy(dx);

//the list of output fuzzy values
var fy=[];

//fire all rules -
//each rule checks both x and dx against a fuzzy sets and
//selects the MIN value of both fuzzy sets for the resulting output fuzzy set
//calculate the centroid value
//sum( cm(i)*y(i))/sum(y(i)) for i in all rules
//where cm(i) is the location of center of mass of output value of rule i
//y(i) is the min value of the input sets in the rule i

for(i=0;i<varDX.length;i++)
{
for(j=0;j<varX.length;j++)
{

}
}
return 0;
}
}
}
*/
