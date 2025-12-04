.PHONY: dev prod down clean logs restart db-reset

# Development
dev:
	@cp -n .env.example .env 2>/dev/null || true
	docker-compose up --build

dev-d:
	@cp -n .env.example .env 2>/dev/null || true
	docker-compose up --build -d

# Production
prod:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d

# Stop containers
down:
	docker-compose down

# Clean everything
clean:
	docker-compose down -v --rmi local
	docker system prune -f

# View logs
logs:
	docker-compose logs -f

logs-backend:
	docker-compose logs -f backend

logs-frontend:
	docker-compose logs -f frontend

# Restart services
restart:
	docker-compose restart

restart-backend:
	docker-compose restart backend

restart-frontend:
	docker-compose restart frontend

# Database
db-reset:
	docker-compose exec backend npx prisma migrate reset --force

db-migrate:
	docker-compose exec backend npx prisma migrate dev

db-studio:
	docker-compose exec backend npx prisma studio

# Shell access
shell-backend:
	docker-compose exec backend sh

shell-frontend:
	docker-compose exec frontend sh

shell-db:
	docker-compose exec postgres psql -U notion_user -d notion_trello
