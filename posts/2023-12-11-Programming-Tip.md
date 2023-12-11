---
layout: 'index'
view: 'post'
permalink: '/posts/2023/12/11/Programming-Tip.html'
opengraph:
    site:
        name: 'ProjectedBy/Sub'
        url: '/'
date: '2023/12/11 11:01:00'
title: 'Programming Tip'
description: ""
category: 'ProgrammingTip'
tags: ['Programming', 'Tip']
---

## Git - blame

`git blame [파일 경로]` 명령어를 사용하면 누가 수정했는지 어떤 커밋으로 수정되었는지 확인 가능

`git blame` 명령에서 `-s` 옵션을 사용하면 author name 과 timestamp 는 출력되지 않음

`git blame -L [start]:[end] [파일 경로]` 를 통하여 특정 라인에 대한 수정 사항을 확인할 수 있음

`git show [커밋 아이디]` 명령어를 사용하여 수정 사항 확인

## JDK 이해

[자바 개발의 시작과 끝, JDK의 이해](https://www.itworld.co.kr/news/317048)

자바 개발 키트(JDK)는 JVM(자바 가상 머신), JRE(자바 런타임 환경)와 함께 자바 프로그래밍에 사용되는 3가지 핵심 기술 중 하나

JVM은 실행 중인 프로그램을 호스팅하는 런타임

- JRE는 자바의 온디스크 부분으로, JVM을 만들어 프로그램을 로드
- JDK는 JVM과 JRE에서 실행 가능한 자바 프로그램을 작성하는 데 필요한 툴을 제공
- JDK는 자바 기반 소프트웨어를 개발하기 위한 툴 패키지, JRE는 자바 코드를 실행하기 위한 툴 패키지

JDK의 기술적인 정의와 일상적인 정의

- 기술적 정의 : JDK는 컴파일러와 표준 클래스 라이브러리를 포함하는 자바 플랫폼 사양의 구현
- 일상적인 정의 : JDK는 자바 기반 애플리케이션을 만들기 위해 다운로드하는 소프트웨어 패키지

## 페북 메신저 암호화

[페북 ‘메신저’ 주고받는 글 모두 암호화…당사자 외 메타도 해독 못](https://www.blockmedia.co.kr/archives/423655)
<date>2023년 12월 08일 오후 4:37</date>
<author>
    블록미디어
</author>
<url>https://www.blockmedia.co.kr/archives/423655</url>

미국의 SNS 운영사 ‘메타(Meta)’가 페이스북 메신저에 종단 간 암호화(End-to-End Encryption) 기술을 도입
