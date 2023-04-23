<script>
    import {message} from "../stores.js"
</script>

<div class="message">{$message}</div>

<style>
    .message {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        /*width: 100%;*/
        padding: 5px 10px;
        background-color: grey;
        color: whitesmoke;
        font-size: 18px;
    }
</style>