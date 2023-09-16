
const methods = {
    methods: {
        goTop() {
            window.scrollTo(0, 0)
        },
        isElementInViewport(el) {
            var rect = el.getBoundingClientRect();
            var windowHeight = (window.innerHeight || document.documentElement.clientHeight);
            var windowWidth = (window.innerWidth || document.documentElement.clientWidth);
        
            // 檢查元素是否至少部分出現在視口中
            var vertInView = (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0);
            var horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);
        
            return (vertInView && horInView);
        },
    },
   
}

