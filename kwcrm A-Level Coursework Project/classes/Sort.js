

function Sort (){}

const _comparisonOperator = Symbol('comparisonOperator');


// private funtion used so that dynamic comparisons can be made 
// params should take a < or > type string in the comparissonOp
// value1 and value2 should be the two values that are going to be compared.
Sort[_comparisonOperator] = (comparisonOp, value1, value2) => {
    if(comparisonOp === "<"){ return value1 < value2 }
    if(comparisonOp === ">"){ return value1 > value2 }
};

// these methods can be considered an imitation of static methods

// sorts the array in ascending or descending order
// depending on if the ascending variable is set to true
// or false, and returns the sorted array
// THE ASCENDING PARAMETER COULD BE CONSIDERED POLYMORPHISM AS THE METHODS FUNCTIONALITY DIFFERS DEPENDENT ON
// WHETHER THE ARGUMENT PASSED SETS IT TO FALSE OR IS LEFT ALONE/ SET TO TRUE
Sort.bubbleSort = (array, ascending) => {

    if (ascending === undefined) ascending = true;
    // if no ascending argument is passed, method sorts array in ascending order

    let n = array.length;
    let sorted = false;
    let temp = 0;
    let comparisonOp = "";

    if (ascending) comparisonOp = ">";
    if (!ascending) comparisonOp = "<";

        while(!sorted){

            sorted = true;
            for(let i = 0; i < n; i++){

                // if(array[i] > array[i+1]) is for ascending

                // uses the comparisonOperator method to make this
                // method dynamic in sorting both ascending and descending
                if (Sort[_comparisonOperator](comparisonOp,
                    array[i], array[i+1])) {

                    temp = array[i];
                    array[i] = array[i+1];
                    array[i+1] = temp;
                    sorted = false;
                }
            }
        }

    return array;
};

// works by comparing a set lot of columns from different
// records against each other. Swaps the records if the condition
// for a swap to be made is met (condition is determined by the boolean
// argument "ascending")
// column to sort by should be type number
// ascending should be boolean or not entered
Sort.bubbleSort2D = (array2D, columnToSortBy, ascending) => {

    if (ascending === undefined) ascending = true;
    // if no ascending argument is passed, method sorts array in ascending order

    let n = array2D.length;
    let sorted = false;
    let temp = [];
    let comparisonOp = "";

    if (ascending) comparisonOp = ">";
    if (!ascending) comparisonOp = "<";


    while(!sorted){
        sorted = true;
        for(let i = 0; i < n -1 ; i++){

            // if(array[i] > array[i+1]) is for ascending

            // uses the comparisonOperator method to make this
            // method dynamic in sorting both ascending and descending
            if (Sort[_comparisonOperator](comparisonOp,
                array2D[i][columnToSortBy], array2D[i+1][columnToSortBy])) {


                temp = array2D[i];
                array2D[i] = array2D[i+1];
                array2D[i+1] = temp;
                sorted = false;


            }
        }
    }

    return array2D;
};



module.exports = Sort;


