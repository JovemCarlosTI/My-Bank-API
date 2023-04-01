import express from 'express';
const router = express.Router();
// import cors from 'cors';

import accountController from "../controllers/account.controller.js"

router.post('/', accountController.createAccount);

router.get('/' /*, cors()*/, accountController.getAccounts);

router.get("/:id", accountController.getAccount);

router.delete("/:id", accountController.deleteAccount);

// PUT - Atualização integral
router.put("/", accountController.updateAccount);

// PATCH - Atualização parcial
router.patch("/updateBalance", accountController.updateBalance);

// Tratamento de erros
router.use((err, req, res, next) => {
    res.status(400).send({ error: err.message });
    global.logger.error(`${req.method} ${req.baseUrl} - ${err.message}`);
})

export default router;