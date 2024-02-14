$(document).ready(function(){
    var className = ''; 
    var creator = '';

    $(document).on('click', '.snip1336', function() {
        className = $(this).data('class-name');
        creator = $(this).data('creator');
        console.log("Class Name: " + className + ", Creator: " + creator);
        $('#class-name').text(className);
        retrival_post(); // Call retrival_post() when .snip1336 is clicked
    });

    $("#post_form").on("submit", function(e) {
        e.preventDefault();
        var title = $("#title").val();
        var fileInput = document.getElementById('sfile');
        var data_file = fileInput.files[0];
        var filename = data_file.name;
        console.log("Title: " + title + ", File Name: " + filename + ", Class Name: " + className + ", Creator: " + creator);
        var formData = new FormData();
        formData.append('title', title);
        formData.append('sfile', data_file);
        formData.append('classname', className);
        formData.append('creator', creator);
        formData.append('post', true);

        $.ajax({
            url: "../php_folder/post.php",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            dataType: 'json',
            success: function(data) {
                console.log(data);
                if (data.status == 200) {
                    $('#post_form')[0].reset();
                    alert("Post Created Successfully");
                    $("#post-model").click();
                    retrival_post(); // Call retrival_post() after successful post creation
                }
            },
            error: function(xhr, status, error) {
                console.error(xhr.responseText);
                alert("Error creating post");
            }
        });
    });

    function retrival_post(){
        console.log("Retrieving posts for class: " + className);
        $.ajax({
            url: "../php_folder/post.php",
            type: "POST",
            data: {retrieve_post: true, classname: className},
            dataType: 'json',
            success: function(response) {
                if (response.status == 200) {
                    console.log("Posts retrieved:", response.data);
                    for (var i = 0; i < response.data.length; i++) {
                        var post = response.data[i];
                        var postDiv = '<div class="row-8 my-5 rounded-4 p-4" style="border: 1px solid black;">';
                        postDiv += '<div class="row">';
                        postDiv += '<div class="col-2 col-md-1">';
                        postDiv += '<img src="../image/image2.webp" alt="" width="50px" height="50px" class="rounded-circle"></div>';
                        postDiv += '<div class="col-2">';
                        postDiv += '<h6>' + creator + '</h6>'; // Assuming creator is the username
                        postDiv += '<p>' + post.date + '</p>';
                        postDiv += '</div>';
                        postDiv += '</div>';
                    
                        postDiv += '<div class="row">';
                        postDiv += '<div class="row">';
                        postDiv += '<h3>' + post.title + '</h3>';
                        postDiv += '</div>';
                        postDiv += '<div class="row-6 shadow d-flex">';
                        var fullPath = post.data;
                        var fileName = fullPath.split('/').pop(); // Extract the file name from the full path
                        postDiv += '<p>' + fileName + '</p>'; 
                        postDiv += '<img src="../image/download.webp" alt="" width="30px" height="30px" class="mx-2 download-btn" data-file="' + fullPath + '" data-bs-toggle="tooltip" title="Download">';
                        postDiv += '</div>';
                        postDiv += '</div>';
                    
                        postDiv += '<div class="row-12 d-flex mt-5">';
                        postDiv += '<div class="col-3 col-md-1">';
                        postDiv += '<img src="../image/image2.webp" width="50px" height="50px" class="rounded-circle" alt="">';
                        postDiv += '</div>';
                        postDiv += '<div class="col-8">';
                        postDiv += '<input type="text" class="rounded-4 p-2" style="width: 100%;" placeholder="Enter your comment">';
                        postDiv += '</div>';
                        postDiv += '<div class="col px-3 py-1">';
                        postDiv += '<img src="../image/send.png" alt="" width="20px" height="20px">';
                        postDiv += '</div>';
                        postDiv += '</div>';
                    
                        postDiv += '</div>'; // Closing the main post div
                    
                        // Append the postDiv to the postsContainer
                        var postsContainer = document.getElementById("postsContainer");
                        if (postsContainer) {
                            postsContainer.innerHTML += postDiv;
                        } else {
                            console.error("Container element with ID 'postsContainer' not found.");
                        }
                    }
                    
                    // Add event listener to download buttons
                    var downloadButtons = document.querySelectorAll('.download-btn');
                    downloadButtons.forEach(function(button) {
                        button.addEventListener('click', function() {
                            var fileUrl = button.getAttribute('data-file');
                            downloadFile(fileUrl);
                        });
                    });
                    
                    // Function to download file
                    function downloadFile(fileUrl) {
                        // Create an anchor element
                        var a = document.createElement('a');
                        a.href = fileUrl;
                        a.download = fileUrl.split('/').pop(); // Set the file name to be downloaded
                        document.body.appendChild(a);
                        a.click(); // Simulate click to trigger download
                        document.body.removeChild(a);
                    }
                    
                } else {
                    console.error("Invalid or missing response data.");
                }       
            },
            error: function(xhr, status, error) {
                console.error("Error creating post:", error); // Log the error details
                alert("Error creating post. Please try again later."); // Display a user-friendly error message
            }            
        });
    }
});
