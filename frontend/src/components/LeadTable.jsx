import { Edit3, Trash2 } from 'lucide-react';

const formatDate = (date) =>
  new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date(date));

const previewNotes = (notes) => {
  if (!notes?.trim()) return 'No notes added';
  return notes.length > 44 ? `${notes.slice(0, 44)}...` : notes;
};

function LeadTable({ leads, loading, onAddLead, onEdit, onDelete }) {
  if (loading) {
    return <div className="empty-state">Loading leads...</div>;
  }

  if (!leads.length) {
    return (
      <div className="empty-state">
        <strong>No leads found</strong>
        <span>Add your first lead to start managing customers.</span>
        <button className="primary-button" type="button" onClick={onAddLead}>
          Add Lead
        </button>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Company</th>
            <th>Status</th>
            <th>Notes</th>
            <th>Created Date</th>
            <th aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead._id}>
              <td data-label="Name">{lead.name}</td>
              <td data-label="Email">{lead.email}</td>
              <td data-label="Phone">{lead.phone}</td>
              <td data-label="Company">{lead.company}</td>
              <td data-label="Status">
                <span className={`status-pill status-${lead.status.toLowerCase()}`}>{lead.status}</span>
              </td>
              <td data-label="Notes">
                <span className="notes-preview" title={lead.notes || 'No notes added'}>
                  {previewNotes(lead.notes)}
                </span>
              </td>
              <td data-label="Created Date">{formatDate(lead.createdAt)}</td>
              <td className="row-actions">
                <button className="icon-button" type="button" onClick={() => onEdit(lead)} aria-label={`Edit ${lead.name}`}>
                  <Edit3 size={17} />
                </button>
                <button
                  className="icon-button danger"
                  type="button"
                  onClick={() => onDelete(lead)}
                  aria-label={`Delete ${lead.name}`}
                >
                  <Trash2 size={17} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LeadTable;
