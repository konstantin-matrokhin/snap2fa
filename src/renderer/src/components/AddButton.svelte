<script>
    import {uglyMenuIsShown} from "../lib/stores";

    function onClick() {
        uglyMenuIsShown.set(!$uglyMenuIsShown);
    }
</script>

<button on:click={onClick} class="add-button"><i class="add-button__icon"></i></button>

<style lang="scss">
    .add-button {
        width: 38px;
        height: 38px;
        background: #E8A6FE;
        border: 1px solid #181818;
        border-radius: 6px;

        &__icon {
            display: block;
            width: 14px;
            height: 14px;
            background-image: url('../assets/plus.svg');
            margin: 0 auto;
        }
    }
</style>
