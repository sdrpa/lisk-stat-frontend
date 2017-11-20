import React, { Component } from 'react'

import { getTicker } from './api'

function BTC(WrappedComponent) {
   class Loader extends Component {
      constructor(props) {
         super(props);

         this.state = {
            btcUsdt: null, 
            fetching: false, 
            error: null
         }
      }

      componentDidMount() {
         this.setState({ fetching: true })
         
         getTicker('USDT-BTC').then(result => {
            this.setState({ 
               btcUsdt: result.Last,
               fetching: false
            })
         }, error => {
            this.setState({ 
               btcUsdt: null,
               fetching: false,
               error: error 
            })
         })
      }

      render() {
         const { btcUsdt, fetching, error } = this.state;

         if (error) {
            return (
               <div className="alert alert-danger">
                  <strong>Oops!</strong> {error}
               </div>
            )
         }
         if (!btcUsdt && !fetching) {
            return <h3>No data to show.</h3>
         }
         if (fetching) {
            return <div >Loading...</div>;
         }
         return ( 
            <WrappedComponent { ...this.props }
               btcUsdt={btcUsdt}
            />
         );
      }
   }

   return Loader
}

export default BTC
