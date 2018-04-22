var app = angular.module("getBookInfo",[]);


app.controller('getBookInfoCtrl', function($scope, $http) {
    var user_id = getCookie('account');

    if(user_id != 0){
        $http({
            method: 'POST',
            url: '/order/get',
            data : {id : user_id}
        }).then(function successCallback(response) {
            if(response.data.error){
                alert('没有相关订单！');
            }else{
                console.log(response.data);
                $scope.orders = response.data;
                document.execCommand('Refresh'); 
            }
            }, function errorCallback(response) {
                alert('错误！');
        });
    }else{
        alert('请先登录！');
    }
});


function deleteOrder(event){
    var $target = $(event);
    var order_id = $target.parents('.all-book').find('.order-id').text();

    if(getCookie('user_id') == 0){
        alert('请先登录！');
    }else{
        $.ajax({
            method : 'POST',
            url : '/order/delete',
            data : {order_id : order_id},
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
}