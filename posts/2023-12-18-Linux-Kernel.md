---
layout: 'index'
view: 'post'
permalink: '/posts/2023/12/18/Linux-Kernel.html'
opengraph:
    site:
        name: 'ProjectedBy/Sub'
        url: '/'
date: '2023/12/18 11:18:00'
title: 'Linux Kernel'
description: ""
category: 'Linux Kernel'
tags: ['Linux Kernel']
---

## 리눅스 커널 코드 스니펫 #13 6.6.4 net/socket.c:1109 `sock_splice_eof(file: struct file *)`

소켓 스플라이싱을 완료하고 소켓에서 더 이상 데이터를 읽지 않는다고 알리는 함수입니다. `ops->splice_eof(...)` 함수가 존재하면, 이 함수를 호출하여 소켓 프로토콜에 맞게 스플라이싱을 종료합니다. 이 작업을 수행하려면 소켓은 스플라이싱 작업을 지원해야 합니다.

소켓 스플라이싱은 소켓의 데이터를 파이프와 연결하여 로드 밸런싱을 위한 작업을 수행할 수 있는 등의 네트워크 최적화를 위한 구현 등에 사용되어질 수 있습니다.

```c
// net/socket.c:1109

static void sock_splice_eof(struct file *file)
{
        struct socket *sock = file->private_data;
        const struct proto_ops *ops;

        ops = READ_ONCE(sock->ops);
        if (ops->splice_eof)
                ops->splice_eof(sock);
}
```