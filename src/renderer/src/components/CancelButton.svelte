<script>
    export let text;
    export let icon;
    export let onClick;

    function handleClick() {
        if (typeof onClick === 'function') {
            onClick();
        }
    }
</script>

<button class="button" on:click={handleClick}>
    {#if icon}
        <i class="button__icon button__icon_{icon}"></i>
    {/if}
    {text}
</button>

<style lang="scss">
    .button {
        padding: 13px 25px 13px 23px;
        width: 294px;
        height: 50px;
        background: #F3F3F3;
        border-radius: 12px;
        font-size: 16px;
        line-height: 24px;
        color: #181818;
        position: absolute;
        bottom: 20px;
        left: 0;
        right: 0;
        margin: 0 auto;
        border: none;
        cursor: pointer;

        &__icon {
            display: block;
            width: 16px;
            height: 16px;
            background-image: none;
            background-repeat: no-repeat;

            &_qr {
                background-image: url('../assets/qr.svg');
            }

            &_cmd {
                background-image: url('../assets/cmd.svg');
            }

            &_upload {
                background-image: url('../assets/upload.svg');
            }
        }
    }
</style>
