import React, { Component } from 'react'

function makeLodable(WrappedComponent, fn) {
   class Loader extends Component {
      constructor(props) {
         super(props);

         this.state = {
            result: null, 
            fetching: false, 
            error: null
         }
      }

      componentDidMount() {
         this.setState({ fetching: true })
         
         fn().then(result => {
            this.setState({ 
               result: result,
               fetching: false
            })
         }, error => {
            this.setState({ 
               result: null,
               fetching: false,
               error: error 
            })
         })
      }

      render() {
         const { result, fetching, error } = this.state;

         if (error) {
            return (
               <div className="alert alert-danger">
                  <strong>Oops!</strong> {error}
               </div>
            )
         }
         if (!result && !fetching) {
            return <h3>No data to show.</h3>
         }
         if (fetching) {
            return <div >Loading...</div>;
         }
         return ( 
            <WrappedComponent { ...this.props }
               result={result}
            />
         );
      }
   }

   return Loader
}

export default makeLodable
