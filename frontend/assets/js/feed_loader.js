let htmlFeedWithPicture = `<div class="feed">
<div class="head">
    <div class="user">
        <div class="profile-photo">
            <img src="./api/profile/image/%replace_profile_picture%">
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
    <img src="./images/feed-1.jpg">
</div>

<div class="action-buttons">
    <div class="interaction-buttons">
        <span><i class="uil uil-heart"></i></span>
        <span><i class="uil uil-comment-alt"></i></span>
        <span><i class="uil uil-link"></i></span>
    </div>
    <div class="bookmark">
        <span><i class="uil uil-bookmark-full"></i></span>
    </div>
</div>

<div class="liked-by">
    <!-- write a random pick form the likes -->
    <span><img src="%replace_random_like_pfp%"></span>
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
            <img src="./api/profile/image/%replace_user_id%/user_id">
        </div>
        <div class="ingo">
            <h3>%replace_title%</h3>
            <small>For %replace_game%, %replace_time%</small>
        </div>
    </div>
    <span class="edit">
        <i class="uil uil-ellipsis-h"></i>
    </span>
</div>

<p class="text-content">%replace_message%</p>

<div class="action-buttons">
    <div class="interaction-buttons">
        <span onclick="addNewLike('%replace_post_id%');"><i class="%replace_liked_icon%"></i></span>
        <span onclick=""><i class="uil uil-comment-alt"></i></span>
        <span><i class="uil uil-link"></i></span>
    </div>
    <div class="bookmark">
        <span><i class="uil uil-bookmark-full"></i></span>
    </div>
</div>

<div class="liked-by">
    <!-- write a random pick form the likes -->
    <span><img src="./api/profile/image/%replace_random_like_pfp%/user_id"></span>
    <p>Liked by %replace_like_amount% other gamers</b></p>
</div>

<div class="caption">
    <p><b>%replace_user%</b> %replace_description%</p>
</div>
<div class="comments text-muted">View %replace_comments% comments</div>
</div>`;

var div = document.getElementById('feeds');

function createPostById(post) {
    let newHtml;
    if(post.content[0].image === "no_image") {
        newHtml = htmlFeedWithoutPicture;
    } else {
        newHtml = htmlFeedWithPicture;
    }
    newHtml = newHtml.replaceAll("%replace_description%", post.content[0].description)
                    .replaceAll("%replace_like_amount%", post.likes.length)
                    .replaceAll("%replace_post_id%", post._id)
                    .replaceAll("%replace_user_id%", post.user_id)
                    .replaceAll("%replace_comments%", post.comments.length)
                    .replaceAll("%replace_game%", post.game)
                    .replaceAll("%replace_message%", user_id)
                    .replaceAll("%replace_time%", getTimeDifference(post.post_date))
                    .replaceAll("%replace_title%", post.title)
                    .replaceAll("%replace_user%", post.posted_by)
                    .replaceAll("%replace_random_like_pfp%", post.likes.length > 0 ? post.likes[Math.floor(Math.random()*post.likes.length)] : "no_likes")
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

getAndLoadNewPosts(10);

let oldScrollPosition = 0;

window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY;
    if (scrollPosition >= 1000 + oldScrollPosition) {
        oldScrollPosition = scrollPosition;
        console.log('User has scrolled more 500 pixels or more from their original position ' + oldScrollPosition);
        getAndLoadNewPosts(10);
    }
  });
