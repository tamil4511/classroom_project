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
            alertify.set('notifier','position', 'top-right');
            alertify.warning('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
            return false;
        }

        else if(password == '' || newpassword == '' || confirmpassword == '') {
            alertify.set('notifier','position', 'top-right');
            alertify.warning('Please fill in all fields');

            return false;
        }
        else if(newpassword != confirmpassword) {
            alertify.set('notifier','position', 'top-right');
            alertify.warning('Passwords do not match');
            return false;
        }
        else if(password == newpassword) {
            alertify.set('notifier','position', 'top-right');
            alertify.warning('New password cannot be the same as old password');
            return false;
        }
        $.ajax({
            type : 'POST',
            url : '../php_folder/profile.php',
            data:{
                password:true,
                newpassword:newpassword,
                oldpassword:password
            },
            success:function(data){
                data = JSON.parse(data);
                if(data.status == 200) {
                    alertify.set('notifier','position', 'top-right');
                    alertify.success('Password changed successfully');
                    $('#changepassword')[0].reset();
                }
                else if(data.status == 400) {
                    alertify.set('notifier','position', 'top-right');
                    alertify.warning("Old password is incorrect");
                }
            }

        })
    });

    
    
});
