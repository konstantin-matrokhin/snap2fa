import {derived, readable, writable} from 'svelte/store'
import {generateCode, validateSecret} from './utils.js'

function createMessage() {
    const { subscribe, set, update } = writable('')
    let timeoutId;
    return {
        subscribe,
        update,
        show: (value) => {
            set(value);
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => set(''), 2000);
        }
    }
}

export const timer = readable(new Date(), (set) => {
    const interval = setInterval(() => {
        set(new Date())
    }, 500)
    return () => clearInterval(interval)
})

function createAccounts() {
    const { subscribe, set, update } = writable(new Map());
    return {
        subscribe,
        loadAccounts: () => {
            const accounts = JSON.parse(localStorage.getItem('accounts') || "{}")
            return set(new Map(Object.entries(accounts)));
        },
        add: (id, account) => {
            console.log(id, account)
            if (!validateSecret(account.secret)) {
                return;
            }
            if (!account.account) {
                account.account = 'New account'
            }
            if (!account.issuer) {
                account.issuer = 'Unknown issuer'
            }
            update(accountsMap => {
                accountsMap.set(id, account)
                localStorage.setItem('accounts', JSON.stringify(Object.fromEntries(accountsMap)));
                return accountsMap;
            });
        },
        remove: (id) => {
            update(accountsMap => {
                accountsMap.delete(id)
                localStorage.setItem('accounts', JSON.stringify(Object.fromEntries(accountsMap)));
                return accountsMap;
            });
        }
    }
}
export const accounts = createAccounts();

export const message = createMessage();

export const codes = derived([timer, accounts], ([$timer, $accounts]) => {
    const codesMap = new Map()
    $accounts.forEach((account, id) => {
        codesMap.set(id, generateCode(account.secret))
    })
    return codesMap
})

export const manualFormOpened = writable(false);
export const cameraScanIsOpened = writable(false);
export const uglyMenuIsShown = writable(false);
