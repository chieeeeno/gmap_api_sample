var iconImg = '';
var MAP_JSON_URL = './js/map.json'

//中央位置を求める
var vAveLat=0;
var vAveLng=0;

var currentInfoWindow = null;


/*===================================
 関数定義
 ===================================*/
/**
 * Google Map clientライブラリが読み込まれた直後に呼ばれる関数
 */
function mapApiClientReady(){
  currentInfoWindow = null;
  getJsonData(MAP_JSON_URL)
    .then(function(_data){
    showMap(_data);
  });
  
}



/**
 * 地図を表示する
 */
function showMap(_mapData){
  var y=0;
  var x=0;
  
  for(var i = 0; i < _mapData.length; i++){
    var _lat = parseFloat(_mapData[i].latlng[0]);
    var _lng = parseFloat(_mapData[i].latlng[1]);
    vAveLat += _lat;
    vAveLng += _lng;
  }
  
  var mapOptions = {
    zoom: 15,
    center: new google.maps.LatLng((vAveLat/_mapData.length)+y,(vAveLng/_mapData.length)+x),
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
  
  for (var i = 0; i < _mapData.length; i++) {
    fAddBallon(_mapData[i]);
  }
  
  
  /**
   * ピンをクリックした時のバルーンの表示設定
   * @param {Object} _data 地図の座標や住所のデータ
   */
  function fAddBallon(_data){
    //console.log(_data);
    //var id = _data.id;
    var lat = _data.latlng[0];
    var lng = _data.latlng[1];
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
      //console.log('d');
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


