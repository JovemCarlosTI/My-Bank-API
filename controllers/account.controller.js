import { promises as fs } from 'fs';
import accountService from '../services/account.service.js';

const { readFile, writeFile } = fs;

async function createAccount(req, res, next) {
    try {
        let account = req.body;

        if (!account.name || account.balance == null) {
            throw new Error("Name e balance são obrigatórios");
        }

        account = await accountService.createAccount(account);

        res.send(account);

        logger.info(`${req.method} ${req.baseUrl} - ${JSON.stringify(account)}`);
    } catch (err) {
        next(err);
    } finally {
        res.end();
    }
}

async function getAccounts(req, res, next) {
    try {
        const data = JSON.parse(await readFile(global.fileName));
        delete data.nextId;
        res.send(data);
        logger.info(`${req.method} ${req.baseUrl}`);
    } catch (err) {
        next(err);
    }
}

async function getAccount(req, res, next) {
    try {
        const data = JSON.parse(await readFile(global.fileName));

        const account = data.accounts.find(account => account.id === parseInt(req.params.id))
        res.send(account)

        logger.info(`${req.method} ${req.baseUrl}/:id`);

    } catch (err) {
        next(err);
    }
}

async function deleteAccount(req, res, next) {
    try {
        const data = JSON.parse(await readFile(global.fileName));
        data.accounts = data.accounts.filter(account => account.id !== parseInt(req.params.id));

        await writeFile(global.fileName, JSON.stringify(data, null, 2));

        res.end();

        logger.info(`${req.method} ${req.baseUrl}/:id - id ${req.params.id}`);

    } catch (err) {
        next(err);
    }
}

async function updateAccount(req, res, next) {
    try {
        const account = req.body;

        if (!account.name || !account.id || account.balance == null) {
            throw new Error("Name, id e balance são obrigatórios");
        }

        const data = JSON.parse(await readFile(global.fileName));
        const indexAccount = data.accounts.findIndex(a => a.id === account.id);

        if (indexAccount === -1) {
            throw new Error(`Account com id ${account.id} inexistente`)
        }

        data.accounts[indexAccount].name = account.name;
        data.accounts[indexAccount].balance = account.balance;

        await writeFile(global.fileName, JSON.stringify(data, null, 2));

        res.send(data.accounts[indexAccount])

        logger.info(`${req.method} ${req.baseUrl} - ${JSON.stringify(account)}`);
    } catch (err) {
        next(err);
    }
}

async function updateBalance(req, res, next) {
    try {
        const account = req.body;

        if (!account.id || account.balance == null) {
            throw new Error("Id e Balance são obrigatórios");
        }

        const data = JSON.parse(await readFile(global.fileName));
        const indexAccount = data.accounts.findIndex(a => a.id === account.id);

        if (indexAccount === -1) {
            throw new Error(`Account com id ${account.id} inexistente`)
        }

        data.accounts[indexAccount].balance = account.balance;

        await writeFile(global.fileName, JSON.stringify(data, null, 2));

        res.send(data.accounts[indexAccount])

        logger.info(`${req.method} ${req.baseUrl} - ${JSON.stringify(account)}`);

    } catch (err) {
        next(err);
    }
}

export default {
    createAccount,
    getAccounts,
    getAccount,
    deleteAccount,
    updateAccount,
    updateBalance
}