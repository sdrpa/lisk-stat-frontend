import React from 'react'
import PropTypes from 'prop-types'

import { Float } from './fn'
import { getOrderBook } from './api'
import makeLodable from './loadable'
import OrderBookTable from './order-book-table'

const OrderBook = ({ result, btcUsdt }) => {
   const transform = data => {
      return data.map(o => { 
         return { 
            quantity: o.Quantity,
            rate: o.Rate,
            total: (o.Quantity * o.Rate),
            totalUsdt: (o.Quantity * o.Rate * btcUsdt) }
      })
   }

   const totalBuy = transform(result.buy)
      .map(o => o.total)
      .reduce((total, amount) => total + amount)
   const totalSell = transform(result.sell)
      .map(o => o.total)
      .reduce((total, amount) => total + amount)

   const renderRatio = ratio => {
      let style = (ratio >= 1) ? 'text-success' : 'text-danger'
      return <span className={style}>{Float(2, ratio)}</span>
   }

   return (
      <div>
         <div className="row">
            <div className="col-md-1">
               <span className="text-success">{Float(0, totalBuy)}</span>
            </div>
            <div className="col-md-1">
               <span className="text-danger">{Float(0, totalSell)}</span>
            </div>
            <div className="col-md-1">
               {renderRatio(totalBuy/totalSell)}
            </div>
         </div>
         <div className="row mb-3">
            <div className="col-md-6">
               <OrderBookTable
                  title="Buy"
                  orderType="BUY"
                  btcUsdt={btcUsdt}
                  data={transform(result.buy)} />
            </div>
            <div className="col-md-6 mb-2">
               <OrderBookTable
                  title="Sell"
                  orderType="SELL"
                  btcUsdt={btcUsdt}
                  data={transform(result.sell)} />
            </div>
         </div>
      </div>
   )
}
OrderBook.propTypes = {
   result: PropTypes.object.isRequired,
   btcUsdt: PropTypes.number.isRequired
}

export default makeLodable(OrderBook, getOrderBook.bind(this, 'BTC-LSK'))
