# GraphQL API

A full-featured GraphQL API built with Node.js, Express, TypeORM, and PostgreSQL. This project provides a complete backend solution for managing users, posts, and comments with GraphQL queries and mutations.

## 🚀 Features
- **GraphQL API** with queries and mutations
- **TypeORM** for database management
- **PostgreSQL** database with Docker support
- **TypeScript** for type safety
- **Database migrations** for version control
- **Database seeding** for initial data
- **JWT authentication** with rotating refresh tokens and reuse detection
- **Role-based authorization** (USER / ADMIN) and ownership checks
- **BCrypt** for password hashing
- **Class Validator** for DTO validation

## 📋 Prerequisites

Before running this project, make sure you have installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [Yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/) and Docker Compose
- [PostgreSQL](https://www.postgresql.org/) (if not using Docker)

## 🛠️ Technologies

- **Node.js** with **Express**
- **GraphQL** served with [graphql-http](https://github.com/graphql/graphql-http) (GraphQL-over-HTTP spec compliant)
- **TypeScript**
- **TypeORM** - Database ORM
- **PostgreSQL** - Database
- **Docker** - Containerization
- **BCrypt** - Password hashing
- **Class Validator** - Input validation

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ws-graphql-api
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   DB_NAME=your_database
   JWT_ACCESS_SECRET=a_long_random_string
   JWT_ACCESS_EXPIRES_IN=15m
   REFRESH_TOKEN_TTL_DAYS=7
   ```

   Generate a secret with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`.

4. **Start PostgreSQL with Docker**
   ```bash
   docker-compose up -d
   ```

5. **Run database migrations**
   ```bash
   yarn migration:run
   ```

6. **Seed the database** (optional)
   ```bash
   yarn seed
   ```

   Seeded users all have password `123456`; `admin@example.com` has the ADMIN role.

## 🚀 Running the Application

### Development Mode
```bash
yarn dev
```

The server will start at `http://localhost:3000` (or your configured PORT).

### GraphQL Playground

Open `http://localhost:3000/graphql` in a browser to use GraphiQL (served only when `NODE_ENV` is not `production`). API clients send `POST` (or `GET ?query=`) requests to the same URL.

## 📂 Project Structure

```
src/
├── app.ts                  # Express application setup
├── server.ts               # Server entry point
├── config/
│   └── data-source.ts      # TypeORM configuration
├── db/
│   ├── run-seed.ts         # Seed runner
│   └── seed.ts             # Database seeding logic
├── dto/
│   ├── CreateCommentDTO.ts # Comment data transfer object
│   ├── CreatePostDTO.ts    # Post data transfer object
│   └── CreateUserDTO.ts    # User data transfer object
├── entities/
│   ├── Comment.ts          # Comment entity
│   ├── Post.ts             # Post entity
│   └── User.ts             # User entity
├── graphql/
│   ├── schema.ts           # GraphQL schema
│   ├── mutations/
│   │   ├── comment.mutations.ts
│   │   ├── post.mutations.ts
│   │   └── user.mutations.ts
│   ├── queries/
│   │   ├── comment.queries.ts
│   │   ├── post.queries.ts
│   │   └── user.queries.ts
│   └── types/
│       ├── CommentType.ts
│       ├── PostType.ts
│       └── UserType.ts
├── migrations/             # TypeORM migrations
└── services/
    ├── CommentService.ts   # Comment business logic
    ├── PostService.ts      # Post business logic
    └── UserService.ts      # User business logic
```

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `yarn dev` | Start development server with hot reload |
| `yarn typeorm` | Run TypeORM CLI commands |
| `yarn seed` | Seed the database with initial data |
| `yarn migration:generate` | Generate a new migration based on entity changes |
| `yarn migration:create` | Create a new empty migration |
| `yarn migration:run` | Run pending migrations |
| `yarn migration:revert` | Revert the last migration |
| `yarn migration:show` | Show all migrations and their status |

## 🔧 Database Migrations

### Create a new migration
```bash
yarn migration:create src/migrations/YourMigrationName
```

### Generate migration from entity changes
```bash
yarn migration:generate src/migrations/YourMigrationName
```

### Run migrations
```bash
yarn migration:run
```

### Revert last migration
```bash
yarn migration:revert
```

## 📝 GraphQL API

### Entities

The API manages three main entities:
- **Users** - User accounts 
- **Posts** - Blog posts 
- **Comments** - Comments on posts, written by users

Deleting a user cascades to their posts and comments; deleting a post cascades to its comments.
Inputs are validated with `class-validator` before they reach the database.

## 🔐 Authentication

1. `register` or `login` returns an `accessToken` (JWT, short-lived) and a `refreshToken` (opaque, long-lived).
2. Send the access token on every request: `Authorization: Bearer <accessToken>`. In GraphiQL, add it in the **Headers** tab as `{ "Authorization": "Bearer <accessToken>" }`.
3. When the access token expires, call `refreshToken(token: "<refreshToken>")` to get a new pair. Each refresh token works once; reusing an old one revokes all of that user's sessions.
4. `logout(refreshToken: "...")` revokes a refresh token. `changePassword` revokes all of them.

```graphql
mutation {
  login(email: "alice@example.com", password: "123456") {
    accessToken
    refreshToken
    user { id name role }
  }
}
```

### Permissions

| Action | Anonymous | User | Admin |
|---|---|---|---|
| Read users, posts, comments | ✅ | ✅ | ✅ |
| See a user's `email` | ❌ | own only | ✅ |
| `userByEmail` | ❌ | ❌ | ✅ |
| `createPost`, `createComment` | ❌ | ✅ (as themself) | ✅ |
| Update / delete a post or comment | ❌ | own only | ✅ |
| `updateUser`, `deleteUser` | ❌ | own account | ✅ |
| `setUserRole` | ❌ | ❌ | ✅ |

Errors carry `extensions.code`: `UNAUTHENTICATED` (missing or invalid token) or `FORBIDDEN` (not allowed).

### Example Queries

**Get the logged-in user:**
```graphql
query {
  me {
    id
    name
    email
    posts { title }
  }
}
```

### Example Mutations

**Create a post** (requires a token; the author is the logged-in user):
```graphql
mutation {
  createPost(title: "My Post", content: "Post content") {
    id
    title
    content
  }
}
```

**Comment on a post:**
```graphql
mutation {
  createComment(content: "Nice post!", postId: "<post-uuid>") {
    id
    content
    author { name }
  }
}
```

**Delete a post** (returns `true`, or `false` if it did not exist):
```graphql
mutation {
  deletePost(id: "<post-uuid>")
}
```

## 🐳 Docker

The project includes a `docker-compose.yml` file that sets up a PostgreSQL database.

**Start the database:**
```bash
docker-compose up -d
```

**Stop the database:**
```bash
docker-compose down
```

**View logs:**
```bash
docker-compose logs -f
```
