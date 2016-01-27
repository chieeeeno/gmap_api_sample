
/*===================================
 メイン処理
===================================*/
$(function(){
  
});


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
