import React from 'react'
import PropTypes from 'prop-types'

import { format } from 'd3-format'
import { timeFormat } from 'd3-time-format'

import { ChartCanvas, Chart } from 'react-stockcharts'
import {
   BarSeries,
   AreaSeries,
   CandlestickSeries,
   LineSeries,
   MACDSeries,
   RSISeries
} from 'react-stockcharts/lib/series'
import { XAxis, YAxis } from 'react-stockcharts/lib/axes'
import {
   CrossHairCursor,
   EdgeIndicator,
   CurrentCoordinate,
   MouseCoordinateX,
   MouseCoordinateY,
} from 'react-stockcharts/lib/coordinates'

import { discontinuousTimeScaleProvider } from 'react-stockcharts/lib/scale'
import {
   OHLCTooltip,
   MovingAverageTooltip,
   MACDTooltip,
   RSITooltip
} from 'react-stockcharts/lib/tooltip'
import { ema, macd, rsi, sma, atr } from 'react-stockcharts/lib/indicator'
import { fitWidth } from 'react-stockcharts/lib/helper'
import { last } from 'react-stockcharts/lib/utils'
import { randomString } from './random'

const macdAppearance = {
   stroke: {
      macd: '#FF0000',
      signal: '#00F300',
   },
   fill: {
      divergence: '#4682B4'
   }
}

class CandleStickChartWithRSIAndMACDIndicator extends React.Component {
   render() {
      const ema26 = ema()
         .id(0)
         .options({ windowSize: 26 })
         .merge((d, c) => {d.ema26 = c})
         .accessor(d => d.ema26)

      const ema12 = ema()
         .id(1)
         .options({ windowSize: 12 })
         .merge((d, c) => {d.ema12 = c})
         .accessor(d => d.ema12)

      const smaVolume50 = sma()
         .id(3)
         .options({ windowSize: 50, sourcePath: 'volume' })
         .merge((d, c) => {d.smaVolume50 = c})
         .accessor(d => d.smaVolume50)

      const macdCalculator = macd()
         .options({
            fast: 12,
            slow: 26,
            signal: 9,
         })
         .merge((d, c) => {d.macd = c})
         .accessor(d => d.macd)

      const rsiCalculator = rsi()
         .options({ windowSize: 14 })
         .merge((d, c) => {d.rsi = c})
         .accessor(d => d.rsi)

      const atr14 = atr()
         .options({ windowSize: 14 })
         .merge((d, c) => {d.atr14 = c})
         .accessor(d => d.atr14)

      const { data: initialData, width, ratio } = this.props
      const type = 'hybrid' //'svg', 'hybrid'

      const rsiData = ema26(ema12(smaVolume50(rsiCalculator(atr14(initialData)))))
      const macdData = smaVolume50(macdCalculator(ema12(ema26(initialData))))
      const xScaleProvider = discontinuousTimeScaleProvider
         .inputDateAccessor(d => d.date)
      const {
         data
      } = xScaleProvider(rsiData)
      
      const {
         unused, // eslint-disable-line no-unused-vars
         xScale,
         xAccessor,
         displayXAccessor,
      } = xScaleProvider(macdData)

      const xExtend = 96 // Show n last bars 
      const start = xAccessor(last(data))
      const end = xAccessor(data[Math.max(0, data.length - xExtend)])
      const xExtents = [start, end]

      return (
         <ChartCanvas 
            height={650} width={width} 
            ratio={ratio}
            margin={{ left: 70, right: 70, top: 20, bottom: 30 }}
            type={type}
            seriesName="MSFT"
            data={data}
            xScale={xScale}
            xAccessor={xAccessor}
            displayXAccessor={displayXAccessor}
            xExtents={xExtents} >

            { /* Candlestick wit ema26, ema12 */ }
            <Chart id={randomString()} 
               height={300}
               yExtents={[d => [d.high, d.low], ema26.accessor(), ema12.accessor()]}
               padding={{ top: 10, bottom: 20 }}>

               <XAxis axisAt="bottom" orient="bottom" showTicks={false} outerTickSize={0} />
               <YAxis axisAt="right" orient="right" ticks={5} />

               <MouseCoordinateY at="right" orient="right"
                  displayFormat={format('.2f')} />

               <CandlestickSeries />

               <LineSeries yAccessor={ema26.accessor()} stroke={ema26.stroke()} />
               <LineSeries yAccessor={ema12.accessor()} stroke={ema12.stroke()} />

               <CurrentCoordinate yAccessor={ema26.accessor()} fill={ema26.stroke()} />
               <CurrentCoordinate yAccessor={ema12.accessor()} fill={ema12.stroke()} />

               <EdgeIndicator 
                  itemType="last" orient="right" edgeAt="right"
                  yAccessor={d => d.close} fill={d => d.close > d.open ? '#6BA583' : '#FF0000'} />

               { /* Candlestick on mouse move stat. */}
               <OHLCTooltip 
                  origin={[-40, 0]}
                  xDisplayFormat={timeFormat('%d.%m.%Y. %H:%M:%S')} />

               <MovingAverageTooltip
                  onClick={e => console.log(e)}
                  origin={[-38, 15]}
                  options={[{
                     yAccessor: ema26.accessor(),
                     type: 'EMA',
                     stroke: ema26.stroke(),
                     windowSize: ema26.options().windowSize,
                  },
                  {
                     yAccessor: ema12.accessor(),
                     type: 'EMA',
                     stroke: ema12.stroke(),
                     windowSize: ema12.options().windowSize,
                  }]} />
            </Chart>

            { /* smaVolume50 */ }
            <Chart id={randomString()} 
               height={150}
               origin={(w, h) => [0, h - 450]}
               yExtents={[d => d.volume, smaVolume50.accessor()]}>

               <YAxis axisAt="left" orient="left" ticks={5} tickFormat={format('.0s')} />

               <MouseCoordinateY at="left" orient="left"
                  displayFormat={format('.4s')} />

               <BarSeries 
                  yAccessor={d => d.volume} 
                  fill={d => d.close > d.open ? '#6BA583' : '#FF0000'} />
               <AreaSeries 
                  yAccessor={smaVolume50.accessor()} 
                  stroke={smaVolume50.stroke()}
                  fill={smaVolume50.fill()} />
            </Chart>

            { /* RSI */ }
            <Chart id={randomString()}
               height={125} 
               origin={(w, h) => [0, h - 290]}
               yExtents={[0, 100]}>

               <XAxis axisAt="bottom" orient="bottom" 
                  showTicks={false} />
               <YAxis axisAt="right" orient="right"
                  tickValues={[30, 50, 70]} />

               <MouseCoordinateY at="right" orient="right"
                  displayFormat={format('.2f')} />

               <RSISeries yAccessor={d => d.rsi} />

               <RSITooltip origin={[-38, 15]}
                  yAccessor={d => d.rsi}
                  options={rsiCalculator.options()} />
            </Chart>

            { /* MACD */ }
            <Chart id={randomString()}
               height={150}
               yExtents={macdCalculator.accessor()}
               origin={(w, h) => [0, h - 160]} padding={{ top: 10, bottom: 0 }}>

               <XAxis axisAt="bottom" orient="bottom" />
               <YAxis axisAt="right" orient="right" ticks={5} />

               { /* X coord on mouse move */ }
               <MouseCoordinateX at="bottom" orient="bottom"
                  displayFormat={timeFormat('%H:%M:%S %d.%m.%Y.')} />
               <MouseCoordinateY at="right" orient="right"
                  displayFormat={format('.2f')} />

               <MACDSeries 
                  yAccessor={d => d.macd}
                  {...macdAppearance} />
               <MACDTooltip
                  origin={[-38, 15]}
                  yAccessor={d => d.macd}
                  options={macdCalculator.options()}
                  appearance={macdAppearance} />
            </Chart>

            <CrossHairCursor />
         </ChartCanvas>
      )
   }
}

CandleStickChartWithRSIAndMACDIndicator.propTypes = {
   data: PropTypes.array.isRequired,
   width: PropTypes.number.isRequired,
   ratio: PropTypes.number.isRequired
}

export default fitWidth(CandleStickChartWithRSIAndMACDIndicator)
