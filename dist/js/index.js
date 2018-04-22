var search_type = 1;//默认搜索方式为按照书籍名称搜索

function searchType(searchtype){
    var name = document.getElementById('name-search');
    var author = document.getElementById('author-search');
    var ISBN = document.getElementById('ISBN-search');
    if(searchtype == 1){
        author.style.color = "#CACEDE";
        ISBN.style.color = "#CACEDE";
        name.style.color = "#8CA3FE";
        name.style.textDecoration = "none"; 
        document.getElementById('search').placeholder = "请输入书籍名称"; 
        search_type = 1;      
    }
    if(searchtype == 2){
        name.style.color = "#CACEDE";
        ISBN.style.color = "#CACEDE";  
        author.style.color = "#8CA3FE";  
        author.style.textDecoration = "none";
        document.getElementById('search').placeholder = "请输入书籍作者"; 
        search_type = 2;     
    }
    if(searchtype == 3){
        author.style.color = "#CACEDE";
        name.style.color = "#CACEDE"; 
        ISBN.style.color = "#8CA3FE";
        ISBN.style.textDecoration = "none";
        document.getElementById('search').placeholder = "请输入书籍ISBN"; 
        search_type = 3;        
    }

}
function searchBook(){
    var searchValue = $('#search').val();
    if(searchValue == ''){
        document.getElementById('search').placeholder = "请输入搜索关键词！";
    }
}



var app = angular.module('index', []);

app.controller('searchCtrl', function($scope) {
    $scope.type = 1;
    $scope.method={  
        change:function(type){  
            $scope.type = type;
            console.log($scope.type);
        }
    };
});


//获取热销书籍controller
app.controller('getBookInfoCtrl', function($scope, $http) {
    $http({
        method: 'GET',
        url: '/index/sellingbooks'
    }).then(function successCallback(response) {
            $scope.books = response.data;
        }, function errorCallback(response) {
            // 请求失败执行代码
            alert('获取畅销书籍失败');
    });
});



