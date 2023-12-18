---
layout: 'index'
view: 'post'
permalink: '/posts/2023/12/18/Linux-Review.html'
opengraph:
    site:
        name: 'ProjectedBy/Sub'
        url: '/'
date: '2023/12/18 12:52:00'
title: 'Linux Review'
description: ""
category: 'LinuxReview'
tags: ['Linux', 'Review']
---

## What remains to be done for proxy execution

[What remains to be done for proxy execution](https://lwn.net/Articles/953438/)
<date>December 4, 2023</date>
<author>
    Jonathan Corbet
</author>
<url>
    https://lwn.net/Articles/953438/
</url>

How to reduce complexity in Proxy Execution

리눅스 리뷰 #1 - Foreground/Background Task 간에 우션순위 부여에 프록시 실행을 도입하려는 논의

Foreground/Background Task 간에 우션순위 부여는 중요한 작업이 Background Task 에 의해 중단되지 않도록 하면서, 리소스 사용을 효율적으로 관리하여 중요한 작업이 더 많은 리소스를 사용하도록 하면서, Background Task 의 성능을 저하시키지 않도록 하는 작업입니다. RealTime 우선순위를 가진 프로세스가 우선 순위가 낮은 프로세스에 리소스를 요청하여 우선 순위 역전이 일어나 작업이 중단될 수 있는데, 이럴 경우를 위해서 고전적으로 낮은 우선 순위의 프로세스를 일시적으로 우선 순위를 높히는 우선 순위 상속이란 방법을 사용했습니다. 이 방법은 다른 프로세스의 우선 순위를 일시적으로 높히는 것으로 원래 프로세스의 성능 저하를 가지고 올 수 있고 구현이 복잡합니다. 특히 안드로이드 앱은 일반적으로 Real Time Priority 를 안정적으로 사용할 수 없고, 우선순위 역적인 많이 일어나며, SCHED_OTHER 는 우선순위 상속을 사용할 수 없습니다.

이런 이유로 Proxy Execution 이란 방법을 도입하려는 논의가 이루어지고 있습니다.

프록시 실행의 핵심 아이디어는 리소스를 기다리는 작업과 해당 리소스를 소유하는 작업 간의 "차단된" 관계를 추적하는 것입니다.

현재 커널에서는 리소스를 기다리는 작업이 실행 대기열에서 제거되지만 대신 프록시 실행을 사용하면 여전히 실행 가능한 것처럼 대기열에 남아 있게 됩니다. 스케줄러가 실제로 차단된 작업을 실행하도록 선택하면 차단된 링크를 따라 대신 리소스 소유자를 실행합니다. 실제로 대기 작업은 필요한 리소스를 확보한다는 목표를 위해 주어진 런타임의 일부를 사용하게 됩니다.

프록시 실행 아이디어는 간단하지만 구현은 복잡합니다.

1. 리소스를 보유한 프로세스가 두번째 리소스에서 차단될 수 있고, 이런 경우 스케줄러는 실제로 실행될 수 있는 작업에 도달하기 위해 적당한 길이로 제한된 링크 체인이어야 할 수도 있습니다.
2. 스케줄러가 이러한 링크가 가리키는 작업을 실행하려면 차단된 작업을 보유자가 실제로 실행 중인 CPU로 마이그레이션해야 합니다.
3. 차단된 체인 끝에 있는 리소스 보유자가 다른 이유로 현재 절전 모드(실행할 수 없음)에 있을 수 있습니다.

일단 벤치마킹의 결과 바닐라 커널에서는 fs 잠금의 우선순위 반전에 의한 값들이 존재하지만, Proxy Execution 을 적용한 커널에서는 그래프에서 보듯이 존재하지 않음을 알 수 있습니다.

Proxy Execution 에 어떻게 리눅스에 도입될지 궁금해집니다. 😀 





그 아이디어는 간단하지만 구현은 복잡한 것으로 드러났습니다. 리소스를 보유한 작업은 두 번째 리소스에서 차단될 수 있으므로 스케줄러는 실제로 실행될 수 있는 작업에 도달하기 위해 임의 길이의 차단된 링크 체인을 따라야 할 수 있습니다. 차단된 링크는 CPU를 통과할 수 있습니다. 스케줄러가 이러한 링크가 가리키는 작업을 실행하려면 차단된 작업을 보유자가 실제로 실행 중인 CPU로 마이그레이션해야 합니다. 차단된 체인 끝에 있는 리소스 보유자가 다른 이유로 현재 절전 모드(실행할 수 없음)에 있을 수 있습니다. 즉, 해당 작업이 다시 실행될 때까지 진행할 수 없습니다. 이 경우 원래 차단된 작업은 리소스를 보유하고 있는 휴면 작업에 추가되어 두 작업을 함께 깨울 수 있습니다. 다른 과제도 있습니다.

- 리소스를 보유한 작업은 두 번째 리소스에서 차단될 수 있으므로 스케줄러는 실제로 실행될 수 있는 작업에 도달하기 위해 임의 길이의 차단된 링크 체인을 따라야 할 수 있음
- 차단된 링크는 CPU를 통과할 수 있음
- 스케줄러가 이러한 링크가 가리키는 작업을 실행하려면 차단된 작업을 보유자가 실제로 실행 중인 CPU로 마이그레이션해야 함
- 해당 작업이 다시 실행될 때까지 진행할 수 없음 - 이 경우 원래 차단된 작업은 리소스를 보유하고 있는 휴면 작업에 추가되어 두 작업을 함께 깨울 수 있음

- 그럼에도 불구하고 프록시 실행은 실질적인 가능성을 보여줌 - 프록시 실행은 안드로이드 사용 사례에서 "매우 매력적"





- 소유자에 대한 뮤텍스 대기자의 차단됨 관계 추적
- 실행 대기열에서 뮤텍스 차단 작업을 유지하세요!
- 스케줄러를 블랙박스처럼 취급합니다. 실행할 가장 중요한 작업을 선택합니다.
- 실행하기 위해 뮤텍스 차단 작업을 선택하면, Blocked_on 체인을 따라 차단되지 않은 소유자를 실행합니다.






다른 프로세스의 우선 순위를 일시적으로 높임으로써, 해당 프로세스의 성능이 저하될 수 있습니다.
우선순위 상속을 구현하기 위해서는 운영 체제에 추가적인 기능이 필요합니다.

 우선순위 역적이 일어나면 




- 프록시 실행을 위해 남은 작업

- LPC커널의 데드라인 스케줄링 클래스는 여러 실시간(또는 일반적으로 대기 시간에 민감한) 문제에 대한 솔루션을 제공

- 우선순위 반전 문제에 대한 일반적인 솔루션에도 저항

Android는 시도하는 동안 많은 우선순위 반전 문제에 직면했으며 이러한 문제에 대한 고전적인 솔루션(우선순위 상속)은 Linux의 마감 기한이나 비실시간 작업에는 작동하지 않았음 - Android 시스템은 사용자가 현재 실제로 관심을 갖는 포그라운드 작업에 대해 일관되지 않은 동작을 생성하지 않고는 유용한 방식으로 백그라운드 작업 활동을 제한할 수 없음

<!-- 스케쥴링에서 우선 순위 반전 문제 란 -->

- 우선순위 역전은 우선순위가 낮은 작업이 우선순위가 높은 작업에 필요한 리소스를 보유할 때 발생
- 우선 순위가 낮은 작업이 실행할 CPU 시간을 확보할 수 없는 경우 해당 리소스를 오랫동안 보유하여 우선 순위가 높은 작업이 실행되지 않을 수 있음
- 해결 방법은 일반적으로 대기 중인 작업이 필요한 리소스를 보유하고 있는 작업에 우선순위를 부여하여 보유 작업이 리소스를 실행하고 해제할 수 있도록 하는 것
- 하지만 Linux에서는 마감일 작업에는 우선순위가 없으므로 다른 접근 방식이 필요

- 프록시 실행의 핵심 아이디어는 리소스를 기다리는 작업과 해당 리소스를 소유하는 작업 간의 "차단된" 관계를 추적하는 것
    - 현재 커널에서는 리소스를 기다리는 작업이 실행 대기열에서 제거
    - 대신 프록시 실행을 사용하면 여전히 실행 가능한 것처럼 대기열에 남아 있게 됨
    - 스케줄러가 실제로 차단된 작업을 실행하도록 선택하면 차단된 링크를 따라 대신 리소스 소유자를 실행
    - 실제로 대기 작업은 필요한 리소스를 확보한다는 목표를 위해 주어진 런타임의 일부를 기부함

- 그 아이디어는 간단하지만 구현은 복잡
- 리소스를 보유한 작업은 두 번째 리소스에서 차단될 수 있으므로 스케줄러는 실제로 실행될 수 있는 작업에 도달하기 위해 임의 길이의 차단된 링크 체인을 따라야 할 수 있음
- 차단된 링크는 CPU를 통과할 수 있음
- 스케줄러가 이러한 링크가 가리키는 작업을 실행하려면 차단된 작업을 보유자가 실제로 실행 중인 CPU로 마이그레이션해야 함
- 해당 작업이 다시 실행될 때까지 진행할 수 없음 - 이 경우 원래 차단된 작업은 리소스를 보유하고 있는 휴면 작업에 추가되어 두 작업을 함께 깨울 수 있음

- 그럼에도 불구하고 프록시 실행은 실질적인 가능성을 보여줌 - 프록시 실행은 안드로이드 사용 사례에서 "매우 매력적"

- 그 의도는 대기 중인(우선 순위가 높은) 작업을 소유 작업에 추가하여 함께 깨어날 수 있도록 하는 것이지만 이는 복잡함
- 리소스 보유자에게 실행 시간을 제공하기 위해 작업을 마이그레이션한 경우 차단 문제가 해결되면 다시 마이그레이션해야 하지만 속도가 느리고 잠금 문제가 발생

Foreground/Background Tasks 간의 우선 순위 부여는 사용자가 실행하는 작업의 중요성을 결정하는 프로세스입니다.



Foreground/Background Tasks 간의 우선 순위 부여는 사용자가 실행하는 작업의 중요성을 결정하는 프로세스입니다. 이 프로세스는 일반적으로 운영 체제(OS)에서 수행되며, 작업의 우선 순위를 결정하여 중요한 작업이 더 많은 리소스를 사용할 수 있도록 합니다.

Foreground Tasks는 사용자가 직접 실행하는 작업으로, 일반적으로 사용자의 입력에 응답하거나 사용자 인터페이스를 제공하는 작업입니다. Background Tasks는 사용자가 직접 실행하지 않는 작업으로, 일반적으로 데이터를 전송하거나 백그라운드에서 실행되는 프로세스를 지원하는 작업입니다.

Foreground/Background Tasks 간의 우선 순위 부여는 다음과 같은 이유로 중요합니다.

중요한 작업이 실행을 완료할 수 있도록 합니다. 사용자가 실행하는 중요한 작업이 Background Tasks에 의해 중단되지 않도록 합니다.
리소스 사용을 효율적으로 관리합니다. 중요한 작업이 더 많은 리소스를 사용할 수 있도록 하여, Background Tasks의 성능을 저하시키지 않습니다.
Foreground/Background Tasks 간의 우선 순위 부여는 다음과 같은 방법으로 수행될 수 있습니다.

프로세스의 유형에 따라 우선 순위를 지정합니다. 일반적으로 Foreground Tasks는 Background Tasks보다 높은 우선 순위를 받습니다.
작업의 중요성에 따라 우선 순위를 지정합니다. 사용자가 현재 실행 중인 작업이 다른 작업보다 더 중요하다고 판단되면, 해당 작업의 우선 순위를 높일 수 있습니다.
작업의 CPU 사용량에 따라 우선 순위를 지정합니다. CPU 사용량이 많은 작업은 CPU 사용량이 적은 작업보다 낮은 우선 순위를 받을 수 있습니다.
Foreground/Background Tasks 간의 우선 순위 부여는 운영 체제의 성능과 효율성을 향상시키는 데 중요한 역할을 합니다.

Classic solutions: RealTime Priority -> Priority Inversion -> Priority Inheritance

우선순위 상속은 우선순위가 높은 프로세스가 다른 프로세스의 리소스를 요청하거나 락을 획득할 때, 해당 프로세스의 우선 순위를 일시적으로 높여 우선순위 역전이 발생하지 않도록 하는 방법입니다.

단점:

다른 프로세스의 우선 순위를 일시적으로 높임으로써, 해당 프로세스의 성능이 저하될 수 있습니다.
우선순위 상속을 구현하기 위해서는 운영 체제에 추가적인 기능이 필요합니다.