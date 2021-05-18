export const AxisBottom = ({ xScale, innerHeight, tickFormat, tickOffset = 3 }) => {
    return (
        xScale.ticks().map(tickValue => (
            <g className="tick" key={tickValue} transform={`translate(${xScale(tickValue)},${innerHeight + tickOffset})`} >
                <line className="vertical-line" y1={-tickOffset} y2={-innerHeight - tickOffset} />
                    <text 
                        transform="rotate(-90)"
                        className="axis-text"
                        style={{textAnchor: 'end'}} 
                        // dx={-20}
                        dy={5}
                    >{tickFormat(tickValue)}
                    </text>
            </g>
        ))
    )

}
