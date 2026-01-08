// 전역 상태 관리
const state = {
    currentScreen: 'home',
    formData: {
        duration: '1박 2일',
        transport: '대중교통',
        budget: '20만원',
        includeFood: true,
        region: '서울',
        style: '집돌이'
    },
    currentResult: null,
    savedTravels: [],
    map: null,
    markers: []
};

// 로컬 스토리지에서 저장된 여행 불러오기
function loadSavedTravels() {
    const saved = localStorage.getItem('lazy_travel_v5');
    if (saved) {
        try {
            state.savedTravels = JSON.parse(saved);
        } catch (e) {
            state.savedTravels = [];
        }
    }
}

// 저장된 여행 저장하기
function saveSavedTravels() {
    localStorage.setItem('lazy_travel_v5', JSON.stringify(state.savedTravels));
}

// 초기화
loadSavedTravels();

// 추천 데이터베이스
const travelRecommendations = {
    서울: {
        '당일치기': {
            '10만원': {
                title: '10만원으로 끝내는 서울역 껌딱지 여행',
                difficulty: 85,
                comment: '역 출구에서 넘어지면 코 닿을 거리만 이동하는 진정한 귀차니스트 코스',
                days: [{
                    day: 1,
                    activities: [
                        {
                            name: '명동성당',
                            desc: '역에서 3분 거리. 사진만 찍으면 바로 튈 수 있는 최적의 위치. 사람 많으면 그냥 지나가세요.',
                            tip: '서울역 1번 출구에서 직진 300m. 내비게이션 안 켜도 됩니다.',
                            photo: 4,
                            mapLink: 'https://www.google.com/maps/place/명동성당'
                        },
                        {
                            name: '명동거리',
                            desc: '성당에서 2분 거리. 걷기 싫으면 그냥 사진만 찍고 역으로 복귀하는 것도 추천.',
                            tip: '사람 많으면 즉시 철수. 에스컬레이터 타고 올라가는 것도 체력 소모입니다.',
                            photo: 3,
                            mapLink: 'https://www.google.com/maps/place/명동거리'
                        }
                    ]
                }]
            },
            '20만원': {
                title: '20만원으로 끝내는 홍대역 주변 찍먹 여행',
                difficulty: 80,
                comment: '역에서 5분 반경만 활동하는 효율충 추천 코스',
                days: [{
                    day: 1,
                    activities: [
                        {
                            name: '홍대입구역 9번 출구',
                            desc: '출구에서 바로 나오면 보이는 카페 거리. 앉아서 쉬기만 해도 여행 느낌.',
                            tip: '홍대입구역 9번 출구 직결. 에스컬레이터 하나만 타면 끝.',
                            photo: 3,
                            mapLink: 'https://www.google.com/maps/place/홍대입구역'
                        },
                        {
                            name: '홍익대학교 앞 거리',
                            desc: '카페에서 200m 거리. 사진 찍고 바로 돌아오면 체력 절약.',
                            tip: '직진만 하면 됩니다. 건너가기는 선택사항입니다.',
                            photo: 4,
                            mapLink: 'https://www.google.com/maps/place/홍익대학교'
                        }
                    ]
                }]
            },
            '30만원': {
                title: '30만원으로 즐기는 강남역 프리미엄 게으름',
                difficulty: 90,
                comment: '역에서 발렛까지 모든 게 해결되는 진정한 게으름의 경지',
                days: [{
                    day: 1,
                    activities: [
                        {
                            name: '강남역 지하상가',
                            desc: '역에서 내리면 바로. 비도 안 맞고, 엘리베이터만 타면 되는 천국.',
                            tip: '지하에서만 활동하면 외부 이동 거리 0m. 완벽합니다.',
                            photo: 3,
                            mapLink: 'https://www.google.com/maps/place/강남역'
                        },
                        {
                            name: '코엑스',
                            desc: '강남역에서 지하철 2호선 한 정거장. 또는 도보 10분. 선택은 당신 몫.',
                            tip: '지하철 추천. 땅 위로 나가는 것 자체가 체력 낭비입니다.',
                            photo: 5,
                            mapLink: 'https://www.google.com/maps/place/코엑스'
                        }
                    ]
                }]
            }
        },
        '1박 2일': {
            '20만원': {
                title: '1박 2일 서울 역세권 최소 이동 코스',
                difficulty: 75,
                comment: '숙소에서 나가기 싫어도 나갈 수밖에 없는 미묘한 거리의 여행',
                days: [
                    {
                        day: 1,
                        activities: [
                            {
                                name: '인사동',
                                desc: '지하철 안국역 3번 출구에서 2분. 전통적인 분위기지만 이동 거리는 최소.',
                                tip: '안국역 3번 출구 직결. 출구 번호 헷갈리면 1번 출구 가서 물어보세요.',
                                photo: 4,
                                mapLink: 'https://www.google.com/maps/place/인사동'
                            },
                            {
                                name: '경복궁',
                                desc: '인사동에서 도보 5분. 입장료 있지만 사진 찍기 좋은 곳.',
                                tip: '직진하면 됩니다. 복잡한 길 찾기 필요 없습니다.',
                                photo: 5,
                                mapLink: 'https://www.google.com/maps/place/경복궁'
                            }
                        ]
                    },
                    {
                        day: 2,
                        activities: [
                            {
                                name: '북촌한옥마을',
                                desc: '경복궁 근처. 언덕이 약간 있지만 뷰 좋은 곳에서 사진 한 장만 찍으면 끝.',
                                tip: '언덕 오르기 싫으면 아래쪽에서만 사진 찍고 돌아가세요.',
                                photo: 5,
                                mapLink: 'https://www.google.com/maps/place/북촌한옥마을'
                            }
                        ]
                    }
                ]
            }
        }
    },
    부산: {
        '당일치기': {
            '20만원': {
                title: '부산 해운대역 바다 한눈에 보기 최단거리',
                difficulty: 85,
                comment: '역에서 바다까지 걸어가기 싫은 당신을 위한 코스',
                days: [{
                    day: 1,
                    activities: [
                        {
                            name: '해운대역',
                            desc: '해운대 해수욕장과 가장 가까운 역. 여기서 시작하면 이동 최소화.',
                            tip: '해운대역 5번 출구에서 직진 7분. 바다 보이면 바로 돌아와도 됩니다.',
                            photo: 3,
                            mapLink: 'https://www.google.com/maps/place/해운대역'
                        },
                        {
                            name: '해운대 해수욕장',
                            desc: '바다 보고 사진 찍고 끝. 물에 들어갈 생각은 아예 하지 마세요.',
                            tip: '모래밭 걷기는 체력 소모 큽니다. 벤치에 앉아서 바다만 보세요.',
                            photo: 5,
                            mapLink: 'https://www.google.com/maps/place/해운대해수욕장'
                        }
                    ]
                }]
            }
        }
    },
    제주: {
        '1박 2일': {
            '30만원': {
                title: '제주 공항 근처 주차 넓은 곳만 골라서',
                difficulty: 70,
                comment: '주차 걱정 없는 곳만 간 다음 바로 돌아오는 코스',
                days: [
                    {
                        day: 1,
                        activities: [
                            {
                                name: '제주공항 근처 카페',
                                desc: '공항에서 차로 10분. 주차 넓고 앉아서 쉬기만 하면 됩니다.',
                                tip: '네비게이션으로 주차장 큰 카페 검색 추천. 걷기 최소화.',
                                photo: 3,
                                mapLink: 'https://www.google.com/maps/search/제주+카페+주차장+넓은'
                            },
                            {
                                name: '협재해수욕장',
                                desc: '주차장 넓은 해수욕장. 차에서 내려서 바다만 보다가 다시 차로 복귀.',
                                tip: '해변까지 걷기 싫으면 차에서 창문 열고 사진만 찍으세요.',
                                photo: 5,
                                mapLink: 'https://www.google.com/maps/place/협재해수욕장'
                            }
                        ]
                    },
                    {
                        day: 2,
                        activities: [
                            {
                                name: '카멜리아힐',
                                desc: '주차장 넓고 평지 위주. 걷기 싫으면 카페에서만 시간 보내도 됩니다.',
                                tip: '전체 돌기보다는 입구 근처 카페에서만 머물기 추천.',
                                photo: 4,
                                mapLink: 'https://www.google.com/maps/place/카멜리아힐'
                            }
                        ]
                    }
                ]
            }
        }
    }
};

// 기본 추천 (데이터 없을 때)
function getDefaultRecommendation() {
    return {
        title: `${state.formData.budget}으로 즐기는 ${state.formData.region} 최소 이동 코스`,
        difficulty: 75,
        comment: '역 출구에서 넘어지면 코 닿을 거리만 이동하는 진정한 귀차니스트 코스',
        days: [{
            day: 1,
            activities: [
                {
                    name: `${state.formData.region} 중심가`,
                    desc: '역에서 가장 가까운 관광지. 이동 거리 최소화.',
                    tip: '직진만 하면 됩니다. 복잡한 길 찾기 필요 없습니다.',
                    photo: 4,
                    mapLink: `https://www.google.com/maps/search/${encodeURIComponent(state.formData.region)}`
                }
            ]
        }]
    };
}

// 추천 가져오기
function getRecommendation() {
    const region = state.formData.region;
    const duration = state.formData.duration;
    const budget = state.formData.budget;

    if (travelRecommendations[region] && 
        travelRecommendations[region][duration] && 
        travelRecommendations[region][duration][budget]) {
        return travelRecommendations[region][duration][budget];
    }

    // 정확히 매칭 안 되면 기본값 반환
    return getDefaultRecommendation();
}

// 지도 초기화
function initMap() {
    // 기존 지도가 있으면 제거
    if (state.map) {
        state.map.remove();
        state.map = null;
    }
    
    // 지도 컨테이너 확인
    const mapContainer = document.getElementById('travel-map');
    if (!mapContainer) return;
    
    // 한국 중심 좌표로 지도 생성
    state.map = L.map('travel-map', {
        zoomControl: true,
        attributionControl: true
    }).setView([37.5665, 126.9780], 10); // 서울 기본 좌표
    
    // OpenStreetMap 타일 레이어 추가
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(state.map);
    
    // 기존 마커 초기화
    state.markers = [];
}

// 장소명을 좌표로 변환 (Geocoding)
async function geocodePlace(placeName, region) {
    try {
        // OpenStreetMap Nominatim API 사용 (무료)
        const query = `${placeName}, ${region}, 대한민국`;
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&countrycodes=kr`;
        
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'LazyTraveler/1.0' // Nominatim은 User-Agent 필요
            }
        });
        
        const data = await response.json();
        
        if (data && data.length > 0) {
            return {
                lat: parseFloat(data[0].lat),
                lon: parseFloat(data[0].lon)
            };
        }
    } catch (error) {
        console.error('Geocoding error:', error);
    }
    
    // 실패 시 지역별 기본 좌표 반환
    const regionCoords = {
        '서울': { lat: 37.5665, lon: 126.9780 },
        '부산': { lat: 35.1796, lon: 129.0756 },
        '제주': { lat: 33.4996, lon: 126.5312 },
        '강릉': { lat: 37.7519, lon: 128.8761 },
        '전주': { lat: 35.8242, lon: 127.1480 },
        '경주': { lat: 35.8562, lon: 129.2247 },
        '인천': { lat: 37.4563, lon: 126.7052 },
        '속초': { lat: 38.2070, lon: 128.5918 },
        '여수': { lat: 34.7604, lon: 127.6622 }
    };
    
    return regionCoords[region] || { lat: 37.5665, lon: 126.9780 };
}

// 지도에 장소 마커 추가
async function addPlaceToMap(place, index, total, region) {
    if (!state.map) return;
    
    const coords = await geocodePlace(place.name, region);
    
    // 마커 아이콘 생성
    const markerIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="
            background: #f97316;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 900;
            font-size: 14px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            border: 2px solid white;
        ">
            <span style="transform: rotate(45deg); display: block;">${index + 1}</span>
        </div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 30]
    });
    
    const marker = L.marker([coords.lat, coords.lon], { icon: markerIcon })
        .addTo(state.map)
        .bindPopup(`
            <div class="map-popup">
                <h4>${place.name}</h4>
                <p>${place.desc}</p>
            </div>
        `);
    
    state.markers.push({
        marker: marker,
        coords: coords,
        place: place
    });
    
    return coords;
}

// 지도에 경로 그리기
function drawRouteOnMap(coordinates) {
    if (!state.map || coordinates.length < 2) return;
    
    // 경로 선 그리기
    const routeLine = L.polyline(
        coordinates.map(c => [c.lat, c.lon]),
        {
            color: '#f97316',
            weight: 4,
            opacity: 0.7,
            smoothFactor: 1
        }
    ).addTo(state.map);
    
    // 모든 마커가 보이도록 지도 범위 조정
    if (coordinates.length > 0) {
        const bounds = L.latLngBounds(coordinates.map(c => [c.lat, c.lon]));
        state.map.fitBounds(bounds, { padding: [50, 50] });
    }
}

// 결과 데이터로 지도 업데이트
async function updateMapWithResults(data, region) {
    // 기존 지도 제거
    if (state.map) {
        state.map.remove();
        state.map = null;
        state.markers = [];
    }
    
    // 약간의 지연 후 지도 생성 (DOM 업데이트 후)
    setTimeout(async () => {
        const mapContainer = document.getElementById('travel-map');
        if (!mapContainer) {
            console.error('지도 컨테이너를 찾을 수 없습니다.');
            return;
        }
        
        // 지도 초기화
        initMap();
        
        // 지도 크기 조정 (컨테이너가 처음 표시될 때 필요)
        setTimeout(() => {
            if (state.map) {
                state.map.invalidateSize();
            }
        }, 200);
        
        const allActivities = data.days.flatMap(d => d.activities);
        const coordinates = [];
        
        // 각 장소를 지도에 추가
        for (let i = 0; i < allActivities.length; i++) {
            const coords = await addPlaceToMap(allActivities[i], i, allActivities.length, region);
            if (coords) {
                coordinates.push(coords);
            }
            
            // API 호출 간 딜레이 (Nominatim 사용 제한)
            if (i < allActivities.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
        
        // 경로 그리기
        if (coordinates.length >= 2) {
            drawRouteOnMap(coordinates);
        } else if (coordinates.length === 1) {
            // 마커 하나만 있을 때
            state.map.setView([coordinates[0].lat, coordinates[0].lon], 15);
        }
        
        // 지도 크기 다시 조정
        if (state.map) {
            setTimeout(() => {
                state.map.invalidateSize();
            }, 100);
        }
    }, 300);
}

// 화면 전환
function showScreen(screenName) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(`${screenName}-screen`).classList.add('active');
    state.currentScreen = screenName;

    if (screenName === 'mypage') {
        renderSavedTravels();
    }
}

function showHome() {
    showScreen('home');
    state.currentResult = null;
    
    // 지도 제거
    if (state.map) {
        state.map.remove();
        state.map = null;
        state.markers = [];
    }
    
    // 지도 컨테이너 숨기기
    const mapContainer = document.getElementById('map-container');
    if (mapContainer) {
        mapContainer.style.display = 'none';
    }
}

function showForm() {
    showScreen('form');
}

function showMypage() {
    showScreen('mypage');
}

// 옵션 선택
function selectOption(field, value) {
    state.formData[field] = value;
    
    // UI 업데이트
    document.querySelectorAll(`[data-field="${field}"]`).forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll(`[data-field="${field}"][data-value="${value}"]`).forEach(btn => {
        btn.classList.add('active');
    });
}

// 음식 토글
function toggleFood() {
    state.formData.includeFood = !state.formData.includeFood;
    const btn = document.getElementById('food-toggle');
    const text = document.getElementById('food-text');
    
    if (state.formData.includeFood) {
        btn.classList.add('active');
        text.textContent = '전설의 맛집 반드시 포함';
    } else {
        btn.classList.remove('active');
        text.textContent = '먹는 건 대충 때울래요';
    }
}

// 제출 처리
function handleSubmit(e) {
    e.preventDefault();
    showScreen('loading');
    
    // 예산 표시
    document.getElementById('loading-budget').textContent = 
        `${state.formData.budget} 예산에 맞춰 동선을 최적화하고 있어요.`;
    
    // 시뮬레이션 로딩
    setTimeout(async () => {
        const recommendation = getRecommendation();
        state.currentResult = recommendation;
        renderResult(recommendation);
        showScreen('result');
        
        // 지도 업데이트
        await updateMapWithResults(recommendation, state.formData.region);
    }, 2000);
}

// 결과 렌더링
function renderResult(data) {
    const card = document.getElementById('result-card');
    
    const lazinessInfo = getLazinessInfo(data.difficulty);
    
    let html = `
        <div class="result-header-card">
            <div class="difficulty-badge">LV. ${data.difficulty}</div>
            <div class="result-badges">
                <span class="badge-small">${state.formData.duration}</span>
                <span class="badge-small">${state.formData.budget}</span>
            </div>
            <h2 class="result-title">${data.title}</h2>
            
            <div class="laziness-card">
                <div class="laziness-header">
                    <div>
                        <p class="laziness-label">Laziness Score</p>
                        <h3 class="laziness-title">${lazinessInfo.emoji} ${lazinessInfo.label}</h3>
                    </div>
                    <span class="laziness-score">${data.difficulty}%</span>
                </div>
                <div class="laziness-bar">
                    <div class="laziness-bar-fill ${lazinessInfo.colorClass}" style="width: ${data.difficulty}%"></div>
                </div>
                <p class="laziness-note">높을수록 덜 귀찮은 여행입니다.</p>
            </div>
            
            <div class="comment-card">
                <span class="comment-icon">💬</span>
                <p class="comment-text">"${data.comment}"</p>
            </div>
        </div>
    `;
    
    // 구글 맵 경로 링크
    const allPlaces = data.days.flatMap(d => d.activities.map(a => a.name));
    if (allPlaces.length >= 2) {
        const origin = encodeURIComponent(allPlaces[0]);
        const destination = encodeURIComponent(allPlaces[allPlaces.length - 1]);
        const waypoints = allPlaces.slice(1, -1).map(p => encodeURIComponent(p)).join('|');
        const travelMode = state.formData.transport === '대중교통' ? 'transit' : 'driving';
        const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypoints ? `&waypoints=${waypoints}` : ''}&travelmode=${travelMode}`;
        
        html += `
            <div class="maps-card">
                <div class="maps-header">
                    <div>
                        <h3 class="maps-title">한눈에 보는 이동 경로</h3>
                        <p class="maps-subtitle">지도로 동선을 한눈에 확인하고 출발하세요.</p>
                    </div>
                    <div class="maps-emoji">🗺️</div>
                </div>
                <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" class="maps-link">
                    <i class="fa-solid fa-map-location-dot"></i> 구글 맵 전체 동선 핀 보기
                </a>
            </div>
        `;
    }
    
    // 일정 렌더링
    data.days.forEach(day => {
        html += `
            <div class="day-section">
                <div class="day-header">
                    <div class="day-badge">DAY ${day.day}</div>
                    <div class="day-line"></div>
                </div>
                <div class="activities-list">
        `;
        
        day.activities.forEach((act, idx) => {
            html += `
                <div class="activity-card">
                    <div class="activity-header">
                        <div>
                            <h4 class="activity-name">
                                <span class="location-icon">📍</span> ${act.name}
                            </h4>
                            <div class="photo-stars">
                                ${Array(5).fill(0).map((_, i) => 
                                    `<i class="fa-solid fa-camera ${i >= act.photo ? 'inactive' : ''}"></i>`
                                ).join('')}
                            </div>
                        </div>
                        ${act.mapLink ? `
                            <a href="${act.mapLink}" target="_blank" rel="noopener noreferrer" class="map-link-btn">
                                <i class="fa-solid fa-location-dot"></i>
                            </a>
                        ` : ''}
                    </div>
                    <p class="activity-desc">${act.desc}</p>
                    <div class="tip-card">
                        <div class="tip-badge">게으름 꿀팁</div>
                        <p class="tip-text">${act.tip}</p>
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    });
    
    html += `
        <div class="result-footer">
            <button class="btn-primary btn-large" onclick="showHome()">다른 여행 찾기 (아직 부족함)</button>
        </div>
    `;
    
    card.innerHTML = html;
    
    // 지도 컨테이너가 있으면 표시
    const mapContainer = document.getElementById('map-container');
    if (mapContainer) {
        mapContainer.style.display = 'block';
    }
}

// 게으름 지수 정보
function getLazinessInfo(score) {
    if (score >= 90) return { label: '침대 합일 수준', colorClass: 'laziness-indigo', emoji: '💤' };
    if (score >= 70) return { label: '진정한 귀차니스트', colorClass: 'laziness-orange', emoji: '🛋️' };
    if (score >= 40) return { label: '적당한 게으름', colorClass: 'laziness-yellow', emoji: '🚶' };
    return { label: '거의 극기훈련', colorClass: 'laziness-red', emoji: '🏃' };
}

// 여행 저장
function saveTravel() {
    if (!state.currentResult) return;
    
    if (state.savedTravels.some(t => t.title === state.currentResult.title)) {
        alert('이미 저장된 코스입니다.');
        return;
    }
    
    const newSave = {
        id: Date.now().toString(),
        title: state.currentResult.title,
        data: state.currentResult,
        savedAt: new Date().toLocaleDateString('ko-KR'),
        region: state.formData.region,
        difficulty: state.currentResult.difficulty,
        transport: state.formData.transport,
        duration: state.formData.duration,
        budget: state.formData.budget
    };
    
    state.savedTravels.unshift(newSave);
    saveSavedTravels();
    alert('저장되었습니다!');
}

// 저장된 여행 목록 렌더링
function renderSavedTravels() {
    const container = document.getElementById('saved-travels');
    
    if (state.savedTravels.length === 0) {
        container.innerHTML = `
            <div class="empty-saved">
                저장된 코스가 없네요.
            </div>
        `;
        return;
    }
    
    container.innerHTML = state.savedTravels.map(travel => `
        <div class="saved-item" onclick="loadSavedTravel('${travel.id}')">
            <div class="saved-item-content">
                <div class="saved-badges">
                    <span class="saved-badge saved-badge-region">${travel.region}</span>
                    <span class="saved-badge saved-badge-duration">${travel.duration}</span>
                </div>
                <h3 class="saved-title">${travel.title}</h3>
            </div>
            <button class="saved-delete" onclick="event.stopPropagation(); deleteSavedTravel('${travel.id}')">
                <i class="fa-solid fa-circle-xmark"></i>
            </button>
        </div>
    `).join('');
}

// 저장된 여행 불러오기
async function loadSavedTravel(id) {
    const travel = state.savedTravels.find(t => t.id === id);
    if (travel) {
        state.currentResult = travel.data;
        renderResult(travel.data);
        showScreen('result');
        
        // 지도 업데이트
        await updateMapWithResults(travel.data, travel.region);
    }
}

// 저장된 여행 삭제
function deleteSavedTravel(id) {
    if (confirm('삭제하시겠습니까?')) {
        state.savedTravels = state.savedTravels.filter(t => t.id !== id);
        saveSavedTravels();
        renderSavedTravels();
    }
}

// 초기 옵션 설정
document.addEventListener('DOMContentLoaded', () => {
    // 초기 기본값 설정
    if (document.getElementById('form-screen')) {
        selectOption('duration', state.formData.duration);
        selectOption('transport', state.formData.transport);
        selectOption('budget', state.formData.budget);
        selectOption('region', state.formData.region);
        selectOption('style', state.formData.style);
        
        const foodToggle = document.getElementById('food-toggle');
        const foodText = document.getElementById('food-text');
        if (foodToggle && foodText) {
            if (state.formData.includeFood) {
                foodToggle.classList.add('active');
                foodText.textContent = '전설의 맛집 반드시 포함';
            }
        }
    }
});

