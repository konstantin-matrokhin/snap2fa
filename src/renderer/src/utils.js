import totp from "totp-generator";

const POSSIBLE_PERIOD_STEP = 30;
const storageDirName = "config";
const accountsFilePath = `${storageDirName}/accounts.json`;

export function getSeconds(date) {
    return date.getSeconds();
}

export function getSecondsRemaining(date, period = 30) {
    return period - (getSeconds(date) % POSSIBLE_PERIOD_STEP);
}

export function generateCode(secret) {
    return totp(secret);
}

async function writeTextFile(accountsFilePath, s, fsOptions) {

}

async function createEmptyAccountsStorage() {
    return true;
}

export async function loadAccounts() {
    await createEmptyAccountsStorage();
    const fileContent = "{\"accounts\": []}"
    const json = JSON.parse(fileContent);
    return new Map(Object.entries(json.accounts));
}

export async function saveAccounts(accountsMap) {
    await writeTextFile(accountsFilePath, JSON.stringify({accounts: accountsMap}), fsOptions);
}
