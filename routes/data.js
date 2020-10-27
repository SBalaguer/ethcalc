'use strict';

const { Router } = require('express');
const router = new Router();
const Contract = require('../models/contracts');
const Data = require('../models/data');
const Export = require('../models/exportableData');
const axios = require('axios');
const moment = require('moment')

router.get('/all', async (req, res, next) => {
    //gets all data in the db.
    try {
        const allData = await Data.find().exec();
        res.json({ type: 'success', data: allData });
    } catch (error) {
        console.log(error);
        next(error);
    }
});

// router.get('/generate-exportable', async (req,res,next)=>{
//   try {
//     const allData = await Data.find().populate('project').exec();
//     allData.forEach((value)=>{
//       value.data.forEach(async (info) =>{
//         const data = {
//           name: value.project.name,
//           day:info.day,
//           ethPrice:info.ethPrice,
//           ethFeesSpent:info.ethFeesSpent,
//           usdFeesSpent:info.usdFeesSpent,
//           ethFeesUsed:info.ethFeesUsed,
//           usdFeesUsed:info.usdFeesUsed
//         };
//         await Export.create(data);
//       });
//     });
//     res.json({"message":"success"});
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// });

router.get('/summary', async (req, res, next) => {
  //gets all data in the db, sends a summary to the Front End.
  try {
      const allData = await Data.find().populate('project').exec();
      const summary = allData.reduce((acc,project)=>{
        let projcObj = {
          project:project.project
        };

        const data = project.data;

        const lastDayWithData = data.sort((a,b)=> b.day-a.day)[0].day;
        
        const PM = {
          count:0,
          ethPrice: 0,
          ethFeesSpent: 0,
          usdFeesSpent: 0,
          ethFeesUsed: 0,
          usdFeesUsed: 0,
          total: 0
        }; 
        const P3M = {
          count:0,
          ethPrice: 0,
          ethFeesSpent: 0,
          usdFeesSpent: 0,
          ethFeesUsed: 0,
          usdFeesUsed: 0,
          total: 0
        }; 
        const P6M = {
          count:0,
          ethPrice: 0,
          ethFeesSpent: 0,
          usdFeesSpent: 0,
          ethFeesUsed: 0,
          usdFeesUsed: 0,
          total: 0
          
        }; 
        const CY = {
          count:0,
          ethPrice: 0,
          ethFeesSpent: 0,
          usdFeesSpent: 0,
          ethFeesUsed: 0,
          usdFeesUsed: 0,
          total: 0
        }; 
        const STD = {
          count:0,
          ethPrice: 0,
          ethFeesSpent: 0,
          usdFeesSpent: 0,
          ethFeesUsed: 0,
          usdFeesUsed: 0,
          total: 0
        }; 
        const firstDay = data.sort((a,b)=> a.day-b.day)[0].day;

        data.forEach(value =>{

          if (moment(value.day*1000).isSameOrAfter(moment(lastDayWithData*1000).subtract(6,"M"))) {
            //I'm in the P6M territory
            P6M.count = P6M.count + 1;
            P6M.ethPrice = P6M.ethPrice + value.ethPrice;
            P6M.ethFeesSpent = P6M.ethFeesSpent + value.ethFeesSpent;
            P6M.usdFeesSpent = P6M.usdFeesSpent + value.usdFeesSpent;
            P6M.ethFeesUsed = P6M.ethFeesUsed + value.ethFeesUsed;
            P6M.usdFeesUsed = P6M.usdFeesUsed + value.usdFeesUsed;
            P6M.total = P6M.total + 1;
          }

          if (moment(value.day*1000).isSameOrAfter(moment(lastDayWithData*1000).subtract(3,"M"))) {
            //I'm in the P3M territory
            P3M.count = P3M.count + 1;
            P3M.ethPrice = P3M.ethPrice + value.ethPrice;
            P3M.ethFeesSpent = P3M.ethFeesSpent + value.ethFeesSpent;
            P3M.usdFeesSpent = P3M.usdFeesSpent + value.usdFeesSpent;
            P3M.ethFeesUsed = P3M.ethFeesUsed + value.ethFeesUsed;
            P3M.usdFeesUsed = P3M.usdFeesUsed + value.usdFeesUsed;
            P3M.total = P3M.total + 1;
          }

          if (moment(value.day*1000).isSameOrAfter(moment(lastDayWithData*1000).subtract(1,"M"))) {
            //I'm in the PM territory
            PM.count = PM.count + 1;
            PM.ethPrice = PM.ethPrice + value.ethPrice;
            PM.ethFeesSpent = PM.ethFeesSpent + value.ethFeesSpent;
            PM.usdFeesSpent = PM.usdFeesSpent + value.usdFeesSpent;
            PM.ethFeesUsed = PM.ethFeesUsed + value.ethFeesUsed;
            PM.usdFeesUsed = PM.usdFeesUsed + value.usdFeesUsed;
            PM.total = PM.total + 1;
          }

          if (moment(value.day*1000).isSame(moment(lastDayWithData*1000),"year")) {
            //get CY --> calendar year
            CY.count = CY.count + 1;
            CY.ethPrice = CY.ethPrice + value.ethPrice;
            CY.ethFeesSpent = CY.ethFeesSpent + value.ethFeesSpent;
            CY.usdFeesSpent = CY.usdFeesSpent + value.usdFeesSpent;
            CY.ethFeesUsed = CY.ethFeesUsed + value.ethFeesUsed;
            CY.usdFeesUsed = CY.usdFeesUsed + value.usdFeesUsed;
            CY.total = CY.total + 1;
          }
          
          //get STD --> spend to date
          STD.count = STD.count + 1;
          STD.ethPrice = STD.ethPrice + value.ethPrice;
          STD.ethFeesSpent = STD.ethFeesSpent + value.ethFeesSpent;
          STD.usdFeesSpent = STD.usdFeesSpent + value.usdFeesSpent;
          STD.ethFeesUsed = STD.ethFeesUsed + value.ethFeesUsed;
          STD.usdFeesUsed = STD.usdFeesUsed + value.usdFeesUsed;
          STD.total = STD.total + 1;
        });

        const crunchedData = {
          PM,
          P3M,
          P6M,
          CY,
          STD,
          firstDay
        };

        projcObj = {...projcObj, data: crunchedData};

        return [...acc , projcObj];
        
      },[]);


      res.json({ type: 'success', data: summary });
      
  } catch (error) {
      console.log(error);
      next(error);
  }
});

router.get('/:id', async (req,res,next)=>{
    //gets all data for a specific project
    const projectId = req.params.id;
    try {
        const projectData = await Data.find({project:projectId}).populate('project').exec();
        res.json({ type: 'success', data: projectData });
    } catch (error) {
        console.log(error);
        next(error);
    }
});

router.get('/create/:id', async (req, res, next) => {
    //const projectName = req.params.name;
    const projectId = req.params.id;
    try {
        const projectInfo = await Contract.findById(projectId).exec();
        const projectContracts = projectInfo.contracts;
        const response = await axios.post("http://127.0.0.1:5000/find", {data: projectContracts});
        const projectData = response.data.info[0];
        const aggregatedData = {};

        projectData.map(value =>{
              let date = value[0].replace("(","").replace(")","").split(",");
              date = Date.UTC(Number(date[0]),Number(date[1]),Number(date[2]));
              if (!aggregatedData[date/1000]) {
                aggregatedData[date/1000]={
                  ethPrice: Number(value[2]),
                  ethFeesSpent:Number(value[7]),
                  usdFeesSpent:Number(value[8]),
                  ethFeesUsed:Number(value[9]),
                  usdFeesUsed:Number(value[10])
                };
              } else {
                aggregatedData[date/1000]={
                  ethPrice: value[2],
                  ethFeesSpent:aggregatedData[date/1000].ethFeesSpent + Number(value[7]),
                  usdFeesSpent:aggregatedData[date/1000].usdFeesSpent + Number(value[8]),
                  ethFeesUsed:aggregatedData[date/1000].ethFeesUsed + Number(value[9]),
                  usdFeesUsed:aggregatedData[date/1000].usdFeesUsed + Number(value[10])
                };
              }
          });
        
        const data = [];

        for (const key in aggregatedData) {
            const dataObj = {
              day: Number(key),
              ethPrice: aggregatedData[key].ethPrice,
              ethFeesSpent: aggregatedData[key].ethFeesSpent,
              usdFeesSpent: aggregatedData[key].usdFeesSpent,
              ethFeesUsed: aggregatedData[key].ethFeesUsed,
              usdFeesUsed: aggregatedData[key].usdFeesUsed
            };
            data.push(dataObj);
          }
        const newData = await Data.create({project: projectId, data});
        res.json({"data": newData});
    } catch (error) {
        console.log(error);
        next(error);
    }

});

module.exports = router;
