import data from '@/app/data/pages.json';
import { z } from 'zod';
import { calculateScore } from '../utils';

const websiteMetricsSchemaWithScore = z.object({
  url: z.string(),
  totalCount: z.number(),
  totalVisitorCount: z.number(),
  bounceCount: z.number(),
  startsWithCount: z.number(),
  endsWithCount: z.number(),
  avgScrollPercentage: z.number().min(0).max(100),
  totalPageviewCount: z.number(),
  score: z.number(),
});

const websiteMetricsSchema = websiteMetricsSchemaWithScore.omit({
  score: true,
});

type Metrics = z.infer<typeof websiteMetricsSchemaWithScore>;
type MetricsWithoutScore = z.infer<typeof websiteMetricsSchema>;

async function getDataAction() {
  const parsedData = z.array(websiteMetricsSchema).safeParse(data);
  if (parsedData.success) {
    const dataWithScore = parsedData.data.map((metrics) => ({
      ...metrics,
      score: calculateScore(metrics),
    }));
    return {
      data: dataWithScore,
      message: 'Data fetched successfully',
    };
  }
  throw new Error('Data fetch failed');
}

export { getDataAction };

export type { Metrics, MetricsWithoutScore };
