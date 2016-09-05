(function (router, rootscope,tpls,api, undefined) {
    var home_temp = doT.template(tpls.home.cache, undefined, '');
    var home = {
        url: '/home',
        className: 'home',
        render: function () {
            return home_temp(rootscope.get());
        },
        bind: function () {
            var _this = $(this);
            //设置页面高度，形成内滚动条方便设置平滑滚动属性
            _this.height(window.innerHeight);

        }
    };
    router.push(home);

})(ROUTER, DATA,TPLS,API);
