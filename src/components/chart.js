import React from 'react'
import PropTypes from 'prop-types'

import { getTicks } from './api'
import makeLodable from './loadable'
import CandleStickChartWithRSIAndMACDIndicator from './candlestick-rsi-macd-chart'

const Chart = ({ result, market, btcUsdt }) => {
   const transform = data => {
      return data.map(o => { 
         return { 
            close: o.C * btcUsdt,
            high: o.H * btcUsdt,
            low: o.L * btcUsdt,
            open: o.O * btcUsdt,
            date: new Date(o.T),
            volume: Math.round(o.V / btcUsdt * 10)
         }
      })
   }
   const data = transform(result)

   return (
      <div>
         <CandleStickChartWithRSIAndMACDIndicator 
            data={data} 
            seriesName={market}
            width={window.innerWidth} />
      </div>
   )
}
Chart.propTypes = {
   result: PropTypes.array.isRequired,
   market: PropTypes.string.isRequired,
   btcUsdt: PropTypes.number.isRequired
}

export default makeLodable(Chart, getTicks.bind(this, 'BTC-LSK'))
