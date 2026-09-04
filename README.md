# Flux — Task Manager

A small full-stack task manager built to practice **manual deployment** on Ubuntu with Docker, Docker Compose, Nginx, Next.js, Django, and PostgreSQL.

The backend is intentionally simple. The frontend is a premium dark SaaS-style page with CSS animations, parallax, and micro-interactions.

---

## Architecture

```text
Browser
  ↓
Nginx :80          ← the only service published to the host
  ├─ /          → Next.js frontend :3000
  ├─ /api/      → Django REST API :8000
  ├─ /admin/    → Django admin :8000
  └─ /static/   → Django static files (WhiteNoise via backend)
        ↓
Django REST API
        ↓
PostgreSQL :5432   ← internal Docker network only
```

| Service    | Role |
|------------|------|
| **Nginx**  | Reverse proxy. The browser talks only to Nginx. |
| **frontend** | Next.js App Router UI on port 3000 inside the network. |
| **backend** | Django + Django REST Framework on port 8000 inside the network. |
| **db**     | PostgreSQL. Stores tasks. Not exposed to the host. |

### Docker networking

All four services join the default Compose network. They reach each other by **service name**:

- frontend → `frontend:3000`
- backend → `backend:8000`
- database → `db:5432`

Do **not** use `localhost` for communication between containers. `localhost` inside a container is that container itself, not your PC and not another service.

### Why PostgreSQL is not public

The database has **no** `ports:` mapping in `docker-compose.yml`. Only the backend can reach it on the internal network. That is the correct default for a server.

### Frontend ↔ Django

The browser calls `NEXT_PUBLIC_API_URL` (default `/api`).

1. The page runs `fetch('/api/tasks/')`.
2. Nginx matches `/api/` and proxies to `backend:8000`.
3. Django serves `/api/tasks/` through DRF.

The frontend never talks to PostgreSQL. Django does.

### Django ↔ PostgreSQL

Django reads `POSTGRES_HOST=db`, `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, and `POSTGRES_PORT` from the environment. It opens a TCP connection to `db:5432`.

### Volumes

`postgres_data` is a named Docker volume mounted at `/var/lib/postgresql/data`. Container rebuilds do not wipe the database.

---

## Project structure

```text
FDP-prod/
├── frontend/                 Next.js (JavaScript, App Router)
│   ├── app/
│   │   ├── components/       UI sections + CSS modules
│   │   ├── lib/api.js        Fetch helpers
│   │   ├── lib/motion.js     Reduced-motion / viewport helpers
│   │   ├── layout.jsx
│   │   ├── page.jsx
│   │   └── globals.css
│   ├── public/
│   ├── Dockerfile
│   └── package.json
├── backend/                  Django + DRF
│   ├── config/               Project settings and URLs
│   ├── tasks/                One app, one model, one API
│   ├── requirements.txt
│   ├── Dockerfile
│   └── entrypoint.sh
├── nginx/nginx.conf
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

---

## Environment variables

Copy the example file and edit values before starting:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

| Variable | Purpose |
|----------|---------|
| `POSTGRES_DB` | Database name |
| `POSTGRES_USER` | Database user |
| `POSTGRES_PASSWORD` | Database password — change this |
| `POSTGRES_HOST` | Hostname of the DB service (`db` in Docker) |
| `POSTGRES_PORT` | PostgreSQL port (`5432`) |
| `SECRET_KEY` | Django secret — change this |
| `DEBUG` | `False` for Docker / servers |
| `ALLOWED_HOSTS` | Hostnames Django will accept |
| `CSRF_TRUSTED_ORIGINS` | Origins for Django admin CSRF |
| `NEXT_PUBLIC_API_URL` | API prefix used by the browser (`/api`) |

Never commit `.env`. It is listed in `.gitignore`.

When you deploy to a real server, add the server IP or domain to `ALLOWED_HOSTS` and `CSRF_TRUSTED_ORIGINS`. Example:

```env
ALLOWED_HOSTS=localhost,127.0.0.1,192.168.1.10
CSRF_TRUSTED_ORIGINS=http://localhost,http://127.0.0.1,http://192.168.1.10
```

---

## Local startup (Docker)

From the project root:

```bash
docker compose build
docker compose up
```

Detached mode:

```bash
docker compose up -d
```

Open:

- App: [http://localhost](http://localhost)
- API: [http://localhost/api/tasks/](http://localhost/api/tasks/)
- Admin: [http://localhost/admin/](http://localhost/admin/)

Useful commands:

```bash
docker compose ps
docker compose logs
docker compose logs backend
docker compose logs frontend
docker compose logs nginx
docker compose down
```

The backend entrypoint waits for PostgreSQL, runs migrations, collects static files, then starts Gunicorn. You can still run migrations yourself:

```bash
docker compose exec backend python manage.py migrate
```

Create an admin user:

```bash
docker compose exec backend python manage.py createsuperuser
```

---

## API testing

List tasks:

```bash
curl http://localhost/api/tasks/
```

Create a task:

```bash
curl -X POST http://localhost/api/tasks/ ^
  -H "Content-Type: application/json" ^
  -d "{\"title\":\"Ship to Ubuntu\",\"description\":\"Practice Docker Compose\",\"completed\":false}"
```

On Linux / macOS:

```bash
curl -X POST http://localhost/api/tasks/ \
  -H "Content-Type: application/json" \
  -d '{"title":"Ship to Ubuntu","description":"Practice Docker Compose","completed":false}'
```

Update (complete) a task — replace `1` with a real id:

```bash
curl -X PATCH http://localhost/api/tasks/1/ \
  -H "Content-Type: application/json" \
  -d '{"completed":true}'
```

Delete a task:

```bash
curl -X DELETE http://localhost/api/tasks/1/
```

Single task:

```bash
curl http://localhost/api/tasks/1/
```

---

## Manual Ubuntu Deployment

This section is meant to be typed by hand. There is no deploy script, CI, Kubernetes, or SSL automation.

### Learning flow

```text
Local PC
  → GitHub
  → SSH
  → Ubuntu Server
  → git clone
  → .env
  → Docker
  → Docker Compose
  → Containers
  → Nginx
  → Next.js
  → Django
  → PostgreSQL
```

### 1. On your PC — put the project on GitHub

```bash
git init
git add .
git commit -m "Initial Flux task manager"
git branch -M main
git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
git push -u origin main
```

Do not push `.env`.

### 2. SSH into the Ubuntu server

```bash
ssh username@YOUR_SERVER_IP
```

### 3. Install Docker Engine and the Compose plugin

Follow Docker’s current Ubuntu instructions, then verify:

```bash
sudo docker version
sudo docker compose version
```

Add your user to the `docker` group if you do not want `sudo` on every command (then log out and back in):

```bash
sudo usermod -aG docker $USER
```

### 4. Open HTTP on the firewall (if UFW is enabled)

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw enable
sudo ufw status
```

### 5. Clone the repository

```bash
sudo apt update
sudo apt install -y git
git clone https://github.com/YOUR_USER/YOUR_REPO.git
cd YOUR_REPO
```

### 6. Create `.env` on the server

```bash
cp .env.example .env
nano .env
```

Change at least:

- `SECRET_KEY`
- `POSTGRES_PASSWORD`
- `ALLOWED_HOSTS` (include the server IP or domain)
- `CSRF_TRUSTED_ORIGINS` (include `http://YOUR_SERVER_IP`)

### 7. Build and start

```bash
docker compose build
docker compose up -d
docker compose ps
docker compose logs -f
```

Wait until backend logs show Gunicorn started and Nginx is running.

### 8. Confirm each layer

```bash
curl -I http://127.0.0.1/
curl http://127.0.0.1/api/tasks/
docker compose exec backend python manage.py showmigrations
```

Optional admin user:

```bash
docker compose exec backend python manage.py createsuperuser
```

### 9. Open the app from your browser

Visit `http://YOUR_SERVER_IP`.

If Django returns `DisallowedHost`, add that host to `ALLOWED_HOSTS` in `.env`, then:

```bash
docker compose up -d backend
```

### 10. Later updates

```bash
cd YOUR_REPO
git pull
docker compose build
docker compose up -d
```

Stop everything:

```bash
docker compose down
```

Stop and also delete the database volume (destroys data):

```bash
docker compose down -v
```

HTTPS / a domain / a host Nginx in front of this stack are separate manual steps. This project already includes containerized Nginx on port 80 so you can learn the proxy path first.

---

## Running pieces without Docker (optional)

Useful while developing on a laptop. PostgreSQL must still exist (Docker db only, or a local install).

Backend:

```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
pip install -r requirements.txt
# export / set the same variables as .env
python manage.py migrate
python manage.py runserver 0.0.0.0:8000
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

`npm run dev` serves the UI on port 3000. Set `NEXT_PUBLIC_API_URL=http://localhost:8000/api` **or** keep `/api` and call the API through Docker Nginx. The production path is always Nginx → `/api` → Django.

---

## REST API

| Method | Path | Action |
|--------|------|--------|
| GET | `/api/tasks/` | List |
| POST | `/api/tasks/` | Create |
| GET | `/api/tasks/<id>/` | Retrieve |
| PUT | `/api/tasks/<id>/` | Replace |
| PATCH | `/api/tasks/<id>/` | Partial update |
| DELETE | `/api/tasks/<id>/` | Delete |

Implemented with one model, one serializer, one viewset, and a DRF router.

---

## Animations (high level)

- Hero parallax layers (transform via `requestAnimationFrame`, no React state per scroll)
- Hero fade, gradient heading, floating cards, mouse spotlight
- Feature cards enter from left / bottom / right (`IntersectionObserver`)
- Statistics counters (DOM text, not React state)
- Vertical “How it works” timeline with a growing line
- Horizontal product timeline (vertical on mobile)
- Staggered showcase and task cards
- CTA background shift and shine button
- Input focus glow, checkbox, strike-through, delete exit
- Loading dots and floating empty state
- Nav underline and several distinct hover treatments

`prefers-reduced-motion` disables parallax, looping motion, and large transforms. Parallax is also skipped on small screens.

---

## Performance notes

- Animate `transform` and `opacity`, not layout properties
- Passive scroll listeners + `requestAnimationFrame`
- Scroll listeners attach only while a section is intersecting
- Reveal animations use one `IntersectionObserver` (no re-renders)
- `will-change` is not sprayed on every element
- CSS-generated decoration instead of image CDNs
