import { promises as fs } from 'fs';
const { readFile, writeFile } = fs;


async function createAccount(account) {
    // Ler arquivo
    const data = JSON.parse(await readFile(global.fileName));

    // Altera data temporário
    account = { id: data.nextId, name: account.name, balance: account.balance }
    data.nextId++;
    data.accounts.push(account)

    // Sobrescreve arquivo
    await writeFile(global.fileName, JSON.stringify(data, null, 2));

    return account;
}

export default {
    createAccount
}