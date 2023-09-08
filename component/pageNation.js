const pagenation = {
    props: {
        length:Number,
        showNum:Number,
        paginationNum: Number,
        currentNum: Number,
        showRange1: Number,
        showRange2: Number,
        className: String,
    },
    methods: {
        //切換頁面
        changePage(param, i) {
            switch (param) {
                case "1":
                    if (this.$props.currentNum > 1) {
                        this.$props.currentNum -= 1

                        this.$emit("getCurrentNum", [param, 1])
                    }
                    break;
                case "2": this.$props.currentNum = i;
                    this.$emit("getCurrentNum", [param, i])
                    break;
                case "3":
                    if (this.$props.currentNum < this.$props.paginationNum) {
                        this.$props.currentNum += 1
                        this.$emit("getCurrentNum", [param, 1])
                    }
                    break;
                case "4":
                    this.$emit("getCurrentNum", [param, 1])
                    break;
                case "5":
                    this.$emit("getCurrentNum", [param, this.$props.paginationNum])
                    break;
            }

        },
        /**
         * 判斷要顯示的頁碼
         * @param {Number} i 所有頁碼的變數 
         * @param {Number} range_1  控制1~range_1的頁碼，超過後即出現"1.."
         * @param {Number} range_2  控制currnetNum左右顯示的數量
         * @returns 
         */
        showPagination(i, range_1, range_2) {
            //例:currentNum = 1  range_1 = 6 i<6+1  顯示 1~7
            if (this.$props.currentNum <= range_1 && i <= range_1 + 1) {
                return true
            
                //大於range_1 即出現 "1..."，以currentNum左右延伸數字例:currenyNum = 10 顯示  6~10~14
            } else if (this.$props.currentNum > range_1) {
                //例:currentNum = 10 range_2 = 4  i>=10-4  && i<= 10 等於顯示6~10
                if (i >= this.$props.currentNum - range_2 && i <= this.$props.currentNum) {
                    return true

                 //例:currentNum = 10 range_2 = 4  i< 10  i>=10-4  等於顯示10~14
                } else if (i <= this.$props.currentNum + range_2 && i >= this.$props.currentNum) {
                    return true
                }
            }
            return false
        },

    },
    template: `     
    <nav aria-label="..." class="pagination-box" :class="className">
    <ul class="pagination pagination-sm">
        <li class="page-item"><span class="page-link" @click="changePage('1')">Prev</span></li>
        <li class="page-item"><span class="page-link" v-show="currentNum>showRange1"
                @click="changePage('4')">1</span></li>

        <li class="page-item"><span class="page-link" v-show="currentNum>showRange1">...</span></li>

        <li class="page-item" aria-current="page" v-for="(i,index) in paginationNum"
            :class="{activePage:currentNum==i}">
            <span class="page-link" @click="changePage('2',i)"
                v-show="showPagination(i,showRange1,showRange2)">{{i}}</span>
        </li>
        <li class="page-item"><span class="page-link"
                v-show="paginationNum-currentNum>showRange2">...</span></li>
        <li class="page-item"><span class="page-link" v-show="paginationNum-currentNum>showRange2"
                @click="changePage('5')">{{paginationNum}}</span></li>
        <li class="page-item"><span class="page-link" @click="changePage('3')">Next</span></li>
    </ul>
</nav>
`
}