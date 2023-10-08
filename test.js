let sum  =require("./index")

test('a=1, b=2 加起來等於 3', function( ){
    expect(sum(1,2)).toBe(5)
 })