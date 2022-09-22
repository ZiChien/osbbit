

$(function () {
    var basic = $('#demo-basic').croppie({
        viewport: {
            width: 300,
            height: 300
        }
    });

    $('#upload_image').on('change', function () {
        var reader = new FileReader();
        var file = $('input[name="upload_image"]').prop('files');
        reader.onload = function (event) {
            basic.croppie('bind', {
                url: event.target.result
            });
        }
        reader.readAsDataURL(file[0])
        $('.modal-body').show()
        $('#uploadimage').prop('disabled', false);
        $('.modal-footer').hide()
    })

    $('.cr-vp-square').css({
        "width": "357px",
        "height": "357px"
    })

    $('#uploadimage').on('click', function (e) {
        console.log('!')
        basic.croppie('result', {
            type: 'canvas',
            size: {
                width: 800,
                height: 800
            },
        })
            .then(function (res) {
                $('#imagebase64').val(res);
                let filename = upload_image.files[0].name.split('.')
                $('#imagename').val(filename[0]);
                console.log(res)
            })
            .catch(function(err){
                console.log(err);
            })
    })

    //addpost
    let n = location.pathname
    $.get(`auth/getpost${n}`, function (data) {
        userid = data.userid;
        const imgpath = data.imagePath;
        var new_colpost = function () {
            var colnum = 0;
            var postindex = 0;
            while (postindex < imgpath.length) {
                $('#postContainer').append('<div class="col-post" id="col-post">');
                console.log("new col")
                for (var postnum = 0; postnum < 3 && postindex < imgpath.length; postnum++) {
                    console.log(colnum)
                    var path = imgpath[postindex].image_name
                    $(`#col-post:nth-child(${colnum + 1})`).append(`<div class="post"><img class="postimage" src="${path}" alt=""></div>`);
                    postindex++;
                }
                colnum++;
            }
        }
        new_colpost()
    })



});
