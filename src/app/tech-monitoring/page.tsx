import { MonitoringPage } from '@/components/monitoring/MonitoringPage';
import { getMonitoringItems } from '@/lib/monitoring/rss';

export const revalidate = 3600;

export default async function TechMonitoringPage() {
  return <MonitoringPage items={await getMonitoringItems()} />;
}
