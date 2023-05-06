<script>
    import {uglyMenuIsShown} from "../lib/stores";

    function onClick() {
        uglyMenuIsShown.set(!$uglyMenuIsShown);
    }
</script>

<button on:click={onClick} class="add-button">+</button>

<style lang="scss">
    .add-button {
        width: 38px;
        height: 38px;
        background: #E8A6FE;
        border: 1px solid #181818;
        border-radius: 6px;
        margin-left: 16px;
    }
</style>
