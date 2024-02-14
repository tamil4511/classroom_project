$(document).ready(function(){
    classroom_retrieve() ;
    $("#create_class").on("submit", function(e) {
        e.preventDefault();

        // Get class name and class code
        var classname = $("#classname").val();
        var classcode = generateCode();

        // Get profile image file
        var fileInput = document.getElementById('classprofile');
        var profileImage = fileInput.files[0];

        // Create FormData object to hold all data
        var formData = new FormData();
        formData.append('classname', classname);
        formData.append('classcode', classcode);
        formData.append('profile_image', profileImage);
        formData.append('create_class', true);

        // Send AJAX request to the PHP script
        $.ajax({
            url: "../php_folder/create_class.php",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            dataType: 'json', // Specify dataType as 'json'
            success: function(data) {
                if (data.status == 200) {
                    $('#create_class')[0].reset(); // Reset the form
                    alert("Class Created Successfully");
                    $("#close-model1").click(); // Trigger click event
                    classroom_retrieve();
                    //window.location.href = "class.php";
                }
            },
            error: function(xhr, status, error) {
                console.error(xhr.responseText);
                alert("Error creating class");
            }
        });
        
        
    });


    $("#join_class").on("submit", function(e) {
        e.preventDefault();
        console.log("Joining class");
        var classcode = $("#join_code").val();
        $.ajax({
            url: "../php_folder/join_class.php",
            type: "POST",
            data:{
                classcode: classcode,
                join_class: true
            },
            dataType: 'json',
            success: function(data) {
                if (data.status == 200) {
                    $('#join_class')[0].reset();
                    alert("Class Joined Successfully");
                    $("#close-model2").click();
                    classroom_retrieve();
                    //window.location.href = "class.php";
                }
            },
            error: function(xhr, status, error) {
                console.error(xhr.responseText);
                alert("Error joining class");
            }
        });
    });



    // Function to generate a class code
    function generateCode() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 6; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }


        function classroom_retrieve() {
            $.ajax({
                url: "../php_folder/classroom_retrieve.php",
                type: "POST",
                data: {classroom_retrieve: true},
                dataType: 'json',
                success: function(data) {
                    console.log(data); // Check what data is received
                    if(data.status === 200) {
                        $("#con").append('');
                        var class_data = data.data;
                        console.log(class_data);
                        $("#classroom").html('');
                        var studyImages = [
                            '../image/image1.webp',
                            '../image/study2.jpg',
                            '../image/image3.webp',
                            '../image/image2.jpg',
                            '../image/image4.jpg',
                            // Add more URLs as needed
                        ];
                        class_data.forEach(function(classItem) {
                            var t = document.getElementById('contain-1');
                            var r = document.getElementById('contain-2');
                            var s = document.getElementById('contain-3');

                            // Select a random image URL from the studyImages array
                            var randomImageIndex = Math.floor(Math.random() * studyImages.length);
                            var randomImageUrl = studyImages[randomImageIndex];

                            var content = '<figure class="snip1336" data-class-name="' + classItem.class_name + '" data-creator="' + classItem.creator + ' "data-code="'+classItem.code +'" onclick="visible(\'' + t.id + '\', \'' + s.id + '\', \'' + r.id + '\')">';
                            content += '<img src="' + randomImageUrl + '" alt="sample87" />';
                            content += '<figcaption>';
                            content += '<img src="' + classItem.profile + '" alt="profile-sample4" class="profile rounded-circle" />';
                            content += '<h2>' + classItem.class_name + '<span>' + classItem.creator + '</span></h2>';
                            content += '<a href="#" class="info">open</a>';
                            content += '</figcaption>';
                            content += '</figure>';

                            // Append the newly created content to the existing div with id 'con'
                            $("#con").html(content);
                        });  
                    }
                else if(data.status === 400){
                        var content = '<center><h4>NO CLASS FOUND</h4></center>';
                        $("#con").append(content);
                    }
                },
                error: function(xhr, status, error) {
                    console.error("AJAX Error: " + error);
                }
            });
        }
        

    $(document).on('click', '.snip1336', function() {
        var className = $(this).data('class-name');
        var creator = $(this).data('creator');
        var classcode = $(this).data('code');
        console.log("Class Name: " + className + ", Creator: " + creator);
        $('#class-name').text(className);
        $('#class-code').text(classcode);
    });


});
