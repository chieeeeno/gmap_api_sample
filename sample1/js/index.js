var iconImg = '';
var mapData = [];

//中央位置を求める
var vAveLat=0;
var vAveLng=0;

//var vPointCountTotal = $(".tempo").length;
var vPointCount = 0;

var currentInfoWindow = null;

var dataMaxLength = 0;  //データ件数

/*===================================
 メイン処理
===================================*/
$(function(){
  var $address = $('.address');
  
//  vPointCountTotal = $(".tempo").length;
  vPointCount = 0;
  currentInfoWindow = null;
  
  dataMaxLength = $address.length;
  console.log('aaa');
  $address.each(function(index){
    console.log('aaa');
    var addressTxt = $(this).text();
    var timer = setTimeout(function(){
      getCoordinate(addressTxt);
    },300 * index);
  })
  
//  for(var i = 0; i < dataMaxLength; i++){
//    
//    
//    var timer = setTimeout(function(){
//      getCoordinate(id,jyusyo,geo);
//    },300 * i);
//  }
  
  
  
});

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

      mapData.push({point:[ lat , lng ],icon:iconImg,id:''});
      vAveLat += lat;
      vAveLng += lng;
      vPointCount++;
      console.table(mapData)
    }
  });
}

/*===================================
 関数定義
===================================*/



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


/*===================================
 YouTube Data API setting
===================================*/
