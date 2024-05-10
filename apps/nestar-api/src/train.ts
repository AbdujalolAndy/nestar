/*******************************************************************************************************************
ZJ-TASK:

Shunday function yozing, u berilgan arrayni ichidagi numberlarni qiymatini hisoblab qaytarsin.
MASALAN: reduceNestedArray([1, [1, 2, [4]]]) return 8

function reduceNestedArray(arr: any[]): number {
    try {
        let result = 0;
        if (!arr.every(val => typeof val === "number") && !arr[0]) throw new Error("Please, fill array with numbers!");
        for (const val of arr) {
            if (typeof val === "number") {
                result += val
            } else {
                result += reduceNestedArray(val)
            }
        }
        return result
    } catch (err: any) {
        return err.message
    }
}


console.log("Nested Arr sum:", reduceNestedArray([1, [1, 2, [4, 1, 1, [1, 2, 1, 0, [1, 1, 2, [1, 3, 5]]]]]]))
********************************************************************************************************************/

/*******************************************************************************************************************
ZK-TASK:

Shunday function yozing, u har soniyada bir marta consolega 1 dan 5 gacha bolgan raqamlarni chop etsin va 5 soniyadan
keyin ishini toxtatsin.
MASALAN: printNumbers()*/
function printNumbers(execNum: number = 5): void {
    try {
        const totalDuration = execNum + 5
        let stopInterval: number = 1
        if (execNum < 1) throw new Error("execNum should be greater then 0")
        const result = setInterval(() => {
            if (stopInterval > totalDuration) {
                clearInterval(result)
            } else if (stopInterval <= execNum) {
                console.log(stopInterval)
            }
            stopInterval++
        }, 1000)
    } catch (err: any) {
        console.log(`ERROR printNumber: ${err.message}`);
    }
}

printNumbers(5)
/********************************************************************************************************************/