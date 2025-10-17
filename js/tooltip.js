(function () {
    const DEFAULT_OFFSET = { x: 16, y: 16 };
    let tooltipEl = null;

    function getTooltipElement() {
        if (tooltipEl) {
            return tooltipEl;
        }

        tooltipEl = d3.select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("pointer-events", "none")
            .style("opacity", 0)
            .style("background", "rgba(0, 0, 0, 0.75)")
            .style("color", "#fff")
            .style("padding", "6px 10px")
            .style("border-radius", "4px")
            .style("font-size", "12px")
            .style("line-height", "1.4");

        return tooltipEl;
    }

    function getOffsets(options) {
        if (!options) {
            return DEFAULT_OFFSET;
        }

        return {
            x: options.offsetX != null ? options.offsetX : DEFAULT_OFFSET.x,
            y: options.offsetY != null ? options.offsetY : DEFAULT_OFFSET.y
        };
    }

    function setPosition(event, options) {
        const offsets = getOffsets(options);
        const [x, y] = [event.pageX, event.pageY];

        getTooltipElement()
            .style("left", `${x + offsets.x}px`)
            .style("top", `${y + offsets.y}px`);
    }

    function showTooltip(content, event, options) {

        getTooltipElement()
            .html(content)
            .transition()
            .duration(100)
            .style("opacity", 1);

        setPosition(event, options);
    }

    function moveTooltip(event, options) {
        if (!tooltipEl) {
            return;
        }
        setPosition(event, options);
    }

    function hideTooltip() {
        if (!tooltipEl) {
            return;
        }
        tooltipEl
            .transition()
            .duration(100)
            .style("opacity", 0);
    }

    window.showTooltip = showTooltip;
    window.moveTooltip = moveTooltip;
    window.hideTooltip = hideTooltip;
})();
