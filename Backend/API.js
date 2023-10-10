const express = require('express')
const cors = require('cors')
const fs = require('fs')

const app = express()
app.use(cors())

let storeData = ''
fs.readFile('./store.json', 'utf8', (err, data) => {
    if (err) {
        console.error('err file', err)
        return
    }
    storeData = JSON.parse(data);
})

app.get("/store", (req, res) => {
    let city = req.query.city
    let area = req.query.area
    let data = []

    try{
        data = storeData[city].stores.filter(item => item.Address.includes(area))
        res.json(data)
    }catch(err){
        res.status(500)
    }
})

app.get("/find", (req, res) => {

    let storeName = req.query.storeName
    let columns = Object.keys(storeData)
    let newData = {}

    try {
        for (let i = 0; i < columns.length; i++) {
            let storeArr = storeData[columns[i]].stores
            for (let j = 0; j < storeArr.length; j++) {
                if (storeArr[j].POIName == storeName || storeArr[j].POIID == storeName) {
                    let item = storeArr[j]
                    newData = {
                        address: item.Address,
                        x: item.X,
                        y: item.Y,
                        poiid: item.POIID,
                        poinName: item.POIName,
                        tel: item.Telno,
                        isBathRoom: item.isDining == "Y" ? "是" : "否"
                    }
                    break;
                }
            }
        }
        res.json(newData)

    } catch (err) {
        res.status(500)
    }
})

const port = 3000
app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})