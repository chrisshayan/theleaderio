import {arraySum} from '/imports/utils/index';

/**
 * Function calculate mean of Normal Distribution
 * @param data
 * @return {number}
 */
export const normalDistributionMean = ({data}) => {
  check(data, Array);

  const
    count = data.length,
    sum = arraySum(data),
    mean = arraySum(data) / data.length
  ;

  return {
    count,
    sum,
    mean
  };
};

export const normalDistribution = ({data}) => {
  check(data, Array);

  const
    {count, sum, mean} = normalDistributionMean({data})
    ;
  let
    differences = [],
    sumOfDifferences = 0,
    variance = 0,
    standardDeviation = 0
    ;

  data.map(num => {
    differences.push(Math.pow(num - mean, 2));
  });

  sumOfDifferences = arraySum(differences);
  variance = sumOfDifferences / count;
  standardDeviation = Math.sqrt(variance);

  // console.log({differences, sumOfDifferences, variance, standardDeviation});

  return {
    mean,
    standardDeviation: standardDeviation === 0 ? 1 : standardDeviation
  };
};