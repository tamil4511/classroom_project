$(document).ready(function() {
    image();
    $('#changepassword').on('submit', function(e) {
        e.preventDefault();
        var password = $('#oldpassword').val();
        var newpassword = $('#newpassword').val();
        var confirmpassword = $('#cnewpassword').val();

        // Regular expressions for password complexity
        var uppercaseRegex = /[A-Z]/;
        var lowercaseRegex = /[a-z]/;
        var symbolRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
        var numberRegex = /[0-9]/;

        // Check if the passwords meet complexity requirements
        if (
            !uppercaseRegex.test(newpassword) ||
            !lowercaseRegex.test(newpassword) ||
            !symbolRegex.test(newpassword) ||
            !numberRegex.test(newpassword)
        ) {
            alert('Password must contain at least one uppercase letter, one lowercase letter, one symbol, and one number');
            return false;
        }

        else if(password == '' || newpassword == '' || confirmpassword == '') {
            alert('All fields are required');
            return false;
        }
        else if(newpassword != confirmpassword) {
            alert('New password and confirm password do not match');
            return false;
        }
        else if(password == newpassword) {
            alert('Old password and new password cannot be the same');
            return false;
        }
        $.ajax({
            type : 'POST',
            url : '../php_folder/profile.php',
            data:{
                password:true,
                newpassword:newpassword,
            },
            success:function(data){
                data = JSON.parse(data);
                if(data.status == 200) {
                    alert('Password changed successfully');
                    $('#changepassword')[0].reset();
                }
                else {
                    alert('Incorrect old password');
                }
            }

        })
    });

    
    
});
