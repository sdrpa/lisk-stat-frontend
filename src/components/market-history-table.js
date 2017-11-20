import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import { Float, formatter } from './fn'
import ReactTable from 'react-table'
import 'react-table/react-table.css'

const MarketHistoryTable = ({ title, btcUsdt, data }) => {
   const total = data
      .map(o => o.total)
      .reduce((total, amount) => total + amount)
   const avg = total/data.length // Avg in BTC

   const renderOrderType = row => {
      let style = (row.value === 'BUY') ? 'text-success' : 'text-danger'
      return <div className={style}>{row.value}</div>
   }
   const renderTimestamp = row => {
      const value = moment(row.value).utcOffset(+120).locale('sr').format('LTS')
      return <div className="text-right">{value}</div>
   }
   const renderQuantity = row => {
      const value = Float(2, row.value)
      return <div className="text-right">{value}</div>
   }
   const renderBTC = row => {
      const value = Float(8, row.value)
      return <div className="text-right">{value}</div>
   }
   const renderUSDT = row => {
      let bigValue = 10000
      const value = Float(2, row.value * btcUsdt)
      var textStyle = (value/btcUsdt) > avg ? 'text-strong' : 'text-muted'
      if (value > bigValue) {
         textStyle += row.original.orderType === 'BUY' ? ' text-success' : ' text-danger'
      }
      return <div className={`text-right ${textStyle}`}>
         {formatter.format(value)}
      </div>
   }

   const columns = [{
      Header: 'Order Type',
      accessor: 'orderType',
      Cell: row => renderOrderType(row)
   }, {
      Header: 'Quantity',
      accessor: 'quantity',
      Cell: row => renderQuantity(row)
   }, {
      Header: 'Total (USDT)',
      accessor: 'total',
      Cell: row => renderUSDT(row)
   }, {
      Header: 'Price (USDT)',
      accessor: 'price',
      Cell: row => renderUSDT(row)
   }, {
      Header: 'Price (BTC)',
      accessor: 'price',
      Cell: row => renderBTC(row)
   }, {
      Header: 'Total (BTC)',
      accessor: 'total',
      Cell: row => renderBTC(row)
   }, {
      Header: 'Time',
      accessor: 'timeStamp',
      Cell: row => renderTimestamp(row)
   }]

   const stat = {
      buyCount: data.filter(o => o.orderType === 'BUY').length,
      sellCount: data.filter(o => o.orderType === 'SELL').length,
   }
   const renderRatio = ratio => {
      let style = (ratio >= 1) ? 'text-success' : 'text-danger'
      return <span className={style}>{Float(2, ratio)}</span>
   }

   return (
      <div>
         <h3>{title}&nbsp;
            <small>
               <span className="text-success">{stat.buyCount}</span>/
               <span className="text-danger">{stat.sellCount}</span>&nbsp;
               ({renderRatio(stat.buyCount / stat.sellCount)})
            </small>
         </h3>
         <ReactTable
            className="-highlight"
            data={data}
            columns={columns}
            defaultPageSize={15}
            getTrProps={(state, rowInfo) => {
               if (!rowInfo) {
                  return {
                     style: {
                        background: 'white'
                     }
                  }
               }
               const orderType = rowInfo.original.orderType
               return {
                  style: {
                     background: (orderType === 'BUY') 
                        ? 'rgba(48, 166, 74, .08)'
                        : 'rgba(218, 55, 73, .08)'
                  }
               }
            }} />
      </div>
   )
}
MarketHistoryTable.propTypes = {
   title: PropTypes.string.isRequired,
   btcUsdt: PropTypes.number.isRequired,
   data: PropTypes.array.isRequired
}

export default MarketHistoryTable
