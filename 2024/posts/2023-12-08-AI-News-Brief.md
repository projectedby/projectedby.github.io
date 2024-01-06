---
layout: 'index'
view: 'post'
permalink: '/posts/2023/12/08/AI-News-Brief.html'
opengraph:
    site:
        name: 'ProjectedBy/Sub'
        url: '/'
date: '2023/12/08 12:17:00'
title: '2023년 12월 08일 AI News Brief'
description: ""
category: 'ArtificialIntelligenceNews'
tags: ['Artificial Intelligence', 'News']
---

## Bard, Gemini Pro를 Bard에 도입

[Experiment updates](https://bard.google.com/updates)
<date>2023.12.06</date>
<author>...</author>
<url>https://bard.google.com/updates</url>

이해와 요약, 추론, 코딩 및 계획과 같은 작업을 훨씬 더 효과적으로 수행할 수 있도록 Bard의 Gemini Pro를 특별히 조정

스트 기반 프롬프트를 위해 Gemini Pro와 함께 Bard를 사용해 볼 수 있으며 다른 양식도 곧 지원될 예정

처음에는 170개 이상의 국가 및 지역에서 영어로 제공될 예정

가까운 시일 내에 유럽을 비롯한 더 많은 언어와 장소에 제공될 예정

## 리퀴드 AI의 '액체 신경망'

[500억 투자 받은 리퀴드 AI의 '액체 신경망'이란](https://www.aitimes.com/news/articleView.html?idxno=155740)
<date>2023.12.07 18:13</date>
<author>박찬 기자</author>
<url>https://www.aitimes.com/news/articleView.html?idxno=155740</url>

'액체 신경망(LNN, Liquid Neural Network)'을 기반으로 하는 인공지능(AI) 모델 스타트업 리퀴드 AI가 3700만달러(약 500억원) 규모의 투자를 유치

테크크런치는 6일(현지시간) 미국 스타트업 리퀴드 AI가 LNN이라는 새 유형의 AI 모델 구축으로 3억300만달러(약 4000억원)의 기업 가치로 3700만달러의 시드 라운드 펀딩을 마감했다고 보도

적은 전력을 사용해 기존 모델보다 안정적으로 작업을 수행할 수 있는 새 유형의 AI 아키텍처인 LNN 상용화를 목표

    - AI 모델은 인공 뉴런이라는 비교적 간단한 코드 조각으로 구성
    - 이러한 코드 조각은 실행 중인 AI 모델에 할당된 작업의 작은 부분을 수행
    - 개별 뉴런의 동작은 신경망의 작업에 따라 달라지는 방정식 또는 방정식 세트에 의해 결정

리퀴드 AI가 개발하는 LNN은 뉴런의 동작을 결정하는 방정식을 고정하지 않고 '액체처럼' 변경할 수 있음

특히 뉴런 간의 상호 작용 방식도 변경가능

신경망의 자체 아키텍처 수정 기능은 LNN을 기존 AI 모델보다 적응력이 더 뛰어나게 만듦

기존의 딥러닝 신경망 모델들이 방대한 데이터에서 정답을 찾는 훈련하는 것과 달리, LNN은 실시간으로 변화하는 데이터를 보고 적응하는 방법을 학습한 다음 데이터를 순차적으로 처리하고 과거 입력의 메모리를 유지하고 새로운 입력에 따라 동작을 조정

기존 AI 모델은 훈련 단계 후에 고정되므로 수신하는 데이터 흐름의 변화에 적응하지 못함

NN은 예상 밖이거나 잡음이 심한 데이터에 탄력적으로 대응할 수 있음

LNN은 훈련 단계뿐만 아니라 추론 과정에서도 학습을 계속하는 인공신경망 - 유연하게 모습을 바꾼다는 의미에서 ‘액체 신경망’이라는 이름이 붙여짐, 새로운 데이터 입력에 지속 적응하도록 기본 방정식의 매개변수를 변경하는 게 특징

LNN 아키텍처는 연속 또는 시계열 데이터를 효과적으로 처리할 수 있다는 것이 특징

LNN은 기존 AI 모델보다 훨씬 적은 수의 뉴런으로 구현될 수 있으며 데이터 처리 방법을 결정하는 구성 설정과 매개변수도 더 적음 - 이를 통해 이를 실행하는 데 필요한 인프라의 양이 크게 줄어듦

실제로 LNN은 수백만개 매개변수를 학습해 자율주행 등 복잡한 작업에 쓰이는 기존 AI 모델보다 훨씬 적은 7만5000개 매개변수로도 완벽히 적응할 수 있다고 소개

## 애플, 전용칩에서 '온디바이스 AI' 구축하는 프레임워크 공개

[애플, 전용칩에서 '온디바이스 AI' 구축하는 프레임워크 공개](https://www.aitimes.com/news/articleView.html?idxno=155730)
<date>2023.12.07 18:00</date>
<author>임대준 기자</author>
<url>https://www.aitimes.com/news/articleView.html?idxno=155730</url>

맥북에 도입한 전용 칩에서 '온디바이스 AI'가 가능하도록 설계한 프레임워크와 라이브러리를 공개

애플이 전용 칩 '애플 실리콘'에서 실행할 수 있는 모델 구축용 프레임워크 'MLX'와 딥러닝 모델라이브러리 'MLX 데이터'를 선보였다고 보도 - 개발자는 이 도구들을 활용, 생성 AI 애플리케이션을 구축해 맥북에 도입할 수 있음

애플은 MLX는 파이토치나 Jax, 어레이파일(ArrayFire)와 같은 프레임워크에서 영감 - 프레임워크와 MLX의 차이점은 통합 메모리 모델이라는 점

MLX는 데이터 복사를 수행하지 않고도 지원되는 모든 장치 유형에서 MLX 어레이 작업을 수행할 수 있음

현재 지원되는 장치 유형은 CPU와 GPU

## 삼성 프레스 콘퍼런스

[\[CES 2024\] “모두를 위한 AI: 일상 속 똑똑한 초연결 경험” 삼성 프레스 콘퍼런스 초대장](https://news.samsung.com/kr/ces-2024-%EB%AA%A8%EB%91%90%EB%A5%BC-%EC%9C%84%ED%95%9C-ai-%EC%9D%BC%EC%83%81-%EC%86%8D-%EB%98%91%EB%98%91%ED%95%9C-%EC%B4%88%EC%97%B0%EA%B2%B0-%EA%B2%BD%ED%97%98-%EC%82%BC%EC%84%B1-%ED%94%84)
<date>2023/12/07</date>
<author></author>
<url>https://news.samsung.com/kr/ces-2024-%EB%AA%A8%EB%91%90%EB%A5%BC-%EC%9C%84%ED%95%9C-ai-%EC%9D%BC%EC%83%81-%EC%86%8D-%EB%98%91%EB%98%91%ED%95%9C-%EC%B4%88%EC%97%B0%EA%B2%B0-%EA%B2%BD%ED%97%98-%EC%82%BC%EC%84%B1-%ED%94%84</url>

삼성전자는 세계 최대 정보기술(IT) 가전 전시회 ‘CES 2024’ 개막 하루 전인 내년 1월 8일 오후 2시(미국 라스베이거스 현지시간, 한국시간 1월 9일 오전 7시)에 프레스 콘퍼런스를 개최한다고 발표

‘AI for All: Connectivity in the Age of AI(모두를 위한 AI: 일상 속 똑똑한 초연결 경험)’라는 주제

삼성전자의 AI 전략이 공개될 예정
