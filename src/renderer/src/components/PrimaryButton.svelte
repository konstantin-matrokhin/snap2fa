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
    <i class="button__icon button__icon_{icon}"></i>
    {text}
</button>

<style lang="scss">
    .button {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 16px;
        width: 294px;
        height: 84px;
        background: #BBB9FF;
        border-radius: 12px;
        color: #181818;
        border: none;
        margin: 8px 20px;
        font-size: 16px;
        line-height: 24px;
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
