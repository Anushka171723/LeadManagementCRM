import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowDownAZ,
  ArrowUpAZ,
  CheckCircle2,
  Plus,
  RefreshCcw,
  Search,
  SlidersHorizontal,
  X
} from 'lucide-react';
import {
  createLead,
  deleteLead,
  getLeadStats,
  getLeads,
  updateLead
} from './api/leadApi.js';
import LeadForm from './components/LeadForm.jsx';
import LeadAnalytics from './components/LeadAnalytics.jsx';
import LeadTable from './components/LeadTable.jsx';
import RecentActivity from './components/RecentActivity.jsx';
import StatsCards from './components/StatsCards.jsx';

const STATUSES = ['New', 'Contacted', 'Qualified', 'Converted', 'Lost'];
const emptyForm = {
  name: '',
  email: '',
  phone: '',
  company: '',
  status: 'New',
  notes: ''
};

function App() {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState({ total: 0, byStatus: {} });
  const [form, setForm] = useState(emptyForm);
  const [editingLead, setEditingLead] = useState(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, totalPages: 1, page: 1, limit: 8 });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [activities, setActivities] = useState([]);

  const query = useMemo(
    () => ({
      search,
      status,
      sort,
      order,
      page: String(page),
      limit: '8'
    }),
    [search, status, sort, order, page]
  );

  const loadLeads = async () => {
    setLoading(true);
    setError('');

    try {
      const [leadResponse, statsResponse] = await Promise.all([getLeads(query), getLeadStats()]);
      setLeads(leadResponse.data);
      setMeta(leadResponse.meta);
      setStats(statsResponse.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, [query]);

  const showToast = (message) => {
    const id = Date.now();
    setToasts((current) => [...current, { id, message }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 2600);
  };

  const addActivity = (message, detail = '') => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setActivities((current) => [{ id, message, detail, time: new Date().toISOString() }, ...current].slice(0, 6));
  };

  const openCreateDrawer = () => {
    setEditingLead(null);
    setForm(emptyForm);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setEditingLead(null);
    setForm(emptyForm);
    setIsDrawerOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (editingLead) {
        const response = await updateLead(editingLead._id, form);
        if (editingLead.status !== form.status) {
          addActivity(`Status changed: ${editingLead.status} -> ${form.status}`, response.data.name);
        } else {
          addActivity(`Lead updated: ${response.data.name}`, response.data.company);
        }
        showToast('Lead updated');
      } else {
        const response = await createLead(form);
        addActivity(`Lead added: ${response.data.name}`, response.data.company);
        showToast('Lead created');
      }

      setForm(emptyForm);
      setEditingLead(null);
      setIsDrawerOpen(false);
      setPage(1);
      await loadLeads();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (lead) => {
    setEditingLead(lead);
    setForm({
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      status: lead.status,
      notes: lead.notes || ''
    });
    setIsDrawerOpen(true);
  };

  const handleDelete = async (lead) => {
    const confirmed = window.confirm(`Delete ${lead.name} from leads?`);
    if (!confirmed) return;

    try {
      await deleteLead(lead._id);
      addActivity(`Lead deleted: ${lead.name}`, lead.company);
      showToast('Lead deleted');
      await loadLeads();
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleOrder = () => {
    setOrder((current) => (current === 'asc' ? 'desc' : 'asc'));
  };

  const handleStatusSelect = (selectedStatus) => {
    setStatus(selectedStatus);
    setPage(1);
  };

  return (
    <main className="app-shell">
      <section className="hero-band">
        <div>
          <p className="eyebrow">Lead Management CRM</p>
          <h1>Manage small-business leads from first contact to conversion.</h1>
        </div>
        <div className="hero-actions">
          <button className="secondary-button hero-button" type="button" onClick={loadLeads}>
            <RefreshCcw size={17} />
            Refresh
          </button>
          <button className="primary-button hero-button" type="button" onClick={openCreateDrawer}>
            <Plus size={17} />
            Add Lead
          </button>
        </div>
      </section>

      <StatsCards
        activeStatus={status}
        loading={loading}
        stats={stats}
        statuses={STATUSES}
        onSelect={handleStatusSelect}
      />

      <LeadAnalytics loading={loading} stats={stats} />

      <RecentActivity activities={activities} leads={leads} />

      {error ? (
        <div className="alert" role="alert">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      ) : null}

      <section className="lead-panel">
        <div className="toolbar">
          <label className="search-field">
            <Search size={18} />
            <input
              type="search"
              placeholder="Search name, email, or company"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />
          </label>

          <label className="select-field">
            <SlidersHorizontal size={18} />
            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setPage(1);
              }}
            >
              <option value="">All statuses</option>
              {STATUSES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <select className="compact-select" value={sort} onChange={(event) => setSort(event.target.value)}>
            <option value="createdAt">Created date</option>
            <option value="name">Name</option>
            <option value="company">Company</option>
            <option value="status">Status</option>
          </select>

          <button className="icon-button" type="button" onClick={toggleOrder} aria-label="Toggle sort direction">
            {order === 'asc' ? <ArrowUpAZ size={18} /> : <ArrowDownAZ size={18} />}
          </button>

          <button className="primary-button toolbar-add" type="button" onClick={openCreateDrawer}>
            <Plus size={17} />
            Add Lead
          </button>
        </div>

        <LeadTable
          leads={leads}
          loading={loading}
          onAddLead={openCreateDrawer}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <div className="pagination">
          <span>
            Page {meta.page} of {meta.totalPages} | {meta.total} leads
          </span>
          <div className="pagination-actions">
            <button type="button" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>
              Previous
            </button>
            <button
              type="button"
              disabled={page >= meta.totalPages}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </section>

      <button className="floating-add" type="button" aria-label="Add lead" onClick={openCreateDrawer}>
        <Plus size={22} />
      </button>

      {isDrawerOpen ? (
        <div className="drawer-overlay" role="presentation" onMouseDown={closeDrawer}>
          <aside className="drawer" aria-label="Lead form" onMouseDown={(event) => event.stopPropagation()}>
            <button className="icon-button drawer-close" type="button" onClick={closeDrawer} aria-label="Close form">
              <X size={18} />
            </button>
            <LeadForm
              form={form}
              statuses={STATUSES}
              editingLead={editingLead}
              saving={saving}
              onCancel={closeDrawer}
              onChange={setForm}
              onSubmit={handleSubmit}
            />
          </aside>
        </div>
      ) : null}

      <div className="toast-stack" aria-live="polite" aria-atomic="true">
        {toasts.map((toast) => (
          <div className="toast" key={toast.id}>
            <CheckCircle2 size={18} />
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </main>
  );
}

export default App;
