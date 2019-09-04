
// declaring the symbols so that I can imitate private variables and methods
// will prevent the methods and variables appearing as suggestions when I type 'Analytics.'
// will only show when I type 'Analytics[_' this will make the class easier to use else where when
// an instance of this class is made and help ensure that everything works as intended
const _greatestCommonDivisor = Symbol('greatestCommonDivisor');
const _getConversionRateRatioAsString = Symbol('getConversionRateRatioAsString');
const _getConversionRatePercentageAsString = Symbol('getConversionRatePercentageAsString');

// The class that will be used to create a conversion rate
class ConversionRate {

    // uses A RECURSIVE ALGORITHM to find the greatest common divisor
    // uses the basis of the Euclidean algorithm
    static [_greatestCommonDivisor] (valueOne, valueTwo)  {
        let remainder;
        if (!valueTwo) { // conditional gets met when valueTwo ('remainder' after first call) == 0 (terminating condition)
            return valueOne; // valueOne is now our greatest common divisor
        }
        remainder = valueOne % valueTwo; // calculates the remainder
        // calls its self again with the valueOne parameter passing in the valueTwo as an argument
        // and in the place of the valueTwo parameter the remainder is passed as an argument
        return this[_greatestCommonDivisor](valueTwo, remainder);
    };


    // method outputs a ratio as type string of the conversion rate
    static [_getConversionRateRatioAsString] (numberOfClientsGained, numberOfLeadsLost) {

        // if both the numberOfClientsGained and the numberOfLeadsLost  is == 0,
        // output a dash so that the output is not 'NaN : NaN'
        if (numberOfClientsGained === 0 && numberOfLeadsLost === 0) {
            return '-'
        }
        // stores the greatest common divisor in the gcd variable so that the ratio can be
        // shown in it's lowest form
        let gcd = this[_greatestCommonDivisor](numberOfClientsGained, numberOfLeadsLost);
        // the ratio values are calculated by dividing the inputs by the greatest common divisor
        // the output is a string such as "2:3" if the inputs for example were 20 and 30
        return `${numberOfClientsGained/gcd} : ${numberOfLeadsLost/gcd}`;
    }

    // method outputs a percentage value as type string of the conversion rate
    static [_getConversionRatePercentageAsString](numberOfClientsGained, numberOfLeadsLost){
        // if both the numberOfClientsGained and the numberOfLeadsLost  is == 0,
        // output a dash so that the output is not 'NaN%'
        if (numberOfClientsGained === 0 && numberOfLeadsLost === 0) {
            return '-'
        }
        // total is calculated to get a divisor
        let total  = numberOfClientsGained + numberOfLeadsLost;
        // percentage is calculated by dividing the numberOfClients gained by the total variable
        // then multiplying by 100 to get the number as a value between 0 and 100
        // Math.floor() method is used to truncate the value or any decimal values it may have
        let percentage = Math.floor((numberOfClientsGained / total) * 100);
        // the return is the percentage
        return `${percentage}%`
    }





    // public static method that can be called anywhere without instantiating the class
    // used to get an object containing the conversion rate as a ratio and as a
    // percentage. arguments passed should be of type number
    static conversionRate (numberOfClientsGained, numberOfLeadsLost) {

        let conversionRateRatio = this[_getConversionRateRatioAsString](numberOfClientsGained, numberOfLeadsLost);
        let conversionRatePercentage = this[_getConversionRatePercentageAsString](numberOfClientsGained, numberOfLeadsLost);


        return {
            ratio: conversionRateRatio,
            percentage: conversionRatePercentage
        }
    }
}

module.exports = ConversionRate;


