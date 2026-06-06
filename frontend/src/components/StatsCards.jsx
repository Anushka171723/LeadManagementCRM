import { BadgeCheck, CircleDollarSign, Contact, Target, UsersRound, XCircle } from 'lucide-react';

const ICONS = {
  Total: UsersRound,
  New: Contact,
  Contacted: Target,
  Qualified: BadgeCheck,
  Converted: CircleDollarSign,
  Lost: XCircle
};

function StatsCards({ activeStatus, loading, stats, statuses, onSelect }) {
  const cards = [
    { label: 'Total', value: stats.total || 0, filter: '' },
    ...statuses.map((status) => ({
      label: status,
      value: stats.byStatus?.[status] || 0,
      filter: status
    }))
  ];

  return (
    <section className="stats-grid" aria-label="Lead statistics">
      {cards.map((card) => {
        const Icon = ICONS[card.label];

        return (
          <button
            className={`stat-card status-card-${card.label.toLowerCase()} ${
              activeStatus === card.filter ? 'active' : ''
            }`}
            key={card.label}
            type="button"
            title={`Filter leads by ${card.label}`}
            onClick={() => onSelect(card.filter)}
          >
            <div className="stat-icon" aria-hidden="true">
              <Icon size={19} />
            </div>
            <div>
              <p>{card.label}</p>
              {loading ? <span className="skeleton stat-skeleton" /> : <strong>{card.value}</strong>}
            </div>
          </button>
        );
      })}
    </section>
  );
}

export default StatsCards;
