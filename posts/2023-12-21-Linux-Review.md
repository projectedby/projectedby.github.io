---
layout: 'index'
view: 'post'
permalink: '/posts/2023/12/21/Linux-Review.html'
opengraph:
    site:
        name: 'ProjectedBy/Sub'
        url: '/'
date: '2023/12/21 16:31:00'
title: 'Linux Review'
description: ""
category: 'LinuxReview'
tags: ['Linux', 'Review']
---

## 리눅스 리뷰 #3 Linux Kernel Crypto API

리눅스 커널에서 크립토 관련하여 어플리케이션에서 사용할 수 있는 API 를 제공합니다. 지원하는 암호화/복호화 알고리즘과 관련된 정보들은 

cat /proc/crypto

를 통하여 확인할 수 있습니다.

블로그 글에 따르면, AES-CTR-128 로 OpenSSL 과 커널 Crypto API 의 벤치마킹을 수행했다고 하고 그 결과가 아쉽지만, 2배 느렸다고 하네요. 커널에서 지원하는 크립토 API 를 사용하게 되면 사용자 공간의 악성 소프트웨어가 데이터를 암호 해제하거나 변경하기 어렵고, 데이터 또한 읽거나 수정할 수 없으며, 데이터 또한 노출될 위험도 감소할 수 있습니다.

아직은 OpenSSL 의 구현을 따라잡지는 못하지만, 언젠가 속도 측면에서는 OpenSSL 만큼 따라잡을 수 있다는 예상이 되네요.

https://blog.cloudflare.com/the-linux-crypto-api-for-user-applications
https://www.kernel.org/doc/html/v4.12/crypto/index.html

