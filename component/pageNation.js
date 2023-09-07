const pagenation = {
    props: {
        paginationNum: Number,
        currentNum: Number,
        showRange: Number,

    },
    style:`
  
    `,
    methods: {
        // 判斷要顯示的頁碼
        showPagination(i, num1, num2) {

            if (this.$props.paginationNum <= num1 && i <= num1 + 1) {
                return true

            } else if (this.$props.paginationNum > num1) {

                if (i >= this.$props.paginationNum - num2 && i <= this.$props.paginationNum) {
                    return true

                } else if (i < this.$props.paginationNum + num2 && i >= this.$props.paginationNum) {
                    return true
                }
            }
            return false

        },
        //切換頁面
        changePage(param, i) {
   
            switch (param) {
                case "1":
                    if (this.$props.paginationNum > 1) {
                        this.$props.paginationNum -= 1
                    }
                    break;
                case "2": this.$props.paginationNum = i; break;
                case "3":
                    if (this.$props.paginationNum < this.activePagination) {
                        this.$props.paginationNum += 1
                    }
                    break;
            }
        },
    },
    computed: {
        activePagination() {
            if (this.$props.paginationNum.length > 72) {
                return Math.ceil(this.$props.paginationNum.length / 72)
            }
            return 1
        },
    },
    mounted() {
        
    },
    template: `     
    <nav aria-label="..." class="pagination-box computer">
    <ul class="pagination pagination-sm">
        <li class="page-item"><span class="page-link" @click="changePage('1')">Prev</span></li>
        <li class="page-item"><span class="page-link" v-show="paginationNum>6"
                @click="paginationNum = 1">1</span></li>

        <li class="page-item"><span class="page-link" v-show="paginationNum>6">...</span></li>

        <li class="page-item" aria-current="page" v-for="(i,index) in paginationNum"
            :class="{activePage:paginationNum==i}">
            <span class="page-link" @click="changePage('2',i)"
                v-show="showPagination(i,6,4)">{{i}}</span>
        </li>
        <li class="page-item"><span class="page-link"
                v-show="activePagination-paginationNum>5">...</span></li>
        <li class="page-item"><span class="page-link" v-show="activePagination-paginationNum>5"
                @click="paginationNum = activePagination">{{activePagination}}</span></li>
        <li class="page-item"><span class="page-link" @click="changePage('3')">Next</span></li>
    </ul>
</nav>
`
}