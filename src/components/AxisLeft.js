import numeral from 'numeral';

const formatPrice = price => numeral(price).format('0,0.0');

export const AxisLeft = ({ yScale, innerWidth, tickOffset, currency }) => 
    yScale.ticks().map(tickValue => (
        <g 
            key={tickValue} 
            className="tick"
            transform={`translate(0,${yScale(tickValue)})`}
        >
            <line className="horizontal-line" x2={innerWidth} />
            <text 
                className="axis-text"
                x={-tickOffset} 
                dy='.32em' 
                style={{textAnchor: 'end'}}
            >
                {formatPrice(tickValue)}
            </text>
        </g>
    )
);