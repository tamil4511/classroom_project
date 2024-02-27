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
                if (data.status == 200) {
                    alertify.set('notifier', 'position', 'top-right');
                    alertify.success('Login successfully');
                    setTimeout(function() {
                        window.location.href = "../html_folder/home.html";
                    }, 1000); 
                } else {
                    alertify.set('notifier', 'position', 'top-right');
                    alertify.error(data.message);
                }
            }
            
        })
        
    });

   
});