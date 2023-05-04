<script>
    import {timer} from "../../lib/stores.js";
    import {getSecondsRemaining} from "../../lib/utils.js";
</script>

<div>
    <h2>{getSecondsRemaining($timer)}</h2>
</div>
