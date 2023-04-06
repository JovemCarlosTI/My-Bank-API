// Dependencies
import express from 'express';
import winston from 'winston';
import basicAuth from 'express-basic-auth';
import { promises as fs } from 'fs';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
// import { buildSchema } from 'graphql';
import { graphqlHTTP } from 'express-graphql';

import accountService from './services/account.service.js';
import Schema from './schema/index.js';

// Routers
import accountsRouter from "./routes/account.routes.js";
import { swaggerDocument } from './doc.js';

// Consts
const app = express();
const PORT = 3000;
const { readFile, writeFile } = fs;

// Consts Winstons
const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
})


global.fileName = "accounts.json"
global.logger = winston.createLogger({
    level: "silly",
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: 'my-bank-api.log' })
    ],
    format: combine(
        label({ label: 'my-bank-api' }),
        timestamp(),
        myFormat
    )
});

// const schema = buildSchema(`
//     type Account {
//         id: Int
//         name: String
//         balance: Float
//     }
//     input AccountInput {
//         id: Int
//         name: String
//         balance: Float 
//     }
//     type Query {
//         getAccounts: [Account]
//         getAccount(id: Int): Account
//     }
//     type Mutation {
//         createAccount(account: AccountInput): Account
//         deleteAccount(id: Int): Boolean
//         updateAccount(account: AccountInput): Account
//     }
// `)

const root = {
    getAccounts: () => accountService.getAccounts(),
    getAccount({ id }) {
        return accountService.getAccount(id);
    },
    createAccount({ account }) {
        return accountService.createAccount(account);
    },
    deleteAccount({ id }) {
        accountService.deleteAccount(id);
    },
    updateAccount({ account }) {
        return accountService.updateAccount(account);
    }
}

app.use(express.json());

// Libera acesso de outros domínios
app.use(cors());

app.use(express.static('public'));

// Documentação
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

function getRole(username) {
    if (username == 'admin') return 'admin';
    else if (username == "carlos") return 'role1';
}

function authorize(...allowed) {
    const isAllowed = role => allowed.indexOf(role) > -1;

    return (req, res, next) => {
        if(req.auth.user) {
            const role = getRole(req.auth.user);

            if (isAllowed(role)) next();
            else res.status(401).send('Role not allowed');
        } else res.status(403).send('User not found');
    }
} 

app.use(basicAuth({
    authorizer: (username, password) => {
        // Proteção contra timing attacks
        const userMatches = basicAuth.safeCompare(username, 'admin')
        const passwordMatches = basicAuth.safeCompare(password, 'admin')

        const userMatchesR1 = basicAuth.safeCompare(username, 'carlos')
        const passwordMatchesR1 = basicAuth.safeCompare(password, '1234')

        return userMatches && passwordMatches || userMatchesR1 && passwordMatchesR1
    }
}));

// Redireciona router de Account
app.use('/account', authorize('admin'), accountsRouter);

app.use('/graphql', graphqlHTTP({
    schema: Schema,
    rootValue: root,
    graphiql: true
}));

app.listen(PORT, async () => {

    // Verifica se o arquivo existe
    try {
        await readFile(global.fileName).then(() => {
            global.logger.info("Using the preview Accounts.json")
        })
    } catch (err) {
        // Se não existir, cria JSON inicial
        const initialJSON = {
            nextId: 1,
            accounts: []
        }
        writeFile(global.fileName, JSON.stringify(initialJSON)).then(() => {
            global.logger.info("New file accounts.json created")
        }).catch(err => {
            global.logger.error(err);
        });
    } finally {
        global.logger.info(`API is running at port ${PORT}`)
    }
});