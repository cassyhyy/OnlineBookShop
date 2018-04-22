function deleteBook(event){
    var cart_id = getCookie('cart_id');
    var $target = $(event);
    var book_id = parseInt($target.parents('.row').find('.book-name').attr('id'));

    $.ajax({
        method : 'POST',
        url : '/cart/delete',
        data : {
            cart_id : cart_id,
            book_id : book_id
        },
        success : function(data){
            if(data.error){
                alert('删除失败！');
            }else{
                alert('删除成功！');
                window.location.reload();
            }
        }
    });
}


function minus(){
    var num = $('#num').val();
    document.getElementById('alert').style.visibility = 'hidden';
    if(num > 1){
        num--;
        document.getElementById('num').value = num; 
    }
}

function plus(){
    var num = $('#num').val();
    if(num < 99){//判断是否超出库存，这里的数字现在是瞎写的
        num++;
        document.getElementById('num').value = num; 
    }
    else{
        document.getElementById('alert').style.visibility = 'visible';
    }
}

var id=new Array(), nums=new Array(), prices=new Array();
var sum=0, amount=0;
function chooseBook(){
    var length = $("input[type = checkbox]:checked").length;
    var name,num,price;
    id=new Array(), nums=new Array(), prices=new Array();
    sum=0, amount=0;
    $("input[type = checkbox]:checked").each(function(){
            //name = $(this).parents('.all-book').find('#name').text();
            num = $(this).parents('.all-book').find('#num').val();
            price = $(this).parents('.all-book').find('#price').text();
            
            id.push(parseInt($(this).parents('.all-book').find('.book-name').attr('id')));
            nums.push(num);
            prices.push(price);

            amount += parseInt(num);
            sum += parseInt(num) * parseFloat(price);
    });
    
    $('#all-price').text('￥'+String(sum));
}


var id = new Array();
var app = angular.module('getBookInfo', []);

app.controller('getBookInfoCtrl', function($scope, $http) {
    $http({
        method: 'POST',
        url: '/cart/get',
        data : {cart_id : getCookie('cart_id')}
    }).then(function successCallback(response) {
            $scope.books = response.data;
        }, function errorCallback(response) {
            // 请求失败执行代码
    });

    

    $scope.payButton = function(){
        if(getCookie('account')==0){
            alert('请先登录再购买！');
        }else{
            $http({
                method: "POST",
                url: "/order/generate",
                data:{user_id : getCookie('account'),
                      id : id,//书籍id
                      price : sum,
                      amount : nums,//每本书籍数量
                      allamount : amount//总数量
                    }
             }).then(
                 function success(response){
                    window.open('payPage.html','_parent');
                 },
                 function error(response){
                    alert('error');
                 }
              );
           }
        }
});
