import { tweetsData } from "./data.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";


// localStorage.setItem('tweetData', JSON.stringify(tweetsData))
let dataTweet = JSON.parse(localStorage.getItem('tweetData'))


if (dataTweet) {
    tweetsData.length = 0;
    tweetsData.push(...dataTweet)
}


let text = document.getElementById('textarea')

document.addEventListener('click', function (e) {
    if (e.target.dataset.like) {
        handleLike(e.target.dataset.like);
        render()
    }

    else if (e.target.dataset.retweet) {
        handRetweet(e.target.dataset.retweet);
        render();
    }

    else if (e.target.dataset.comment) {
        handleComment(e.target.dataset.comment);
    }

    else if(e.target.dataset.icon){
        handleDelete(e.target.dataset.icon);
        // render()
    }

})




function newPost() {
    document.getElementById("btn").addEventListener('click', function () {
        let textAreaValue = text.value;
        text.value = ""

        let newPerson = {
            handle: `@scrim💎`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: `${textAreaValue}`,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4(), // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
        };

        tweetsData.unshift(newPerson);
        localStorage.setItem("tweetData", JSON.stringify(tweetsData));

        render()
    })
}

newPost();

function commentReplies(){


   tweetsData.forEach(function(element){
        document.getElementById(`btns-${element.uuid}`).addEventListener("click", function () {
            let textArea = document.getElementById(`textarea-${element.uuid}`);
            let newComent = {
              handle: `@jamess💎`,
              profilePic: `images/scrimbalogo.png`,
              likes: 0,
              retweets: 0,
              tweetText: `${textArea.value}`,
              replies: [],
              isLiked: false,
              isRetweeted: false,
              uuid: uuidv4(), // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d',
            };

            let pushElement = element.replies.unshift(newComent)
           localStorage.setItem("tweetData", JSON.stringify(tweetsData));
            if (pushElement) {
                render();
            }
        });
        
    })
}



function handleComment(tweetId) {
    document.getElementById(`replies-${tweetId}`).classList.toggle("hidden");
}


function handleLike(tweetId) {
    const filtering = tweetsData.filter(function (element) {
        return element.uuid.includes(tweetId);
    })[0]

    if (filtering.isLiked) {
        filtering.likes--;
    } else {
        filtering.likes++;
    }

    filtering.isLiked = !filtering.isLiked;
}

function handRetweet(tweetId) {
    const filtering = tweetsData.filter(function (element) {
        return element.uuid.includes(tweetId);
    })[0]

    if (filtering.isRetweeted) {
        filtering.retweets--;
    } else {
        filtering.retweets++;
    }

    filtering.isRetweeted = !filtering.isRetweeted;
}




function handleDelete(tweetId) {
  tweetsData.forEach(function (element) {
    let btn = document.getElementById(`delete-${element.uuid}`);
    if(element.uuid.includes(tweetId)){
        btn.style.display = "inline";

        btn.addEventListener('click', function(){
            btn.style.display = 'none'
            tweetsData.shift(element)
            localStorage.setItem("tweetData", JSON.stringify(tweetsData));
            render()
        })

    }

  });
}





function getFeedHtml() {

    let interfaces = ""

    tweetsData.forEach(function (element) {
        let likeEmoji = "";
        let retweetEmoji = "";
        if (element.isLiked) {
            likeEmoji = "liked";
        }

        if (element.isRetweeted) {
            retweetEmoji = "retweet";
        }


        let repliesHtml = "";
        if (element.replies.length > 0) {
            element.replies.forEach(function (reply) {
                repliesHtml += `
                    <div class = 'comment'>
                        <div class = 'inner'>
                            <img src = "${reply.profilePic}">
                            <div class = "plain">
                                <p class = "handle"> ${reply.handle}</p>
                                <p class = "tweet"> ${reply.tweetText}</p>
                            </div>
                        </div>
                    </div>
                `;
                
            })
        }







        interfaces += `
        <div class = "outro">
          <button id="delete-${element.uuid}" class = "delete">Delete</button>
            <div class = "interface">
                <img src = "${element.profilePic}">
                
                <div class = "plain">
                    <p class = "handle"> ${element.handle}</p>
                    <p class = "tweet"> ${element.tweetText}</p>
                    
                    <div class = "tweet-details">
                        <span class = "tweet_detail">
                            <i class="fa-regular fa-comment-dots" data-comment="${element.uuid}" id= "comment"></i>
                            <span>${element.replies.length}</span>
                        </span>
                        <span class = "tweet_detail">
                            <i class="fa-solid fa-heart ${likeEmoji}" data-like="${element.uuid}"></i>
                            <span>${element.likes}</span>
                        </span>
                        <span class = "tweet_detail">
                            <i class="fa-solid fa-retweet ${retweetEmoji}" data-retweet="${element.uuid}"></i>
                            <span>${element.retweets}</span>
                        </span>

                        <i class="fa-solid fa-ellipsis-vertical" data-icon="${element.uuid}"></i>
                    </div>
                </div>
            </div> 
            
            <div class="hidden" id="replies-${element.uuid}">
                 <div class = "input">
                    <textarea name="textarea" id= "textarea-${element.uuid}" class="textarea" placeholder="Your coment?"></textarea>
                    <button class= "btns" id= "btns-${element.uuid}">reply</button>
                 </div>
                 ${repliesHtml}
            </div>
        </div> 
        `;
    });

    return interfaces
}


// 

function render() {
    document.getElementById("main").innerHTML = getFeedHtml()
     commentReplies();
    
}

render()