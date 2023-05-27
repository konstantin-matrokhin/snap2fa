<script>
    import {goto, PAGE_ADD, PAGE_MAIN} from "../lib/pages";

    export let isCloseButton = false;

    function onClick() {
        goto(isCloseButton ? PAGE_MAIN : PAGE_ADD);
    }
</script>

<button on:click={onClick} class="add-button">
    <i class="add-button__icon" style="--rotate: {isCloseButton ? '45deg' : '0deg'}"></i>
</button>

<style lang="scss">
    .add-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 38px;
        height: 38px;
        background: #E8A6FE;
        border: 1px solid #181818;
        border-radius: 6px;
        cursor: pointer;

        &__icon {
            display: block;
            width: 14px;
            height: 14px;
            background-image: url('../assets/plus.svg');
            rotate: var(--rotate);
            margin: 0 auto;
        }
    }
</style>
