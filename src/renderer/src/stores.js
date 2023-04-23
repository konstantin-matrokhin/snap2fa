import {derived, readable, writable} from "svelte/store";
import {generateCode} from "./utils.js";

function createMessage() {
    const {subscribe, set, update} = writable("");
    return {
        subscribe,
        update,
        set: (value) => {
            set(value);
            setTimeout(() => set(""), 2000);
        },
    };
}

export const timer = readable(new Date(), (set) => {
    const interval = setInterval(() => {
       set(new Date());
    }, 500);
    return () => clearInterval(interval);
})

export const message = createMessage();
export const accounts =  writable(new Map());

export const codes = derived([timer, accounts], ([$timer, $accounts]) => {
    const codesMap = new Map();
    $accounts.forEach((account, id) => {
        codesMap.set(id, generateCode(account.secret));
    })
    return codesMap;
})
