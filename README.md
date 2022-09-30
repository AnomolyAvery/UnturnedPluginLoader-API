# Unturned Plugin Loader API

A Node.js Express server to host the plugin and library files to load from.

## Installation

Clone the repo.

```
git clone https://github.com/AnomolyAvery/UnturnedPluginLoader-API <local_dir_name>
```

Copy the contents of .env.example into a new file `.env`

```
PORT=4000
DATABASE_URL=mysql://user:pwd@localhost:3306/unturnedpluginloader
```

Install the project dependecies

```
yarn

# or

npm install
```

Push the current schema to the database

```
yarn prisma db push

# or

npx prisma db push

```

## Start

Run the following command to build & start the project.

```
yarn build && yarn start
```

## Development

Run the following command to start the project in dev mode.

```

yarn dev

# or

npm run dev
```

### Routes

#### Plugins

-   [GET] /api/plugins - Get a list of all the plugins
-   [GET] /api/plugins/[id] - Get a single plugin
-   [GET] /api/plugins/[id]/stream - Get the base64 string for the plugin.
-   [POST] /api/plugins - Create a new plugin entry and upload file

#### Libraries

-   [GET] /api/libraries - Get a list of all libraries
-   [GET] /api/libraries/[id] - Get a single library
-   [GET] /api/libraries/[id]/stream - Get the base64 string for the library.
-   [POST] /api/libraries - Create a new library entry and upload file.
