# Phase 2 — Pizza & Category Module

Adds the pizza catalog on top of the Phase 1 auth foundation. No existing files
were changed — only new classes were added to the existing packages.

## New files

```
entity/        PizzaSize.java, Category.java, Pizza.java
repository/     CategoryRepository.java, PizzaRepository.java
dto/request/    CategoryRequest.java, PizzaRequest.java
dto/response/   CategoryResponse.java, PizzaResponse.java, PageResponse.java
mapper/         CategoryMapper.java, PizzaMapper.java
service/        CategoryService.java, PizzaService.java
service/impl/   CategoryServiceImpl.java, PizzaServiceImpl.java
controller/     CategoryController.java, PizzaController.java
```

## Authorization model

- **Read endpoints** (`GET`) require any authenticated user (per the existing
  `.anyRequest().authenticated()` rule in `SecurityConfig`).
- **Write endpoints** (`POST`/`PUT`/`DELETE`) are restricted to `ADMIN` via
  `@PreAuthorize("hasRole('ADMIN')")` (method security is already enabled).

> Want the menu browsable **without** login? Add this one line to
> `SecurityConfig.securityFilterChain(...)`, just above the `anyRequest()` rule:
> ```java
> .requestMatchers(HttpMethod.GET, "/api/v1/pizzas/**", "/api/v1/categories/**").permitAll()
> ```

## Category APIs

| Method | Path                      | Access  |
|--------|---------------------------|---------|
| POST   | `/api/v1/categories`      | ADMIN   |
| GET    | `/api/v1/categories`      | Auth    |
| GET    | `/api/v1/categories/{id}` | Auth    |
| PUT    | `/api/v1/categories/{id}` | ADMIN   |
| DELETE | `/api/v1/categories/{id}` | ADMIN   |

## Pizza APIs

| Method | Path                      | Access  |
|--------|---------------------------|---------|
| POST   | `/api/v1/pizzas`          | ADMIN   |
| GET    | `/api/v1/pizzas`          | Auth (paginated) |
| GET    | `/api/v1/pizzas/{id}`     | Auth    |
| GET    | `/api/v1/pizzas/search`   | Auth (filter + paginate + sort) |
| PUT    | `/api/v1/pizzas/{id}`     | ADMIN   |
| DELETE | `/api/v1/pizzas/{id}`     | ADMIN   |

## Quick walkthrough (replace <ADMIN_JWT> with the token from logging in as admin)

Login as the seeded admin:
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@smartpizza.ai","password":"admin123"}'
```

Create a category:
```bash
curl -X POST http://localhost:8080/api/v1/categories \
  -H "Authorization: Bearer <ADMIN_JWT>" -H "Content-Type: application/json" \
  -d '{"name":"Classic","description":"Timeless favourites","active":true}'
```

Create a pizza (categoryId from the response above):
```bash
curl -X POST http://localhost:8080/api/v1/pizzas \
  -H "Authorization: Bearer <ADMIN_JWT>" -H "Content-Type: application/json" \
  -d '{"name":"Margherita","description":"Tomato, mozzarella, basil","price":299.00,"size":"MEDIUM","veg":true,"categoryId":1,"available":true}'
```

## Advanced search examples

All query params are optional and combinable. Pagination/sorting via `page`, `size`, `sort`.

```
# search by name
GET /api/v1/pizzas/search?name=marg

# veg pizzas under 400, cheapest first
GET /api/v1/pizzas/search?veg=true&maxPrice=400&sort=price,asc

# a category, price band, page 2, 5 per page
GET /api/v1/pizzas/search?categoryId=1&minPrice=200&maxPrice=600&page=1&size=5
```

Every paginated response is wrapped as:
```json
{
  "content": [ /* pizzas */ ],
  "page": 0, "size": 10,
  "totalElements": 23, "totalPages": 3,
  "first": true, "last": false
}
```

## Notes / design choices

- **Price** is `BigDecimal` (never use `double` for money).
- **Size** is a `PizzaSize` enum stored as a string.
- **One dynamic query** powers all of search/filter via null-skipping `WHERE` clauses,
  which keeps the repository simple and easy to explain.
- Deleting a category that still has pizzas is blocked with a clear `400` message
  rather than letting the DB throw a foreign-key error.
