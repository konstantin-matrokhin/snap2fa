<script>

</script>

<div class="searchbar">
    <i class="searchbar__icon"></i>
    <input type="text" class="searchbar__input" placeholder="Search"/>
</div>

<style lang="scss">
    .searchbar {
        width: 219px;
        height: 38px;
        padding: 9px 13px;
        background: #F9F9F9;
        border: 1px solid #181818;
        border-radius: 6px;

        display: flex;
        flex-direction: row;
        align-items: center;
        flex-grow: 1;

        &__icon {
            margin-right: 10px;
            display: block;
            width: 16px;
            height: 16px;
            background-image: url('../assets/searchbar.svg');
        }

        &__input {
            border: none;
            background: none;
            outline: none;
            flex-grow: 1;

            &::placeholder {
                font-weight: 400;
                font-size: 14px;
                line-height: 20px;

                /* Gray/500 */

                color: #8C8C8C;
            }
        }
    }
</style>
