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
		getArea : function () {
			if (this.totalarea === undefined) {
				if (p3 > p2 && p2 > p1) {
					this.totalarea = (p3 - p1) / 2;
				} else {
					this.totalarea = 0;
				}
			}
			return this.totalarea;
		},
		getCenter : function () {
			return p2;
		},
		getFuzzyArea : function () {
			return this.weighedArea || 0;
		},
		calculateFuzzyArea : function () { //a private function
			this.weighedArea = (1 - Math.pow((1 - this.getFuzzyValue()), 2)) * this.getArea();
		},
		getFuzzyValue : function () {
			return this.fuzzyValue || 0;
		},
		setFuzzyValue : function (value) {
			this.fuzzyValue = value;
			this.calculateFuzzyArea();
		},
		calculateFuzzyValue : function (x) {
			this.fuzzyValue = 0;
			this.crispValue = x;
			if (p3 > p2 && p2 > p1) {
				if (x > p1 && x <= p2) {
					this.fuzzyValue = (x - p1) / (p2 - p1);
				} else if (x > p2 && x < p3) {
					this.fuzzyValue = 1.0 - ((x - p2) / (p3 - p2));
				}
			}
			this.calculateFuzzyArea();
			return this.fuzzyValue;
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
			var fuzzysets = this.getFuzzySets(),
			n = fuzzysets.length,
			i = 0;
			for (i = 0; i < n; i += 1) {
				fuzzysets[i].variable = that;
				fuzzysets[i].calculateFuzzyValue(v);
			}
		},
		defuzzify : function () {
			//uses centroid method to calculate the crisp fuzzy value
			//calculates the weighed centroid of fuzzy values ie
			// y = sum(m*c)/N  where m is the fuzzy value (weight) and c is the center of the
			// set  (p2) and N is the number of sets calulated
			//the weight is a function of the fuzzy set value
			var fuzzysets = this.getFuzzySets(),
			n = fuzzysets.length,
			i = 0,
			sumOfWeights = 0,
			weighedSum = 0;

			for (i = 0; i < n; i += 1) {
				weighedSum += fuzzysets[i].getFuzzyArea() * fuzzysets[i].getCenter();
				sumOfWeights += fuzzysets[i].getFuzzyArea();
			}
			return (sumOfWeights === 0) ? 0 : weighedSum / sumOfWeights;
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
					fuzzyset.setFuzzyValue(rule.fire());
				}

			}
		}
	};
};

// Represents a AND expression of the form
// exp [AND exp]*
// Methods:
// fire() : returns the expression fuzzy value
var FuzzyRule = function () {
	"use strict";
	return {
		className : 'FuzzyRule',
		addExpr : function (expr) {
			//adds a list of fuzzysets that forms a AND expression
			//the list represents ORed AND expressions
			if (this.list === undefined) {
				this.list = [];
			}
			this.list.push(expr);
		},
		fire : function () {
			var i,
			j,
			n,
			m,
			min,
			max,
			set,
			fuzzyValue = 0;

			if (this.list === undefined) {
				return 0;
			}
			min = 1;
			max = 0;
			n = this.list.length;
			//loop through the or expressions and find the maximum fuzzy value from each and expression
			for (i = 0; i < n; i += 1) {
				m = this.list[i].length;
				min = 1;
				//loop through and expression to get it's min value
				for (j = 0; j < m; j += 1) {
					set = this.list[i][j];
					if (set !== undefined && set.className === 'FuzzySet' && set.value !== 'undefined') {
						fuzzyValue = set.getFuzzyValue();
						if (fuzzyValue < min) {
							min = fuzzyValue;
						}
					}
				}
				if (min > max) {
					max = min;
				}
			}
			return max;
		}
	};
};
