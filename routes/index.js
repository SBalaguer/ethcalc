'use strict';

const { Router } = require('express');
const router = new Router();
const axios = require('axios');

router.get('/', (req, res, next) => {
  res.json({ type: 'success', data: { title: 'Hello World' } });
});

router.get('/test', async (req ,res, next)=>{
  try{
    const response = await axios.post("http://127.0.0.1:5000/find", {data:["0x7a250d5630b4cf539739df2c5dacb4c659f2488d", "0xf164fc0ec4e93095b804a4795bbe1e041497b92a"]});
    res.json({"message":response.data.info});
  } catch (error) {
    next(error);
    console.log(error);
  }
});

// router.get('/uniswap-gas',(req,res,next)=>{
//   const data = uniswapData;
//   const aggregatedData = {};

//   data.map(contract =>{
//     contract.map(value=>{
//       if (!aggregatedData[value[0]/1000]) {
//         aggregatedData[value[0]/1000]={
//           ethPrice: value[2],
//           ethFeesSpent:value[7],
//           usdFeesSpent:value[8],
//           ethFeesUsed:value[9],
//           usdFeesUsed:value[10]
//         };
//       } else {
//         aggregatedData[value[0]/1000]={
//           ethPrice: value[2],
//           ethFeesSpent:aggregatedData[value[0]/1000].ethFeesSpent +value[7],
//           usdFeesSpent:aggregatedData[value[0]/1000].usdFeesSpent +value[8],
//           ethFeesUsed:aggregatedData[value[0]/1000].ethFeesUsed +value[9],
//           usdFeesUsed:aggregatedData[value[0]/1000].usdFeesUsed +value[10]
//         };
//       }
//     });
//   });
// const dates = Object.keys(aggregatedData).sort(function(a, b){return Number(a)-Number(b)});

// res.json({dates,aggregatedData});

// });


module.exports = router;
