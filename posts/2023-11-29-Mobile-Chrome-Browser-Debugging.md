---
layout: 'index'
view: 'post'
permalink: '/posts/2023/11/29/Programming-Tip.html'
opengraph:
    site:
        name: 'ProjectedBy/Sub'
        url: '/'
date: '2023/11/29 14:05:00'
title: '2023년 11월 29일 / 프로그래밍 팁'
description: ""
category: 'ProgrammingTip'
tags: ['Programming', 'Tip']
---

## 안드로이드 기기에서 크롬을 이용하여 모바일 웹 디버깅 환경 구축

크롬의 개발 툴을 이용하여 모바일 웹을 디버깅할 수 있음

1. 안드로이드 기기의 개발자 모드 활성화
2. 안드로이드 기기를 개발용 컴퓨터에 케이블로 연결
3. 크롬 실행 후 `chrome://inspect` 옵션에서 개발자 도구에서 디버깅 설정

- 로컬호스트 환경을 포트포워딩을 통해서 연결

## 웹으로 공유하기 구현

[Navigator: share() method](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share)

> 일부 또는 모든 지원 브라우저의 보안 컨텍스트(HTTPS)에서만 사용할 수 있음

Web Share API의 `navigator.share()` 메서드를 통하여 장치의 기본 공유 메커니즘을 호출하여 텍스트, URL 또는 파일과 같은 데이터를 공유 가능

파일 공유가 성공하면 항상 `navigator.canShare()`로 테스트해야 함

이 기능을 사용하려면 현재 문서에 웹 공유 권한 정책과 임시 활성화가 있어야 함

버튼 클릭과 같은 UI 이벤트로 트리거되어야 하며 스크립트에 의해 임의의 지점에서 시작할 수 없음

메서드는 기본 구현에서 공유를 지원하는 유효한 데이터를 지정해야 함

### 문법

```js
navigator.share(data)
```

### 파라미터

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| data      | `{ url, text, title, files }` | 공유할 데이터가 포함된 개체 |

공유 데이터는 사용자 에이전트가 이해하는 속성에 대해서만 평가
모든 속성은 선택 사항이지만 알려진 데이터 속성을 하나 이상 지정해야 함

- url
- text
- title
- files

### 리턴

```js
Promise<undefined>
```

| Exception | Description |
| --------- | ----------- |
| InvalidStateError | 문서가 완전하지 활성화되지 않았거나 다른 공유 작업이 진행 중 |
| NotAllowedError | 웹 공유 권한 정책이 차단되었거나, 일시적으로 활성화되지 않았거나, 보안 문제로 인해 파일 공유가 차단 |
| TypeError | 공유데이터를 확인할 수 없음(URL 형식이 잘못됨, 파일이 지정되었지만 파일 공유를 지원하지 않음, 사용자 에이전트에 의해 "적대적인 공유"로 간주) |
| AbortError | 사용자가 공유 작업을 취소했거나 사용 가능한 공유 대상이 없음 |
| DataError | 공유 대상을 시작하거나 데이터를 전송하는 데 문제가 발생 |

### 예제

```sh
button.addEventListener("click", async () => {
    try {
        await navigator.share({
            title: "ProjectedBy/ProgramingTip",
            text: "2023년 11월 29일 프로그래밍 팁",
            url: "https://projectedby.github.io/posts/2023/11/29/Programming-Tip.html"
        });
    } catch(e) {
        console.log(e);
    }
});
```
