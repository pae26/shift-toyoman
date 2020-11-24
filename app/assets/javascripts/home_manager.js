$(function(){
    $('#logo').css('float', 'left');

    $('#menu-toggle').on('click', function(){
        $('.nav').slideToggle();
    });

    let date = new Date();
    let today = parseInt(date.getDate(), 10);
    let login_user_id = gon.login_user_id;
    if(today < 20 && login_user_id != 9999) {
        $('#not_edit h2').show();
        $('.confirm').hide();
    }
    else {
        $('#not_edit h2').hide();
        $('.confirm').show();
    }
    
    $('.edit-dropdown').on('click', function () {
        $(this).attr('tabindex', 1).focus();
        $(this).toggleClass('active');
        $(this).find('.edit-dropdown-menu').slideToggle(300);
    });
    $('.edit-dropdown').on('focusout', function () {
        $(this).removeClass('active');
        $(this).find('.edit-dropdown-menu').slideUp(300);
    });
    $('.edit-dropdown .edit-dropdown-menu li').on('click', function() {
        $(this).parents('.edit-dropdown').find('span').text($(this).text());
        $(this).parents('.edit-dropdown').find('input').attr('value', $(this).attr('id'));
    });

    $('#confirm-btn').on('click', function(){
        $('#confirmModal').fadeIn(200);
        $('html').addClass('modalset');
    });
    $('.confirm-modal .confirm-modal-bg, .confirm-modal .confirm-modal-close').on('click', function(){
        $('#confirmModal').fadeOut(200);
        $('html').removeClass('modalset');
    });

    $('#confirm-ok').on('click', function(){
        let confirm_shift = {};
        let get_name = $('.employee_name').text().replace(/(\r|\n)/g, '');
        let employee_name = get_name.split(/\s+/g);
        //空文字を除去
        employee_name.pop();
        console.log(employee_name);
        //let next_month_end_day = new Date(date.getFullYear(), date.getMonth() + 2, 0).getDate();
        for(let i=0; i<gon.employee_count; i++) {
            confirm_shift["name"] = employee_name[i];
            confirm_shift["shift"] = {};
            for(let j=1; j<=gon.next_end_month_day; j++) {
                shift_one = $('#' + employee_name[i] + '_' + j +' > .edit-dropdown > .select > .edit-shift-time').text();
                if(shift_one == "" || shift_one == "×") {
                    shift_one = "休"
                }
				confirm_shift["shift"]["day"+j] = shift_one;
            }

            $.ajax({
                dataType: 'json',
                type: 'POST',
                url: '/confirm_shift',
                data: {
                    confirm_shift: confirm_shift,
                },
            }).done(function(data){
                console.log('通信成功！');
                $('#confirmedModal').fadeIn(200);
                $('html').addClass('modalset');
            }).fail(function(){
                alert('通信失敗...');
            });
        }
    });

    $('.confirmed-modal .confirmed-modal-bg, .confirmed-modal .confirmed-modal-close, .close').on('click', function(){
        $('#confirmedModal').fadeOut(200);
        $('html').removeClass('modalset');
    });


    $('#export-table').tableExport({
        formats: ["xlsx"],
        bootstrap: false
    });

    let export_obj = $('caption button').clone();
    $('#export-btn').append(export_obj);
    $('#export-table caption').hide();
});