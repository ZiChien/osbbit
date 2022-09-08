
$(function(){
    let earec = function(name,avater){
        $('#recon').append(
            '<div class="earec">'+
                `<button onclick="location.href='/${name}'">`+
                    '<div class="btnfqewf554">'+
                        `<div class="btnfqewf554img"><img src="${avater}" alt=""></div>`+
                        `<h4>${name}</h4>`+
                    '</div>'+
                '</button>'+
            '</div>'
        )
    }
    $('#seinpu').on('input',async function(){
        
        await axios.get('/auth/explore',{
            params:{    
                keywords: $(this).val()
            }
        })
        .then(function(res){
            if($('#seinpu').val()==''){
                console.log("1empty")
                $('#recon').empty();
                return false;
            }
            console.log("2empty")
            $('#recon').empty();
            res.data.users.forEach(element => {
                earec(element.name,element.avater)
            });
        })
        .catch(function(err){
            console.log(err);
        })
    })

})