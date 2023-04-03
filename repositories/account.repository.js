import { promises as fs } from 'fs';
const { readFile, writeFile } = fs;

async function getAccounts() {
    // Ler arquivo
    const data = JSON.parse(await readFile(global.fileName));
    return data.accounts;
}

async function getAccount(id) {
    const accounts = await getAccounts();

    const account = accounts.find(account => account.id === id);
    if(account) return account;
    else throw new Error(`Account com id ${id} inexistente`)
}

async function insertAccount(account) {
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

async function deleteAccount(id) {
    const data = JSON.parse(await readFile(global.fileName));
    data.accounts = data.accounts.filter(account => account.id !== id);

    await writeFile(global.fileName, JSON.stringify(data, null, 2));
}

async function updateAccount(account) {
    const data = JSON.parse(await readFile(global.fileName));
    const indexAccount = data.accounts.findIndex(a => a.id === account.id);

    if (indexAccount === -1) {
        throw new Error(`Account com id ${account.id} inexistente`)
    }

    if (account.name) data.accounts[indexAccount].name = account.name;
    if (account.balance) data.accounts[indexAccount].balance = account.balance;

    await writeFile(global.fileName, JSON.stringify(data, null, 2));

    return data.accounts[indexAccount];
}

export default {
    getAccounts,
    insertAccount,
    getAccount,
    deleteAccount,
    updateAccount
}