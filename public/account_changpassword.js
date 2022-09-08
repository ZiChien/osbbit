$(function(){
    let noteup = function(note){
        $('#note').animate({
            bottom: "0px"
        }, {
            duration: 400,
            queue: false,
            complete: function(){
                $(this).delay(2000).animate({bottom: '-40px'})
            }
        })
        .find('p').text(note)
    }
    $('#btn_changpassword').on('click',function(){
        if($('#n_password').val()!=$('#confrim_o_password').val()){
            noteup(res.data.info);
            return;
        }
        axios.post('/auth/changpassword',{
            password : $('#o_password').val(),
            newpassword: $('#n_password').val()
        })
            .then(function(res){
                if(!res.data.pwcheck){
                    noteup(res.data.info)
                }
                else{
                    noteup(res.data.info)
                    $('#o_password').val("")
                    $('#n_password').val("")
                    $('#confrim_o_password').val("")
                }
            })
    })
})