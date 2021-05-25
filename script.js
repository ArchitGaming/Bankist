'use strict';


// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30, 200],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460, -200],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');



// LECTURES

let current_account;
let container;  
let login_Button = document.querySelector('.login__btn')
let LogoutButton = document.querySelector('.BtnLogout')

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];



function create_username(arr) {
  arr.forEach(cv =>
    cv.username = cv.owner.split(" ")
      .map(cv => cv[0])
      .join('')
      .toLowerCase()
  )
}

create_username(accounts)


function displayMovements(mov) {

  containerMovements.innerHTML = ""

  mov.forEach(function (cv, index) {

    let tranactionType = null

    if (cv > 0) tranactionType = "deposit"
    else tranactionType = "withdrawal"
    let html = `   <div class="movements__row">
             <div class="movements__type movements__type--${tranactionType}">
               ${index} ${tranactionType}
             </div>
             <div class="movements__value">${cv}$</div>
           </div>;`
    containerMovements.insertAdjacentHTML('afterbegin', html)

  })
}



function displaySummary(arr) {

  //adding all deposits
  let deposit = arr.filter(function (cv, index, arr) {

    return cv > 0


  }).reduce(function (acc, cv) {

    return acc + cv

  })
  labelSumIn.textContent = deposit + "$"

  let intrest = deposit * 0.19
  labelSumInterest.textContent = intrest + "$"

  //adding all withdrawal

  let withdrawal = arr.filter(function (cv, index, arr) {

    return cv < 0

  }).reduce(function (acc, cv) {

    return acc + cv

  }, 0)

  labelSumOut.textContent = withdrawal + "$"
  //Finding user balance

  let balence = deposit + intrest - withdrawal

  labelBalance.textContent = balence + "$"
}



btnLogin.addEventListener('click', (event) => {

  
  //stoping reload
  event.preventDefault()


  current_account = accounts.find(cv => cv.username == inputLoginUsername.value)
  
  
  

  if (current_account.pin === Number(inputLoginPin.value)) {

    containerApp.style.opacity = 100

    swal({
      title: "Success!",
      text: "You just logged in!",
      icon: "success",
      button: "ok",
    });
    labelWelcome.textContent = `Welcome ${current_account.owner.split(" ")[0]}!`

    inputLoginPin.value = inputLoginUsername.value = ""

    // Display movements for logged-in user

    displayMovements(current_account.movements)

    // To calulcate IN ,out,display , bal

    displaySummary(current_account.movements)
    container = document.querySelector('.container')
    container.addEventListener('animationend', () => {
    container.classList.remove('active');
});


  }

  else{swal({
      title: "Error!",
      text: "The Id Or Passcode Is Incorrect",
      icon: "error",
      button: "ok",
    });}
  
})

btnSort.addEventListener("click", function (){

  current_account.movements.sort(function(a,b){return a-b})
  displayMovements(current_account.movements)

})

btnTransfer.addEventListener("click", function (event) {

  event.preventDefault()
  let transferPerson = inputTransferTo.value
  let transfetToPerson = accounts.find(cv => cv.username == transferPerson)
  let transferAmount = Number(inputTransferAmount.value)
  

  swal("Are you Sure?", "Once you click transfer you can not undo it!", "warning",{
    buttons: {
      cancel: "Cancle",
      catch: {
        text: "Transfer",
        value: "catch",
      },

    },
  })
  .then((value) => {
    switch (value) {
   
      case "catch":
        swal("Money Transfeared!", "your money has been sent to " + transfetToPerson.owner + ".", "success");
        current_account.movements.push(-transferAmount)
        transfetToPerson.movements.push(transferAmount)
        displayMovements(current_account.movements)
  
        break;
   
      case "cancel":
        swal("Cancelled Transfer!", " " ,"success");
        break;
    }
  });
  
})



btnLoan.addEventListener("click", function (event) {

  event.preventDefault()
  let loanInputBox = Number(inputLoanAmount.value)
  
  if (loanInputBox < 0) {
          swal("Wrong Input!", "You can not enter negative or blank values", "error")
          inputLoanAmount.value = "";
        }
  
  swal("Are you Sure?", "Once you take a loan you can not undo it!", "warning",{
    buttons: {
      cancel: "No, cancle Loan.",
      catch: {
        text: "Yes, I know what I am doing!",
        value: "catch",
      },

    },
  })
  .then((value) => {
    switch (value) {
   
      case "catch":
        swal("Loan Taken!", "  ", "success");
        if (loanInputBox > 0) {
          current_account.movements.push(loanInputBox)
          displayMovements(current_account.movements)
          displaySummary(current_account.movements)
          inputLoanAmount.value = "";
        }
        break;
   
      case "cancel":
        swal("Cancelled Loan!", " " ,"success");
        break;
    }
  });


})







btnSort.addEventListener("click", function (event) {

  event.preventDefault()

})





btnClose.addEventListener('click', function (event) {
  event.preventDefault();

  

    swal("Are you Sure?", "Once deleted, you will not be able to recover this account!", "warning",{
      buttons: {
        cancel: "No, cancle delete.",
        catch: {
          text: "Yes, I know what I am doing!",
          value: "catch",
        },

      },
    })
    .then((value) => {
      switch (value) {
     
        case "catch":
          swal("Account Deleted!", "Now this account will not be accessible!", "warning");
          if (inputCloseUsername.value === current_account.username && Number(inputClosePin.value) === current_account.pin) {
            let accountindex = accounts.findIndex(
              acc => acc.username === current_account.username
            );
            // .indexOf(23)

            // Delete account
            accounts.splice(accountindex, 1);

            // Hide UI
            containerApp.style.opacity = 0;
            inputCloseUsername.value = inputClosePin.value = '';
            labelWelcome.textContent = "Log in to get started"
  
          }
          break;
     
        case "cancel":
          swal("Cancelled delete!", " " ,"success");
          break;
      }
    });





  
  
})

LogoutButton.addEventListener('click',function(){


  swal("Are you Sure you want to log out?", " ", "warning",{
    buttons: {
      cancel: "No, cancle Logout.",
      catch: {
        text: "Yes, Logout!",
        value: "catch",
      },

    },
  })
  .then((value) => {
    switch (value) {
   
      case "catch":
        swal("You are Loggedout!", "  ", "success");
        opacity = 100
        labelWelcome.textContent = "Log in to get started"
        break;
   
      case "cancel":
        swal("Cancelled Logout!", " " ,"success");
        break;
    }
  });


})
