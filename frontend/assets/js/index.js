// SIDEBAR 
const menuItems = document.querySelectorAll('.menu-item');

// THEME
const theme = document.querySelector('#theme');
const themeModal = document.querySelector('.customize-theme');
const fontSizes = document.querySelectorAll('.choose-size span');
var root = document.querySelector(':root');
const colorPalette = document.querySelectorAll('.choose-color span');
const Bg1 = document.querySelector('.bg-1');
const Bg2 = document.querySelector('.bg-2');
const Bg3 = document.querySelector('.bg-3');



// ================ SIDEBAR ===============

// remove active class from all menu items
const changeActiveItem = () => {
    menuItems.forEach(item => {
        item.classList.remove('active');
    })
}

menuItems.forEach(item => {
    item.addEventListener('click', () => {
        changeActiveItem();
        item.classList.add('active');
        if(item.id != 'notifications'){
            document.querySelector('.notifications-popup').style.display = 'none';
        } else{
            document.querySelector('.notifications-popup').style.display = 'block';
            document.querySelector('#notifications .notification-count').style.display = 'none';
        }
    })
})

// THEME/DISPLAY CUSTOMIZATION

// opens modal
const openThemeModal = () => {
    themeModal.style.display = 'grid';
}

// closes modal
const closeThemeModal = (e) => {
    if(e.target.classList.contains('customize-theme')){
        themeModal.style.display = 'none';
    }
}

// close modal
themeModal.addEventListener('click', closeThemeModal);

theme.addEventListener('click', openThemeModal);




// ======================== FONTS =========================

// remove active class from spans or font size selectors
const removeSizeSelector = () => {
    fontSizes.forEach(size => {
        size.classList.remove('active');
    })
}

fontSizes.forEach(size => {
    size.addEventListener('click', () => {
        removeSizeSelector();
        let fontSize;
        size.classList.toggle('active');
        
        let sticky_top_left = 0;
        let sticky_top_right = 0;

        if(size.classList.contains('font-size-1')){
            fontSize = '10px';
            sticky_top_left = '5.4rem';
            sticky_top_right = '5.4rem';
        } else if(size.classList.contains('font-size-2')){
            fontSize = '13px';
            sticky_top_left = '5.4rem';
            sticky_top_right = "-7rem";
        } else if(size.classList.contains('font-size-3')){
            fontSize = '16px';
            sticky_top_left = '-2rem';
            sticky_top_right = "-17rem";
        } else if(size.classList.contains('font-size-4')){
            fontSize = '19px';
            sticky_top_left = '-5rem';
            sticky_top_right = "-25rem";
        } else if(size.classList.contains('font-size-5')){
            fontSize = '22px';
            sticky_top_left = '-12rem';
            sticky_top_right = "-35rem";
        }
        // UPDATE
        root.style.setProperty('----sticky-top-left', sticky_top_left);
        root.style.setProperty('----sticky-top-right', sticky_top_right);
        setCookie("sticky_top_left", sticky_top_left, 60);
        setCookie("sticky_top_right", sticky_top_right, 60);
        setCookie("font_size", fontSize, 60);
        document.querySelector('html').style.fontSize = fontSize;
    })
    
})



// remove active class from colors
const changeActiveColorClass = () => {
    colorPalette.forEach(colorPicker => {
        colorPicker.classList.remove('active');
    })
}

// change primary colors
colorPalette.forEach(color => {
    color.addEventListener('click', () => {
        let primary;
        // remove active class from colors
        changeActiveColorClass();

        if(color.classList.contains('color-1')){
            primaryHue = 252;
        } else if(color.classList.contains('color-2')){
            primaryHue = 52;
        } else if(color.classList.contains('color-3')){
            primaryHue = 352;
        } else if(color.classList.contains('color-4')){
            primaryHue = 152;
        } else if(color.classList.contains('color-5')){
            primaryHue = 202;
        }
        color.classList.add('active');

        root.style.setProperty('--primary-color-hue', primaryHue);
        setCookie("hue", primaryHue, 60);
    })
})

// theme BACKGROUND values
let lightColorLightness;
let whiteColorLightness;
let darkColorLightness;

// changes background color
const changeBG = () => {
    root.style.setProperty('--light-color-lightness', lightColorLightness);
    root.style.setProperty('--white-color-lightness', whiteColorLightness);
    root.style.setProperty('--dark-color-lightness', darkColorLightness);
    setCookie("dark_color_lightness", darkColorLightness, 60);
    setCookie("light_color_lightness", lightColorLightness, 60);
    setCookie("white_color_lightness", whiteColorLightness, 60);
}


// change background colors
Bg1.addEventListener('click', () => {
    // add active class
    Bg1.classList.add('active');
    // remove active class from the others
    Bg2.classList.remove('active');
    Bg3.classList.remove('active');
    // remove customized changes from local storage
    setCookie("dark_color_lightness", 17, 60);
    setCookie("light_color_lightness", 95, 60);
    setCookie("white_color_lightness", 100, 60);
    window.location.reload();
});

Bg2.addEventListener('click', () => {
    darkColorLightness = '95%';
    whiteColorLightness = '20%';
    lightColorLightness = '15%';
    
    // add active class
    Bg2.classList.add('active');
    // remove active class from the others
    Bg1.classList.remove('active');
    Bg3.classList.remove('active');
    changeBG();
});

Bg3.addEventListener('click', () => {
    darkColorLightness = '95%';
    whiteColorLightness = '10%';
    lightColorLightness = '0%';

    // add active class
    Bg3.classList.add('active');
    // remove active class from others
    Bg1.classList.remove('active');
    Bg2.classList.remove('active');
    changeBG();
})




// show sidebar
const menuBtn = document.querySelector('#menu-btn');
    menuBtn.addEventListener('click', () => {
    document.querySelector('.left').style.display = 'block';
})

// hide sidebar
const closeBtn = document.querySelector('#close-btn');
    closeBtn.addEventListener('click', () => {
    document.querySelector('.left').style.display = 'none';
})

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
  }
  
// LIKES / COMMENTS / SAVE ----------------------------------------------------------------------------------------------

async function likePost(postId) {
    switch((await fetch("../../api/internal/post/like/" + postId)).status) {
        case 200: {
            var iElement = document.getElementById(postId + "-like-button");
            iElement.className = 'bx bxs-heart bx red';
            break;
        }
        case 401: {
            showMedal('.login_needed');
            break;
        }
        case 900: {
            (await fetch("../../api/internal/post/unlike/" + postId)).status
            var iElement = document.getElementById(postId + "-like-button");
            iElement.className = 'uil uil-heart';
            break;
        } 
    }
}

// INTERACTIONS

let interactionUserId = null;
let interactionPostId = null;
let openCommentsPostId = null;

async function openInteraction(postId, user) {
    interactionUserId = user;
    interactionPostId = postId;
    if((await fetch(`../../../../api/internal/post/delete/${interactionPostId}/false`)).status != 200) {
        let button = document.querySelector(".auth_for_interaction");
        button.classList.add("disabled");
    }
    showMedal(".user_interaction");
}

async function processInteraction(type) {
    switch(type) {
        case "like": {
            break;
        }
        case "profile": {
            removeMedal(".user_interaction");
            window.location.href = './home/profile/' + interactionUserId;
            break;
        }
        case "delete_post": {
            removeMedal(".user_interaction");
            await fetch(`../../../../api/internal/post/delete/${interactionPostId}/true`);
            window.reload;
            break;
        }
    }
}

async function sendComment() {
    if(openCommentsPostId == null)
        return;
    let comment = document.getElementById("user-comment-imput").value;
    await fetch(`../../../../api/internal/post/add/comment/${openCommentsPostId}/${comment}`);
    // reload comments
    injectComments(openCommentsPostId);
    document.getElementById("user-comment-imput").value = "";
}

// MEDAL REMOVAL AND ACTIVATOR

function showMedal(name) {
    let section = document.querySelector(name);
    let overlay = document.querySelector(".overlay");
    overlay.classList.add("active");
    section.classList.add("active");
}
function removeMedal(name) {
    let section = document.querySelector(name);
    let overlay = document.querySelector(".overlay");
    overlay.classList.remove("active");
    section.classList.remove("active"); 
}