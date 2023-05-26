let htmlFeedWithPicture = `<div class="feed">
<div class="head">
    <div class="user">
        <div class="profile-photo">
        <img src="../../../../../api/profile/image/%replace_user_id%/user_id">
        </div>
        <div class="ingo">
            <h3>%replace_title%</h3>
            <small>%replace_game%, %replace_time%</small>
        </div>
    </div>
    <span class="edit">
        <i class="uil uil-ellipsis-h"></i>
    </span>
</div>

<div class="photo">
    <img src="../../../../../../api/cdn/uploaded/image/%replace_image%">
</div>

<div class="action-buttons">
    <div class="interaction-buttons">
        <span onclick="likePost('%replace_post_id%');"><i class="%replace_liked_icon%" id="%replace_post_id%-like-button"></i></span>
        <span onclick="loadComments('%replace_post_id%')"><i class="uil uil-comment-alt"></i></span>
        <span><i class="uil uil-link"></i></span>
    </div>
    <div class="bookmark">
        <span><i class="uil uil-bookmark-full"></i></span>
    </div>
</div>

<div class="liked-by">
    <!-- write a random pick form the likes -->
    <span><img src="../../../../../api/profile/image/%replace_random_like_pfp%"></span>
    <p>Liked by %replace_like_amount% other gamers</b></p>
</div>

<div class="caption">
    <p><b>%replace_user%</b> %replace_description%</p>
</div>

<div class="comments text-muted">View %replace_comments% comments</div>
</div>`;

let htmlFeedWithoutPicture = `<div class="feed">
<div class="head" id="%replace_post_id%">
    <div class="user">
        <div class="profile-photo">
            <img src="../../../../../api/profile/image/%replace_user_id%/user_id">
        </div>
        <div class="ingo">
            <h3>%replace_title%</h3>
            <small>For %replace_game%, %replace_time%</small>
        </div>
    </div>
    <span class="edit">
        <i class="uil uil-ellipsis-h" onclick="openInteraction('%replace_post_id%', '%replace_user_id%')"></i>
    </span>
</div>

<p class="text-content">%replace_message%</p>

<div class="action-buttons">
    <div class="interaction-buttons">
        <span onclick="likePost('%replace_post_id%');"><i class="%replace_liked_icon%" id="%replace_post_id%-like-button"></i></span>
        <span onclick="loadComments('%replace_post_id%')"><i class="uil uil-comment-alt"></i></span>
        <span><i class="uil uil-link"></i></span>
    </div>
    <div class="bookmark">
        <span><i class="uil uil-bookmark-full"></i></span>
    </div>
</div>

<div class="liked-by">
    <!-- write a random pick form the likes -->
    <span><img src="../../../../../api/profile/image/%replace_random_like_pfp%"></span>
    <p>Liked by %replace_like_amount% other gamers</b></p>
</div>

<div class="comments text-muted">View %replace_comments% comments</div>
</div>`;

let commentHtml = `
<div class="user">
    <img src="./api/profile/image/%replace_user_id%/user_id">
    <h1>%replace_user_name%</h1>
</div>
<p>%replace_comment%</p>
`;

var div = document.getElementById('feeds');

function createPostById(post) {
    let newHtml;
    if(post.content[0].image === "no_image") {
        newHtml = htmlFeedWithoutPicture;
    } else {
        newHtml = htmlFeedWithPicture.replaceAll("%replace_image%", post.content[0].image);
    }
    newHtml = newHtml.replaceAll("%replace_description%", post.content[0].description)
                    .replaceAll("%replace_like_amount%", post.likes.length)
                    .replaceAll("%replace_post_id%", post._id)
                    .replaceAll("%replace_user_id%", post.user_id)
                    .replaceAll("%replace_comments%", post.comments.length - 1)
                    .replaceAll("%replace_game%", post.game)
                    .replaceAll("%replace_message%", post.content[0].description)
                    .replaceAll("%replace_time%", getTimeDifference(post.post_date))
                    .replaceAll("%replace_title%", post.content[0].title)
                    .replaceAll("%replace_user%", post.posted_by)
                    .replaceAll("%replace_random_like_pfp%", post.likes.length > 0 ? post.likes[Math.floor(Math.random()*post.likes.length)] + "/user_id" : "no_likes/uuid")
                    .replaceAll("%replace_liked_icon%", post.likes.includes(user_id) ? "bx bxs-heart bx red" : "uil uil-heart");
    return newHtml;
}

async function getAndLoadNewPosts(amount) {
    let obj = await (await fetch('./api/internal/get/request/' + amount)).json();
    for(post of obj) {
        var toUpload = document.createElement("div");
        toUpload.innerHTML = createPostById(post);
        div.appendChild(toUpload);
    }
}

function getTimeDifference(oldTimestamp) {
    const ONE_MINUTE = 60 * 1000; // milliseconds
    const ONE_HOUR = 60 * ONE_MINUTE;
    const ONE_DAY = 24 * ONE_HOUR;
  
    const currentTime = Date.now();
    const timeDifference = currentTime - oldTimestamp;
  
    if (timeDifference < ONE_DAY) {
      // Display the time difference
      if (timeDifference < ONE_HOUR) {
        // Less than 1 hour
        const minutes = Math.floor(timeDifference / ONE_MINUTE);
        return `${minutes} minutes ago`;
      } else {
        // 1 hour or more
        const hours = Math.floor(timeDifference / ONE_HOUR);
        return `${hours} hours ago`;
      }
    } else {
      // Display the date
      const date = new Date(oldTimestamp);
      return date.toLocaleDateString();
    }
}

async function loadPosts(url) {
    let posts = await (await fetch(url)).json();
    for(post of posts) {
        var toUpload = document.createElement("div");
        toUpload.innerHTML = createPostById(post);
        div.appendChild(toUpload);
    }
}

async function injectComments(id) {
    var div = document.getElementById('comment_box');
    div.innerHTML = '';
    let posts = await (await fetch("../../../api/internal/get/request/comments/" + id)).json();
    for(comm of posts) {
        var toUpload = document.createElement("div");
        toUpload.classList = "comment";
        toUpload.innerHTML = commentHtml.replace("%replace_user_id%", comm[0]).replace("%replace_user_name%", comm[1]).replace("%replace_comment%", comm[2]);
        div.appendChild(toUpload);
    }
}

async function loadComments(id) {
    let section = document.querySelector(".comp_comments");
    let overlay = document.querySelector(".overlay");
    openCommentsPostId = id;
    overlay.classList.add("active");
    section.classList.add("active");
    injectComments(id);
}

let oldScrollPosition = 0;

switch(customLoader) {
    case "feed": {
        getAndLoadNewPosts(10);
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            if (scrollPosition >= 1000 + oldScrollPosition) {
                oldScrollPosition = scrollPosition;
                console.log('User has scrolled more 500 pixels or more from their original position ' + oldScrollPosition);
                getAndLoadNewPosts(10);
            }
        });
        break;
    }
    case "profile": {
        if(profile_id != null) {
            loadPosts('../../../api/internal/get/request/user/posts/' + profile_id)
        }
        break;
    }
}