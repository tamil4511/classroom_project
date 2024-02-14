    $(document).ready(function(){
        function uploadImage() {
            console.log('uploadImage');
            var formData = new FormData();
            var fileInput = document.getElementById('profile-image-upload');
            formData.append('file', fileInput.files[0]);
            formData.append('uploadImage', true);
        
            $.ajax({
                url: '../phpfolder/upload.php',
                type: 'POST',
                data: formData,
                contentType: false,
                processData: false,
                success: function(response) {
                    if (response.status === 200) {
                        image();
        
                    } else {
                        alert(response.message);
                    }
                },
                error: function(xhr, status, error) {
                    console.error('AJAX request failed:', status, error);
                    console.log(xhr.responseText); // Log the full response for additional details
                    alert('AJAX request failed. Please check the console for more information.');
                }
            });
        }

        function image() {
            $.ajax({
                url: '../phpfolder/retrieve.php',
                type: 'GET',
                data: {
                    'image': true
                },
                success: function(response) {
                    if (response.status === 200) {
                        var profileImageSrc = response.image ? '../uploads/' + response.image : '../imagefolder/default-profile.jpg';
                        document.getElementById('changeImage').src = profileImageSrc;
                        document.getElementById('profileImage').src = profileImageSrc;
                    }
                },
                error: function(xhr, status, error) {
                    console.error('AJAX request failed:', status, error);
                    console.log(xhr.responseText); // Log the full response for additional details
                    alert('AJAX request failed. Please check the console for more information.');
                }
            });
        }
    });

