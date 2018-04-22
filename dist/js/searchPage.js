var search = 1;//默认搜索方式为按照书籍名称搜索

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
        search = 1;      
    }
    if(searchtype == 2){
        name.style.color = "#CACEDE";
        ISBN.style.color = "#CACEDE";  
        author.style.color = "#8CA3FE";  
        author.style.textDecoration = "none";
        document.getElementById('search').placeholder = "请输入书籍作者"; 
        search = 2;     
    }
    if(searchtype == 3){
        author.style.color = "#CACEDE";
        name.style.color = "#CACEDE"; 
        ISBN.style.color = "#8CA3FE";
        ISBN.style.textDecoration = "none";
        document.getElementById('search').placeholder = "请输入书籍ISBN"; 
        search = 3;        
    }

}
function searchBook(){
    var searchValue = $('#search').val();
    if(searchValue == ''){
        document.getElementById('search').placeholder = "请输入搜索关键词！";
    }
    else{
        document.getElementById('no-search').style.visibility = 'hidden';
        document.getElementById('search-result').style.visibility = 'visible';
    }
}

//显示搜索结果（隐藏'没有搜索结果'div）
function display(){
    $('#no-search').hide();
    $('#search-result').show();
    //document.getElementById('no-search').style.visibility = 'hidden';
    //document.getElementById('search-result').style.visibility = 'visible';
}

var app = angular.module("getBookInfo",[]);

app.controller('searchCtrl', function($scope) {
    $scope.type = 1;
    $scope.method={  
        change:function(type){  
            $scope.type = type;
        }
    };
});

app.controller('getBookInfoCtrl', function($scope, $http, $location) {
    var params = $location.url().split('&');
    
    if(params[0]){
        let type = params[0].split('=')[1];//搜索类型
        let value = params[1].split('=')[1];//搜索值

        $http({
            method: 'POST',
            url: '/book/search',
            data : {type:type,
                    value:value}
        }).then(function successCallback(response) {
            if(response.data.error){
                alert('没有搜索到相关书籍！');
            }else{
                $scope.books = response.data;
                display();
                document.execCommand('Refresh'); 
            }
            }, function errorCallback(response) {
                alert('错误！');
        });
    }
});
