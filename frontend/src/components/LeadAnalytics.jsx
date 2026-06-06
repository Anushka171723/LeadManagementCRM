import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { PieChart as PieChartIcon } from 'lucide-react';

const STATUS_COLORS = {
  New: '#2458a7',
  Contacted: '#c08403',
  Qualified: '#7c3aa2',
  Converted: '#06704f',
  Lost: '#9b2637'
};

const FUNNEL_STAGES = ['New', 'Contacted', 'Qualified', 'Converted'];

function LeadAnalytics({ loading, stats }) {
  const byStatus = stats.byStatus || {};
  const chartData = Object.keys(STATUS_COLORS).map((status) => ({
    status,
    count: byStatus[status] || 0,
    fill: STATUS_COLORS[status]
  }));
  const hasChartData = chartData.some((item) => item.count > 0);

  return (
    <section className="analytics-grid" aria-label="Lead analytics">
      <article className="analytics-card funnel-card">
        <div className="analytics-heading">
          <p className="eyebrow">Lead Conversion Funnel</p>
          <h2>New to converted pipeline</h2>
        </div>

        {loading ? (
          <div className="chart-skeleton" />
        ) : (
          <div className="funnel-steps">
            {FUNNEL_STAGES.map((stage, index) => (
              <div className="funnel-stage" key={stage}>
                <div className={`funnel-count status-${stage.toLowerCase()}`}>{byStatus[stage] || 0}</div>
                <span>{stage}</span>
                {index < FUNNEL_STAGES.length - 1 ? <div className="funnel-arrow" aria-hidden="true" /> : null}
              </div>
            ))}
          </div>
        )}
      </article>

      <article className="analytics-card chart-card">
        <div className="analytics-heading">
          <p className="eyebrow">Status Mix</p>
          <h2>Pie chart by status</h2>
        </div>

        {loading ? (
          <div className="chart-skeleton" />
        ) : hasChartData ? (
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={chartData} dataKey="count" nameKey="status" innerRadius={54} outerRadius={82} paddingAngle={2}>
                {chartData.map((entry) => (
                  <Cell fill={entry.fill} key={entry.status} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="chart-empty">
            <PieChartIcon size={30} />
            <span>No chart data yet</span>
          </div>
        )}
      </article>

      <article className="analytics-card chart-card">
        <div className="analytics-heading">
          <p className="eyebrow">Status Volume</p>
          <h2>Bar chart by status</h2>
        </div>

        {loading ? (
          <div className="chart-skeleton" />
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData} margin={{ top: 8, right: 6, bottom: 0, left: -24 }}>
              <XAxis dataKey="status" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {chartData.map((entry) => (
                  <Cell fill={entry.fill} key={entry.status} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </article>
    </section>
  );
}

export default LeadAnalytics;
