---
layout: 'index'
view: 'post'
permalink: '/posts/2023/12/12/Linux-Kernel.html'
opengraph:
    site:
        name: 'ProjectedBy/Sub'
        url: '/'
date: '2023/12/12 10:13:00'
title: 'Linux Kernel'
description: ""
category: 'Linux Kernel'
tags: ['Linux Kernel']
---

## 리눅스 커널 코드 스니펫 (6.6.4) net/socket.c:1242 sock_ioctl(file: struct file *, cmd: unsigned, arg: unsigned long): long

소켓의 ioctl 요청을 처리하는 함수입니다. ioctl 요청은 소켓의 설정, 데이터 전송, 디버깅 등이 있습니다. 파라미터를 통해 전달된 `file: struct file *`에서 `sock: struct socket *`을 추출하여, `sock` 변수에 존재하는 오퍼레이터와 `sk: struct sock *` 소켓 커널 구조체를 추출하여 초기화하고, `sk`를 통하여 네트워크 네임스페이스 구조체를 초기화합니다. 커맨드가 장치에 특수한 명령인 경우 (`SIOCDEVPRIVATE <= cmd <= SIOCDEVPRIVATE + 15`), 먼저 arg 를 `ifr: struct ifreq` 에 저장하고 `dev_ioctl(...)` 함수를 수행합니다. 만약에 복사가 필요하면 `put_user_ifreq(...)` 함수를 호출하고 `dev_ioctl(...)` 리턴 값을 리턴하게 됩니다. `get_user_ifreq(...)` 와 `put_user_ifreq(...)` 가 실패하면 `-EFAULT`를 리턴하게 됩니다. 주석에서 나오듯이 `arg` 는 사용자 모드 포인터가 될 수 있습니다. (포인터가 될 경우 arg 를 통해서 쿼리한 값을 호출자 함수에 전달할 수 있습니다.) 다만, `put_user_ifreq(...)` 혹은 `put_user(...)` 등의 수행을 해서, 의미 있는 출력 값을 가지기는 하는데, 그 이후 호출자에게 전달하지 못하고 사용되어지지는 않습니다. ,커맨드가 무선 네트워크 명령(`SIOCIWFIRST`, `SIOCIWLAST`) 범위에 속하는 경우 `wext_handle_ioctl(...)` 함수를 호출하게 됩니다. 그리고 장치만을 위한 커맨드나 무선 네트워크 명령어가 아닐 경우 각각의 명령에 따라서, 필요한 함수를 호출하게 됩니다.

- FIOSETOWN, SIOCSPGRP: 프로세스 아이디를 설정
- FIOGETOWN, SIOCGPGRP: 프로세스 아이디를 출력
- SIOCGIFBR, SIOCSIFBR, SIOCBRADDBR, SIOCBRDELBR: 브리지 네트워크 ioctl 요청을 처리
- SIOCGIFVLAN, SIOCSIFVLAN: VLAN 네트워크 ioctl 요청을 처리
- SIOCGSKNS: 네트워크 네임스페이스 관련 정보를 반환
- SIOCGSTAMP_OLD, SIOCGSTAMPNS_OLD, SIOCGSTAMP_NEW, SIOCGSTAMPNS_NEW: 소켓 타임스탬프 정보를 반환
- SIOCGIFCONF: 네트워크 인터페이스 정보를 반환
- 기타 ioctl 명령어는 sock_do_ioctl 함수를 호출하여 처리

```c
// net/socket.c:1242

/*
 *      With an ioctl, arg may well be a user mode pointer, but we don't know
 *      what to do with it - that's up to the protocol still.
 */
static long sock_ioctl(struct file *file, unsigned cmd, unsigned long arg)
{
        const struct proto_ops  *ops;
        struct socket *sock;
        struct sock *sk;
        void __user *argp = (void __user *)arg;
        int pid, err;
        struct net *net;

        sock = file->private_data;
        ops = READ_ONCE(sock->ops);
        sk = sock->sk;
        net = sock_net(sk);
        if (unlikely(cmd >= SIOCDEVPRIVATE && cmd <= (SIOCDEVPRIVATE + 15))) {
                struct ifreq ifr;
                void __user *data;
                bool need_copyout;
                if (get_user_ifreq(&ifr, &data, argp))
                        return -EFAULT;
                err = dev_ioctl(net, cmd, &ifr, data, &need_copyout);
                if (!err && need_copyout)
                        if (put_user_ifreq(&ifr, argp))
                                return -EFAULT;
        } else
#ifdef CONFIG_WEXT_CORE
        if (cmd >= SIOCIWFIRST && cmd <= SIOCIWLAST) {
                err = wext_handle_ioctl(net, cmd, argp);
        } else
#endif
                switch (cmd) {
                case FIOSETOWN:
                case SIOCSPGRP:
                        err = -EFAULT;
                        if (get_user(pid, (int __user *)argp))
                                break;
                        err = f_setown(sock->file, pid, 1);
                        break;
                case FIOGETOWN:
                case SIOCGPGRP:
                        err = put_user(f_getown(sock->file),
                                       (int __user *)argp);
                        break;
                case SIOCGIFBR:
                case SIOCSIFBR:
                case SIOCBRADDBR:
                case SIOCBRDELBR:
                        err = br_ioctl_call(net, NULL, cmd, NULL, argp);
                        break;
                case SIOCGIFVLAN:
                case SIOCSIFVLAN:
                        err = -ENOPKG;
                        if (!vlan_ioctl_hook)
                                request_module("8021q");

                        mutex_lock(&vlan_ioctl_mutex);
                        if (vlan_ioctl_hook)
                                err = vlan_ioctl_hook(net, argp);
                        mutex_unlock(&vlan_ioctl_mutex);
                        break;
                case SIOCGSKNS:
                        err = -EPERM;
                        if (!ns_capable(net->user_ns, CAP_NET_ADMIN))
                                break;

                        err = open_related_ns(&net->ns, get_net_ns);
                        break;
                case SIOCGSTAMP_OLD:
                case SIOCGSTAMPNS_OLD:
                        if (!ops->gettstamp) {
                                err = -ENOIOCTLCMD;
                                break;
                        }
                        err = ops->gettstamp(sock, argp,
                                             cmd == SIOCGSTAMP_OLD,
                                             !IS_ENABLED(CONFIG_64BIT));
                        break;
                case SIOCGSTAMP_NEW:
                case SIOCGSTAMPNS_NEW:
                        if (!ops->gettstamp) {
                                err = -ENOIOCTLCMD;
                                break;
                        }
                        err = ops->gettstamp(sock, argp,
                                             cmd == SIOCGSTAMP_NEW,
                                             false);
                        break;

                case SIOCGIFCONF:
                        err = dev_ifconf(net, argp);
                        break;

                default:
                        err = sock_do_ioctl(net, sock, cmd, arg);
                        break;
                }
        return err;
}
```