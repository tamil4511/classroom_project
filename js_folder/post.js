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
                    alertify.set('notifier','position', 'top-right');
                    alertify.success('post created successfully');
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
                    var postDiv = '';
                    var postsContainer = document.getElementById("postsContainer");
                    if (postsContainer) {
                        postsContainer.innerHTML = "";
                    }
                    for (var i = 0; i < response.data.length; i++) {
                        var post = response.data[i];
                        postDiv = '<div class="row-8 my-5 rounded-4 p-4 shadow" style="border: 1px solid black;">';
                        postDiv += '<div class="row">';
                        postDiv += '<div class="col-2 col-md-1">';
                        var profileImageSrc = post.profile ? '../userprofile/' + post.profile : '../image/profile_image.jpg';
                        postDiv += '<img src="' + profileImageSrc + '" alt="" width="50px" height="50px" class="rounded-circle"></div>';
                        postDiv += '<div class="col-8">';
                        postDiv += '<div class="row-12 d-flex justify-content-between">';
                        postDiv += '<h6>' + post.people + '</h6>';
                        if (response.username.toString().trim() == post.people.toString().trim() || response.username.toString().trim() == creator.toString().trim()){
                            postDiv += '<img src="../image/dustbin.jpeg" alt="" width="30px" height="30px" class="delete-post" data-post-id="' + post.id + '">';
                            console.log('post id:', post.id);

                        }
                        postDiv += '</div>';

                        postDiv += '<p>' + post.date + '</p>';
                        postDiv += '</div>';
                        postDiv += '</div>';
                        postDiv += '<div class="row shadow rounded-5 my-4 px-5 py-3">';
                        postDiv += '<div class="row">';
                        postDiv += '<h3>' + post.title + '</h3>';
                        postDiv += '</div>';
                        postDiv += '<div class="row-6 my-2 d-flex">';
                        var fullPath = post.data;
                        var fileName = fullPath.split('/').pop(); // Extract the file name from the full path
                        postDiv += '<p class="mb-3">' + fileName + '</p>'; 
                        postDiv += '<img src="../image/download.webp" alt="" width="33px" height="33px" class="mx-2 download-btn" data-file="' + fullPath + '" data-bs-toggle="tooltip" title="Download">';
                        postDiv += '</div>';
                        postDiv += '</div>';
                        postDiv += '<div class="row-12">';
                        postDiv += '<h4 class="mb-4" style="font-weight:500">COMMENTS</h4>';
                        postDiv += '</div>';
                        for(var j = 0; j < post.comments.length; j++) {
                            var comment = post.comments[j];

                            postDiv += '<div class="row">';
                            postDiv += '<div class="col-2 col-md-1">';
                            var profileImageSrc = comment.profile ? '../userprofile/' + comment.profile : '../image/profile_image.jpg';
                            postDiv += '<img src="' + profileImageSrc + '" alt="" width="50px" height="50px" class="rounded-circle"></div>';
                            postDiv += '<div class="col">';
                            postDiv += '<div class="row-10 me-5 d-flex justify-content-between">';
                            postDiv += '<h5>' + comment.comment_name + '</h5>';
                            var commentname = comment.comment_name;
                            console.log(response.username);
                            console.log(comment.comment_name);

                            if (response.username == comment.comment_name || response.username.toString().trim() == creator.toString().trim()){
                                postDiv += '<img src="../image/dustbin.jpeg" alt="" width="30px" height="30px" class="delete-comment" data-comment-id="' + comment.id + '">';
                                  console.log('comment id:', comment.id);
                            }
                            
                            
                            // postDiv += '<img src="../image/dustbin.jpeg" alt="" width="30px" height="30px"></img>';

                            postDiv += '</div>';
                            postDiv += '<div class="row-12">';
                            postDiv += '<p>' + comment.comment + '</p>';
                            postDiv += '</div>';
                            postDiv += '</div>';
                            postDiv += '</div>';
                        }
                    
                        postDiv += '<div class="row-12 d-flex mt-5">';
                        postDiv += '<div class="col-3 col-md-1">';
                            var profileImageSrc = post.profile ? '../userprofile/' + post.profile : '../image/profile_image.jpg';
                            console.log(profileImageSrc);
                            postDiv += '<img src="' + profileImageSrc + '" alt="" width="50px" height="50px" class="rounded-circle">';
                        postDiv += '</div>';
                        postDiv += '<form id="comment_post" class="w-100 d-flex">';
                        postDiv += '<div class="col-8">';
                        postDiv += '<input type="text" class="rounded-4 p-2" style="width: 100%;" id="comment" placeholder="Enter your comment">';
                        postDiv += '</div>';
                        postDiv += '<input type="hidden" name="post_id" id="post_title" value="' + post.title + '">';
                        console.log(post.title);
                        postDiv += '<div class="col-auto px-3 py-1">';
                        postDiv += '<button type="submit" style="border:none" class="rounded-circle shadow"><img src="../image/send.png" alt="" width="20px" height="20px"></button>';
                        postDiv += '</div>';
                        postDiv += '</form>';
                        postDiv += '</div>';
                    
                        postDiv += '</div>'; // Closing the main post div
                    
                        // Append the postDiv to the postsContainer
                        var postsContainer = document.getElementById("postsContainer");
                        if (postsContainer) {
                            postsContainer.innerHTML += postDiv;
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
                    var postsContainer = document.getElementById("postsContainer");
                        if (postsContainer) {
                            postsContainer.innerHTML = '<center><h4 style="font-weight:500;">NO POSTS AVAILABLE</h4></center>';
                        } 
                }       
            },
            error: function(xhr, status, error) {
                alertify.set('notifier','position', 'top-right');
                    alertify.error('Error creating post. Please try again later');
            }            
        });
    }

    $(document).on('submit', '#comment_post', function(e) {
        e.preventDefault();
        var comment_data = $(this).find('#comment').val();
        var post_title = $(this).find('#post_title').val();
        console.log("Comment: " + comment_data + ", Post Title: " + post_title);
        $.ajax({
            url: "../php_folder/post.php",
            type: "POST",
            data: {
                comment: true,
                comment_data: comment_data,
                classname: className,
                post_title: post_title
            },
            dataType: 'json',
            success: function(data) {
                console.log("response working");
                console.log(data);
                if (data.status == 200) {
                    $('#comment_post')[0].reset();
                    alertify.set('notifier','position', 'top-right');
                    alertify.success('Comment Created Successfully');
                    retrival_post(); // Call retrival_post() after successful comment creation
                }
                else
                {
                    alertify.set('notifier','position', 'top-right');
                    alertify.error('Error creating comment');
                }
            },
        });
    });
    


    


    $(document).on('click', '.delete-post', function() {
        var postId = $(this).data('post-id');
        console.log("Post ID: " + postId);
        $.ajax({
            url: "../php_folder/post.php",
            type: "POST",
            data: {
                delete_post: true,
                postId: postId
            },
            dataType: 'json',
            success: function(data) {
                console.log(data);
                if (data.status == 200) {
                    alertify.set('notifier','position', 'top-right');
                    alertify.success('Post deleted successfully');
                    retrival_post(); // Call retrival_post() after successful post deletion
                }
                else
                {
                    alertify.set('notifier','position', 'top-right');
                    alertify.error('Error deleting post');
                }
            },
        });
    });

    $(document).on('click', '.delete-comment', function() {
        var commentId = $(this).data('comment-id');
        console.log("Comment ID: " + commentId);
        $.ajax({
            url: "../php_folder/post.php",
            type: "POST",
            data: {
                delete_comment: true,
                commentId: commentId
            },
            dataType: 'json',
            success: function(data) {
                console.log(data);
                if (data.status == 200) {
                    alertify.set('notifier','position', 'top-right');
                    alertify.success('Comment deleted successfully');
                    retrival_post(); // Call retrival_post() after successful comment deletion
                }
                else
                {
                    alertify.set('notifier','position', 'top-right');
                    alertify.error('Error deleting comment');
                }
            },
        });
    });
    
    

});
