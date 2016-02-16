###Google Maps JavaScript APIサンプル

Webサイトに掲載されている住所を抽出して、自動的にGoogleMap上にピンを刺すサンプル

GoogleMapAPIを使用して、Webサイト上の住所から座標を割り出し、
自動的にGoogleマップ上にピンを指します。

##サンプルファイル
- gmap_api_sample
+ sample1
- css　：CSSファイル
- img　：画像ファイル
+ js　：jsファイル
- lib　：jsライブラリ（jQueryなど）
- [index.js](https://github.com/chieeeeno/gmap_api_sample/blob/master/sample1/js/index.js)
+ [index.html](https://github.com/chieeeeno/gmap_api_sample/blob/master/sample1/index.html)


##解説
###ライブラリ使用準備
GoogleMapAPIを使用するためにHTML内に下記のコードを挿入し、APIを読み込みます。

```html:index.html
<script async defer src="https://maps.googleapis.com/maps/api/js?key=XXXXXXXXXXXXXXXXXXXXXXXX&callback=mapApiClientReady">
```
※「key=XXXXXXXXXXXXXXXXXXXXXXXX」の所には各自取得したAPIキーを入れてください。

パラメータに`callback=javascript関数名`を記述すると、ライブラリファイルの読み込みが完了した直後に、指定した名前の関数が実行されます。
実行したい関数が読み込まれた後じゃないと、関数が見つからず、処理が実行されないため、別途実装したjsファイルは、ライブラリファイルよりも手前で読み込むようにしてください。

###HTML内の住所情報の取得

```index.js
/**
* Google Map clientライブラリが読み込まれた直後に呼ばれる関数
*/
function mapApiClientReady(){

$(function(){

//HTML内に記載の住所情報を取得
var addressData = $('.address');	

currentInfoWindow = null;
dataMaxLength = addressData.length;
vPointCount = 0;
vPointCountTotal = dataMaxLength;

//データ件数分の座標データを取得する。
addressData.each(function(i,_val){
var addressTxt = _val.innerHTML;
var timer = setTimeout(function(){
getCoordinate(addressTxt);
},500 * i);
});
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

var lat = results[0].geometry.location.lat();
var lng = results[0].geometry.location.lng();

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

//取得した座標データを元に地図を描画する
if(vPointCountTotal == vPointCount){
showMap();
}

}
});
}

```

GoogleMapAPIが読み込まれた直後に`mapApiClientReady()`が呼び出されるので、
`mapApiClientReady()`内で、住所の件数分`getCoordinate()`関数をブン回し、座標データを取得します。
この時、連続で処理を実行すると、GoogleMapAPIのリクエスト制限に引っかかり、エラーが起こるため、
`setTimeout`である一定以上の間隔を開けてリクエストを送ります。
※サンプルでは、0.5秒ずつ間隔をあけてリクエストを送ってます。

取得する座標データの件数が多くなるほど、API制限に引っかかりやすくなるため注意が必要です。
