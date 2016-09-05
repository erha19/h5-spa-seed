var API=( ($) =>{
    var API={};
    return API;
})($);

var DATA=(function(){
    //Manage init data
    var data={};
    var _set=function(key,value){
        if(!value){
            data[key]='';
        }
        else{
            data[key]=value;
        }
    };
    var _get=function(key){
        if(key){
            return data[key];
        }
        return data;
    };
    return {
        set: _set,
        get: _get
    };
})();
