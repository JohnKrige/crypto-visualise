import { Multiselect } from 'multiselect-react-dropdown';

export const CoinSelector = ({ onCoinSelect, top100 }) => {
    return (
        <div className='currency-menu currency-menu--coin'>
            <h3 className='currency-menu__title currency-menu__title--coin'>Crypto currency</h3>
            <Multiselect
                options={top100}
                selectedValues={top100.filter(item => item.id === 'bitcoin')}
                onSelect={onCoinSelect} 
                displayValue="name" 
                avoidHighlightFirstOption='true'
                placeholder=''
                selectionLimit={1}
            />
        </div>
    )
}