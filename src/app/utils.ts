import type { MetricsWithoutScore } from './actions/get-data.action';

function calculateScore(metrics: MetricsWithoutScore): number {
  // Define the weights for each metric (adjust as needed)
  const weights = {
    totalCount: 0.15,
    totalVisitorCount: 0.2,
    bounceCount: -0.1, // Negative because higher bounce count is less desirable
    startsWithCount: 0.1,
    endsWithCount: 0.25,
    avgScrollPercentage: 0.15,
    totalPageviewCount: 0.15,
  };

  // Max values for normalization (can be adjusted based on your data's range)
  const maxValues = {
    totalCount: 1000, // Example: max number of total interactions
    totalVisitorCount: 500, // Example: max number of unique visitors
    bounceCount: 100, // Example: max bounce count
    startsWithCount: 1000, // Max starts
    endsWithCount: 1000, // Max ends
    avgScrollPercentage: 100, // Max scroll percentage (0-100)
    totalPageviewCount: 1000, // Example: max total pageviews
  };

  // Normalize function to scale each value to a 0-1 range
  function normalize(value: number, maxValue: number): number {
    return Math.min(value / maxValue, 1); // Scale value to a 0-1 range
  }

  // Normalize each metric
  const normalizedMetrics = {
    totalCount: normalize(metrics.totalCount, maxValues.totalCount),
    totalVisitorCount: normalize(
      metrics.totalVisitorCount,
      maxValues.totalVisitorCount,
    ),
    bounceCount: normalize(metrics.bounceCount, maxValues.bounceCount),
    startsWithCount: normalize(
      metrics.startsWithCount,
      maxValues.startsWithCount,
    ),
    endsWithCount: normalize(metrics.endsWithCount, maxValues.endsWithCount),
    avgScrollPercentage: normalize(
      metrics.avgScrollPercentage,
      maxValues.avgScrollPercentage,
    ),
    totalPageviewCount: normalize(
      metrics.totalPageviewCount,
      maxValues.totalPageviewCount,
    ),
  };

  // Calculate the weighted score
  let score = 0;
  for (const key in weights) {
    if (weights.hasOwnProperty(key)) {
      score +=
        normalizedMetrics[key as keyof typeof normalizedMetrics] *
        weights[key as keyof typeof weights];
    }
  }

  return Math.round(score * 100) / 100;
}

export { calculateScore };
