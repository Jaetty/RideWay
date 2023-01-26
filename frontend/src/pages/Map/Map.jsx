/* eslint-disable */
/* global kakao */
import React, { useEffect, useState } from 'react';

const KAKAOMAP = () => {
  const [district, setTerrain] = useState(false);
  const [bikeroad, setBikeRoad] = useState(false);
  const [kakaoMap, setKakaoMap] = useState(null);
  const [latitude, setLatitude] = useState(37.365264512305174);
  const [longitude, setLongitude] = useState(127.10676860117488);
  const [level, setLevel] = useState(4);
  //
  // checkbox 선택 시 현재 위도, 경도, 래벨을 수정한 후 지도를 랜더링한다.
  const inputTerrain = e => {
    setTerrain(e.target.checked);
    const currentPos = kakaoMap.getCenter();
    const currentLevel = kakaoMap.getLevel();
    setLatitude(currentPos.Ma);
    setLongitude(currentPos.La);
    setLevel(currentLevel);
  };
  const inputBikeRoad = e => {
    setBikeRoad(e.target.checked);
    const currentPos = kakaoMap.getCenter();
    const currentLevel = kakaoMap.getLevel();
    setLatitude(currentPos.Ma);
    setLongitude(currentPos.La);
    setLevel(currentLevel);
  };

  useEffect(() => {
    const mapScript = document.createElement('script');
    mapScript.type = 'text/javascript';
    mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_MAP_KEY}&autoload=false&libraries=services,clusterer,drawing`;
    mapScript.async = true;
    document.head.appendChild(mapScript);

    const onLoadKakaoMap = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById('map');
        const options = {
          center: new window.kakao.maps.LatLng(latitude, longitude),
          level: level,
        };
        const map = new window.kakao.maps.Map(container, options);
        const mapTypes = {
          terrain: kakao.maps.MapTypeId.TERRAIN,
          bicycle: kakao.maps.MapTypeId.BICYCLE,
        };
        const chkTerrain = document.getElementById('chkTerrain');
        const chkBicycle = document.getElementById('chkBicycle');

        for (const type in mapTypes) {
          map.removeOverlayMapTypeId(mapTypes[type]);
        }

        // 지형정보 체크박스가 체크되어있으면 지도에 지형정보 지도타입을 추가합니다
        if (chkTerrain.checked) {
          map.addOverlayMapTypeId(mapTypes.terrain);
        }
        if (chkBicycle.checked) {
          map.addOverlayMapTypeId(mapTypes.bicycle);
        }

        setKakaoMap(map);
      });
    };
    mapScript.addEventListener('load', onLoadKakaoMap);

    return () => mapScript.removeEventListener('load', onLoadKakaoMap);
  }, [district, bikeroad]);

  return (
    <div>
      <div
        id="map"
        style={{
          width: '800px',
          height: '700px',
          position: 'relative',
          overflow: 'hidden',
        }}
      />
      <p>
        <input type="checkbox" id="chkTerrain" onClick={inputTerrain} />{' '}
        지형정보 보기
        <input type="checkbox" id="chkBicycle" onClick={inputBikeRoad} />
        {}
        자전거도로 정보 보기
      </p>
    </div>
  );
};
export default KAKAOMAP;
