(function(Router,Api,RootScope,Tools){
    FastClick.attach(document.body);
    //更新用户信息
    Router.setDefault('/home')

    Router.init();
    //fix android虚拟键盘覆盖input rextarea

    if (/Android/gi.test(navigator.userAgent)) {
        window.addEventListener('resize', function () {
            if (document.activeElement.tagName == 'INPUT' || document.activeElement.tagName == 'TEXTAREA') {
                window.setTimeout(function () {
                    document.activeElement.scrollIntoViewIfNeeded();
                }, 0);
            }
        })
    }
})(ROUTER,API,DATA);
