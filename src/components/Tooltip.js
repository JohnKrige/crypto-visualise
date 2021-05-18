import dayjs from 'dayjs'
import './Tooltip.css';
import numeral from 'numeral';

const htmlWidth = 230;
const htmlHeight = 120;

const formatPrice = price => numeral(price).format('0,0.0000');

const tooltipXCoord = x =>  x < 220 ? x + htmlWidth/1.5 : x - htmlWidth/3 - 10;
const tooltipYCoord = y =>  y < 69 ? y + 10 : y - htmlHeight/3;

export const Tooltip = ({ tooltip, currency }) => {
    if (tooltip.x){
        return (
            <foreignObject className='tooltipSvg' x={tooltipXCoord(tooltip.x)} y={tooltipYCoord(tooltip.y)} width={htmlWidth} height={htmlHeight}>
                <div className="tooltip-background">
                    <div className="tooltip">
                        <p className="tooltip-price">Price({currency.id}): {formatPrice(tooltip.price)}</p>
                        <p className="tooltip-date">{dayjs(tooltip.date).format('DD MMMM YYYY')}</p>
                    </div>
                </div>
            </foreignObject>
        )
    }
    return ''
}

