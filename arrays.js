 const arr = [1, 2, 3, 4, 5];

// console.log(arr);

// // arr.push(6);

// // console.log(arr);

// const popValue = arr.pop();

// console.log(popValue);
// console.log(arr);


// for (let i = 0; i < arr.length; i++) {
//     console.log(arr[i]);
// }


// arr.forEach((el, index) => {
//     console.log(el, index);
// })

const mappedValues = arr.map((el, index) => {
    console.log(el, index);
    return el * 2;
})

console.log(mappedValues);