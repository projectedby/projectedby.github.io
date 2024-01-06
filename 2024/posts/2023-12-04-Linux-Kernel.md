---
layout: 'index'
view: 'post'
permalink: '/posts/2023/12/04/Linux-Kernel.html'
opengraph:
    site:
        name: 'ProjectedBy/Sub'
        url: '/'
date: '2023/12/04 15:31:00'
title: 'Linux Kernel'
description: ""
category: 'Linux Kernel'
tags: ['Linux Kernel']
---

## ...

<!-- BSD 소켓에 대한 자료 조사 -->

```c
#ifdef CONFIG_NET_RX_BUSY_POLL
unsigned int sysctl_net_busy_read __read_mostly;
unsigned int sysctl_net_busy_poll __read_mostly;
#endif
```

커널 컴파일 시에 `CONFIG_NET_RX_BUSY_POLL`를 설정하면 `busy read` 와 `busy poll` 타임 아웃 값(unisecond)을 설정할 수 있습니다. (설정시에 전력 소모가 증가할 수 있습니다.)

[Documentation for /proc/sys/net/*](https://www.kernel.org/doc/Documentation/sysctl/net.txt)

1. net.core.busy_read

    - 소켓 읽기 수행 시에 Low latency busy poll 타임 아웃
    - `CONFIG_NET_RX_BUSY_POLL` 설정 필요
    - 디바이스 큐에서 패킷을 기다리는 busy loop 를 위한 유니초 단위의 값
    - `SO_BUSY_POLL` 소켓 옵션을 통하여 개별적으로 설정이 가능하고, `sysctl`을 통하여 모든 소켓에 적용 가능
    - 권장 값은 50이고, 기본 값은 0(끄기)
    - 전력 사용량을 증가시킬 수 있음

2. net.core.busy_poll

    - `poll`과 `select`를 위한 Low latency busy poll 타임 아웃
    - `CONFIG_NET_RX_BUSY_POLL` 설정 필요
    - 이벤트를 기다리는 busy loop 를 위한 유니초 단위 값
    - 권장 값은 소켓의 숫자에 따라서 다르고, 적은 수의 소켓은 50, 수백의 소켓의 경우 100, 상황에 따라 달라질 수 있음
    - `SO_BUSY_POLL` 소켓 옵션을 통하여 개별적으로 설정이 가능하고, `sysctl`을 통하여 모든 소켓에 적용 가능
    - 전력 사용량을 증가시킬 수 있음
    - 기본 값은 0(끄기)

3. `__read_mostly`

    `__read_mostly` 매크로는 '이 데이터는 자주 수정되지 않고 대부분 읽기 연산만 이루어짐'을 나타내고, 컴파일 과정에서 이 매크로가 선언된 데이터들은 바이너리의 특정한 부분(보통은 '.data.read_mostly' 섹션)에 정의되어, 코어들이 이러한 데이터들을 캐시하게 됩니다.

    읽기 위주의 데이터들만 동일 Cacheline 에 위치시켜서 SMP 내에서 빈번히 발생할 수 있는 Cacheline Bouncing 문제를 방지하기 위함

