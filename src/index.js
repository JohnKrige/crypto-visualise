import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { scaleLinear, scaleTime, extent } from 'd3';
import dayjs from 'dayjs'
import { json } from 'd3';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

import { AxisBottom } from './components/AxisBottom';
import { AxisLeft } from './components/AxisLeft';
import { Marks } from './components/Marks';
import { Tooltip } from './components/Tooltip';
import { CurrencySelector } from './components/CurrencySelector';
import { CoinSelector} from './components/CoinSelector';

import './components/Crypto.css';

const getDataUrl = (coin, currency, period) => {
    const intervals = parseInt(period) > 30 ? 'daily' : 'hourly';
    const coinId = coin.id ? coin.id : 'bitcoin';
    const jsonUrl = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=${currency.id}&days=${period}&interval=${intervals}`;
    return jsonUrl;
};

const periods = ['7','30','90','180','365','max'];
const defaultPeriod = '365';

const width = window.innerWidth * 0.95;
const height = window.innerHeight * 0.5;
const margin = {
    top: 20,
    right: 80,
    bottom: 110,
    left: 120
};

const xAxisLabelOffset = 30;
const yAxisLabelOffset = 80;

const defaultCurrency = {id:'usd', name: 'US Dollar'};

const xAxisTickFormat = period => period === '365' ? dayjs(period).format('MMMM YYYY') : dayjs(period).format('D MMMM');

const innerHeight = height - margin.top - margin.bottom;
const innerWidth = width - margin.left - margin.right;

const xValue = d => d.date;
const yValue = d => d.priceClose;

const App = ()  => {
    const [tooltip, setTooltip] = useState({});
    const [period, setPeriod] = useState(defaultPeriod);
    const [currency, setCurrency] = useState(defaultCurrency); // The curency in which the coin is measured
    const [coin, setCoin] = useState({}); // The crypto currency under consideration
    const [data, setData] = useState([]);
    const [top100, setTop100] = useState([]);

    useEffect(() => {
        fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false')
        .then(response => response.json()).then(data => {
            setTop100(data);
            setCoin(data[0]);
        });
    }, []);

    useEffect(() => {
        if(!coin.id){
            return;
        }

        const dataArr = [];
        const jsonUrl = getDataUrl(coin, currency, period);
        
        json(jsonUrl).then(d => {
            d.prices.forEach((item, i) => {
                let itemObj = {
                    date: new Date (item[0]),
                    priceClose: item[1],
                    coin: coin.name,
                }
                dataArr.push(itemObj);
            })
        })
        .then(() => {
            setData(dataArr);
        })
    }, [coin, currency, period]);

    const xScale = scaleTime()
    .domain(extent(data, xValue))
    .range([0, innerWidth])
    .nice();

    const yScale = scaleLinear()
    .domain(extent(data, yValue))
    .range([innerHeight, 0])
    .nice()

    if(data.length < 1 || !top100){
        return <pre> Loading ...</pre>
    }

    return (
        <div className='crypto-component'>
            <h1 className='coin-title'> {coin.name} </h1>
            <div className='selectors-menu'>
                <CoinSelector top100={top100} onCoinSelect={item => setCoin(item[0])}/>               
                <CurrencySelector onSetCurrency={item => setCurrency(item[0])}/>
                <div className='currency-menu'>
                <h3 className='currency-menu__title'>Period (days)</h3>
                    <Dropdown 
                        options={periods} 
                        onChange={item => {
                            console.log(item);
                            setPeriod(item.value);
                        }} 
                        value={defaultPeriod} 
                    />
                </div>
            </div>
            <svg className='graph' width={width} height={height}>
                <g transform={`translate(${margin.left}, ${margin.top})`}>
                <AxisBottom 
                    xScale={xScale} 
                    innerHeight={innerHeight} 
                    tickFormat={xAxisTickFormat}
                    tickOffset={8}
                />
                <AxisLeft 
                    yScale={yScale} 
                    innerWidth={innerWidth} 
                    tickOffset={8}
                />
                <text 
                    className = 'axis-label axis-label__left'

                    textAnchor='middle'
                    transform={`translate(${-yAxisLabelOffset}, ${innerHeight/2}) rotate(-90) `}
                >   
                    {currency.name ? currency.name : ''}
                </text>
                <text 
                    className = 'axis-label'
                    x={innerWidth/2} 
                    textAnchor='middle'
                    y={innerHeight + xAxisLabelOffset}
                >   
                    {/* {xLabel} */}
                </text>
                <Marks 
                    data={data} 
                    xScale={xScale} 
                    yScale={yScale} 
                    xValue={xValue} 
                    yValue={yValue} 
                    tooltipFormat={xAxisTickFormat}
                    circleRadius={3}
                    onTooltipValues={setTooltip}
                />
                </g>
                <Tooltip 
                    tooltip={tooltip}
                    currency={currency}
                />
            </svg>
        </div>
    );
}

const rootElement = document.getElementById('root');

ReactDOM.render( <App />, rootElement);

