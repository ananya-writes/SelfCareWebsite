window.addEventListener("load", function () {
    const storedHabit = localStorage.getItem("currentHabit");
    if (storedHabit) {
        document.getElementById("CurrentHabit").innerText = storedHabit;
    }
});


class Chatbox {

    constructor(){

        this.args={
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button')

        }

        this.state = false;
        this.messages = [];

    }

    display(){

        const {openButton, chatBox,  sendButton} = this.args;

        //openButton.addEventListener('click',()=>this.toggleState(chatBox))

        sendButton.addEventListener('click',()=>this.onSendButton(chatBox))

        const node = chatBox.querySelector('input');

        node.addEventListener("keyup" , ({key})=>{

            if(key === "Enter"){
                this.onSendButton(chatBox)
            }

        })

    }
/*
    toggleState(chatbox){

        this.state = !this.state;

        if(this.state){

            chatbox.classList.add('chatbox--active')

        }

        else{

            chatbox.classList.remove('chatbox--active')

        }

    }
*/
    onSendButton(chatbox){

        var textField = chatbox.querySelector('input');
        let text1= textField.value;
        console.log(text1);

        if (text1 == ""){
            return;
        }

        let msg1 = { name : "User" , message : text1 }
        
        this.messages.push(msg1);

        fetch($SCRIPT_ROOT + '/predict', {

            method : 'POST',

            body : JSON.stringify({message:text1}),
            mode : 'cors',

            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(r=>r.json())
        .then(r=>{

            let msg2 = {name : "Sam" , message : r.answer};
            this.messages.push(msg2);
            this.updateChatText(chatbox)
            textField.value=''

        }).catch((error)=>{
            
            console.error('Error:',error);
            this.updateChatText(chatbox)
            textField.value=''

        });

    }

    updateChatText(chatbox){

        var html='';
        this.messages.slice().reverse().forEach(function(item,index){

            if(item.name==="Sam"){

                html += '<div class="messages__item messages__item--visitor">'+item.message+'</div>' 
            }

            else{

                html+= '<div class="messages__item messages__item--operator">'+item.message+'</div>'

            }

        });

        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;

    }

}

const chatbox =  new Chatbox();
chatbox.display();


var date=new Date();
console.log(date);

var currentMonth = date.getMonth();
var currentDay = date.getDay();
var currentDate = date.getDate();
var currentYear = date.getFullYear();

var months=[

    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];


var title = document.getElementById("monthTitle");
title.innerHTML = months[currentMonth];

var habitTitle=document.getElementById("monthTitle");
habitTitle.onclick=function(){

    let habits=prompt("What routine are you shaping?",habitTitle.innerHTML);
    if (habits.length==0){
        habitTitle.innerHTML="Click to set your habit";
    }

    else{
        habitTitle.innerHTML=habits;
    }


}

var daysInTheMonthList = [31,28,31,30,31,30,31,31,30,31,30,31];
var daysInThisMonth=daysInTheMonthList[currentMonth];

var daysCompleted = 0;
var totalDays = document.getElementById("totalDays");
totalDays.innerHTML="0/"+daysInThisMonth;

var dayCount = 0;
var rowCount = 0;
var days = document.getElementsByClassName("days");

for(var i=0;i<days.length;i++){

    var day = days[rowCount].getElementsByClassName("day");

    for(var j=0;j<day.length;j++){

        if(dayCount == currentDate-1){

            
            day[j].setAttribute("style","border: 2px solid black");

        }

        if(dayCount < daysInThisMonth){

            day[j].innerHTML=dayCount+1;
            day[j].setAttribute("id","day"+(dayCount+1));
            day[j].setAttribute("style","background-color:white");
            dayCount++;

        }

        else{

            day[j].innerHTML="";

        }

    }

    rowCount++;

}

var completed = new Array(31);

for(var i=0; i<dayCount; i++){

    var tempString = "" + (currentMonth + 1) + "-" + (i+1) + "-" + currentYear;
    console.log("storing date : "+tempString);

    var tempDay = localStorage.getItem(tempString);
    console.log(tempDay);

    if(tempDay == null || tempDay == "false"){
        
        localStorage.setItem(tempString, "false");
    
    }
    else if (tempDay == "true") {
        daysCompleted++;
    }
    
    totalDays.innerHTML = daysCompleted + "/" + daysInThisMonth;

}

console.log("completed array: "+completed);
console.log("total days completed"+daysCompleted);

for(var i=0; i<currentDate;i++){

    var tempString = "" + (currentMonth+1) + "-" + (i+1) + "-" + currentYear;

    console.log(tempString);

    var chosenDay=localStorage.getItem(tempString);
    console.log(i+1+": "+ chosenDay);

    var chosenDayDiv = document.getElementById("day"+(i+1));

    if(chosenDay==="true"){
        chosenDayDiv.style.backgroundColor="lightblue";
    }
    else if(chosenDay==="false"){
        chosenDayDiv.style.backgroundColor="white";
    }

}


var dayDivs = document.querySelectorAll(".day");

for(var i=0;i<currentDate; i++){

    dayDivs[i].onclick= function(e){

        var num=e.target.innerText;
        var selectedDate=document.getElementById(e.target.id);
        var storageString = "" + (currentMonth+1) + "-" + num + "-" + currentYear;

        if(localStorage.getItem(storageString)==="false"){

            selectedDate.style.backgroundColor="lightblue";
            localStorage.setItem(storageString,true);
            daysCompleted++;

        }else if(localStorage.getItem(storageString)==="true"){

            selectedDate.style.backgroundColor="white";
            localStorage.setItem(storageString,false);
            daysCompleted--;

        }

        totalDays.innerHTML=daysCompleted+"/"+dayCount;
        console.log(daysCompleted,currentDate);
        if(daysCompleted===currentDate){
            alert("great progress");
        }

    }

}

document.getElementById("resetButton").addEventListener("click", function() {
    for (let i = 1; i <= 31; i++) {
        let storageKey = `${currentMonth + 1}-${i}-${currentYear}`;
        localStorage.setItem(storageKey, "false");
        document.getElementById(`day${i}`).style.backgroundColor = "white";
    }
    daysCompleted = 0;
    totalDays.innerHTML = `0/${daysInThisMonth}`;

    let newHabit = prompt("Enter the new habit you want to track:");
    if (newHabit && newHabit.trim() !== "") {
        // Update the #CurrentHabit div with the new habit
        document.getElementById("CurrentHabit").innerText = newHabit;

        // Optional: Store the new habit in localStorage (so it persists after refresh)
        localStorage.setItem("currentHabit", newHabit);
    }
    
});


// List of 100 positive quotes
const quotes = [
    "You are enough, just as you are, right now.",
    "The world is a better place with you in it.",
    "Every storm runs out of rain. This too shall pass.",
    "You have survived 100% of your worst days. You are stronger than you think.",
    "Your heart has touched lives in ways you don’t even realize.",
    "Even the smallest light can brighten the darkest room. That light is you.",
    "You deserve to feel love, joy, and peace. They are waiting for you.",
    "No one else can play your role in this life. You are irreplaceable.",
    "Sometimes, just taking one more step is the bravest thing you can do.",
    "You are not alone in this. You are never alone.",
    "Your laughter has healed hearts you don't even know about.",
    "Healing isn’t a race; it’s a journey. Be kind to yourself along the way.",
    "You’ve made it through so much already. You’re doing amazing.",
    "Every flower blooms at a different pace. Your time to bloom will come.",
    "Your tears are proof of your courage to feel deeply.",
    "The fact that you’re still standing shows how powerful you are.",
    "Your dreams are valid, no matter how big or small they seem.",
    "You are allowed to rest. The world will wait for you to heal.",
    "You are a masterpiece, even with the unfinished parts.",
    "Your smile can light up a room, even if you don’t see it yet.",
    "The universe whispered, ‘You belong here,’ and it’s true.",
    "It’s okay to not be okay. You’re allowed to feel what you feel.",
    "You’ve touched lives in ways you’ll never fully understand.",
    "Each breath you take is a reminder of your strength to keep going.",
    "You matter. Your feelings matter. Your existence matters.",
    "You are the sky; everything else is just the weather.",
    "One day, you’ll look back and be so proud of how far you’ve come.",
    "You are a walking story of resilience, love, and hope.",
    "Even the longest nights end with a sunrise. Your sunrise is coming.",
    "You have a heart that cares, and that is rare and beautiful.",
    "It’s okay to ask for help. Strong people do it all the time.",
    "You are worthy of love, even on your hardest days.",
    "The universe wouldn’t be the same without you in it.",
    "You are more than your thoughts, more than your fears.",
    "One small step forward is still progress. Keep moving.",
    "You bring a unique kind of magic to the world. Never forget that.",
    "It’s okay to pause and catch your breath. Life isn’t a race.",
    "Your kindness leaves ripples that reach far beyond what you can see.",
    "You are not broken. You are rebuilding, and that is beautiful.",
    "There’s no rush to be perfect. You’re perfectly imperfect already.",
    "You’ve already overcome so much. You can handle this too.",
    "Every scar tells a story of your bravery and survival.",
    "You are allowed to let go of things that hurt you.",
    "Your value isn’t determined by how others see you but by how you feel inside.",
    "You are a miracle just by being here today.",
    "No mountain is too tall when you climb it one step at a time.",
    "Your inner strength is greater than any storm you’re facing.",
    "Even on your quietest days, your presence makes a difference.",
    "The fact that you’re still trying is something to celebrate.",
    "You are worthy of every bit of love and happiness the world can offer.",
    "It’s okay to feel lost sometimes. Even stars get hidden by clouds.",
    "You are a work of art, painted with resilience and courage.",
    "The kindness you’ve shown others will find its way back to you.",
    "You have a light inside you that darkness cannot extinguish.",
    "You don’t have to do it all at once. Small steps matter too.",
    "The way you care shows how deeply beautiful your soul is.",
    "You have a 100% success rate at getting through tough days.",
    "You are learning, growing, and healing in your own time.",
    "The love you give to others is a reflection of the love within you.",
    "You are so much more than the sadness you feel right now.",
    "Take your time. Healing is not a race, and you’re doing great.",
    "Your story is not over. There are beautiful chapters ahead.",
    "You are never a burden. Your existence is a gift.",
    "Even when it’s hard to see, you are still glowing with potential.",
    "You are capable of more than you ever imagined.",
    "You have the courage to rise again, no matter how many times you fall.",
    "You are a survivor, and your strength inspires more people than you know.",
    "The kindness in your heart is your superpower.",
    "Your unique journey is shaping you into something extraordinary.",
    "No one else has your smile, your laugh, or your spirit. You are one of a kind.",
    "You are allowed to take up space. You are allowed to be heard.",
    "You don’t have to be perfect to be loved. You are lovable just as you are.",
    "Your presence is the answer to someone’s prayers.",
    "There’s a purpose to your life, even if you can’t see it yet.",
    "The stars only shine in the darkness, and so do you.",
    "You are growing stronger, even on the days you feel weak.",
    "You have the power to rewrite your story at any moment.",
    "The world needs your kindness, your love, and your hope.",
    "Your heart has so much beauty that even you don’t see yet.",
    "You are brave for feeling, for trying, and for simply being here.",
    "Your life is precious. You are precious.",
    "You are enough. You always have been, and you always will be.",
    "One small act of kindness from you can change someone’s world.",
    "The love you give is the love you deserve.",
    "You’ve come so far already. Don’t give up now.",
    "The things you’ve been through have made you uniquely strong.",
    "You are a treasure. Never let anyone make you feel otherwise.",
    "You are like a flower, blossoming in your own time."
  ];
  
  
  // Function to change the quote randomly
  function changeQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    document.getElementById("quote-text").innerText = quotes[randomIndex];
  }
  
  document.getElementById('bresetButton').addEventListener('click', function(event) {
    // Prevent form submission
    event.preventDefault();
    
    // Clear the book results
    const resultsContainer = document.querySelector('.results-container');
    resultsContainer.innerHTML = '';  // Clear the displayed results
    
    // Clear the input field
    const inputField = document.querySelector('input[name="user_input"]');
    inputField.value = '';  // Clear the input field
    
    // Optionally, you can reset the "Currently Tracking" section as well:
    const habitList = document.getElementById('Content');
    habitList.innerHTML = '';  // Clear the habit tracking section
});


