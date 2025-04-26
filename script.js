const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");
const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#Symbol");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateBtn");
const allCheckBox=document.querySelectorAll("input[type=checkbox")
const symbol='!@#$%^&*(){}:"?><][./\|+-';

let password="";
let passwordLength=10;
let checkCount=0;
handleSlider();
//set circle colour to grey
setIndicator("#ccc");


//set password length according to the slider 
//work of this function is to show the password length over the ui
function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min))+"% 100%"

}

function setIndicator(color){
    indicator.style.backgroundColor=color;
    //shadow
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;


}
// function used to generate integer random value between max-min
function getRndInteger(min, max){
    return Math.floor(Math.random() *(max-min))+min;
    //floor function is used to remove the floating part and print the rounded off value 

}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));

}
function generateUpperCase(){
     return String.fromCharCode(getRndInteger(65,90));
}

function generateSymbol(){
     const randnum=getRndInteger(0,symbol.length);
     return symbol.charAt(randnum);

}

function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;
    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numbersCheck.checked) hasNum=true;
    if(symbolsCheck.checked) hasSym=true;

    if(hasUpper && hasLower &&(hasNum||hasSym) && passwordLength>=8){
        setIndicator("#0f0");
    }
    else if(
        (hasLower||hasUpper)&&
        (hasNum||hasSym)&&
        passwordLength>=6
    ){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}
//function used to copy the genrated password over the clipboard 
async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        console.log("Content copied");
        
    }
    catch(e)
    {
        copyMsg.innerText="failed";
    }
    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active");

    },2000);
    
}
function shufflePassword(array){

    //algorithm used to create this function is Fisher Yates Method 
    for(let i=array.length-1;i>0;i--){
        //random j ,find out using random function 
        const j=Math.floor(Math.random()*(i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;

    }
    let str="";
    array.forEach((el)=>(str+=el));
    return str;

}
//function used to check that how many chekboxes are checked 
//if the number of checkboxed checked is less then the check count then 
//length of password is equal to the checkcount
function handleCheckBoxchange(){
    checkCount=0;
    allCheckBox.forEach((CheckBox)=>{
        if(CheckBox.checked)
            checkCount++;
});

        if(passwordLength<checkCount){
            passwordLength=checkCount;
        handleSlider();
        
    }
}
//event to check that how many checboxes are checked 
allCheckBox.forEach((CheckBox)=>{
    CheckBox.addEventListener('change',handleCheckBoxchange);
})

//event listner over slider as we move the slider the value of the password length will get changed
inputSlider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleSlider();
    console.log("slider done");
});

//event over copy button used to copy the password and then print over the clipboard
copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        // let copiedText=passwordDisplay.value;
        // showCopiedMessage(copiedText);
        copyContent();
        console.log("content copy done");
    }


}
);
// function showCopiedMessage(text) {
//     const messageDiv = document.getElementById('copyMessage');
//     messageDiv.textContent = `Copied: ${text}`;
//     messageDiv.style.display = 'block'; // Make sure it is visible
// }


generateBtn.addEventListener('click',()=>{
    //if none of the checkbox is checked then 
  
    if(checkCount==0){
        return;
    }
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
    console.log("Starting the journey");
    //find new password
    //firstly remove old password
    password="";
    //now we have to check that which checkboxes is checked acoording to which we have to put one element into the password
    // if(uppercaseCheck.checked){
    //     password+=generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password+=generateLowerCase();
    // }
    // if(numbersCheck.checked){
    //     password+=generateRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password+=generateSymbol();
    // }
    // //if the password length is 10 then these 4 consition is checked then the password of length 4 is 
    // //generated then what about the other password character that is 6 character is left then 
    // //we genrate a random numbers for this we are going to create an array in which we
    // //store these four function and randomly call any function.
    let funcArr=[];
    if(uppercaseCheck.checked){
        funcArr.push(generateUpperCase);

    }
    if(lowercaseCheck.checked){
        funcArr.push(generateLowerCase);
        
    }
    if(symbolsCheck.checked){
        funcArr.push(generateSymbol);
        
    }
    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);
        
    }
    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
    }
    console.log("Compulsory Addition done");
//remaining addition
    for(let i=0;i<passwordLength-funcArr.length;i++){
        let randIdx=getRndInteger(0,funcArr.length);
        password+=funcArr[randIdx]();
    }
    console.log("remaining addition done");


    //shuffle the password
    password=shufflePassword(Array.from(password));
    console.log("shuffling Done");
    //show in ui
    passwordDisplay.value=password;
    console.log("UI addition Done");
    //calculate strength
    calcStrength();
    console.log("Strength is done");
});
