const pagenation = {
    props: {
        data: {
            type: Array,
            default: []
        },
        showRange: {
            type: Number,
            default: 30
        },
        //開始時要呈現多少頁碼
        startPage: {
            type: Number,
            default: 7,
        },
        pageNeighborhood: {
            type: Number,
            default: 1
        },
        pageCount: {
            type: Boolean,
            default: true
        },
        className: String,
    },
    data() {
        return {
            currentNum: 1,
            startPageResult: 0,
        }
    },
    computed: {
        //計算總共頁碼
        pagenationNum() {
            let length = this.$props.data ? this.$props.data.length : 0;
            let range = this.$props.showRange
            if (length > range) {
                return Math.ceil(length / range)
            }
            return 1
        },
        //是否顯示符合項目比數
        showPageCount() {
            let show = this.$props.pageCount;
            let data = this.$props.data;
            if (show && data && data.length) {
                return true
            }

            return false
        },
    },
    watch: {
        //判斷當下頁碼回傳範圍資料到父層
        currentNum: {
            handler(newVal) {
                this.updateUI()
            },
        },
        data: {
            handler(newVal, oldVal) {
                this.currentNum = 1
                this.updateUI()
            },
            deep: true
        }
    },
    mounted() {
        console.log('page')
        this.startPageHandle()
    },
    methods: {
        /**
         * 切換頁面
         * @param {String} param 更新頁碼得方法
         * @param {Number} i 傳送的頁碼 
         */
        changePage(param, i) {
            let length = this.pagenationNum;
            // let currentNum = this.currentNum;

            switch (param) {
                case "1":
                    if (this.currentNum > 1) {
                        this.currentNum -= 1
                        // this.$emit("getCurrentNum", currentNum)
                    }
                    break;
                case "2": this.currentNum = i;
                    // this.$emit("getCurrentNum", currentNum)
                    break;
                case "3":
                    if (this.currentNum < length) {
                        this.currentNum += 1
                        // this.$emit("getCurrentNum", currentNum)
                    }
                    break;
                case "4":
                    this.currentNum = 1
                    // this.$emit("getCurrentNum", 1)
                    break;
                case "5":
                    this.currentNum = length
                    // this.$emit("getCurrentNum", length)
                    break;
            }

        },
        /**
         * 判斷要顯示的頁碼
         * @param {Number} i 所有頁碼的變數 
         * @returns boolean
         */
        showPagination(i) {
            let currentNum = this.currentNum;
            // let range_1 = this.$props.startPage;
            let range_1 = this.startPageResult;
            let range_2 = this.$props.pageNeighborhood;

            //例:currentNum = 1  range_1 = 6 i<6+1  顯示 1~7
            if (currentNum < range_1 && i <= range_1) {
                return true

                //大於range_1 即出現 "1..."，以currentNum左右延伸數字例:currenyNum = 10 顯示  6~10~14
            } else if (currentNum >= range_1) {
                //例:currentNum = 10 range_2 = 4  i>=10-4  && i<= 10 等於顯示6~10
                if (i >= currentNum - range_2 && i <= currentNum) {
                    return true

                    //例:currentNum = 10 range_2 = 4  i< 10  i>=10-4  等於顯示10~14
                } else if (i <= currentNum + range_2 && i >= currentNum) {
                    return true
                }
            }
            return false
        },
        updateUI() {
            let newData = []
            let data = this.$props.data
            let ranage = this.$props.showRange
            let newVal = this.currentNum

            if (data && data.length) {
                if (data.length > ranage) {
                    for (let i = 0; i < data.length; i++) {
                        if (i >= ranage * (newVal - 1) && i < ranage * (newVal - 1) + ranage) {
                            newData.push(data[i])
                        }
                    }
                    this.$emit("updateData", newData)
                } else {
                    this.$emit("updateData", data)
                }
            } else {
                this.$emit("updateData", [])
            }
        },
        startPageHandle() {
            //TODO 總頁數10頁以下不要給他設定showpage
            this.$nextTick(() => {
                this.startPageResult = this.$props.startPage
                let pageNum = this.pagenationNum

                if(pageNum < 5){
                    this.startPageResult = 7;
                    
                }
            })
        }
    },
    template: `     
    <nav aria-label="..."  :class="className">
    <div class="quantity">
    <span  v-if="showPageCount">符合條件的項目，共<span
            class="number">{{ data && data.length?data.length:0 }}</span>筆</span>
    </div>
    <div class="pagination-box">
    <ul class="pagination pagination-sm">
        <li class="page-item"><span class="page-link" @click="changePage('1')">Prev</span></li>
        <li class="page-item"><span class="page-link" v-show="!showPagination(1)"
                @click="changePage('4')">1</span></li>

        <li class="page-item"><span class="page-link" v-show="!showPagination(1)">...</span></li>

        <li class="page-item" aria-current="page" v-for="(i,index) in pagenationNum"
            :class="{activePage:currentNum==i}">
            <span class="page-link" @click="changePage('2',i)"
                v-show="showPagination(i)">{{i}}</span>
        </li>
        <li class="page-item"><span class="page-link"
                v-show="pagenationNum-currentNum>pageNeighborhood && !showPagination(pagenationNum)">...</span></li>

        <li class="page-item"><span class="page-link" v-show="pagenationNum-currentNum>pageNeighborhood && !showPagination(pagenationNum)"
                @click="changePage('5')">{{pagenationNum}}</span></li>

        <li class="page-item"><span class="page-link" @click="changePage('3')">Next</span></li>
    </ul>
    </div>
</nav>
`
}
