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
MASALAN: printNumbers()

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
********************************************************************************************************************/

/*******************************************************************************************************************
ZL-TASK:

Shunday function yozing, u parametrda berilgan stringni kebab casega otkazib qaytarsin. 
Bosh harflarni kichik harflarga ham otkazsin.
MASALAN: stringToKebab(“I love Kebab”) return “i-love-kebab”

function stringToKebab(text: string): any {
    try {
        if (!text) {
            throw new Error("Please, insert text!")
        }
        return text.toLowerCase().split(" ").join("-");
    } catch (err) {
        return err.message
    }
}

console.log("Kebab Case: ", stringToKebab("I love Kebab"))

********************************************************************************************************************/

/*******************************************************************************************************************
ZM-TASK:

Shunday function yozing, u function parametrga berilgan raqamlarni orqasiga ogirib qaytarsin.
MASALAN: reverseInteger(123456789) return 987654321
*
function reverseInteger(num: number): any {
    try {
        return parseInt(String(num).split("").reverse().join(""))
    } catch (err: any) {
        throw err.message
    }
}

console.log("Reversed Number:", reverseInteger(123456789))



********************************************************************************************************************/


/*******************************************************************************************************************
ZN-TASK:

Shunday function yozing, uni array va number parametri bolsin. Ikkinchi parametrda berilgan raqamli indexgacha arrayni orqasiga ogirib qaytarsin.
MASALAN: rotateArray([1, 2, 3, 4, 5, 6], 3) return [5, 6, 1, 2, 3, 4]*/

function rotateArray(arr: number[], index: number): number[] {
    const cacheList = [];
    const updatedList = arr.filter((val: number, indexVal: number) => {
        if (indexVal > index) return val
        else cacheList.push(val)
    }
    )
    return [...updatedList, ...cacheList]
}


console.log("Rotated Array: ", rotateArray([1, 2, 3, 4, 5, 6], 3))

/*******************************************************************************************************************/