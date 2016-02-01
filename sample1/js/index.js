var iconImg = '';
var mapData = [];

//中央位置を求める
var vAveLat=0;
var vAveLng=0;

var vPointCountTotal = 0;
var vPointCount = 0;

var currentInfoWindow = null;

var dataMaxLength = 0;  //データ件数

/*===================================
 メイン処理
===================================*/



/*===================================
 関数定義
 ===================================*/
/**
 * Google Map clientライブラリが読み込まれた直後に呼ばれる関数
 */
function mapApiClientReady(){

  $(function(){
    var addressData = $('.address');

    currentInfoWindow = null;
    dataMaxLength = addressData.length;
    vPointCount = 0;
    vPointCountTotal = dataMaxLength;
    console.log('dataMaxLength='+dataMaxLength);
    
    //データ件数分の座標データを取得する。
    addressData.each(function(i,_val){
      var addressTxt = _val.innerHTML;
      //console.log('addressData['+i+']='+addressTxt);
      var timer = setTimeout(function(){
        getCoordinate(addressTxt);
      },500 * i);
    })
    
    setTimeout(console.table(mapData),500*dataMaxLength);

    var timerID = setInterval(function(){
      if(vPointCountTotal ==vPointCount){
        clearInterval(timerID);
        showMap();
      }
    },200);
  });
  
}

/**
 * 住所から座標データを取得する
 * @param {String} _address 住所
 */
function getCoordinate(_address){
  //googlemap APIのGeocoderインスタンスを生成
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({'address': _address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {

      //var lat = results[0].geometry.location.ob;
      //var lng = results[0].geometry.location.pb;
      var lat = results[0].geometry.location.lat();
      var lng = results[0].geometry.location.lng();
      console.log(_address);
      console.log('lat='+lat);
      console.log('lng='+lng);
      mapData.push({
        point:{
          lat:lat,
          lng:lng
        },
        icon:iconImg,
        address:_address,
        id:''
      });
      
      vAveLat += lat;
      vAveLng += lng;
      vPointCount++;
      
    }
  });
}


/**
 * 地図を表示する
 */
function showMap(){
  var y=0;
  var x=0;
  var mapOptions = {
    zoom: 15,
    center: new google.maps.LatLng((vAveLat/mapData.length)+y,(vAveLng/mapData.length)+x),
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    panControl: true,
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: true,
    streetViewControl: false,
    overviewMapControl: false,
    scrollwheel: false 
  }
  
  var map = new google.maps.Map(document.getElementById("map"), mapOptions);
  
  for (var i = 0; i < mapData.length; i++) {
    fAddBallon(mapData[i]);
  }
  
  
  /**
   * ピンをクリックした時のバルーンの表示設定
   * @param {Object} _data 地図の座標や住所のデータ
   */
  function fAddBallon(_data){
    console.log(_data);
    var id = _data.id;
    var lat = _data.point.lat;
    var lng = _data.point.lng;
    var icon = _data.icon;
    var address = _data.address;
    
    //所在地を表示する
    var beachMarker = new google.maps.Marker({
      position: new google.maps.LatLng(lat,lng),
      map: map,
      icon: icon
    });
    //var contentString = '<div class="balloon"><p class="ancher"><a href="#'+id+'">'+$('#'+id+' h5').text()+'</a></p>'+$('#'+id+' .jyusyo').text()+"<br>"+$('#'+id+' .jyusyo-txt').text()+'<ul>'+$('#'+id+' .denwa').text()+'</ul></div>'
    var contentString = '<div class="balloon">'+
        address +
        '</div>';
    
    
    
    var infowindow = new google.maps.InfoWindow({
      content: contentString
    });
    google.maps.event.addListener(beachMarker, 'click', function() {
      if (currentInfoWindow) {
        currentInfoWindow.close();
      }
      infowindow.open(map,beachMarker);
      currentInfoWindow = infowindow;
      console.log('d');
      $(".gm-style-iw").css("min-width","230px")
    });
  }
  
}





/**
 * jsonのデータを取得する
 * @param {String} JSONデータのURL
 * @return {$.Defferd}
 */
function getJsonData(_url){
  console.log('getJsonData()開始：'+_url);
  var $dfd = $.Deferred();
  $.ajax({
    url:_url,
    dataType:'json',
    cache:false,
    timeout:15000
  })
    .done(function(_data){
    console.log('json取得成功：'+_url);
    $dfd.resolve(_data);
  })
    .fail(function(_data){
    console.log('json取得error：'+_url);
    $dfd.reject(_data);
  })
    .always(function(_data){
    console.log('getJsonData()終了：'+_url);
  });
  return $dfd.promise();
}


