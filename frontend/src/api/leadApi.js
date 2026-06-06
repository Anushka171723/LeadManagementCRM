const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const handleResponse = async (response) => {
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || 'Something went wrong');
  }

  return payload;
};

export const getLeads = (params) => {
  const query = new URLSearchParams(params);
  return fetch(`${API_BASE_URL}/leads?${query.toString()}`).then(handleResponse);
};

export const getLeadStats = () => fetch(`${API_BASE_URL}/leads/stats`).then(handleResponse);

export const createLead = (lead) =>
  fetch(`${API_BASE_URL}/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lead)
  }).then(handleResponse);

export const updateLead = (id, lead) =>
  fetch(`${API_BASE_URL}/leads/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lead)
  }).then(handleResponse);

export const deleteLead = (id) =>
  fetch(`${API_BASE_URL}/leads/${id}`, {
    method: 'DELETE'
  }).then(handleResponse);
