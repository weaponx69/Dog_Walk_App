# Deploying DogGo to AWS EC2

This guide outlines the steps to deploy the DogGo application (Django backend + Vite/React frontend + PostgreSQL/PostGIS) to an Amazon EC2 instance.

## Prerequisites
- An AWS Account
- An EC2 Instance running Ubuntu 22.04 LTS (t3.small or larger recommended due to PostGIS and build requirements)
- A domain name (optional but recommended for SSL/TLS)

## 1. Initial EC2 Setup

1. SSH into your EC2 instance.
2. Update system packages:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```
3. Install Docker and Docker Compose:
   ```bash
   sudo apt install docker.io docker-compose -y
   sudo usermod -aG docker ubuntu
   ```
   *(You may need to log out and back in for the group change to take effect).*

## 2. Clone the Repository
1. Generate an SSH key on your EC2 instance and add it to your GitHub/GitLab repository.
2. Clone your repository:
   ```bash
   git clone git@github.com:yourusername/dog_walk_app.git
   cd dog_walk_app
   ```

## 3. Environment Variables
1. Create a `.env` file in the root directory and add production secrets:
   ```env
   # .env
   DEBUG=0
   SECRET_KEY=your_secure_random_secret_key
   DATABASE_URL=postgis://postgres:your_db_password@db:5432/dog_walk
   REDIS_URL=redis://redis:6379/0
   STRIPE_SECRET_KEY=sk_live_...
   AWS_ACCESS_KEY_ID=your_aws_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret
   AWS_STORAGE_BUCKET_NAME=your-doggo-bucket
   
   # Frontend
   VITE_API_URL=https://api.yourdomain.com
   ```

## 4. Production Docker Compose (`docker-compose.prod.yml`)
Create a production docker-compose file that disables host port binding for internal services and utilizes Nginx for serving.

```yaml
version: '3.8'

services:
  db:
    image: postgis/postgis:15-3.3
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_DB=dog_walk
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=your_db_password
    restart: always

  redis:
    image: redis:alpine
    restart: always

  backend:
    build: ./backend
    command: gunicorn dog_walk_backend.asgi:application -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000
    volumes:
      - ./backend:/app
    environment:
      - DATABASE_URL=postgis://postgres:your_db_password@db:5432/dog_walk
      - REDIS_URL=redis://redis:6379/0
      - DEBUG=0
    depends_on:
      - db
      - redis
    restart: always

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod # You should create a multi-stage build for production that serves static files
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: always

volumes:
  postgres_data:
```

## 5. Build and Run
1. Start the services:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d --build
   ```
2. Run database migrations:
   ```bash
   docker-compose -f docker-compose.prod.yml exec backend python manage.py migrate
   ```
3. Collect static files:
   ```bash
   docker-compose -f docker-compose.prod.yml exec backend python manage.py collectstatic --no-input
   ```

## 6. Nginx & SSL (Optional but Highly Recommended)
1. Install Nginx on the host EC2 instance.
2. Install Certbot: `sudo apt install certbot python3-certbot-nginx`
3. Configure Nginx to reverse proxy to your `frontend` container for `/` and your `backend` container for `/api` and `/ws` (WebSockets).
4. Run `sudo certbot --nginx` to acquire an SSL certificate.

## 7. Scaling Considerations
- For high traffic, move the database to **Amazon RDS for PostgreSQL (with PostGIS enabled)** instead of running it in a Docker container on the same EC2 instance.
- Move Redis to **Amazon ElastiCache**.
- Configure Django to use **Amazon S3** via `django-storages` for all user-uploaded photos.
