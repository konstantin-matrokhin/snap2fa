<script>
    import {timer} from "../../lib/stores.js";
    import {getSecondsRemaining} from "../../lib/utils.js";

    const defaultPeriod = 30;
    const maxStrokeDashoffset = 81;

    let circle;

    function getDashOffsetPx(timer) {
        const remaining = getSecondsRemaining(timer, defaultPeriod);
        const offset = maxStrokeDashoffset - (maxStrokeDashoffset / defaultPeriod * remaining);
        return `-${offset}px`;
    }

    $: if (circle) circle.style.strokeDashoffset = getDashOffsetPx($timer);
</script>

<div>
    <svg class="countdown">
        <circle class="countdown__circle" bind:this={circle} r="13" cx="16" cy="16"></circle>
    </svg>
</div>

<style lang="scss">
    .countdown {
        width: 32px;
        height: 32px;
        transform: rotateY(-180deg) rotateZ(-90deg);

        &__circle {
            stroke-dasharray: 81px;
            stroke-dashoffset: 0;
            stroke-linecap: square;
            stroke-width: 6px;
            stroke: #000;
            fill: none;
            transition: all 1s ease-in-out;
        }
    }
</style>
