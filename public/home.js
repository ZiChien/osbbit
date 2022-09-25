

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
                $('#postintro').show();
                $('#uploadpost').show();
                $('.modal-body').hide();
                $('#uploadimage').hide();
            })
            .catch(function(err){
                console.log(err);
            })
    })
    $('#uploadpost').on('click',function(e){
        $('#uploadform').submit()
    })

    //addpost
    let n = location.pathname
    $.get(`auth/getpost${n}`, function (data) {
        const result = data.result;
        var new_colpost = function () {
            var colnum = 0;
            var postindex = 0;
            while (postindex < result.length) {
                $('#postContainer').append('<div class="col-post" id="col-post">');
                console.log("new col")
                for (var postnum = 0; postnum < 3 && postindex < result.length; postnum++) {
                    let path = result[postindex].image_path;
                    let asset_id = result[postindex].asset_id;
                    $(`#col-post:nth-child(${colnum + 1})`).append(`<div class="post"><a href="../p/${asset_id}"><img class="postimage" src="${path}" data-asset_id="${asset_id}" alt=""></a></div>`);
                    postindex++;
                }
                colnum++;
            }
        }
        new_colpost()
    })



});
