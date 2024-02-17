$(document).ready(function(){
    $("#login").on("submit", function(event) {
        event.preventDefault();
        var email = $("#email").val();
        var password = $("#password").val();
        console.log(email + " " + password);
        $.ajax({
            url: "../php_folder/login.php",
            type: "POST",
            dataType: "json",
            data: {
                login:true,
                email: email,
                password: password
            },
            success: function(data) {
                console.log(data);
                if (data.status ==200) {
                    Swal.fire({
                        title: "LOGIN SUCCESS",
                        text: "You will be redirected to the home page",
                        icon: "success",
                        showClass: {
                            popup: "animate__animated animate__fadeInUp animate__faster"
                        },
                        hideClass: {
                            popup: "animate__animated animate__fadeOutDown animate__faster"
                        },
                        timer: 2000
                    }).then(function() {
                        window.location = "../html_folder/home.html";
                    });
                } else {
                    Swal.fire({
                        title: "LOGIN FAILED",
                        text: data.message,
                        icon: "error",
                        showClass: {
                            popup: "animate__animated animate__fadeInUp animate__faster"
                        },
                        hideClass: {
                            popup: "animate__animated animate__fadeOutDown animate__faster"
                        }
                    });
                }
            }
        })
        
    });

   
});