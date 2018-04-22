// some global operation like initialize navbar
$().ready(function(){
    //检查用户是否登陆
    if(!getCookie('account')){
        console.log('匿名');
        SetCookie('account',0);
        SetCookie('cart_id',1);
    }else if(getCookie('account') != 0){
        //已登陆
        changeToLoginNavbar(getCookie('account'));
    }
});


//设置cookie
function SetCookie(name, value) {
    var argv = SetCookie.arguments;
    //本例中length = 3
    var argc = SetCookie.arguments.length;
    //var expires = (argc > 2) ? argv[2] : null;
    //var path = (argc > 3) ? argv[3] : null;
    var domain = (argc > 4) ? argv[4] : null;
    var secure = (argc > 5) ? argv[5] : false;
    document.cookie = name + "=" + escape(value) + ";expires="  + ("; path=/" ) + ((domain == null) ? "" : ("; domain=" + domain)) + ((secure == true) ? "; secure" : "");
}
//获取cookie
function getCookie(cookie_name)
{
    var allcookies = document.cookie;
    var cookie_pos = allcookies.indexOf(cookie_name);   //索引的长度
  
    // 如果找到了索引，就代表cookie存在，
    // 反之，就说明不存在。
    if (cookie_pos != -1)
    {
        // 把cookie_pos放在值的开始，只要给值加1即可。
        cookie_pos += cookie_name.length + 1;      //这里容易出问题，所以请大家参考的时候自己好好研究一下
        var cookie_end = allcookies.indexOf(";", cookie_pos);
  
        if (cookie_end == -1)
        {
            cookie_end = allcookies.length;
        }
  
        var value = unescape(allcookies.substring(cookie_pos, cookie_end));         //这里就可以得到你想要的cookie的值了。。。
    }
    return value;
}

//检查是否登陆
function isLocallyLogin(){
    console.log(getCookie('account'));
    if(getCookie('account') != 0)
        return true;

    return false;
}

//若登陆，改变导航栏样式
function changeToLoginNavbar(userid) {
    $('#unlog').addClass('navbar-hide');
    // set profile
    $('#userid').text('已登陆用户id：'+userid);
    $('#login').removeClass('navbar-hide');
}


//注销操作
function logOut() {
    if(isLocallyLogin()) {
        //清除cookie
        SetCookie('account',0);
        SetCookie('cart_id',1);
        location.reload();
    }
}
