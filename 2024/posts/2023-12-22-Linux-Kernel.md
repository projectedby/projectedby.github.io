---
layout: 'index'
view: 'post'
permalink: '/posts/2023/12/22/Linux-Kernel.html'
opengraph:
    site:
        name: 'ProjectedBy/Sub'
        url: '/'
date: '2023/12/22 09:18:00'
title: 'Linux Kernel'
description: ""
category: 'Linux Kernel'
tags: ['Linux Kernel']
---

## 리눅스 커널 코드 스니펫 #17 6.6.4 net/socket.c:227 net_families: struct net_proto_family *[NPROTO]

RCU, READ MOSTLY

네트워크 프로토콜 패밀리의 생성자를 관리하는 구조체 배열인 net_families 의 선언입니다. __rcu(Read-Copy Update) 매크로로 선언되어 있어서 읽기 수행 시에 잠금없이 사용할 수 있음을 알 수 있고, __read_mostly 로 말 그대로 읽는 작업이 주로 일어나는 변수임을 알 수 있습니다. __rcu 로 정의된 것 처럼 읽기 시에는 잠금이 일어나지 않지만, 업데이트 수행 시에는 잠금을 통해서 멀티프로세스 환경에서 일관성을 유지해야 하기에 net_family_lock 스핀락을 사용합니다. 스핀락은 잠금 시간이 짧은 경우 컨텍스트 스위칭을 일으키지 않고 잠금을 수행할 수 있기에 net_proto_family 구조체의 간단한 업데이트의 경우 뮤텍스보다 더 효율적일 수 있을 것입니다.

```c
// net/socket.c:227

/*
 *      The protocol list. Each protocol is registered in here.
 */

static DEFINE_SPINLOCK(net_family_lock);
static const struct net_proto_family __rcu *net_families[NPROTO] __read_mostly;

// ./include/linux/net.h:231
struct net_proto_family {
        int             family;
        int             (*create)(struct net *net, struct socket *sock,
                                  int protocol, int kern);
        struct module   *owner;
};
```





코드 설명:

1. DEFINE_SPINLOCK(net_family_lock);

SPINLOCK: 스핀락(spinlock)을 선언하는 매크로입니다. 스핀락은 다중 프로세서 환경에서 공유 데이터를 보호하는 데 사용되는 동기화 메커니즘입니다.
net_family_lock: 스핀락의 이름입니다. 이 스핀락은 net_families 배열에 대한 접근을 보호하기 위해 사용됩니다.
2. static const struct net_proto_family __rcu *net_families[NPROTO] __read_mostly;

net_families: net_proto_family 구조체를 가리키는 포인터 배열입니다.
NPROTO: 배열의 크기를 나타내는 상수입니다.
__rcu: 읽기 전용 RCU(Read-Copy Update) 접근 방식을 지정하는 매크로입니다. 이는 해당 데이터가 동시에 읽기만 가능하다는 것을 의미합니다.
__read_mostly: 데이터가 대부분 읽기 작업에 사용될 것임을 나타내는 매크로입니다. 이는 컴파일러에게 최적화 시 읽기 접근에 유리한 전략을 선택하도록 유도합니다.
구조체의 역할:

net_family_lock: 여러 프로세스가 동시에 net_families 배열에 접근하는 것을 방지하여 데이터 손상을 막습니다.
net_families: 네트워크 프로토콜 패밀리를 관리하는 데 사용됩니다. 각 프로토콜 패밀리는 net_proto_family 구조체로 표현됩니다.
__rcu 및 __read_mostly 매크로는 성능 최적화에 도움이 됩니다.
추가 정보:

SPINLOCK: 스핀락은 짧은 시간 동안의 동기화에 적합합니다. 오래 걸리는 작업의 경우 mutex와 같은 다른 동기화 메커니즘을 사용하는 것이 좋습니다.
RCU: RCU는 읽기 작업이 잦은 대규모 데이터 구조의 동기화에서 효율적인 기법입니다.
__read_mostly: 이 매크로는 컴파일러에게 데이터를 캐시에 저장하는 등, 읽기 작업에 최적화된 전략을 선택하도록 유도합니다.