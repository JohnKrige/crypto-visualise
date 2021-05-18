import { useEffect, useState } from 'react';
import { Multiselect } from 'multiselect-react-dropdown';
import { csv } from 'd3';

export const CurrencySelector = ({ onSetCurrency }) => {
    const [currencies, setCurrencies] = useState([]);
    const [allCoins, setAllCoins] = useState([]);
    const [fiat, setFiat] = useState([]);
    const [currencyObj, setCurrencyObj] = useState([]);

    // Fetches all fiat currencies and their ISO 4217 codes. The coinghecko api uses the ISO codes, but the
    // user would prefer to see the full names. 
    useEffect(() => {
        csv('https://gist.githubusercontent.com/JohnKrige/3ed9fd5d4946e05e5da4710422275fc8/raw/gistfile1.txt')
        .then(data => setFiat(data));
    }, []);

    // Fetches all the currencies in which the crypto can be measured. 
    useEffect(() => {
        fetch('https://api.coingecko.com/api/v3/simple/supported_vs_currencies')
        .then(response => response.json()).then(data => setCurrencies(data));
    }, []);

    // Fecthces all the crypto and currencies list. Used to get the crypto names from the ISO codes provided in the
    // currencies list. Display the full name. 
    useEffect(() => {
        fetch('https://api.coingecko.com/api/v3/coins/list')
        .then(response => response.json()).then(data => setAllCoins(data));
    }, []);

    useEffect(() => {
        if(currencies.length === 0 || fiat.length === 0 || allCoins.length === 0) {
            return; 
        }

        const availableCurrencies = allCoins.concat(fiat).filter(curr => {
            return currencies.includes(curr.symbol);
        });

        const options = [];
        const keyAlreadyUsed = []; //Keeps track of which currencies have been processed. There are duplicates
        availableCurrencies.forEach(item => {
            if(keyAlreadyUsed.includes(item.symbol)){
                return;

            // Cleaning the usd data myself. The allCoins value for usd is a little strange. 
            } else if (item.symbol === 'usd'){
                options.push({
                    id: item.symbol,
                    name: `US Dollar(usd)`,
                })
            } else {
                options.push({
                    id: item.symbol,
                    name: `${item.name}(${item.symbol})`,
                })
            }

            keyAlreadyUsed.push(item.symbol);
        })

        setCurrencyObj(options);

    }, [currencies, fiat, allCoins]);

    if(!currencyObj){
        return ''
    }

    return (
        <div className='currency-menu currency-menu--currency'>
            <h3 className='currency-menu__title currency-menu__title--measure'>Meausurement Currency</h3>

            <Multiselect
                options={currencyObj}
                selectedValues={currencyObj.filter(item => item.id === 'usd')}
                onSelect={item => onSetCurrency(item)} 
                displayValue="name" 
                avoidHighlightFirstOption='true'
                placeholder=''
                selectionLimit={1}
            />
        </div>
    )
}