/* 低版本 IE polyfill */ 
if(!window.location.origin) {
    window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
}

/* 扩展一个getUrlParam的方法 */
$.getUrlParam = function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r !== null) return unescape(r[2]); return null;
};

$(function() {
    var $kw = $('#kw'),
        $searchSubmit = $('#search'),
        $urlOutput = $('#url-output'),
        $tips = $('#tips'),
        $stop = $('#stop'),
        $arrow = $('#arrow');
    
    var stepTimeout, typeInterval;

    /* 获取并解析查询参数。参数加 Base64 编码是防止别人直接从链接中猜出了结果，而拒绝点击 */ 
    var query = $.getUrlParam('q');
    if(!!query) {
        try {
            query = Base64.decode(query);
        } catch(e) {
            console.log(e);
        }
    }

    /* 有参数，启动教程 */
    if(!!query) {
        $tips.html('Позволь, я научу тебя пользоваться поиском');
        $stop.fadeIn();

        stepTimeout = setTimeout(function() {
            $tips.html('Шаг 1. Выбери поле ввода');

            $arrow.removeClass('active').show().animate({
                left: $kw.offset().left + 20 + 'px',
                top: ($kw.offset().top + $kw.outerHeight() / 2) + 'px'
            }, 1500, function () {
                $tips.html('Шаг 2. Введи запрос');
                $arrow.addClass('active');

                stepTimeout = setTimeout(function() {
                    $arrow.fadeOut();

                    var i = 0;
                    typeInterval = setInterval(function () {
                        $kw.val(query.substr(0, i));
                        if (++i > query.length) {
                            clearInterval(typeInterval);
                            $tips.html('Шаг 3. Нажмите кнопку «Поиск в Google».');

                            $arrow.removeClass('active').fadeIn().animate({
                                left: $searchSubmit.offset().left + $searchSubmit.width()  / 2 + 'px',
                                top:  $searchSubmit.offset().top  + $searchSubmit.height() / 2 + 'px'
                            }, 2000, function () {
                                $tips.html('<strong>Ничего сложного, правда?</strong>');
                                $arrow.addClass('active');

                                stepTimeout = setTimeout(function () {
                                    if ($(".search-text").attr("data-site") == "google") {
                                        window.location = 'https://www.google.com/search?q=' + encodeURIComponent(query);
                                    } else {
                                        window.location = 'https://www.loli.cab/search?q=' + encodeURIComponent(query);
                                    }
                                }, 1500);
                            });
                        }
                    }, 300);
                }, 700);
            });
        }, 1500);
    }

    /* 自己人，停下 */ 
    $stop.click(function() {
        clearTimeout(stepTimeout);
        clearInterval(typeInterval);
        $stop.hide();
        $arrow.stop().hide();
        $kw.val(query);
        query = false;
        $tips.html('Введите вопрос и выполните поиск в Google');
    });

    /* 提交 */
    $('#search').on('click', function() {
        if(!!query) return false;

        var question = $.trim($kw.val());
        if(!question) {
            $tips.html('<span style="color: red"></span>');
            $kw.val('');
        } else {
            $tips.html('↓↓↓ Скопируйте ссылку ниже, чтобы научить людей пользоваться Google.');
            $('#output').fadeIn();
            $urlOutput.val(window.location.origin + window.location.pathname + '?q=' + Base64.encode(question)).focus().select();
        }
        return false;
    });

    /* 复制结果 */ 
    var clipboard = new ClipboardJS('[data-clipboard-target]');
    clipboard.on('success', function(e) {
        $tips.html('<span style="color: #4caf50">Успешно скопировано!</span>');
    });
    clipboard.on('error', function(e) {
        $tips.html('<span style="color: red">Не удалось скопировать, скопируйте вручную</span>');
    });

    /* 预览 */ 
    $('#preview').click(function() {
        var link = $urlOutput.val();
        if (!!link) {
            window.open(link);
        }
    });

    /* 手气不错 */ 
    $('#search2').on('click', function(){
        if ($(".search-text").attr("data-site") == "google") {
            window.location = 'https://www.google.com/search?q=' + encodeURIComponent($('#kw').val());
        } else {
            window.location = 'https://www.google.com/search?q=' + encodeURIComponent($('#kw').val());
        }
    });
});

/* 关于 */
function showAbout(){
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    var popupHeight = $("#msgbox").height();       
    var popupWidth = $("#msgbox").width(); 
    $("#mask").width(windowWidth).height(windowHeight).click(function(){hideAbout();}).fadeIn(200); 
    $("#msgbox").css({"position": "absolute","left":windowWidth/2-popupWidth/2,"top":windowHeight/2-popupHeight/2}).fadeIn(200); 
}
function hideAbout(){
    $("#mask").fadeOut(200);
    $("#msgbox").fadeOut(200); 
}

/* Google 测试 */
function gtest(){
    var img = new Image();
    var timeout = setTimeout(function(){
        img.onerror = img.onload = null;
        $(".search-text").attr("data-site","google2");
    },3000);
    img.onerror = function(){
        clearTimeout(timeout);
        $(".search-text").attr("data-site","google2");
    };
    img.onload = function () {
        clearTimeout(timeout);
        $(".search-text").attr("data-site","google");
    };
    img.src = "https://www.google.com/favicon.ico?"+ +new Date();
}
window.onload = function(){gtest();window.setInterval("gtest()",10000);}
