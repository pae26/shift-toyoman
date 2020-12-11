$(function(){
    $('#logo').css('float', 'left');

    //$('.scroll-confirmed').hide();

    $('#menu-toggle').on('click', function(){
        $('.nav').slideToggle();
    });

    let date = new Date();
    let today = parseInt(date.getDate(), 10);
    let login_user_id = gon.login_user_id;
    if(today < 20 && login_user_id != 9999) {
        $('#not_edit h2').show();
        $('.confirm').hide();
        $('.save').hide();
    }
    else {
        $('#not_edit h2').hide();
        $('.confirm').show();
        $('.save').show();
    }

    if(gon.confirmed && login_user_id == 1) {
        //$('.scroll').hide();
        //$('.confirm').hide();
        $('.scroll-confirmed').show();
        $('#export-headline-next').show();

        $('#export-table-next').tableExport({
            formats: ["xlsx"],
            bootstrap: false
        });

        $('#export-table-next caption').hide();
        $('.save').hide();
    }
    else {
        $('.scroll-confirmed').hide();
        $('#export-table-next').hide();
        $('#export-btn-next').hide();
        $('#export-headline-next').hide();
    }
    $('#export-btn-next').on('click', function(){
        $('#export-table-next caption button').trigger('click');
    });
    
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


    $('#save-btn').on('click', function(){
        $('#saveModal').fadeIn(200);
        $('html').addClass('modalset');
    });
    $('.save-modal .save-modal-bg, .save-modal .save-modal-close').on('click', function(){
        $('#saveModal').fadeOut(200);
        $('html').removeClass('modalset');
    });

    $('#save-ok').on('click', function(){
        let save_shift = {};
        let get_name = $('.employee_name').text().replace(/(\r|\n)/g, '');
        let employee_name = get_name.split(/\s+/g);
        //空文字を除去
        employee_name.pop();
        console.log(employee_name);
        //let next_month_end_day = new Date(date.getFullYear(), date.getMonth() + 2, 0).getDate();
        for(let i=0; i<gon.employee_count; i++) {
            save_shift["name"] = employee_name[i];
            save_shift["shift"] = {};
            for(let j=1; j<=gon.next_end_month_day; j++) {
                shift_one = $('#' + employee_name[i] + '_' + j +' > .edit-dropdown > .select > .edit-shift-time').text();
                /*if(shift_one == "" || shift_one == "×") {
                    shift_one = "休"
                }*/
				save_shift["shift"]["day"+j] = shift_one;
            }

            $.ajax({
                dataType: 'json',
                type: 'POST',
                url: '/save_shift',
                data: {
                    save_shift: save_shift,
                },
            }).done(function(data){
                console.log('通信成功！');
                $('#savedModal').fadeIn(200);
                $('html').addClass('modalset');
            }).fail(function(){
                alert('通信失敗...');
            });
        }
    });

    $('.saved-modal .saved-modal-bg, .saved-modal .saved-modal-close, .close').on('click', function(){
        $('#savedModal').fadeOut(200);
        $('html').removeClass('modalset');
    });

    $('#export-table-this').tableExport({
        formats: ["xlsx"],
        bootstrap: false
    });

    $('#export-table-this caption').hide();

    $('#export-btn-this').on('click', function(){
        $('#export-table-this caption button').trigger('click');
    });
});