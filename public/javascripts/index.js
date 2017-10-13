function $(s){
    return document.querySelectorAll(s);
}
var list = $('#list li');
for(var i= 0 ; i < list.length ; i++){
    list[i].onclick=function(){
        for(var j=0;j<list.length;j++){
            list[j].className=''
        }
        this.className='selected'
        load('/media/'+this.title);
    }
}

var xhr = new XMLHttpRequest();//创建一个ajax对象
function load(url){
    xhr.open('GET',url)//打开请求
    xhr.responseType='arraybuffer'//数据类型，arraybuffer理解为服务器返回的音频数据以二进制数据形式
    xhr.onload = function(){//请求成功后调用的事件处理程序
        console.log(xhr.response)
    }
    xhr.send()//发送请求
}