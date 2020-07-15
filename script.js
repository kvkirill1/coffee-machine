"use strict"
let state = "waiting"// "cooking" "ready"
let balance = document.querySelector('.balance');
let cup = document.querySelector(".cup img")

function cookCoffee (name, price, elem) {
    if( state != "waiting" ){
        return;
    }

    if (balance.value >= price) {
        state =  "cooking"
        balance.style.backgroundColor = ""
        balance.value -= price; //balance.value= balance.value - price;
        changeDisplayText (`Ваш ${name} готовится`);
        //console.log(elem);
        let coffeeImg = elem.querySelector('img');
        //console.log(coffeeImg);
        let coffeeSrc = coffeeImg.getAttribute("src")
       // console.log(coffeeSrc);

        startCooking(name, coffeeSrc);
    } else {
        changeDisplayText ('Недостаточно средств');
        balance.style.backgroundColor = "rgb(255, 50, 50)"
    }
}

//Планирование
//setTimeout(func, ms) отрабатывает только один раз
//setInteval(func, ms) отрабатывает пока не остановим
// let timeout = setTimeout(func, ms)
// let timeout = setInteval(func, ms)
//clearTimeout(timeout)  - остановка
//clearInterval(timeout) - остановка

function startCooking(name, src) {
    //let progressBar = document.querySelector('.progress-bar') функционал в функции changeProgressPercent
    
    cup.setAttribute("src", src);
    cup.style.display = "inline";
    let t = 0;
    let cookingInterval = setInterval(() => { // тоже самое что и  function () { }
    t++
    cup.style.opacity = t + '%';
    //progressBar.style.width = t +'%';  функционал в функции changeProgressPercent
    changeProgressPercent(t)
    if (t == 100) {
        state = "ready";
        clearInterval(cookingInterval);
        changeDisplayText (`Ваш ${name} готов`);
        cup.style.cursor = "pointer";
        cup.onclick = function() {
            takeCoffee();
            }
        }
    }, 50 )
}

function takeCoffee(){
    if (state != "ready" ) {
        return;
    }
    state = "waiting";
    changeProgressPercent(0);
    cup.style.opacity = 0;
    cup.style.display = "";
    changeDisplayText ("Выберите кофе");
    cup.onclick = null;
    cup.style = "cursor";
}

function changeProgressPercent(persent){
    let progressBar = document.querySelector('.progress-bar');
    progressBar.style.width = persent +'%';
}

function changeDisplayText(text) {
    if (text.length > 23) {
        text=text.slice(0, 23) + "...";
    }

    let displayText = document.querySelector('.display span');
    displayText.innerHTML = text;
}

//-------------------Drag'n'Drop------------------

let money = document.querySelectorAll(".money img");

// for (let i=0; i < money.length; i++) {
//     money[i].onmousedown = take.money;
// }

for (let bill of money) {
    bill.onmousedown = takeMoney;
}

function takeMoney(event){
    event.preventDefault()
//     console.log(this);
//     console.log(event);
//     console.log([event.target, event.clientX, event.clientY]);
    let bill = this;

    //console.log( bill.getBoundingClientRect() );

    let billCoords = bill.getBoundingClientRect();
    let billHeight = billCoords.height;
    let billWidth = billCoords.width;

    bill.style.position = "absolute";
    if (!bill.style.transform) {
        bill.style.top = (event.clientY - billHeight/2)  + "px";
        bill.style.left = (event.clientX - billWidth/2) + "px";
        bill.style.transform = " rotate(90deg)";
    } else {
        bill.style.top = (event.clientY - billWidth/2)  + "px";
        bill.style.left = (event.clientX - billHeight/2) + "px";
    }
    bill.style.transition = " transform .4s";
    
    window.onmousemove = function(event) {
        //console.log ([event.clientX, event.clientY]) //Считывает положение курсора при любом движении мыши
        let billCoords = bill.getBoundingClientRect();
        let billHeight = billCoords.height;
        let billWidth = billCoords.width;
        bill.style.top = (event.clientY - billWidth/2)  + "px";
        bill.style.left = (event.clientX - billHeight/2) + "px";
    }

    bill.onmouseup = function() {
        window.onmousemove = null;
        if (inAtm(bill)){
            let cashContainer = document.querySelector(".cash-container");
            bill.style.position = "";
            bill.style.transition = "transform 1.5s";
            cashContainer.append(bill);
            setTimeout(() => {
                bill.style.transform = "rotate(90deg) translateX(-75%)";
                bill.ontransitionend = () => {
                    balance.value = +balance.value + +bill.dataset.cost;
                    bill.remove(); //Удаляем элемент    
                }
            }, 10)
        }
    }
}

function inAtm(bill){
    let atm = document.querySelector(".atm img");

    let atmCoords = atm.getBoundingClientRect();
    let atmLeftX = atmCoords.x;
    let atmRightX = atmCoords.x + atmCoords.width;
    let atmTopY = atmCoords.y;
    let atmBottomY = atmCoords.y + atmCoords.height/3;

    let billCoords = bill.getBoundingClientRect();
    let billLeftX = billCoords.x;
    let billRightX = billCoords.x + billCoords.width;
    let billY = billCoords.y;
    if(
            billLeftX > atmLeftX
        &&  billRightX < atmRightX
        &&  billY > atmTopY
        &&  billY < atmBottomY
        ) {
        return true;
        } else{
        return false
        }
    // return{ 
    //     atm: [atmLeftX, atmRightX, atmTopY,atmBottomY ],
    //     bill:[billLeftX, billRightX, billY],
    // };
}

let changeButton = document.querySelector(".change-button");
changeButton.onclick = takeChange;

function takeChange() {
    if (+balance.value >= 10) {
        createCoin("10");
        balance.value -= 10;
        return setTimeout(takeChange, 300);
    } else if (+balance.value >= 5) {
        createCoin("5");
        balance.value -= 5;
        return setTimeout(takeChange, 300);
    } else if (+balance.value >= 2) {
        createCoin("2");
        balance.value -= 2;
        return setTimeout(takeChange, 300);
    } else if (+balance.value >= 1) {
        createCoin("1");
        balance.value -= 1;
        return setTimeout(takeChange, 300);
    }
    
}

function createCoin(cost) {
    let coinSrc =""
    switch(cost){
        case "10":
            coinSrc = "img/10rub.png"
        break;
        case "5":
            coinSrc = "img/5rub.png"
        break;
        case "2":
            coinSrc = "img/2rub.png"
        break;
        case "1":
            coinSrc = "img/1rub.png"
        break;
    default:
        console.error("Такой монеты не существует")
    }
    
    let changeBox = document.querySelector(".change-box");
    let changeBoxWidth = changeBox.getBoundingClientRect().width;
    let changeBoxHeight = changeBox.getBoundingClientRect().height;

    let coin = document.createElement("img");
    coin.setAttribute("src", coinSrc);
    coin.style.width = "50px";
    coin.style.cursor = "pointer";
    coin.style.position = "absolute";
    coin.style.top = Math.floor(Math.random() * (changeBoxHeight - 50) ) + "px";
    coin.style.left = Math.floor(Math.random() * (changeBoxWidth - 50) ) + "px";
    changeBox.append(coin);//добавляет элемент в конец родительского элемента
    //changeBox.prepend(coin);//добавляет элемент в начало родитеьского элемента
    //changeBox.repLaceWith(coin); // Заменяет родительский элемент
    //changeBox.after(coin); changeBox.before(coin); // Аналогично псевдо элементам
    coin.style.transition = "transform .5s, opacity .5s";
    coin.style.transform = "translateY(-20%)";
    coin.style.opacity = 0;
    setTimeout(() => {
        coin.style.transition = "translateY(0%)";
        coin.style.opacity = 1;
    },10)
    coin.onclick = () => {
        coin.style.transition = "translateY(-20%)";
        coin.style.opacity = 0;
        coin.ontransitionend = () => {
        coin.remove();
        }
    }
}