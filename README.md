# Lead Management CRM

A full-stack CRM for managing small-business leads. It supports lead creation, dashboard viewing, editing, deletion, search, status filtering, sorting, pagination, and lead statistics.

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express.js
- Database: MongoDB + Mongoose
- UI: Responsive CSS with Lucide icons

## Features

- Add new leads/customers
- View all leads in a dashboard
- Edit lead details
- Update lead status: New, Contacted, Qualified, Converted, Lost
- Delete leads
- Search by name, email, or company
- Filter by status
- Sort by created date, name, company, or status
- Pagination
- Lead statistics dashboard
- Responsive desktop and mobile layout

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/leads` | Create a lead |
| GET | `/api/leads` | Get leads with search, filter, pagination, and sorting |
| GET | `/api/leads/stats` | Get lead statistics |
| PUT | `/api/leads/:id` | Update a lead |
| DELETE | `/api/leads/:id` | Delete a lead |

Example query:

```txt
GET /api/leads?search=studio&status=New&page=1&limit=8&sort=createdAt&order=desc
```

## Environment Variables

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## Local Setup

Install dependencies:

```bash
npm install
npm run install:all
```

Run the backend and frontend together:

```bash
npm run dev
```

Or run them separately:

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

Backend runs on:

```txt
http://localhost:5000
```

If those ports are already occupied, change `PORT`, `CLIENT_URL`, and `VITE_API_URL` in the `.env` files. In this workspace the local files are configured for frontend `http://localhost:5174` and backend `http://localhost:5050`.

## Deployment

Recommended:

- Frontend: Vercel
- Backend: Render or Railway
- Database: MongoDB Atlas

After deployment, update:

- `CLIENT_URL` in backend environment variables to the deployed frontend URL
- `VITE_API_URL` in frontend environment variables to the deployed backend API URL

## Submission

Submit:

- GitHub repository link
- Live demo link
- README with setup instructions
