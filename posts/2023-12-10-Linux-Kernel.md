---
layout: 'index'
view: 'post'
permalink: '/posts/2023/12/10/Linux-Kernel.html'
opengraph:
    site:
        name: 'ProjectedBy/Sub'
        url: '/'
date: '2023/12/10 17:37:00'
title: 'Linux Kernel'
description: ""
category: 'Linux Kernel'
tags: ['Linux Kernel']
---

## 리눅스 커널(6.6.4) 코드 스니펫 net/socket.c:1417 `sock_close(inode: struct inode *, filp: struct file *): int`

소켓 연결 해제를 수행하는 함수입니다. 두번째 파라미터인 `filp: struct file *`는 `inode: struct inode *`에서 존재하기에 사용하지 않습니다. 리턴값과 상관없이 항상 0을 리턴합니다.

```c
static int sock_close(struct inode *inode, struct file *filp)
{
        __sock_release(SOCKET_I(inode), inode);
        return 0;
}
```
