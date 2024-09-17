# Guide


## Setup

### Prerequisites

- NodeJS v20

### Install dependencies

Install project dependencies

```console
yarn install
```

Install client dependencies

```console
cd client && yarn install
```

Install server dependencies

```console
cd server && yarn install
```

### Fill environment variables

Client env

```console
cp ./client/.env.example ./client/.env.development
```

Server env

```console
cp ./server/.env.example ./server/.env.local
```

### Run

```console
yarn dev
```