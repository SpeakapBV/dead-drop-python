/**
 * Created for Dead Drop
 * Date: 2013-10-08
 * Time: 10:28 AM
 */

var pw;
var root;
var domain;


function setDrop() {

    "use strict";

    var text = symmetricEncrypt();

    $.post("/drop", { data: text }, function (data) {

        $("#MakeDrop").hide(0, function () {
            var id = data.id;
            var url = buildUrl(id);

            $("#url").text(url);

            $('#pickuplink').attr("href", url);

            $("#pass").text(pw);
            $("#DropComplete").show(0);

        }
        );

    }).fail(function () {

        $.toast({ 
            heading : "<b>Oops...</b>",
            text : "Something went wrong. Unable to create the message.", 
            showHideTransition : 'slide',
            allowToastClose : false,
            hideAfter : 5000,
            textAlign : 'left',
            position : 'top-right'
        });
        //window.location.assign(getHost());
    });

    

}


function getDrop() {

    if (typeof dropid == 'undefined') {
        alert('no drop found');
        window.location.assign("/");
    }

    $.ajax({
        url: '/drop/'+dropid,
        success: function (data) {

            if (data == null) {
                alert('no drop found');
                window.location.assign("/");
                return false;
            }

            var plainText = symmetricDecrypt(JSON.stringify(data));
            $("#decrypted").text(plainText);

            $("#RetrieveDrop").hide(0, function () {
                $("#DisplayDrop").show(0);
            });
        }

    }).fail(function () {

        $.toast({ 
            heading : "<b>Oops...</b>",
            text : "Something went wrong. Unable to get the message.", 
            showHideTransition : 'slide',
            allowToastClose : false,
            hideAfter : 5000,
            textAlign : 'left',
            position : 'top-right'
        });
        //window.location.assign(getHost());
        
    });
}


function makePwd() {
    "use strict";

    //get a good seed
    sjcl.random.startCollectors();

    for (var i = 0; i < 5; i++) {
        //throw away a couple
        sjcl.random.randomWords(1);
    }

    var m = new MersenneTwister(sjcl.random.randomWords(1));
    sjcl.random.stopCollectors();

    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 15; i++) {
        text += possible.charAt(Math.floor(m.random() * possible.length));
    }

    return text;
}


function buildUrl(id) {
    host = getHost()
    var final = host.concat("/pickup/");
    var final = final.concat(id);
    return final;
}

function getHost(){
    "use strict";
    var http = location.protocol;
    var slashes = http.concat("//");
    var host = slashes.concat(window.location.hostname);
    if (window.location.port != "") {
       host = host.concat(":").concat(window.location.port);
    }

    return host
}


function symmetricEncrypt() {
    try {
        "use strict";
        pw = makePwd();
        var crypt = sjcl.encrypt(pw, $('#message').val());

        return crypt;
    } catch (err) {
        $.toast({ 
            heading : "<b>Oops...</b>",
            text : "Error encrypting data", 
            showHideTransition : 'slide',
            allowToastClose : false,
            hideAfter : 5000,
            textAlign : 'left',
            position : 'top-right'
        });
        //alert('Error encrypting data');
        return false;
    }
}


function symmetricDecrypt(data) {
    try {
        "use strict";
        var pw = $("#password").val();
        //trim it
        pw = $.trim(pw);

        return sjcl.decrypt(pw, data);

    } catch (err) {
        $.toast({ 
            heading : "<b>Oops...</b>",
            text : "Error decrypting data", 
            showHideTransition : 'slide',
            allowToastClose : false,
            hideAfter : 5000,
            textAlign : 'left',
            position : 'top-right'
        });
        //window.location.assign("/");
        return false;
    }
}



function require(script) {
    "use strict";
    $.ajax({
        url: script,
        dataType: "script",
        async: false,           // <-- this is the key
        success: function () {
            // all good...
        },
        error: function () {
            throw new Error("Could not load script " + script);
        }
    });
}


$(document).ready(function () {
    root = "/";

    if (typeof dropid != 'undefined') {
        //this is a pickup, show the password dialog
        $("#MakeDrop").hide();
        $("#RetrieveDrop").show();
    } else {
        $("#MakeDrop").show();
        $("#message").focus();
    }

    if (top != self) {
        top.location.assign("/");
    }

    // Showing the particles background
    particlesJS("particles-bg", {
        particles: {
            number: { value: 160, density: { enable: true, value_area: 800 } },
            color: { value: ["#BD10E0","#B8E986","#50E3C2","#FFD300","#E86363"] },
            shape: {
                type: "circle",
            },
            opacity: {
                value: 1,
                random: true,
                anim: { enable: true, speed: 1, opacity_min: 0, sync: false }
            },
            size: {
                value: 3,
                random: true,
                anim: { enable: false, speed: 4, size_min: 0.3, sync: false }
            },
            line_linked: {
                enable: false,
                distance: 150,
                color: "#ffffff",
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 1,
                direction: "none",
                random: true,
                straight: false,
                out_mode: "out",
                bounce: false,
                attract: { enable: false, rotateX: 600, rotateY: 600 }
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: false, mode: "bubble" },
                onclick: { enable: false, mode: "repulse" },
                resize: true
            },
            modes: {
                grab: { distance: 400, line_linked: { opacity: 1 } },
                bubble: { distance: 250, size: 0, duration: 2, opacity: 0, speed: 3 },
                repulse: { distance: 400, duration: 0.4 },
                push: { particles_nb: 4 },
                remove: { particles_nb: 2 }
            }
        },
        retina_detect: true
    });

});
