// const firstName = "Ahmad";//give firstName const value "Ahmad", const means it will not change after givin!!
// const lastName = "Faiz";// give him also const value like first one.
// const fullName = firstName + " " + lastName;//here i give fullName const value, 1st firstName and second is space and last one is lastName!!
// grade(fullName);// here it will be shown on bash terminal with command "node script.js" or "grade(fullName);" in chrome console!!

////////////////////////////////////////////////////////

// let firstName = prompt("enter your first name");
// let lastName = prompt("enter your last name");
// alert("Welcome " +" " + firstName + " " + lastName + "!");

////////////////////////////////////////////////////////

// let a = 5;
// let b = 10;
// grade(`Addition = ${a+b}`);
// grade(`Subtraction = ${a-b}`);
// grade(`Multiplication = ${a*b}`);
// grade(`Division = ${a/b}`);

// a *=5;// a*5 =25
// grade(a);

////////////////////////////////////////////////////////////

//Comparison and Logical Operators
//1)-write a program to check if a number enetered by the user is positive, negative, or zero.
//2)-Combine logical operators to check if the number is between 1 and 100.
// let number = prompt("enter any number");
// number = Number(number);
// if (number>0) {
//     alert("The number is positive");
// }else if (number<0) {
//     alert("The number is negative");
// } else {
//     alert("The is '0'");
// }
// if ( number>1 && number<100 ) {
//     grade("this number is between from 1 to 100");
    
// }

/////////////////////////////////////////////////////////////
//If-Else and Switch Case
//1)- Create a program that asks for a user's grade and prints a message based on the grade using if-else.
//2)- Reimplement the same program using switch-case. 
   
// let marks = parseInt(prompt("enter numbers"));

// if ( marks > 100 ) {
//     grade = "invalid";
    
// }else if ( marks >= 80 ) {
//     grade = "A+";
    
// }else if (marks > 60) {
//     grade = "A";
    
// }else if ( marks > 45 ) {
//     grade = "B";
    
// }else if ( marks >= 33) {
//     grade = "C";
    
// }else
//     grade = "Failed"

// switch (grade) {
//     case "invalid":
//         alert("The value is Incorrect");
//     break;
//     case "A+":
//         alert("Great Work");
//     break;
//     case "A":
//         alert("Very Good");
//     break;
//     case "B":
//         alert("Good");
//     break;
//     case "C":
//         alert("you are passed");
//     break;

//     default:
//         alert("try again next time!!");
        
        
// }

////////////////////////////////////////////////////////////

//Ternary Operator
//1).Use the ternary operator to check if a number is even or odd.

let num = prompt("enter Even or Odd");
let evenodd = num % 2 === 0 ? "Even" : "Odd";
alert(`This number is ${evenodd}`);

    


