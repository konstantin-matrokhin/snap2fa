<script>
    export let text;
    export let icon;
</script>

<button class="button">
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
