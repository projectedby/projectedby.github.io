---
layout: 'index'
view: 'post'
permalink: '/posts/2023/12/15/Linux-Kernel.html'
opengraph:
    site:
        name: 'ProjectedBy/Sub'
        url: '/'
date: '2023/12/15 10:14:00'
title: 'Linux Kernel'
description: ""
category: 'Linux Kernel'
tags: ['Linux Kernel']
---

## 리눅스 커널 코드 스니펫 (6.6.4) net/socket.c:1434 `sock_fasync(fd: int, filp: struct file *, on: int): int`

소켓에 대한 비동기 이벤트 알림을 설정하거나 해제하는 함수입니다. `on: int` 가 1이면 이벤트 알림을 설정하고, `on: int` 가 0이면 이벤트 알림을 해제하는데, 이벤트 알림을 사용하면 커널은 소켓에 대한 이벤트를 처리하기 위한 루프를 수행할 필요가 없고 이벤트가 발생할 때 알림을 받을 수 있기 때문에 효율적으로 소켓을 관리할 수 있습니다. 알림을 설정하는 함수는 `fasync_helper(...)` 으로 알림이 설정되면, socket wait queue 의 리스트에 큐에 대한 참조가 설정되고, 커널 소켓 플래그에 `SOCK_FASYNC`가 설정되기 됩니다. 소켓 커널 구조체를 파일 구조체에서 가지고 올 수 없으면, `-EINVAL` 를 리턴하고 그렇지 않을 경우 성공을 나타내는 0을 리턴하게 됩니다.

```c
// net/socket.c:1434

/*
 *      Update the socket async list
 *
 *      Fasync_list locking strategy.
 *
 *      1. fasync_list is modified only under process context socket lock
 *         i.e. under semaphore.
 *      2. fasync_list is used under read_lock(&sk->sk_callback_lock)
 *         or under socket lock
 */

static int sock_fasync(int fd, struct file *filp, int on)
{
        struct socket *sock = filp->private_data;
        struct sock *sk = sock->sk;
        struct socket_wq *wq = &sock->wq;

        if (sk == NULL)
                return -EINVAL;

        lock_sock(sk);
        fasync_helper(fd, filp, on, &wq->fasync_list);

        if (!wq->fasync_list)
                sock_reset_flag(sk, SOCK_FASYNC);
        else
                sock_set_flag(sk, SOCK_FASYNC);

        release_sock(sk);
        return 0;
}
```