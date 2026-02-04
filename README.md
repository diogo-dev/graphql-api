# GraphQL API

A full-featured GraphQL API built with Node.js, Express, TypeORM, and PostgreSQL. This project provides a complete backend solution for managing users, posts, and comments with GraphQL queries and mutations.

## 🚀 Features
- **GraphQL API** with queries and mutations
- **TypeORM** for database management
- **PostgreSQL** database with Docker support
- **TypeScript** for type safety
- **Database migrations** for version control
- **Database seeding** for initial data
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
- **GraphQL** with express-graphql
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
   ```

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

## 🚀 Running the Application

### Development Mode
```bash
yarn dev
```

The server will start at `http://localhost:3000` (or your configured PORT).

### GraphQL Playground

Access the GraphQL playground at: `http://localhost:3000/graphql`

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
- **Comments** - Comments on posts

### Example Queries

**Get all users:**
```graphql
query {
  users {
    id
    name
    email
  }
}
```

### Example Mutations

**Create a post:**
```graphql
mutation {
  createPost(title: "My Post", content: "Post content", userId: "1") {
    id
    title
    content
  }
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
