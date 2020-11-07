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
                        $('.submit, week-all, .blank-all, #limit_text').hide();
                    }
                }
            }else{
                if(login_user_id != 1){
                    $('#countOutput').text("提出期限が過ぎました");
                    $('.submit, week-all, .blank-all, #limit_text').hide();
                }
            }
        }, 1000);
    }
    limitCounter();

    function manageShortage(day, before_time, after_time) {
        if(before_time == "" || before_time == "×") {
            if(!(after_time == "" || after_time == "×")) {
                gon.shortage[day]['in_time'] += 1;
                if(gon.shortage[day]['in_time'] >= gon.shortage[day]['border']) {
                    $('#day' + day).removeClass('shortage');
                }
            }
        }
        else {
            if(after_time == "" || after_time == "×") {
                gon.shortage[day]['in_time'] -= 1;
                if(gon.shortage[day]['in_time'] < gon.shortage[day]['border']) {
                    $('#day' + day).addClass('shortage');
                }
            }
            else {
                gon.shortage[day]['in_time'] += 1;
                if(gon.shortage[day]['in_time'] >= gon.shortage[day]['border']) {
                    $('#day' + day).removeClass('shortage');
                }
            }
        }
    };

    for(let shortage_day in gon.shortage) {
        let border = gon.shortage[shortage_day]['border'];
        let in_time = gon.shortage[shortage_day]['in_time'];
        if(in_time < border) {
            $('#day' + shortage_day).addClass("shortage");
        }
    }

    $('#logo').css('float', 'left');

    $('#menu-toggle').on('click', function(){
        $('.nav').slideToggle();
    });


    $('.selected-day').on('click',function(){
        let day_element = $(this).find("div");
        let day = (day_element[1].id).replace("shift_","");
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
    });
    $('.select-modal .select-modal-bg,.select-modal .select-modal-close, .close').on('click', function(){
        $('.shift-time').html("希望時間を選択");
        $('#selectModal').fadeOut(200);
        $('html').removeClass('modalset');
    });

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
        let after_time = $('.shift-time').html();
        if(after_time == "希望時間を選択") {
            return false;
        }
        /*let obj_login_user = $('.login_now');
        let login_user_name = obj_login_user[0].id;*/

        /* 人手不足判定 */
        let before_time = $('#shift_' + day).text();
        manageShortage(day, before_time, after_time);

        /* 書き換え */
        $('#login-element-time').html(after_time);
        $('#shift_' + day).html(after_time);
        if(after_time == "×") {
            $('#shift_' + day).removeClass('user_shift');
            $('#shift_' + day).addClass('user_rest');
        }
        else {
            $('#shift_' + day).removeClass('user_rest');
            $('#shift_' + day).addClass('user_shift');
        }

        $('.shift-time').html("希望時間を選択");
        $('#selectModal').fadeOut(200);
        $('html').removeClass('modalset');
    });

    $('.week-all-write').on('click', function(){
        let week = $('.shift-week').html();
        let after_time = $('.shift-week-time').html();
        if(after_time == "希望時間を選択" || week == "曜日を選択") {
            return false;
        }
        let weeks_to_english = {
            '日曜日':'son',
            '月曜日':'mon',
            '火曜日':'tue',
            '水曜日':'wed',
            '木曜日':'thu',
            '金曜日':'fri',
            '土曜日':'sat',
        };

        let shortage_weeks = $('.' + weeks_to_english[week]).get();
        for(let i = 0; i < shortage_weeks.length; i++) {
            let day = (shortage_weeks[i].id).replace('shift_', "")
            let before_time = shortage_weeks[i].innerText;
            manageShortage(day, before_time, after_time);
        }


        $('.' + weeks_to_english[week]).html(after_time);
        if(after_time == "×") {
            $(weeks_to_english[week]).removeClass('user_shift');
            $(weeks_to_english[week]).addClass('user_rest');
        }
        else {
            $(weeks_to_english[week]).removeClass('user_rest');
            $(weeks_to_english[week]).addClass('user_shift');
        }
        $('.shift-week').html("曜日を選択");
        $('.shift-week-time').html("希望時間を選択");
        $('#weekAllModal').fadeOut(200);
        $('html').removeClass('modalset');

        

    });

    $('.blank-all-write').on('click', function(){
        let after_time = $('.shift-blank').html();
        if(after_time == "希望時間を選択") {
            return false;
        }
        for(let i=1;i<=gon.next_end_month_day;i++) {
            
            if($('#shift_' + i).text() == "" ) {
                let day = i;
                let before_time = $('#shift_' + i).text();
                $('#shift_' + i).html(after_time);
                if(after_time != "×") {
                    $('#shift_' + i).removeClass('user_rest');
                    $('#shift_' + i).addClass('user_shift');
                }
                manageShortage(day, before_time, after_time);
            }
        }
        $('.shift-blank').html('希望時間を選択');
        $('#blankAllModal').fadeOut(200);
        $('html').removeClass('modalset');
    });

    $('#submit-btn').on('click', function(){
        $('#submitModal').fadeIn(200);
        $('html').addClass('modalset');
    });
    $('.submit-modal .submit-modal-bg, .submit-modal .submit-modal-close, .close').on('click', function(){
        $('#submitModal').fadeOut(200);
        $('html').removeClass('modalset');
    });

    $('.submited-modal .submited-modal-bg, .submited-modal .submited-modal-close, .close').on('click', function(){
        $('#submitedModal').fadeOut(200);
        $('html').removeClass('modalset');
    });

    $('#week-all-btn').on('click', function(){
        $('#weekAllModal').fadeIn(200);
        $('html').addClass('modalset');
    });
    $('.week-all-modal .week-all-modal-bg,.week-all-modal .week-all-modal-close, .close').on('click', function(){
        $('#weekAllModal').fadeOut(200);
        $('html').removeClass('modalset');
    });

    $('#blank-all-btn').on('click', function(){
        $('#blankAllModal').fadeIn(200);
        $('html').addClass('modalset');
    });
    $('.blank-all-modal .blank-all-modal-bg,.blank-all-modal .blank-all-modal-close, .close').on('click', function(){
        $('#blankAllModal').fadeOut(200);
        $('html').removeClass('modalset');
    });

    $('#submit-ok').on('click', function(){
        let submit_shift = {};
        let date = new Date();
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
            $('#submitedModal').fadeIn(200);
            $('html').addClass('modalset');
        }).fail(function(){
            alert('通信失敗');
        });
    });



    $('.determine-day').on('click',function(){
        let day_element = $(this).find("div");
        let day = (day_element[1].id).replace("shift_", "");
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
                if(data.users_shift[user_id].shift == "" || data.users_shift[user_id].shift == "休" || data.users_shift[user_id].shift == "×") {
                    continue;
                }
                $('.shift-details .details_one_day').append(
                    '<tr class="element-detail">' +
                        '<td class="element-name">' + data.users_shift[user_id].name + '</td>' +
                        '<td class="element-time">' + data.users_shift[user_id].shift + '</td>' +
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

    $('.determine-modal .determine-modal-bg, .determine-modal .determine-modal-close, .close').on('click', function(){
        $('.shift-time').html("希望時間を選択");
        $('#determineModal').fadeOut(200);
        $('html').removeClass('modalset');
    });
});