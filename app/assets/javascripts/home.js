$(function(){
    //提出期限カウントダウン
    function limitCounter() {
        let timer = setInterval(function() {
            let now = new Date();
            let login_user_id = gon.login_user_id;
            let this_year = gon.month_info.this_year;
            let this_month = gon.month_info.this_month;
            let deadline = new Date(this_year + "/" + this_month + "/19 23:59:59");
            let days_between = Math.ceil((deadline - now)/(1000 * 60 * 60 * 24));
            let ms = (deadline - now);
            if (ms >= 0) {
                let h = Math.floor(ms / 3600000);
                let h_ = h % 24;
                let m = Math.floor((ms - h * 3600000) / 60000);
                let s = Math.round((ms - h * 3600000 - m * 60000) / 1000);

                $('#countOutput').text(days_between+"日"+h_+"時間"+m+"分"+s+"秒");

                if ((h == 0) && (m == 0) && (s == 0)) {
                    clearInterval(timer);
                    $('#countOutput').text("提出期限が過ぎました");
                    if(login_user_id != 1){
                        $('.submit, .select_day_time, .ok_div,#all_div, #limit_text').hide();
                    }
                }
            }else{
                if(login_user_id != 1){
                    $('#countOutput').text("提出期限が過ぎました");
                    $('#submit,.select_day_time,.ok_div,#all_div,#limit_text').hide();
                }
            }
        }, 1000);
    }
    limitCounter();



    $('.selected-day').on('click',function(){
        let day_element = $(this).find("div");
        let day = (day_element[0].id).replace("shift_","");
        $.ajax({
            dataType: 'json',
            type: 'POST',
            url: '/select_day',
            data: {
                day: "day" + day,
            },
        }).done(function(data) {
            $('.shift-select .select_one_day .element-select').remove();

            for(let user_id in data.users_shift) {
                if(data.login_user_id == user_id) {
                    if($('#shift_' + day).text() == "" ) {
                        $('.shift-select .select_one_day').append(
                            '<tr id="' + data.users_shift[user_id].name + '_' + day + '" class="element-select">' +
                                '<td id="login-element-name" class="element-name">' + data.users_shift[user_id].name + '</td>' +
                                '<td id="login-element-time" class="element-time">' + data.users_shift[user_id].shift + '</td>' +
                            '</tr>'
                        );
                    }
                    else {
                        $('.shift-select .select_one_day').append(
                            '<tr id="' + data.users_shift[user_id].name + '_' + day + '" class="element-select">' +
                                '<td id="login-element-name" class="element-name">' + data.users_shift[user_id].name + '</td>' +
                                '<td id="login-element-time" class="element-time">' + $('#shift_' + day).text() + '</td>' +
                            '</tr>'
                        );
                    }
                }
                else {
                    if(data.users_shift[user_id].shift != "休") {
                        $('.shift-select .select_one_day').append(
                            '<tr id="' + data.users_shift[user_id].name + '_' + day + '" class="element-select">' +
                                '<td class="element-name">' + data.users_shift[user_id].name + '</td>' +
                                '<td class="element-time">' + data.users_shift[user_id].shift + '</td>' +
                            '</tr>'
                        );
                    }
                }
                $('span .shift-time').attr('id', 'select-time' + day);
                if(data.confirmed) {
                    $('.select-container').hide();
                }
            }
            $('#selectModal').fadeIn(200);
            $('html').addClass('modalset');
            $('.shift-select').show();
            $('.shift-select').attr("data-selectday", day + "日");
            $('.shift-select').attr("id", "select-day" + day);
        }).fail(function(data){
            alert('通信失敗');
        })
        //$('.shift-select').hide();
        //$('#select-day' + day).show();
        //$('#select-day' + day).attr("data-selectday", day + "日");
    });
    $('.select-modal .select-modal-bg,.select-modal .select-modal-close').on('click', function(){
        $('.shift-time').html("希望時間を選択");
        $('#selectModal').fadeOut(200);
        $('html').removeClass('modalset');
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



    $('.shift-write').on('click', function(){
        let parents = $(this).parents();
        let day = parents[1].id.replace("select-day", "");
        let time = $('.shift-time').html();
        let obj_login_user = $('.login_now');
        let login_user_name = obj_login_user[0].id;
        //let login_user_name = $('.login_now').attr('id');
        //if($('#day' + day)[0]) {
        $('#login-element-time').html(time);
        /*}
        else {
            $('#select-table-day' + day).append(
                '<tr id="' + login_user_name + '_' + day +'">' +
                    '<td class="element-name">' + login_user_name + '</td>' +
                    '<td class="element-time">' + time + '</td>' +
                '</tr>'
            );
        }*/

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

    $('#submit-ok').on('click', function(){
        let submit_shift = {};
        let date = new Date();
        console.log(gon.next_end_month_day);
        //let next_month_end_day = new Date(date.getFullYear(), date.getMonth() + 2, 0).getDate();
        for(let i=1; i<=gon.next_end_month_day; i++) {
            submit_shift["day"+i] = $('#shift_' + i).text();
        }
        $.ajax({
            dataType: 'json',
            type: 'POST',
            url: '/submit_shift',
            data: {
                submit_shift: submit_shift,
            },
        }).done(function(data){
            console.log('通信成功！');
            console.log(data);

        }).fail(function(){
            alert('通信失敗');
        });
    });



    $('.determine-day').on('click',function(){
        let day_element = $(this).find("div");
        let day = (day_element[0].id).replace("shift_", "");
        $.ajax({
            dataType: 'json',
            type: 'POST',
            url: '/determine_day',
            data: {
                day: "day" + day,
            },
        }).done(function(data){
            $('.shift-details .details_one_day .element-detail').remove();
            for(let user_id in data.users_shift){
                $('.shift-details .details_one_day').append(
                    '<tr>' +
                        '<td class="element-detail">' + data.users_shift[user_id].name + '</td>' +
                        '<td class="element-detail">' + data.users_shift[user_id].shift + '</td>' +
                    '</tr>'
                );
            }
            $('#determineModal').fadeIn(200);
            $('html').addClass('modalset');
            $('.shift-details').show();
            //$('#determine-day' + day).show();
            $('.shift-details').attr("data-determineday", day + "日");
        }).fail(function(data){
            alert('通信失敗', data);
        });
    });

    $('.determine-modal .determine-modal-bg, .determine-modal .determine-modal-close').on('click', function(){
        $('.shift-time').html("希望時間を選択");
        $('#determineModal').fadeOut(200);
        $('html').removeClass('modalset');
    });
});