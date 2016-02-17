Webサイトに掲載されている住所を抽出して、自動的にGoogleMap上にピンを刺すサンプル

GoogleMapAPIを使用して、Webサイト上の住所から座標を割り出し、
自動的にGoogleマップ上にピンを指します。

- [デモ](http://chieeeeno.github.io/gmap_api_sample/sample1/)
- [サンプルファイル](https://github.com/chieeeeno/gmap_api_sample)



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
<script async defer src="https://maps.googleapis.com/maps/api/js?key=XXXXXXXXXXXXXXXXXXXXXXXX&callback=hogehoge（関数名を指定）">
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

パラメータに`callback=hogehoge`と指定すると、GoogleMapAPIが読み込まれた直後に指定した関数を実行できます。
今回は、`mapApiClientReady()`が呼び出すようになっています。

サンプルでは、`mapApiClientReady()`内で、住所の件数分`getCoordinate()`関数をブン回し、座標データを取得します。
この時、連続で処理を実行すると、GoogleMapAPIのリクエスト制限に引っかかり、エラーが起こるため、
`setTimeout`である一定以上の間隔を開けてリクエストを送ります。
※サンプルでは、0.5秒ずつ間隔をあけてリクエストを送ってます。

取得する座標データの件数が多くなるほど、API制限に引っかかりやすくなるため注意が必要です。

###地図の表示
```index.js
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

```

取得した座標データの配列をGogleMapAPIに渡して、地図上にピンを指します。

`new google.maps.InfoWindow`でオプションを指定することで、
吹き出しに表示する情報ウィンドウのカスタマイズをすることができる。

###google.maps.InfoWindowで指定できるオプション
| プロパティ | 説明 |
|-----------|------------|
| content |情報ウィンドウ内に表示するテキストを指定します。HTML文も記述できます。|
| disableAutoPan |情報ウィンドウを表示する時に、地図を情報ウィンドウ全体が表示されるよう地図が自動的に移動するのを無効化するかを真偽値で指定します。 デフォルトはfalse（自動移動）。|
| pixelOffset |情報ウィンドウの先端部分と情報ウィンドウを固定するオフセット値を指定します。|
| position|情報をウィンドウを固定する位置の緯度・経度のLatLng値を指定します。|
| maxWidth |maxWidthには、情報ウィンドウの最大幅を指定します（単位：ピクセル）。 maxWidthを指定した場合、その幅よりあふれる場合は、情報ウィンドウ内に縦スクロールが表示あれます。 maxWidthを指定しない場合は、吹き出し内のコンテンツ量に合わせて自動的に伸縮されます。|
| zIndex |情報ウィンドウの重なり順序を指定します。 数字が大きい方が前面に表示されます。|

###マップオプション
詳細は[公式リファレンス](https://developers.google.com/maps/documentation/javascript/3.exp/reference?hl=ja)を参照

###実装してみたものの・・・
連続でAPIリクエストができず、間隔をあけて情報を取得しているため、
ピンを刺す件数が多くなると表示にすごく時間がかかります。
1ページにつき2〜3件くらいの住所であれば許容範囲だが、10件以上になる場合は、
座標データは別途ファイル化して管理したほうがよいかも・・という結論になりました。



