// ZJ-TASK:

// Shunday function yozing, u berilgan arrayni ichidagi numberlarni qiymatini hisoblab qaytarsin.
// MASALAN: reduceNestedArray([1, [1, 2, [4]]]) return 8

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