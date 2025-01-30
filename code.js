// encapsulation
// class Vehicle {
//   #name;
//   constructor(name) {
//     this.name = name;
//   }
//   getName() {
//     console.log(`name-> ${this.name}`);
//   }
//   setName(newName) {
//     this.name = newName;
//   }
// }
// const myVehicle1 = new Vehicle("Bike");
// myVehicle1.setName("honda");
// myVehicle1.getName();

// abstraction
// class Bird {
//   constructor() {
//     if (new.target === "Bird") {
//       throw new Error("instance of this class cannot be created");
//     }
//   }
//   speak() {
//     throw new Error("implement it in sub class");
//   }
// }

// class Crow extends Bird {
//   speak() {
//     console.log("i am crow....");
//   }
// }

// const instanceOfBird = new Bird();
// instanceOfBird.speak();
// const crow1 = new Crow();
// crow1.speak();
// //polimorphisum
// class SecondMyliply {
//   constructor(x, y) {
//     this.x = x;
//     this.y = y;
//   }
//   getAra() {
//     console.log(`Multiply - ${this.x * this.y}`);
//   }
// }
// class ThirdMutiply extends SecondMyliply {
//   constructor(x, y, z) {
//     super(x, y);
//     this.z = z;
//   }
//   getAra() {
//     console.log(`Multiply - ${this.x * this.y * this.z}`);
//   }
// }

// const third = new ThirdMutiply(3, 4, 5);
// third.getAra();
// const two = new SecondMyliply(5, 2);
// two.getAra();

function reverseString(str) {
  //return str.split("").reverse().join("");
}
//console.log(reverseString(myString));

let result = "";
let myString = "rishab";
function recurction(lastChar) {
  let currentLength = myString.length;
  result = result + lastChar;
  while (currentLength > 0) {
    return recurction(myString.charAt(currentLength));
  }
}
recurction();
console.log(result);
