const Vue = require("vue")
const app  =require("./index")
const { callBackendAPI }  = app._component.methods // 從 Vue.js 文件中取出需要測試的方法


describe('callBackendAPI function', () => {
    test('calls the callback function when successful', () => {
      // 创建一个模拟的回调函数
      const mockCallback = jest.fn();
  
      // 模拟 fetch 方法，并返回一个成功的 Promise
      global.fetch = jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ data: 'test data' }), // 模拟 JSON 数据
        })
      );

      callBackendAPI('https://example.com/api', mockCallback)
      .then(()=>{
        // 断言回调函数被调用
        expect(mockCallback).toHaveBeenCalled();
      })
    
    });
  
    // 可以添加其他测试用例，比如测试错误情况
  });
// test('a=1, b=2 加起來等於 3', function( ){
//     expect(sum(1,2)).toBe()
//  })
