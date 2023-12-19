---
layout: 'index'
view: 'post'
permalink: '/posts/2023/12/19/Linux-Kernel.html'
opengraph:
    site:
        name: 'ProjectedBy/Sub'
        url: '/'
date: '2023/12/19 15:39:00'
title: 'Linux Kernel'
description: ""
category: 'Linux Kernel'
tags: ['Linux Kernel']
---

## 리눅스 커널 코드 스니펫 #14 6.6.4 net/socket.c:136 `sock_show_fdinfo(m: struct seq_file *, f: struct file *)`

소켓 파일 개체의 정보를 `m: struct seq_file*` 에 저장하는 함수입니다. 이 함수는 커널 빌드 시에 `CONFIG_PROC_FS`를 활성화해야 사용할 수 있지만, 시스템 관리자가 소켓 정보를 디버깅할 때 유용하게 사용될 수 있습니다. `CONFIG_PROC_FS` 옵션은 `/proc` 가상 파일 시스템 지원을 활성화하여, 가상 파일 시스템에 대한 모니터링, 디버깅, 구성 변경 등을 수행할 수 있도록 합니다. 하지만, 이런 모니터링이나 디버깅을 위한 기능은 양날의 검처럼 유용한 기능을 제공하지만 제공하는 기능을 수행하기 위한 코드 실행에 의해 성능 저하와 모니터링 시에 민감한 정보가 노출되는 등의 보안 문제를 가지고 올 수 있습니다.

```c
#ifdef CONFIG_PROC_FS
static void sock_show_fdinfo(struct seq_file *m, struct file *f)
{
        struct socket *sock = f->private_data;
        const struct proto_ops *ops = READ_ONCE(sock->ops);

        if (ops->show_fdinfo)
                ops->show_fdinfo(m, sock);
}
#else
#define sock_show_fdinfo NULL
#endif
```