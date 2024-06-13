import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSportById } from '../../service/sportService';
import './DetailPage.css';

function DetailPage() {
  const { index } = useParams();
  const [sport, setSport] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [activeInfoWindow, setActiveInfoWindow] = useState(null);
  const navigate = useNavigate();

  const displayMarker = (map, locPosition, message) => {
    const marker = new window.kakao.maps.Marker({
      map,
      position: locPosition,
    });

    const infowindow = new window.kakao.maps.InfoWindow({
      content: message,
      removable: false,
    });

    infowindow.open(map, marker);
    map.setCenter(locPosition);
  };

  const initMap = (location, query) => {
    const mapContainer = document.getElementById('map');
    const mapOption = {
      center: new window.kakao.maps.LatLng(location.latitude, location.longitude),
      level: 5,
    };

    const map = new window.kakao.maps.Map(mapContainer, mapOption);
    const ps = new window.kakao.maps.services.Places();
    const radius = 10000; // 10km

    ps.keywordSearch(
      query,
      (data, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const bounds = new window.kakao.maps.LatLngBounds();
          data.forEach((place) => {
            const marker = new window.kakao.maps.Marker({
              map,
              position: new window.kakao.maps.LatLng(place.y, place.x),
            });

            const infowindowContent = `
              <div class="kakao_info_window">
                <div class="wrap">
                  <div class="info">
                    <div class="title">
                      ${place.place_name}
                      <div class="custom-close" onclick="closeInfoWindow()">x</div>
                    </div>
                    <div class="body">
                      ${place.road_address_name || place.address_name}<br>
                      ${place.phone}<br>
                      <a href="${place.place_url}" target="_blank">자세히 보기</a>
                    </div>
                  </div>
                </div>
              </div>`;

            const infowindow = new window.kakao.maps.InfoWindow({
              content: infowindowContent,
              removable: false,
            });

            window.kakao.maps.event.addListener(marker, 'click', () => {
              if (activeInfoWindow) {
                activeInfoWindow.close();
              }
              infowindow.open(map, marker);
              setActiveInfoWindow(infowindow);
            });

            bounds.extend(new window.kakao.maps.LatLng(place.y, place.x));
          });

          map.setBounds(bounds);
        }
      },
      {
        location: new window.kakao.maps.LatLng(location.latitude, location.longitude),
        radius,
      }
    );

    const locPosition = new window.kakao.maps.LatLng(location.latitude, location.longitude);
    const message = '<div style="padding:5px;">내 현재위치</div>';

    displayMarker(map, locPosition, message);
  };

  useEffect(() => {
    const loadSport = async () => {
      try {
        const sportData = await fetchSportById(index);
        setSport(sportData);
      } catch (error) {
        console.error('Failed to load sport:', error);
      }
    };

    loadSport();
  }, [index]);

  useEffect(() => {
    const loadKakaoMapScript = () => {
      const script = document.createElement('script');
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=2c48ff96b1637410fd95f233dd072cea&libraries=services&autoload=false`;
      script.async = true;
      script.onload = () => {
        window.kakao.maps.load(() => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ latitude, longitude });
              },
              (error) => {
                console.error('Error getting user location:', error);
                alert('사용자의 위치를 가져올 수 없습니다.');
              }
            );
          } else {
            console.error('Geolocation is not supported by this browser.');
            alert('브라우저가 위치 정보를 지원하지 않습니다.');
          }
        });
      };
      document.head.appendChild(script);
    };

    if (!window.kakao) {
      loadKakaoMapScript();
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        (error) => {
          console.error('Error getting user location:', error);
          alert('사용자의 위치를 가져올 수 없습니다.');
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      alert('브라우저가 위치 정보를 지원하지 않습니다.');
    }
  }, []);

  useEffect(() => {
    if (sport && userLocation && window.kakao) {
      initMap(userLocation, sport.name);
    }
  }, [sport, userLocation]);

  window.closeInfoWindow = () => {
    if (activeInfoWindow) {
      activeInfoWindow.close();
    }
  };

  const navigateToPosts = () => {
    if (sport) {
      navigate(`/posts/page/1?search=${encodeURIComponent(sport.name)}`);
    }
  };

  if (!sport) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="comubtn">
        <button type="button" className="navigate-button" onClick={navigateToPosts}>
          커뮤니티 바로가기
        </button>
        <p>{sport.description}</p>
      </div>
      <div className="detail-page">
        <div id="map" style={{ width: '100%', height: '500px' }} />
      </div>
      <div className="iframe-container">
        {sport.src && (
          <iframe width="560" height="315" src={sport.src} title="YouTube video player">
            {sport.name}
          </iframe>
        )}
      </div>
    </>
  );
}

export default DetailPage;
