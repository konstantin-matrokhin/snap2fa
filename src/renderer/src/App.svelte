<script>
    import Codes from './lib/Codes.svelte'
    import {loadAccounts} from "./utils.js";
    import AddAccountButton from "./lib/AddAccountButton.svelte";
    import {accounts} from "./stores.js";

    loadAccounts().then(accs => {
        // accounts.set(accs);
      accounts.set(new Map([[1, {
        issuer: "issuer",
        account: "test",
        secret: "jqsdm5ycfnhuwmry"
      }]]));
    })

    const ipcRenderer = window.electron.ipcRenderer;

    ipcRenderer.on('qr:parsed', (event, payload) => {
        const {issuer, account, secret} = payload;
        const maximum = 999;
        const minimum = 100;
        const randomNumber = Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
        accounts.update(old => old.set(randomNumber, {issuer, account, secret}));
    })
</script>

<main class="container">
    <AddAccountButton/>
    <Codes/>
</main>

<style>
    .container {
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-content: start;
    }
</style>
