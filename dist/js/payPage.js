function payment(){
    alert("购买成功！");
    //注意传递新的订单信息给订单界面
    window.location.href = 'orderPage.html';
}


var app = angular.module("getBookInfo",[]);

app.controller('getBookInfoCtrl', function($scope, $http) {
    
    $http({
        method: 'GET',
        url: '/order/pay',
    }).then(function successCallback(response) {
        if(response.data.error){
            alert('错误！');
        }else{
            console.log(response.data);
            $scope.order = response.data;
            $scope.price = response.data.price;
        }
        }, function errorCallback(response) {
            alert('错误！');
    });
});