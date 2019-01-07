'use strict';

function getHashContent() {
    return atob(decodeURIComponent(location.hash.substring(1)));
}

function isLink(content) {
    return content.substr(0,4) === "http";
}

function getExtensionFromLink(content) {
    var parser = document.createElement('a');
    parser.href = content;
    var splitted = parser.pathname.split('.');
    return splitted[splitted.length-1];
}

var imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'svg'];
function isImage(content) {
    return imageExtensions.indexOf(getExtensionFromLink(content).toLowerCase()) >= 0;
}

function guessType(content) {
    if (isLink(content)) {
        if (isImage(content)) {
            return "image";
        }
        return "link";
    }
    return "text";
}

function generateHash(content) {
    return encodeURIComponent(btoa(content));
}

function generateLink(content) {
    var a = document.createElement('a');
    a.href = location.href;
    a.hash = generateHash(content);
    return a.href;
}

var data = {
    content: 'one small step for a man, one giant leap for mankind in css man',
    editorEnabled: false
}

var computed = {
    link: function() {
        return generateLink(this.content);
    },
    contentType: function() {
        return guessType(this.content);
    }
}

var app = new Vue({
    el: '#app',
    data: data,
    computed: computed,
    methods: {
        talk: function() {
            if (this.contentType === 'text' && !!SpeechSynthesisUtterance) {
                var msg = new SpeechSynthesisUtterance(this.content);
                window.speechSynthesis.speak(msg);
            }
        }
    }
});

function init() {
    var hashContent = getHashContent();
    if (hashContent !== "") {
        data.content = hashContent;
    }
}

// function init() {
//     var hashContent = getHashContent();
//     if (hashContent === "") return;
//     var contentType = guessType(hashContent);

//     var bocadilloContainer = document.querySelector('.bocadillo');
//     bocadilloContainer.textContent = "";

//     if (contentType === "image") {
//         var image = document.createElement('img');
//         image.className = "bocadillo-image";
//         image.src = hashContent;
//         bocadilloContainer.appendChild(image);
//     } else if (contentType === "link") {
//         var link = document.createElement('a');
//         link.className = "bocadillo-link";
//         link.href = hashContent;
//         link.textContent = hashContent;
//         bocadilloContainer.appendChild(link);
//     } else {
//         bocadilloContainer.textContent = hashContent;
//     }
// }

init();

// window.onhashchange = init;