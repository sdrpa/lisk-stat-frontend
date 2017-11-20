import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { formatter } from './fn'
import { getMarketHistory } from './api'
import makeLodable from './loadable'
import MarketHistoryTable from './market-history-table'
import 'rc-slider/assets/index.css'
import Slider from 'rc-slider'

const transform = data =>  {
   return data.map(o => { 
      return {
         timeStamp: o.TimeStamp,
         quantity: o.Quantity,
         price: o.Price,
         total: o.Total,
         orderType: o.OrderType
      }
   })
}

class MarketHistory extends Component {
   constructor(props) {
      super(props)

      const result = transform(this.props.result)

      this.state = {
         filteredData: result,
         sliderValue: 0, // slider value in range [0, 100]
         currentValue: 0 // actual value
      }
   }

   render() {
      const { btcUsdt } = this.props

      const onSliderChange = sliderValue => {
         this.setState({ sliderValue })
      }

      const onAfterChange = sliderValue => {
         const result = transform(this.props.result)
         const min = Math.min.apply(Math, result.map(o => o.total))
         const max = Math.max.apply(Math, result.map(o => o.total))
         const limit = sliderValue.map(0, 100, min, max)

         this.setState(prevState => {
            let filteredData = result.filter(o => o.total > limit)
            if (filteredData.length === 0) {
               filteredData = result.filter(o => o.total === max)
            }
            return {
               filteredData,
               sliderValue: prevState.sliderValue,
               currentValue: limit
            }
         })
      }

      const { filteredData } = this.state
      const result = transform(this.props.result)
      const min = Math.min.apply(Math, result.map(o => o.total))
      const max = Math.max.apply(Math, result.map(o => o.total))
      const { currentValue } = this.state
      return (
         <div>
            <div className="row mb-1">
               <div className="col-md-12">
                  <MarketHistoryTable
                     title="Market History"
                     btcUsdt={btcUsdt}
                     data={filteredData} />
               </div>
            </div>
            <div className="row">
               <div className="col-md-1">
                  {(currentValue === 0)
                     ? formatter.format(min * btcUsdt)
                     : formatter.format(currentValue * btcUsdt)
                  }
               </div>
               <div className="col-md-9">
                  <Slider value={this.state.sliderValue}
                     onChange={onSliderChange} onAfterChange={onAfterChange} />
               </div>
               <div className="col-md-1">{formatter.format(min * btcUsdt)}</div>
               <div className="col-md-1">{formatter.format(max * btcUsdt)}</div>
            </div>
         </div>
      )
   }
}
MarketHistory.propTypes = {
   result: PropTypes.array.isRequired,
   btcUsdt: PropTypes.number.isRequired
}

export default makeLodable(MarketHistory, getMarketHistory.bind(this, 'BTC-LSK'))
