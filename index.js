const Vue = require("vue")
const methods = require("./util")
// const { mount } = require("@vue/test-utils");

const app = Vue.createApp({
    data() {
        return {
            storeData: [],
            storeDetailByShow: [],
            storeDetail: [],
            storeInfo: {},
            cityName: '',
            cityNameList: [],
            areaName: '',
            areaData: [],
            areaDataByShow: [],
            activeStore: '',
            enterStoreName: '',
            enterStoreNum: '',
            currentNumByStore: 1,
            currentNumByArea: 1,
            map: null,
            myModal: null,
            callApi: false,
            localAPI: true,
            pagenationParamByStore: {
                showRange: 0,
                startPage: 0,
                pageNeighborhood: 0,
                pageCount: 0
            },
            svgHTML: ''
        }
    },
    mixins: [methods],
    methods: {
        callBackendAPI(url, callBack) {
            this.callApi = true
            return fetch(url)
                .then(res => res.json())
                .then(json => {
                    if (callBack) {
                        callBack(json)
                    }
                    this.callApi = false
                })
                .catch(err => {
                    console.log('err', err)
                    this.callApi = false
                })
        },
        getAreaData() {
            let self = this
            this.callBackendAPI('./Backend/cityName.json', function (json) {
                self.areaData = json

                self.cityNameList = self.areaData.map(item => {
                    return {
                        cityName: item.CityName,
                        engName: item.CityEngName
                    }
                })
            })

        },
        getRemoteStoreData() {
            let self = this
            let url = ''
            const params = new URLSearchParams();

            if (this.localAPI) {
                url = `./Backend/store.json`

            } else {
                params.append('city', this.convertCity(this.cityName));
                params.append('area', this.areaName);
                url = `http://localhost:3000/store?${params}`
            }

            return this.callBackendAPI(url, function (json) {
                self.storeData = json
            })
        },
        initMap(item) {
            let x = 51.505
            let y = -0.09

            this.map = L.map('map').setView([x, y], 13);

            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap'
            }).addTo(this.map);

            this.marker = L.marker([x, y]).addTo(this.map);
            this.marker.bindPopup("歡迎使用!").openPopup();
        },
        setMap(item) {
            setTimeout(() => {
                this.moveStoreChose("mapRow")
            }, 0)

            this.map.removeLayer(this.marker);
            this.marker = L.marker([item.y, item.x]).addTo(this.map);
            this.marker.bindPopup(`
            <img src='./7-11.png'>
            <p style='font-weight: bold;' class='text-center'>${item.poinName}門市</p>
            `).openPopup();
            this.map.setZoom(100);
            this.map.panTo([item.y, item.x]);//讓marker保持置中
            this.storeInfo = item//更新門市資訊
        },
        updateCity(path) {
            this.cityName = path
            this.activeStore = ""

            setTimeout(() => {
                this.moveStoreChose('choseArea')
            }, 0)
        },
        // 鄉鎮下拉選單變更(選擇完後直接進行篩選)
        changeArea(path) {
            if (!this.activeCity) return
            this.callApi = true
            this.storeDetail = []
            this.activeStore = ''
            this.areaName = path

            if (this.localAPI) {
                let storeList = this.storeData[this.activeCity].stores
                storeList.forEach(item => {
                    if (this.areaName && item.Address.includes(this.areaName)) {

                        this.storeDetail.push({
                            address: item.Address,
                            x: item.X,
                            y: item.Y,
                            poiid: item.POIID,
                            poinName: item.POIName,
                            tel: item.Telno,
                            isLavatory: item.isLavatory,
                            is7WiFi: item.is7WiFi,
                            isDining: item.isDining
                        })
                    }

                })

            } else {
                // 非localAPI時，會是選擇完鄉鎮之後才呼叫
                this.getRemoteStoreData().then(() => {
                    this.storeData.forEach(item => {
                        this.storeDetail.push({
                            address: item.Address,
                            x: item.X,
                            y: item.Y,
                            poiid: item.POIID,
                            poinName: item.POIName,
                            tel: item.Telno,
                            isLavatory: item.isLavatory,
                            is7WiFi: item.is7WiFi,
                            isDining: item.isDining
                        })
                    })
                })
            }
            setTimeout(() => {
                this.moveStoreChose('choseStore')
            }, 0)
            this.callApi = false
        },
        updateDataByStore(data) {
            this.storeDetailByShow = data
        },
        updateDataByArea(data) {
            this.areaDataByShow = data
        },
        //輸入框查詢
        searchStore(key, param) {
            let self = this

            const myModal = new bootstrap.Modal('#lightBox', {
                keyboard: false
            })

            if (!param) {
                myModal.show()
                return
            }

            this.storeDetail = []
            if (this.localAPI) {
                let columns = Object.keys(this.storeData)
                for (let i = 0; i < columns.length; i++) {
                    let storeArr = this.storeData[columns[i]].stores
                    for (let j = 0; j < storeArr.length; j++) {
                        storeArr[j][key] += ''//強制轉成字串

                        if (storeArr[j][key].includes(param)) {
                            let item = storeArr[j]
                            this.storeDetail.push({
                                address: item.Address,
                                x: item.X,
                                y: item.Y,
                                poiid: item.POIID,
                                poinName: item.POIName,
                                tel: item.Telno,
                                isLavatory: item.isLavatory,
                                is7WiFi: item.is7WiFi,
                                isDining: item.isDining
                            })
                        }
                    }
                }
                if (this.storeDetail.length < 1) {
                    myModal.show()
                }
            } else {
                const params = new URLSearchParams();
                params.append('storeName', this.enterStoreName);

                this.callBackendAPI(`http://localhost:3000/find?${params}`, function (json) {
                    if (json.poinName) {
                        self.setMap(json)
                    } else {
                        const myModal = new bootstrap.Modal('#lightBox', {
                            keyboard: false
                        })
                        myModal.show()
                    }
                })
            }
            setTimeout(() => {
                this.moveStoreChose("choseStore")
            }, 0)

        },
        moveStoreChose(target) {
            this.$nextTick(() => {
                const inputArea = this.$refs[`${target}`]
                const rect = inputArea.getBoundingClientRect(); // 獲取元素的位置和尺寸
                let yOffset = 0// 計算垂直距離以使 inputArea 出現在瀏覽器的最下方\
                let objSize = rect.height + rect.top;

                if (objSize + window.pageYOffset >= window.innerHeight) {
                    yOffset = Math.abs(window.innerHeight - objSize - window.pageYOffset);
                } else {
                    yOffset = window.innerHeight - objSize - window.pageYOffset
                }

                window.scrollTo({
                    top: yOffset,
                    behavior: 'smooth'
                });
            })
        },
        convertCity(cityName) {
            let egName = this.cityNameList.find(item => item.cityName == cityName).engName
            if (egName) {
                egName = egName.split(' ')[0]
            }

            return egName
        },
        updatePageNationParam() {
            if (window.innerWidth < 768) {
                this.pagenationParamByStore = {
                    showRange: 30,
                    startPage: 3,
                    pageNeighborhood: 1,
                    pageCount: true
                }
            } else {
                this.pagenationParamByStore = {
                    showRange: 72,
                    startPage: 7,
                    pageNeighborhood: 4,
                    pageCount: true
                }
            }
        }
    },
    computed: {
        areaList() {
            let newList = this.areaData.find(item => item.CityName == this.cityName)
            if (newList) {
                return newList.AreaList
            }
            this.areaName = ''
            return []
        },
        activeCity() {
            let newList = this.cityNameList.filter(item => item.cityName == this.cityName)
            let engNameSplit = newList[0].engName.split(' ')

            if (engNameSplit && engNameSplit.length) {
                return engNameSplit[0]
            }
            return ""
        },
    },
    mounted() {
        this.getAreaData()
        if (this.localAPI) {
            this.getRemoteStoreData()
        }

        this.initMap()
        window.addEventListener("scroll", () => {
            const element = this.$refs.mapRow
            const goTop = this.$refs.goTop

            if (this.isElementInViewport(element)) {
                // 如果元素進入可視區域，則顯示它
                goTop.style.opacity = "1";
            }
        });

        this.updatePageNationParam()
        window.addEventListener("resize", (e) => {
            this.updatePageNationParam()
        })
        
    },
})
app.mount("#app")

module.exports = app