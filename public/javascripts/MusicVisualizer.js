function MusicVisualizer(obj){
   
    this.source = null ;
    this.count = 0;
    this.analyser = MusicVisualizer.ac.createAnalyser();
    this.size = obj.size * 2;
    this.gainNode = MusicVisualizer.ac[MusicVisualizer.ac.createGain?'createGain':'createGainNode']();
    this.gainNode.connect(MusicVisualizer.ac.destination);
    this.analyser.connect(this.gainNode);

    this.xhr = new XMLHttpRequest();
    this.visualizer = obj.visualizer;
    this.visualize();
}
MusicVisualizer.ac = new (window.AudioContext||window.webkitAudioContext)();

//加载
MusicVisualizer.prototype.load = function(url,fun){
    this.xhr.abort();
    this.xhr.open('Get',url);
    this.xhr.responseType = 'arraybuffer';
    var self = this;
    this.xhr.onload = function(){
        fun(self.xhr.response);
    }
    this.xhr.send();
}
//解码
MusicVisualizer.prototype.decode = function(arraybuffer,fun){
    MusicVisualizer.ac.decodeAudioData(arraybuffer,function(buffer){
        fun(buffer)
    },function(err){
        console.log(err)
    })
}
//播放
MusicVisualizer.prototype.play = function(url){
    var n = ++this.count;
    var self = this;
    this.source && this.stop();
    this.load(url,function(arraybuffer){
        if(n != self.count) return ;
        self.decode(arraybuffer,function(buffer){
            if(n != self.count) return ;
            var bs = MusicVisualizer.ac.createBufferSource();
            bs.connect(self.analyser)
            bs.buffer  = buffer;
            bs[bs.start? 'start':'noteOn'](0);
            self.source = bs;
        })
    })
}

MusicVisualizer.prototype.stop = function(){
    this.source[this.source.stop?'stop':'noteOff'](0)
}

MusicVisualizer.prototype.changeVolume = function(percent){
    this.gainNode.gain.value = percent  * percent;
}

MusicVisualizer.prototype.visualize = function(){
    var arr = new Uint8Array(this.analyser.frequencyBinCount);//定义一个数组，
    
     //requestAnimationFrame 通过在浏览器重绘的时候，通知函数执行，
     requestAnimationFrame = window.requestAnimationFrame  ||
                             window.wekitRequestAnimationFrame ||
                             window.mozRequestAnimationFrame;
    var self= this;
     function v(){
        self.analyser.getByteFrequencyData(arr);//将分析的数据赋值到数组中，
         requestAnimationFrame(v)
         self.visualizer(arr);
     }
     requestAnimationFrame(v)
}