# Nest-Backend

## Install

Go to: `/services` add a new file `.env`

```
NETWORK_NAME=nest-dev

REDIS_PORT=6379

MYSQL_ROOT_PASSWORD=12qwaszx
MYSQL_DATABASE=nest

MYSQL_PORT=3308

RABBIT_UI_PORT=15672
RABBIT_API_PORT=5672

PROJECT_NAME=nest

```

and run `docker-compose up`

after go to the root folder and add a new `.env`

```
M_PORT=3000
CONTAINER_NAME=nest
NETWORK_NAME=nest-dev
PORT=3000

# POSTGRES_HOST=postgres
# POSTGRES_PORT=5432
# POSTGRES_USER=nest
# POSTGRES_PASSWORD=12qwaszx
# POSTGRES_DB=nestdb

SYNCHRONIZE_DATA=true

MYSQL_USER=root
MYSQL_PASSWORD=12qwaszx
MYSQL_DATABASE=nest
# MYSQL_HOST=mysqldb
# MYSQL_PORT=3306
MYSQL_HOST=localhost
MYSQL_PORT=3308

REDIS_HOST=localhost
# REDIS_HOST=redis
REDIS_PORT=6379

RABBIT_HOST=amqp://guest:guest@localhost:5672
# RABBIT_HOST=amqp://guest:guest@rabbitmq:5672
RABBIT_QUEUE=nest
```
# RUN  `npm run start:dev`
