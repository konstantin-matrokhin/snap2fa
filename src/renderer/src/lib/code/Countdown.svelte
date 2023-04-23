<script>
    import {timer} from "../../stores.js";
    import {getSecondsRemaining} from "../../utils.js";
</script>

<div>
    <h2>{getSecondsRemaining($timer)}</h2>
</div>
