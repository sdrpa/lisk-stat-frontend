export const Float = (places, n) => {
   return n.toFixed(places)
}

export const formatter = new Intl.NumberFormat('en-US', {
   style: 'currency',
   currency: 'USD',
   minimumFractionDigits: 2,
   // the default value for minimumFractionDigits depends on the currency
   // and is usually already 2
})

Number.prototype.map = function(in_min, in_max, out_min, out_max) {
   return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
