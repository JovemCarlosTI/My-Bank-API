// Dependencies
import express from 'express';
import winston from 'winston';
import {promises as fs} from 'fs';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';

// Routers
import accountsRouter from "./routes/account.routes.js";
import { swaggerDocument } from './doc.js';

// Consts
const app = express();
const PORT = 3000;
const {readFile, writeFile} = fs;

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

app.use(express.json());

// Libera acesso de outros domínios
app.use(cors());

app.use(express.static('public'));

// Documentação
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// Redireciona router de Account
app.use('/account', accountsRouter);

app.listen(PORT, async () => {

    // Verifica se o arquivo existe
    try {
        await readFile(global.fileName).then(() => {
            global.logger.info("Using the preview Accounts.json")
        })
    } catch(err) {
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