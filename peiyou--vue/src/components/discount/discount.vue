<template>
  <div class='discount' id='myMap'>
  </div>
</template>

<script>
export default {
    name: 'discount',
    methods: {
        maps () {
        }
    },
    mounted () {
        window.onload = function () {
            let startXY = [40.039, 116.30];
            let endXY = [39.909, 116.3973];
            let mymap = L.map('myMap', {
                center: startXY,
                zoom: 11
            });
            L.tileLayer(
            'http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
                attribution: '&copy; 高德地图',
                maxZoom: 18,
                minZoom: 9,
                subdomains: '1234'
            }).addTo(mymap);
            // 点
            let endMarker = L.marker(endXY, {
                title: '天安门',
                draggable: false // 设置Marker是否可拖拽
            })
                .bindPopup('天安门')
                .addTo(mymap);
            let startMarker = L.marker(startXY, {
                title: '北京八维',
                draggable: false // 设置Marker是否可拖拽
            })
                .bindPopup('北京八维')
                .addTo(mymap)
                .openPopup();
            L.polyline([startXY, endXY]).addTo(mymap);
            startMarker.on('click', (e) => {
                mymap.setView(endXY);
                endMarker.openPopup();
            });
            endMarker.on('click', (e) => {
                mymap.setView(startXY);
                startMarker.openPopup();
            });
        };
    }
};
</script>

<style>
    .discount{
        background: #fff;
    }
    #myMap {
        height: 800px;
        width: 1200px;
    }
</style>
