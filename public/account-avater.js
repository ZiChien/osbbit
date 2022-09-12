
$(function () {
    // var basic_avater = $('#demo-basic-avater').croppie({
    //     viewport: {
    //         width: 300,
    //         height: 300
    //     }
    // });

    // $('#upload_image-avater').on('change',function () {

    //     var reader_avater = new FileReader();
    //     var file_avater = $('input[name="upload_image-avater"]').prop('files');
    //     reader_avater.onload = function (event) {
    //         basic_avater.croppie('bind', {
    //             url: event.target.result
    //         });
    //     }
    //     reader_avater.readAsDataURL(file_avater[0])
    //     $('.modal-body-avater').show()
    //     $('#uploadimage-avater').prop('disabled',false);
    //     $('.modal-footer-avater').hide()
    // })


    let modal = document.getElementById('exampleModal2')
    let ismodalopen = false;
    let basic_avater;
    let avatername;
    $('#upload_image-avater').on('change', function () {
        $('#avaterChange-btn').trigger('click');

        modal.ontransitionend = function (event) {

            if (event.propertyName == 'opacity') {
                if (ismodalopen) {
                    ismodalopen = false;
                    return;
                }
                basic_avater = $('#demo-basic-avater').croppie({
                    viewport: {
                        width: 300,
                        height: 300,
                        type: 'circle'
                    },

                });
                var reader_avater = new FileReader();
                var file_avater = $('input[name="upload_image-avater"]').prop('files');
                avatername = file_avater[0].name

                let filename = file_avater[0].name.split('.')
                reader_avater.onload = function (event) {
                    basic_avater.croppie('bind', {
                        url: event.target.result
                    });
                }
                reader_avater.readAsDataURL(file_avater[0])
                $('#uploadimage-avater').prop('disabled', false);
                $('.cr-vp-square').css({
                    "width": "357px",
                    "height": "357px"
                })
                ismodalopen = true;
            }
        }
    })
    $('#exampleModal2').on('hidden.bs.modal', function () {
        $('#upload_image-avater').val('')
        $('#demo-basic-avater').croppie('destroy')
        console.log("modal close!")
    })

    $('#uploadimage-avater').on('click', function (e) {
        console.log('!')
        basic_avater.croppie('result', {
            type: 'canvas',
            size: 'viewport',
            quality: 1
        })
            .then(function (res) {
                $('#imagebase64-avater').val(res);

                $('#imagename-avater').val(filename[0]);
            })
    })


    // ------------------------------------------
    let username = $('#newname').val();
    let authname = true;
    $('#newname').focusout(function () {
        if ($(this).val() == username) {
            return;
        }
        axios.get('/auth/checkname', {
            params: {
                name: $('#newname').val()
            }
        })
            .then(function (res) {
                console.log(res.data.available)
                if (!res.data.available) {
                    $('#namelabel').text("*此用戶名稱已被使用")
                    authname = false;
                } else {
                    $('#namelabel').text("")
                    authname = true;
                }
            })
            .catch(function (err) {
                console.log(err);
            })
    })

    //---------------textarea-----------------------
    $('#btn_info').on('click', function () {
        if (!authname) return;
        let info = $('#intro').val()
        info = info.replace(/\n|\r\n/g, "<br>");
        $('#intro').val(info)
        $('#signup-form').submit();
    })
    let trasintro = function () {
        let info = $('#intro').val();
        info = info.replace(/<br>/g, "\n");
        $('#intro').val(info);
        console.log(info)
    }
    trasintro();
});
