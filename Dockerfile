# Stage 1: Build frontend
FROM node:20 AS frontend
WORKDIR /app

COPY package.json package-lock.json vite.config.js index.html ./
COPY src ./src

RUN npm install
RUN npm run build

# Stage 2: Build backend container
FROM python:3.13-slim
WORKDIR /app/backend          # Changed to backend folder

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ .              # Copy contents into WORKDIR

# Copy frontend build
COPY --from=frontend /app/dist ./static

RUN touch __init__.py         # optional if you want to keep package-style imports

ENV PORT=8080
EXPOSE 8080

# Start backend
CMD uvicorn main:app --host 0.0.0.0 --port $PORT
