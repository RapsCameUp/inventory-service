# Inventory Service

Inventory management microservice handling stock queries and reservations.

## Endpoints

- `GET /health` - Health check
- `GET /inventory/:sku` - Get stock level
- `POST /inventory/reserve` - Reserve stock
- `POST /inventory/release` - Release reservation

## Run

```bash
npm install
npm start
```
