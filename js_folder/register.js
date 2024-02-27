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
            alertify.set('notifier','position', 'top-right');
            alertify.warning(message);
        }else {
            var username = $("#username").val();
            var email = $("#email").val();
            var password = $("#password").val();
            var cpassword = $("#cpassword").val();
            
            console.log(username + " " + email + " " + password + " " + cpassword);
            
            if (password !== cpassword) {
                alertify.set('notifier','position', 'top-right');
                alertify.warning('Passwords do not match');
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
                            alertify.set('notifier', 'position', 'top-right');
                            alertify.success('Registered successfully');
                    setTimeout(function() {
                        window.location.href = "../html_folder/login.html";
                    }, 1000); 
                        }
                         else {
                            alertify.set('notifier', 'position', 'top-right');
                            alertify.error("response.message");
                        }
                    }
                })
            }
        }
        
    });
});
