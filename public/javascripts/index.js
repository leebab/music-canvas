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
var ac = new (window.AudioContext||window.webkitAudioContext)();

var gainNode = ac[ac.createGain?'createGain':'createGainNode']();
gainNode.connect(ac.destination)//将gainNode连接到destination上

var analyser = ac.createAnalyser();//分析音频
analyser.fftSize=512;
analyser.connect(gainNode)

var source = null;
var count = 0;
function load(url){
    var n = ++count;
    source && source[source.stop?'stop':'noteOff']();
    xhr.abort();//当点击歌曲时，不管s
    xhr.open('GET',url)
    xhr.responseType='arraybuffer'//arraybuffer理解为服务器返回的音频数据以二进制数据形式
    xhr.onload = function(){//请求成功后调用的事件处理程序
        if(n != count)return ; //不相等说明切换了歌曲,这个重点是为了标记切换歌曲，然后return掉
        ac.decodeAudioData(xhr.response,function(buffer){//调用decodeAudioData进行解码
            //解码成功后，播放
            if(n!=count)return ;
            var bufferSource = ac.createBufferSource();
            bufferSource.buffer= buffer;
            bufferSource.connect(analyser)//bufferSource连接analyser,analyser连接gainNode,gainNode连接des...上
            bufferSource[bufferSource.start?'start':'noteOn'](0);
            source = bufferSource;
            visualizer();
        },function(err){
            console.log(err)
       })
    }
    xhr.send()
}

//analyser 得到的数据
function visualizer(){
    var arr = new Uint8Array(analyser.frequencyBinCount);//定义一个数组，
    analyser.getByteFrequencyData(arr);//将分析的数据赋值到数组中，
    console.log(arr)
}


function changeVolume(precent){
    gainNode.gain.value = precent * precent;
}

$('#volume')[0].onchange=function(){
    changeVolume(this.value/this.max)
}
$('#volume')[0].onchange()    