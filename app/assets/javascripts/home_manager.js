$(function(){
    let date = new Date();
    let today = parseInt(date.getDate(), 10);
    if(today < 20) {
        console.log("aaa");
        $('#not_edit h2').text('20日以降に編集可能です');
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
});