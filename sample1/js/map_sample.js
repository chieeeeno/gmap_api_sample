$(function(){

  var noIE = true;
  if($.browser.msie){
    noIE = false;
  }

  var icon1 = 'img/ico_logo.png';

  // 位置情報と表示データの組み合わせ
  var data = new Array();

  //中央位置を求める
  var vAveLat=0;
  var vAveLng=0;

  var vPointCountTotal = $(".tempo").length;
  var vPointCount = 0;

  var currentInfoWindow = null;


  $(".tempo")
    .each(function(i) {
    var jyusyo = $(this).find('.jyusyo-txt').text();
    var geo = $(this).find('.jyusyo-txt').attr("geo");
    var id = $(this).attr('id');

    var timer = setTimeout(function(){
      fGeo(id,jyusyo,geo);
    },300 * i);
  });


  function fGeo(vID,jyusyo,geo){

    var geocoder = new google.maps.Geocoder();

    geocoder.geocode({'address': jyusyo}, function(results, status) {
      if(geo == undefined){
        if (status == google.maps.GeocoderStatus.OK) {

          //var lat = results[0].geometry.location.ob;
          //var lng = results[0].geometry.location.pb;
          var lat = results[0].geometry.location.lat();
          var lng = results[0].geometry.location.lng();

          data.push({point:[ lat , lng ],icon:icon1,id:vID});
          vAveLat += lat;
          vAveLng += lng;
          vPointCount++;
        }
      }else{


        if($('#'+vID+' .jyusyo-txt').attr("geo")!=undefined && $('#'+vID+' .jyusyo-txt').attr("geo")!=null){

          var pointData=$('#'+vID+' .jyusyo-txt').attr("geo").split(',');

          var lat=parseFloat(pointData[0]);
          var lng=parseFloat(pointData[1]);

          data.push({point:[lat,lng],icon:icon1,id:vID});
          vAveLat += lat;
          vAveLng += lng;

        }
        vPointCount++;
      }
    });
  }

  var timerID = setInterval(function(){


    if(vPointCountTotal ==vPointCount){
      clearInterval(timerID);
      fAppearMap();
    }
  },200);


  function fAppearMap(){

    //配列をソート
    //data.sort(function(a, b) {return a.id-b.id});

    if(noIE){
      //console.log("point:", data)
    }



    var y=0;
    var x=0;
    if($("#map").attr("zurasu")!=undefined && $("#map").attr("zurasu")!=null){
      var pointData=$("#map").attr("zurasu").split(',');

      x=parseFloat(pointData[0]);
      y=parseFloat(pointData[1])

    }
    var mapOptions = {
      zoom: 17-parseInt($("#map").attr("zoom")),
      center: new google.maps.LatLng((vAveLat/data.length)+y,(vAveLng/data.length)+x),
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

    //中心の座標設定 
    //var myoffice = new GPoint( (vAveLng/data.length)+x,(vAveLat/data.length)+y);

    //所在地を中心にする
    //map.centerAndZoom(myoffice , parseInt($("#map").attr("zoom")));// 数値部分を変えると詳細-広域に変更できます。0-17

    //コントロール追加
    //map.addControl(new GSmallMapControl());

    for (i = 0; i < data.length; i++) {
      fAddBallon(data[i].id ,data[i].point[0], data[i].point[1],data[i].icon);
    }

    function fAddBallon(id , lat , lng , icon){
      //所在地を表示する

      var beachMarker = new google.maps.Marker({
        position: new google.maps.LatLng(lat,lng),
        map: map,
        icon: icon
      });

      var contentString = '<div class="balloon"><p class="ancher"><a href="#'+id+'">'+$('#'+id+' h5').text()+'</a></p>'+$('#'+id+' .jyusyo').text()+"<br>"+$('#'+id+' .jyusyo-txt').text()+'<ul>'+$('#'+id+' .denwa').text()+'</ul></div>'
      var infowindow = new google.maps.InfoWindow({
        content: contentString
      });

      google.maps.event.addListener(beachMarker, 'click', function() {
        if (currentInfoWindow) {
          currentInfoWindow.close();
        }
        infowindow.open(map,beachMarker);
        currentInfoWindow = infowindow;

        $(".gm-style-iw").css("min-width","230px")
      });
    }

  }


})