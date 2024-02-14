$(document).ready(function(){
    $("#register").on("submit", function(event) {
        event.preventDefault();
        var password = $("#password").val();
        var hasUpperCase = /[A-Z]/.test(password);
        var hasLowerCase = /[a-z]/.test(password);
        var hasNumber = /[0-9]/.test(password);
        var hasSymbol = /[^A-Za-z0-9]/.test(password);
        
        if (!(hasUpperCase && hasLowerCase && hasNumber && hasSymbol)) {
            var message = "The password must contain:";
            if (!hasUpperCase) {
                message += "\n- At least 1 uppercase letter";
            }
            if (!hasLowerCase) {
                message += "\n- At least 1 lowercase letter";
            }
            if (!hasNumber) {
                message += "\n- At least 1 number";
            }
            if (!hasSymbol) {
                message += "\n- At least 1 symbol";
            }
            Swal.fire({
                title: "PASSWORD IS WEAK",
                text: message,
                showClass: {
                    popup: "animate__animated animate__fadeInUp animate__faster"
                },
                hideClass: {
                    popup: "animate__animated animate__fadeOutDown animate__faster"
                }
            });
        }else {
            var username = $("#username").val();
            var email = $("#email").val();
            var password = $("#password").val();
            var cpassword = $("#cpassword").val();
            
            console.log(username + " " + email + " " + password + " " + cpassword);
            
            if (password !== cpassword) {
                Swal.fire({
                    title: "PASSWORD IS WEAK",
                    text: "password is doesn't match with confirm password",
                    showClass: {
                        popup: "animate__animated animate__fadeInUp animate__faster"
                    },
                    hideClass: {
                        popup: "animate__animated animate__fadeOutDown animate__faster"
                    }
                });
            }
            if(password === cpassword)
            {
                $.ajax({
                    url: "../php_folder/register.php",
                    type: "POST",
                    dataType: "json",
                    data: {
                        register:true,
                        username: username,
                        email: email,
                        password: password
                    },
                    success: function(response) {
                        console.log(response);
                        if (response.status ===200) {
                            Swal.fire({
                                title: "REGISTER SUCCESS",
                                text: "You have been registered",
                                icon: "success",
                                showClass: {
                                    popup: "animate__animated animate__fadeInUp animate__faster"
                                },
                                hideClass: {
                                    popup: "animate__animated animate__fadeOutDown animate__faster"
                                }
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    window.location.href = "login.html";
                                }
                            });
                        }
                         else {
                            Swal.fire({
                                title: "REGISTER FAILED",
                                text: "Username or email has been used",
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
            }
        }
        
    });
});
