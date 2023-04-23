<script>
    import {message} from "../../stores.js";
    import Countdown from "./Countdown.svelte";

    export let issuer;
    export let accountName;
    export let code;

    function copy() {
        message.set("Copied!");
    }
</script>

<div class="account" on:click={copy}>
    <div class="account__info">
        <div class="account__issuer">{issuer}</div>
        <div class="account__account">{accountName}</div>
        <div class="account__value">{code}</div>
    </div>
    <div class="account__side">
        <Countdown secondsRemaining=30 />
    </div>
</div>

<style lang="scss">
  .account {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: start;
    align-items: start;
    margin: 5px 0;
    color: #f6f6f6;
    background-color: lightslategray;
    font-size: 18px;
    padding: 5px;
    cursor: pointer;
    pointer-events: bounding-box;
    -webkit-user-select: none;

    &__info {
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
    }

    &__side {
      margin-left: auto;
    }
  }
</style>