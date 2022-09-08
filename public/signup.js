

$(async function(){
    $('#email').focus();
    var getavilble = async function(){
        if($('#email').val()=="") return
        await axios.get('/auth/checkemail',{
            params: {
                email: $('#email').val()
            }
        })
        .then(function(res){
            const available = res.data.available;
            var isAvailble = function(available){
                if(!available) return "*此信箱已註冊過了"
                else return ""
            }
            $('#email-label').text(isAvailble(available))
        })
        .catch(function(err){
            console.log(err);
        })
    }
    let getusernameavilble = async function(){
        if($('#Username').val()=="") return
        await axios.get('/auth/checkname',{
            params: {
                name: $('#Username').val()
            }
        })
        .then(function(res){
            const available = res.data.available;
            var isAvailble = function(available){
                if(!available) return "*此用戶名稱已被使用"
                else return ""
            }
            $('#name-label').text(isAvailble(available))
        })
        .catch(function(err){
            console.log(err);
        })
    }

    $('#email').focusout(await function(){
        if($(this).val()==""){
            $(this).parent().find("label").text("*必填")
            return;
        }
        else{
            $(this).parent().find("label").text("")
        }
        getavilble();
    })
    $('#Username').focusout(function(){
        if($(this).val()==""){
            $(this).parent().find("label").text("*必填")
            return;
        }else{
            $(this).parent().find("label").text("")
        }
        getusernameavilble();
    })

    $('#confirmpassword').focusout(function(){
        

        var password = $('#password').val();
        if(password != $(this).val()){
            $('#confirmpassword-label').text("*密碼不相符")
        }
        else{
            $('#confirmpassword-label').text("")
        }
    })
    $('#password').focusout(function(){

        if($(this).val()==""){
            $(this).parent().find("label").text("*必填")
            return;
        }else{
            $(this).parent().find("label").text("")
        }
        var confirmpassword = $('#confirmpassword').val();
        if(confirmpassword != $(this).val()){
            $('#confirmpassword-label').text("*密碼不相符")
        }
        else{
            $('#confirmpassword-label').text("")
        }
    })


    $('#login-btn').click(async function(){
        
        await getavilble()
        await getusernameavilble()
        $('.form-group label').each(function(index){
            console.log($(this).parent().find("input").val())
            if($(this).parent().find("input").val()===""){
                $(this).text("*必填")
                $(this).parent().find("input").focus();
                return false;
            }
            if($(this).text()!==""){
                $(this).parent().find("input").css("border","1px solid red")
                $(this).parent().find("input").focus();
                return false;
                // return non-false" value will act as a continue
            }else{
                if(index==3){
                    $('#signup-form').submit()
                }
            }
        })
    })
})