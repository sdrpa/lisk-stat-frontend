import React from 'react'
import PropTypes from 'prop-types'

import BTC from './btc'
import Chart from './chart'
import MarketSummary from './market-summary'
import OrderBook from './order-book'
import MarketHistory from './market-history'

const BTCProvider = ({ btcUsdt }) => {
   const market = 'BTC-LSK'

   return (
      <div>
         <div className="header">
            <MarketSummary 
               market={market}
               btcUsdt={btcUsdt} />
         </div>
         <div className="first">
            <Chart 
               market={market}
               btcUsdt={btcUsdt} />
         </div>
         <div>
            <OrderBook 
               market={market}
               btcUsdt={btcUsdt} />
            <MarketHistory
               market={market}
               btcUsdt={btcUsdt} />
         </div>
      </div>
   )
}
BTCProvider.propTypes = {
   btcUsdt: PropTypes.number.isRequired
}

export default BTC(BTCProvider)