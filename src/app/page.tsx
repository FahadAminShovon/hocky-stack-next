import TableView from './TableView';
import { getDataAction } from './actions/get-data.action';
import { testColumn } from './test';

export default async function Home() {
  const { data } = await getDataAction();
  if (!data) {
    return <div> No data available</div>;
  }
  return (
    <TableView
      metricsList={data}
      columns={testColumn}
      defaultSortBy="totalVisitorCount"
    />
  );
}
