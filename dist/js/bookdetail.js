var id;//书籍id

function minus(){
    var num = $('#num').val();
    if(num > 1){
        num--;
        document.getElementById('num').value = num; 
    }
}

function plus(){
    var num = $('#num').val();
    if(num < 10){//判断是否超出库存，这里的数字现在是瞎写的
        num++;
        document.getElementById('num').value = num; 
    }
}

//加入购物车
function addBook(){
    var amount = parseInt($("#num").val());
    console.log(amount);
    $.ajax({
        method : 'POST',
        url : '/cart/add',
        data : {id : id[1],
                amount : amount,
                cart_id : getCookie('cart_id')},
        success : function(data){
            if(data.error){
                alert('添加购物车失败！');
            }else{
                alert('添加购物车成功！');
            }
        }
    });
}


var app = angular.module('getBookInfo', []);

app.controller('getBookInfoCtrl', function($scope, $http, $location) {
    id = $location.url().split('=');
        $http({
        method: 'POST',
        url: '/book/details',
        data : {id : id[1]}
    }).then(function successCallback(response) {
            $scope.book = response.data;
        }, function errorCallback(response) {
            alert('错误！');
    });
});


