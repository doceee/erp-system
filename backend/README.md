## Employee ERP System - backend

### Project setup

```
#install dependencies
npm install

#copy file and set proper data inside
cp .env.example .env

#docker setup
docker-compose up --build

#database setup
npm run db:recreate
```

### Development

```
npm run dev
```

### Run tests

```
# copy file and set proper data inside
cp .env.example .env.test

npm run test
```
