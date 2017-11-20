import { get } from 'axios'
import moment from 'moment'

import { localhost } from './config'
const bittrex1 = `${localhost}:1337/bittrex.com/api/v1.1`
const bittrex2 = `${localhost}:1337/bittrex.com/Api/v2.0`

// https://github.com/thebotguys/golang-bittrex-api/wiki/Bittrex-API-Reference-(Unofficial)
export function getTicks(market) {
   const url = `${bittrex2}/pub/market/GetTicks?marketName=${market}&tickInterval=thirtyMin&_=${moment().unix()}`
   return get(url)
      .then(response => {
         return response.data.result
      })
      .catch(() => {
         throw 'Could not get ticks data.'
      })
}

export function getTicker(market) {
   const url = `${bittrex1}/public/getticker?market=${market}`
   return get(url)
      .then(response => {
         return response.data.result
      })
      .catch(() => {
         throw 'Could not get ticker data.'
      })
}

export function getMarketSummary(market) {
   const url = `${bittrex1}/public/getmarketsummary?market=${market}`
   return get(url)
      .then(response => {
         return response.data.result
      })
      .catch(() => {
         throw 'Could not get market summary data.'
      })
}

export function getOrderBook(market) {
   const url = `${bittrex1}/public/getorderbook?market=${market}&type=both`
   return get(url)
      .then(response => {
         return response.data.result
      })
      .catch(() => {
         throw 'Could not get order book data.'
      })
}

export function getMarketHistory(market) {
   //const url = `${apiServer1}/public/getmarkethistory?market=${market}`
   const url = `${localhost}:8182/getmarkethistory?market=${market}`
   return get(url)
      .then(response => {
         return response.data.result
      })
      .catch(() => {
         throw 'Could not get market history data.'
      })
}
