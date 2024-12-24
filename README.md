# jtk-learn
### Setup Instructions
Start by cloning the project repository to your local machine:
```bash
git clone https://github.com/salsabilamp3/jtk-learn.git
cd jtk-learn
```

## Backend
This is the backend API built with **Express.js** that includes user authentication, JWT-based login, and logout functionality. It uses a **PostgreSQL** database for data storage.
### Prerequisites
Before running the backend, make sure you have the following installed:
- **Node.js** (version 14 or above)
- **npm** or **yarn**
- **PostgreSQL** (for the database)
### Setup Instructions
#### 1. Open backend folder
Start by open backend folder
```bash
cd backend
```
#### 2. Install dependencies
```bash
npm install
```
#### 3. Copy .env copy to .env (adjust with the right db name and password)
```bash
copy "./.env copy" .env
```
#### 4. Create db in postgre
```bash
CREATE DATABASE jtk_learn_db_dev;
```
#### 5. Run migration and seeder
```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```
#### 6. Create random char to jwt secret key and copy to env
```bash
openssl rand -base64 32
```
or use
```bash
[convert]::ToBase64String((1..32 | ForEach-Object {Get-Random -Minimum 0 -Maximum 256}))
```
### Running Project Backend
```bash
npm start
```
### Example Command Adding Migrations and Seeder
#### 1. Adding migrations
```bash
npx sequelize-cli migration:generate --name nama_migration
```
#### 2. Adding seeders
```bash
npx sequelize-cli seed:generate --name nama_seeder
```

## Frontend
The frontend of this project is built with ReactJS (version 19.0.0) and styled using Bootstrap (version 5.3.3), along with Bootstrap Icons for additional iconography.
### Prerequisites
Before running the backend, make sure you have the following installed:
- **npm** or **yarn**
### Setup Instructions
#### 1. Open backend folder
Start by open frontend folder
```bash
cd frontend
```
#### 2. Install dependencies
```bash
npm install
```
#### 3. Copy .env copy to .env (adjust the port you'll be using)
```bash
copy "./.env copy" .env
```
### Running Project Frontend
```bash
npm start
```
### Customizing styling
If you want to add custom css, you can add css file here
```
frontend
├───public
│   ├───styles
│   │   └───(your .css here).css
```
