import React from 'react'
import PropTypes from 'prop-types'

import { Float, formatter } from './fn'
import { getMarketSummary } from './api'
import makeLodable from './loadable'

const Ticker = props => {
   const { Last, High, Low, BaseVolume, Volume, Bid, Ask, OpenBuyOrders, OpenSellOrders } = props.result[0]
   const { btcUsdt } = props
   const lastUsdt = Float(2, Last * btcUsdt)
   const bidUsdt = Float(2, Bid * btcUsdt)
   const askUsdt = Float(2, Ask * btcUsdt)
   const highUsdt = Float(2, High * btcUsdt)
   const lowUsdt = Float(2, Low * btcUsdt)
   return (
      <div>
         <ul className="list-inline">
            <li className="list-inline-item">
               <h3>
                  <span className="text-muted">Last: </span>
                  <span className="text-info"><strong>{Float(8, Last)}</strong> </span>
                  <span className="text-info"><strong>({formatter.format(lastUsdt)})</strong></span>
               </h3>
            </li>
            <li className="list-inline-item">
               <span className="text-muted">Volume: </span><span className="text-muted-less">{Float(2, BaseVolume)} </span>
               <span><strong>({formatter.format(Volume)})</strong></span>
            </li>
         </ul>
         <ul className="list-inline small">
            <li className="list-inline-item">
               <span className="text-muted">High: </span><span className="text-muted-less">{Float(8, High)} </span>
               <span><strong>({formatter.format(highUsdt)})</strong></span>
            </li>
            <li className="list-inline-item">
               <span className="text-muted">Low: </span><span className="text-muted-less">{Float(8, Low)} </span>
               <span><strong>({formatter.format(lowUsdt)})</strong></span>
            </li>
         </ul>
         <ul className="list-inline small">
            <li className="list-inline-item">
               <span className="text-muted">Bid: </span><span className="text-muted-less">{Float(8, Bid)} </span>
               <span><strong>({formatter.format(bidUsdt)})</strong></span>
            </li>
            <li className="list-inline-item">
               <span className="text-muted">Ask: </span><span className="text-muted-less">{Float(8, Ask)} </span>
               <span><strong>({formatter.format(askUsdt)})</strong></span>
            </li>
            <li className="list-inline-item">
               <span className="text-muted">Buy Orders: </span>{OpenBuyOrders}
            </li>
            <li className="list-inline-item">
               <span className="text-muted">Sell Orders: </span>{OpenSellOrders}
            </li>
         </ul>
      </div>
   )
}
Ticker.propTypes = {
   result: PropTypes.array.isRequired,
   market: PropTypes.string.isRequired,
   btcUsdt: PropTypes.number.isRequired
}

export default makeLodable(Ticker, getMarketSummary.bind(this, 'BTC-LSK'))