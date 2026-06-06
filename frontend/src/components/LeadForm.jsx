import { Save, X } from 'lucide-react';

function LeadForm({ form, statuses, editingLead, saving, onCancel, onChange, onSubmit }) {
  const updateField = (field, value) => {
    onChange({ ...form, [field]: value });
  };

  return (
    <section className="form-panel" aria-labelledby="lead-form-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{editingLead ? 'Edit lead' : 'New lead'}</p>
          <h2 id="lead-form-title">{editingLead ? editingLead.name : 'Add customer lead'}</h2>
        </div>
      </div>

      <form className="lead-form" onSubmit={onSubmit}>
        <label>
          <span>Name</span>
          <input
            type="text"
            required
            minLength="2"
            value={form.name}
            onChange={(event) => updateField('name', event.target.value)}
            placeholder="Aarav Sharma"
          />
        </label>

        <label>
          <span>Email</span>
          <input
            type="email"
            required
            value={form.email}
            onChange={(event) => updateField('email', event.target.value)}
            placeholder="aarav@company.com"
          />
        </label>

        <label>
          <span>Phone Number</span>
          <input
            type="tel"
            required
            value={form.phone}
            onChange={(event) => updateField('phone', event.target.value)}
            placeholder="+91 98765 43210"
          />
        </label>

        <label>
          <span>Company Name</span>
          <input
            type="text"
            required
            value={form.company}
            onChange={(event) => updateField('company', event.target.value)}
            placeholder="Bright Studio"
          />
        </label>

        <label>
          <span>Lead Status</span>
          <select value={form.status} onChange={(event) => updateField('status', event.target.value)}>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Notes</span>
          <textarea
            value={form.notes}
            onChange={(event) => updateField('notes', event.target.value)}
            placeholder="Follow-up context, requirements, budget, or next step"
            rows="5"
          />
        </label>

        <div className="form-actions">
          <button className="secondary-button" type="button" onClick={onCancel}>
            <X size={17} />
            Cancel
          </button>
          <button className="primary-button" type="submit" disabled={saving}>
            <Save size={17} />
            {saving ? 'Saving' : editingLead ? 'Update Lead' : 'Create Lead'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default LeadForm;
