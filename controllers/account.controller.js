import accountService from '../services/account.service.js';

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
        res.send(await accountService.getAccounts());
        logger.info(`${req.method} ${req.baseUrl}`);
    } catch (err) {
        next(err);
    }
}

async function getAccount(req, res, next) {
    try {
        res.send(await accountService.getAccount(parseInt(req.params.id)))

        logger.info(`${req.method} ${req.baseUrl}/:id`);

    } catch (err) {
        next(err);
    }
}

async function deleteAccount(req, res, next) {
    try {
        await accountService.deleteAccount(parseInt(req.params.id))

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

        res.send(await accountService.updateAccount(account))

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

        res.send(await accountService.updateBalance(account))

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