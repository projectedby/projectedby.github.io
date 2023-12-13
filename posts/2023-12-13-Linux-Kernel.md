---
layout: 'index'
view: 'post'
permalink: '/posts/2023/12/13/Linux-Kernel.html'
opengraph:
    site:
        name: 'ProjectedBy/Sub'
        url: '/'
date: '2023/12/13 11:46:00'
title: 'Linux Kernel'
description: ""
category: 'Linux Kernel'
tags: ['Linux Kernel']
---

## 리눅스 커널 코드 스니펫(6.6.4) net/socket.c:3482 `compat_sock_ioctl(file: struct file *, cmd: unsigned int, arg: unsigned long): long`

이전 버전의 커널 API를 지원하기 위해 `CONFIG_COMPAT` 설정으로 커널을 컴파일 하면 사용할 수 있는 ioctl 호환을 위한 함수입니다. 이 함수는 이전 버전의 ioctl 명령어를 처리하여 이전 버전의 애플리케이션이 정상적으로 작동할 수 있도록 합니다. 파일 구조체 변수에서 `sock: struct socket *`을 초기화하고, `sock` 변수에서 프로토콜 오퍼레이터와 커널 소켓을 초기화, 마지막으로 네트워크 구조체를 커널 소켓을 통해서 초기화합니다. 이렇게 초기화 한 이후에 `compat_ioctl(...)` 함수가 존재하면 이 함수를 수행하며, WIFI 명령의 경우 `compat_wext_handle_ioctl(...)` 함수를 `compat_ioctl(...)`이나 `compat_wext_handle_ioctl(...)` 에서도 처리하지 못한 경우 `compat_sock_ioctl_trans(...)` 함수를 호출하고 그 리턴 값을 리턴하게 됩니다. 이 함수는 이전 버전의 애플리케이션을 동작하도록 하게 하기 위한 호환성(compatibility) 함수입니다.

```c
// net/socket.c:3482

static long compat_sock_ioctl(struct file *file, unsigned int cmd,
                              unsigned long arg)
{
        struct socket *sock = file->private_data;
        const struct proto_ops *ops = READ_ONCE(sock->ops);
        int ret = -ENOIOCTLCMD;
        struct sock *sk;
        struct net *net;

        sk = sock->sk;
        net = sock_net(sk);

        if (ops->compat_ioctl)
                ret = ops->compat_ioctl(sock, cmd, arg);

        if (ret == -ENOIOCTLCMD &&
            (cmd >= SIOCIWFIRST && cmd <= SIOCIWLAST))
                ret = compat_wext_handle_ioctl(net, cmd, arg);

        if (ret == -ENOIOCTLCMD)
                ret = compat_sock_ioctl_trans(file, sock, cmd, arg);

        return ret;
}
```