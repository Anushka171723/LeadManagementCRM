import { Clock3 } from 'lucide-react';

const formatTime = (date) =>
  new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));

function RecentActivity({ activities, leads }) {
  const leadFallback = [...leads]
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
    .slice(0, 4)
    .map((lead) => ({
      id: lead._id,
      message: `Lead added: ${lead.name}`,
      detail: `${lead.company} | ${lead.status}`,
      time: lead.createdAt
    }));

  const items = [...activities, ...leadFallback].slice(0, 4);

  return (
    <article className="activity-card" aria-labelledby="recent-activity-title">
      <div className="analytics-heading">
        <p className="eyebrow">Recent Activity</p>
        <h2 id="recent-activity-title">Latest CRM updates</h2>
      </div>

      {items.length ? (
        <ul className="activity-list">
          {items.map((item) => (
            <li key={item.id}>
              <span className="activity-dot" aria-hidden="true" />
              <div>
                <strong>{item.message}</strong>
                <span>{item.detail || formatTime(item.time)}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="activity-empty">
          <Clock3 size={24} />
          <span>No recent activity yet</span>
        </div>
      )}
    </article>
  );
}

export default RecentActivity;
