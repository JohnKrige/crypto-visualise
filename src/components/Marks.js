import { line, curveNatural } from 'd3';

export const Marks = ({ data, yScale, xScale, xValue, yValue, circleRadius, onTooltipValues }) => 
    (
        <g className="marks">
            <path 
                d={line()
                .x(d => xScale(xValue(d)))
                .y(d => yScale(yValue(d)))
                .curve(curveNatural)(data) 
            }
            />
            {
                data.map((d,i) => 
                    <circle 
                        key={i}
                        className = "circle-mark"
                        cx={xScale(xValue(d))} 
                        cy={yScale(yValue(d))} 
                        r={circleRadius}
                        onMouseOver={e => {
                            onTooltipValues({
                                x: xScale(xValue(d)),
                                y: yScale(yValue(d)),
                                price: d.priceClose.toFixed(5),
                                date: d.date,
                            })}
                        }
                        onMouseOut={e => {
                            onTooltipValues({})
                        }}
                    >
                    
                    </circle>
                )
            }
        </g>
    )
