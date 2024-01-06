---
layout: 'index'
view: 'post'
permalink: '/posts/2023/12/11/Linux-Kernel.html'
opengraph:
    site:
        name: 'ProjectedBy/Sub'
        url: '/'
date: '2023/12/11 10:20:00'
title: 'Linux Kernel'
description: ""
category: 'Linux Kernel'
tags: ['Linux Kernel']
---

## 리눅스 커널 코드 스니펫(6.6.4) net/socket.c: `sock_poll(file: struct file *, wait: poll_table *): __poll_t`

소켓의 읽기, 쓰기, 예외 등의 이벤트가 발생했는지 확인하는 함수입니다. 파일 구조체의 `private_data` 필드에는 소켓이 저장되어 있어서 이 정보를 바탕으로 소켓을 위한 오퍼레이터들의 정보(`sock->ops`)를 확인할 수 있고, 이 함수는 그 오퍼레이터 중에 `poll`을 호출하고 그 리턴 값을 다시 리턴하게 됩니다. 두번째 파라미터인 `wait: poll_table` 에서 요청된 이벤트 정보를 `events` 변수에 대입하여 초기화 작업을 마칩니다. 만약에 오퍼레이터 중에 `poll` 함수가 존재하지 않으면 0을 리턴합니다. 만약에 busy loop 를 사용할 수 있고, 요청된 이벤트에 `POLL_BUSY_LOOP`가 설정되어 있다면, `sk_busy_loop(...)` 함수를 수행하여 빠르게 소켓의 데이터가 준비되어 있는지 확인하게 됩니다. 이렇게 busy loop 를 사용하게 되면, 소켓의 데이터가 존재하는 경우 빠르게 데이터를 반환할 수 있습니다. 다만, 전력 사용량이 늘어나는 것으로 알려져 있습니다. busy loop 수행 후에 데이터가 존재하지 않는다면, poll 은 소켓에 이벤트가 발생할 때까지 기다리게 됩니다.

```c
// net/socket.c:1389

/* No kernel lock held - perfect */
static __poll_t sock_poll(struct file *file, poll_table *wait)
{
        struct socket *sock = file->private_data;
        const struct proto_ops *ops = READ_ONCE(sock->ops);
        __poll_t events = poll_requested_events(wait), flag = 0;

        if (!ops->poll)
                return 0;

        if (sk_can_busy_loop(sock->sk)) {
                /* poll once if requested by the syscall */
            if (events & POLL_BUSY_LOOP)
                            sk_busy_loop(sock->sk, 1);

                /* if this socket can poll_ll, tell the system call */
                flag = POLL_BUSY_LOOP;
        }

        return ops->poll(file, sock, wait) | flag;
}
```