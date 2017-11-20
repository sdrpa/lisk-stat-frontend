import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Float, formatter } from './fn'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import 'rc-slider/assets/index.css'
import Slider from 'rc-slider'

class OrderBookTable extends Component {
   constructor(props) {
      super(props)

      const { data } = this.props

      this.state = {
         fData: data,
         sliderValue: 0, // slider value in range [0, 100]
         currentValue: 0 // actual value
      }
   }

   render() {
      const { title, data, orderType, btcUsdt } = this.props
      
      const total = data
         .map(o => o.total)
         .reduce((total, amount) => total + amount)
      const avg = total/data.length // Avg in BTC

      const renderQuantity = row => {
         const value = Float(2, row.value)
         return <div className="text-right">{value}</div>
      }
      const renderRate = row => {
         const value = Float(8, row.value)
         const valueUsdt = Float(2, row.value * btcUsdt)
         return <div className="text-right">
            {value} <span className="text-muted">${valueUsdt}</span>
         </div>
      }
      const renderTotalBTC = row => {
         const value = Float(8, row.value)
         return <div className="text-right">
            {value}
         </div>
      }
      const renderTotalUSDT = row => {
         let bigValue = 10000
         const value = Float(2, row.value)
         var textStyle = (value/btcUsdt) > avg ? 'text-strong' : 'text-muted'
         if (value > bigValue) {
            textStyle += orderType === 'BUY' ? ' text-success' : ' text-danger'
         }
         return <div className={`text-right ${textStyle}`}>
            {formatter.format(value)}
         </div>
      }

      const columns = [{
         Header: 'Quantity',
         accessor: 'quantity',
         Cell: row => renderQuantity(row)
      }, {
         Header: 'Rate (BTC)',
         accessor: 'rate',
         Cell: row => renderRate(row)
      }, {
         Header: 'Total (USDT)',
         accessor: 'totalUsdt',
         Cell: row => renderTotalUSDT(row)
      }, {
         Header: 'Total (BTC)',
         accessor: 'total',
         Cell: row => renderTotalBTC(row)
      }]

      const onSliderChange = sliderValue => {
         this.setState({ sliderValue })
      }

      // Here we need to set the max value in btc manually, since there are some
      // extremenly big orders so range between min and max value can be very big
      // making very hard to fine tune small values.
      const min = 0
      const max = 1

      const onAfterChange = sliderValue => {
         const { data } = this.props
         const limit = sliderValue.map(0, 100, min, max)

         this.setState(prevState => {
            let fData = data.filter(o => o.total > limit)
            if (fData.length === 0) {
               fData = data.filter(o => o.total === max)
            }
            return {
               fData,
               sliderValue: prevState.sliderValue,
               currentValue: limit
            }
         })
      }

      const { fData } = this.state
      const { currentValue, sliderValue } = this.state
      return (
         <div>
            <div className="row mb-1">
               <div className="col-md-12">
                  <h3>{title}</h3>
                  <ReactTable
                     className="-highlight"
                     data={fData}
                     columns={columns}
                     defaultPageSize={15} />
               </div>
            </div>
            <div className="row small">
               <div className="col-md-2">
                  {(currentValue === 0)
                     ? formatter.format(min * btcUsdt)
                     : formatter.format(currentValue * btcUsdt)
                  }
               </div>
               <div className="col-md-6">
                  <Slider value={sliderValue}
                     onChange={onSliderChange} onAfterChange={onAfterChange} />
               </div>
               <div className="col-md-2">{formatter.format(min * btcUsdt)}</div>
               <div className="col-md-2">{formatter.format(max * btcUsdt)}</div>
            </div>
         </div>
      )
   }
}
OrderBookTable.propTypes = {
   title: PropTypes.string.isRequired,
   data: PropTypes.array.isRequired,
   orderType: PropTypes.string.isRequired,
   btcUsdt: PropTypes.number.isRequired
}

export default OrderBookTable
