//import '@fortawesome/fontawesome-free/js/all';

$(function(){
    $('.test').on('click', function(){
        let id=7;

        $.ajax({
            dataType: 'text',
            type: 'GET',
            url: '/ajax',
            data: {
                id:id,
            },
        }).done(function(data){
            console.log('通信成功！');
            console.log(data.name);

        }).fail(function(){
            alert('通信失敗');
        });
    });
    

    $('.selected-day').on('click',function(){
        let day_element = $(this).find("div");
        let day = (day_element[0].id).replace("shift_","");
        $('.shift-select').hide();
        $('#select-day' + day).show();
        $('#select-day' + day).attr("data-selectday", day + "日");
    });

    $('.determine-day').on('click',function(){
        let day_element = $(this).find("div");
        let day = (day_element[0].id).replace("shift_", "");
        $('.shift-details').hide();
        $('#determine-day' + day).show();
        $('#determine-day' + day).attr("data-determineday", day + "日");
    });




    /*Dropdown Menu*/
    $('.dropdown').on('click', function () {
        $(this).attr('tabindex', 1).focus();
        $(this).toggleClass('active');
        $(this).find('.dropdown-menu').slideToggle(300);
    });
    $('.dropdown').on('focusout', function () {
        $(this).removeClass('active');
        $(this).find('.dropdown-menu').slideUp(300);
    });
    $('.dropdown .dropdown-menu li').on('click', function() {
        $(this).parents('.dropdown').find('span').text($(this).text());
        $(this).parents('.dropdown').find('input').attr('value', $(this).attr('id'));
    });
    /*End Dropdown Menu*/


    /*$('.dropdown-menu li').on('click', function() {
    var input = '<strong>' + $(this).parents('.dropdown').find('input').val() + '</strong>',
    msg = '<span class="msg">Hidden input value: ';
    $('.msg').html(msg + input + '</span>');
    });*/

    $('.shift-write').on('click', function(){
        let parents = $(this).parents();
        let day = parents[1].id.replace("select-day", "");
        let time = $('#select-time' + day).html();
        let obj_login_user = $('.login_now');
        let login_user_name = obj_login_user[0].id;
        //let login_user_name = $('.login_now').attr('id');
        if($('#' + login_user_name + '_' + day)[0]) {
            $('#' + login_user_name + '_' + day  + ' .element-time').html(time);
        }
        else {
            $('#select-table-day' + day).append(
                '<tr id="' + login_user_name + '_' + day +'">' +
                    '<td class="element-name">' + login_user_name + '</td>' +
                    '<td class="element-time">' + time + '</td>' +
                '</tr>'
            );
        }

        
        $('#shift_' + day).html(time);
    });

    $('#submit-btn').on('click', function(){
        $('#submitModal').fadeIn(200);
        $('html').addClass('modalset');
    });
    $('.submit-modal .submit-modal-bg,.submit-modal .submit-modal-close').on('click', function(){
        $('#submitModal').fadeOut(200);
        $('html').removeClass('modalset');
    });
});