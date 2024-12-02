import data from '@/app/data/pages.json';
import { z } from 'zod';

const websiteMetricsSchema = z.object({
  url: z.string(),
  totalCount: z.number(),
  totalVisitorCount: z.number(),
  bounceCount: z.number(),
  startsWithCount: z.number(),
  endsWithCount: z.number(),
  avgScrollPercentage: z.number().min(0).max(100),
  totalPageviewCount: z.number(),
});

type Metrics = z.infer<typeof websiteMetricsSchema>;

async function getDataAction() {
  const parsedData = z.array(websiteMetricsSchema).safeParse(data);
  if (parsedData.success) {
    return {
      data: parsedData.data,
      message: 'Data fetched successfully',
    };
  }
  throw new Error('Data fetch failed');
}

export { getDataAction };

export type { Metrics };
