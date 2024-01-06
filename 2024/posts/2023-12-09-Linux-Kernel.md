---
layout: 'index'
view: 'post'
permalink: '/posts/2023/12/09/Linux-Kernel.html'
opengraph:
    site:
        name: 'ProjectedBy/Sub'
        url: '/'
date: '2023/12/09 11:38:00'
title: 'Linux Kernel'
description: ""
category: 'Linux Kernel'
tags: ['Linux Kernel']
---

## 리눅스 커널(6.6.4) 코드 스니펫: ./net/socket.c `sock_mmap(file: struct file *, vma: struct vm_area_struct *): int`

소켓의 메모리를 메모리 맵으로 매핑하는 함수

file: 소켓 파일
vma: 메모리 맵 구조체

- 소켓의 상태를 확인
- 소켓의 메모리 크기를 계산
- 메모리 맵을 생성
- 소켓의 메모리를 메모리 맵에 매핑
- sock_mmap 함수가 성공하면, 메모리 맵 구조체의 vm_flags 필드에 다음과 같은 플래그가 설정
    - MAP_SHARED: 소켓의 메모리를 공유
    - MAP_ANONYMOUS: 소켓의 메모리를 이름 없는 메모리 맵으로 매핑
- sock_mmap 함수가 실패하면, 다음과 같은 오류가 발생
    - EINVAL: 잘못된 인수가 전달
    - ENOMEM: 메모리 부족
    - EPERM: 소켓의 소유자가 아님

소켓의 메모리를 메모리 맵으로 매핑하면, 다음과 같은 장점이 있습니다.

소켓의 상태를 빠르게 확인할 수 있습니다.
소켓의 데이터를 직접 읽고 쓸 수 있습니다.
소켓의 메모리 영역을 공유할 수 있습니다.

## 리눅스 커널(6.6.4) 코드 스니펫: ./net/socket.c:1410 `sock_mmap(file: struct file *, vma: struct vm_area_struct *): int`

소켓의 메모리를 메모리 맵으로 매핑하는 함수로, 소켓의 타입이나 프로토콜 등에 의해서 오퍼레이터들은 달라질 수 있는데, 여러 종류의 소켓의 특성에 맞는 메모리 매핑함수를 호출하는 것입니다. 공통적으로 소켓의 상태를 확인하고 소켓의 메모리 크기를 계산 한 후에 적절한 크기의 메모리 맵을 생성하고 소켓의 메모리를 메모리 맵에 매핑하는 연산을 수행하게 됩니다.

```c
// net/socket.c:1410

static int sock_mmap(struct file *file, struct vm_area_struct *vma)
{
        struct socket *sock = file->private_data;

        return READ_ONCE(sock->ops)->mmap(file, sock, vma);
}
```

READ_ONCE

위 코드는 변수 x의 값을 읽기 전에 변수 x의 읽기 잠금을 획득합니다. 그리고, 변수 x의 값을 읽은 후에는 읽기 잠금을 해제합니다. 따라서, 다른 스레드가 변수 x의 값을 변경하는 경우에도, 변수 y는 변수 x의 값을 읽을 때의 값을 유지합니다.

READ_ONCE 매크로는 다음과 같은 경우에 사용됩니다.

- 변수의 값을 읽은 후에는 변수의 값을 변경하지 않는 경우
- 변수의 값이 다른 스레드에서 변경되는 것을 방지해야 하는 경우

READ_ONCE 매크로와 유사한 기능을 하는 C 언어의 매크로로는 ATOMIC_READ가 있습니다. ATOMIC_READ 매크로는 변수의 값을 읽을 때 원자성을 보장합니다. 즉, 변수의 값을 읽는 동안 다른 스레드가 변수의 값을 변경할 수 없습니다.
