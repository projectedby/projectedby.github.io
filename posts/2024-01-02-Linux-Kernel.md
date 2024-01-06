---
layout: 'index'
view: 'post'
permalink: '/posts/2024/01/02/Linux-Kernel.html'
opengraph:
    site:
        name: 'ProjectedBy/Sub'
        url: '/'
date: '2024/01/02 08:57:00'
title: 'Linux Kernel'
description: ""
category: 'Linux Kernel'
tags: ['Linux Kernel']
---

## 리눅스 커널 코드 스니펫 #20 sock_alloc_inode

net/socket.c:304
6.6.4
sock_alloc_inode(sb: struct super_block *): struct inode *

sock_inode_cachep: <<__ro_after_init>> struct kmem_cache *

커널에서 아이노드를 위한 슬랩 할당자로 초기화 이후에 읽기 전용으로 사용되어집니다.

sock_alloc_inode(sb: struct super_block *): struct inode *

소켓 아이노드를 할당하고 초기화하는 역할을 수행하는 함수입니다. alloc_inode_sb() 함수를 이용하여 인터럽트 컨텍스트에서 사용할 수 있는 소켓 아이노드를 생성합니다. 그리고 데이터를 초기화한 이후에 소켓의 아이노드를 반환합니다. 소켓 아이노드를 생성하여 소켓을 파일 시스템과 연결하고 이후부터는 소켓을 파일처럼 다룰 수 있게 됩니다.

```c
static struct kmem_cache *sock_inode_cachep __ro_after_init;

static struct inode *sock_alloc_inode(struct super_block *sb)
{
        struct socket_alloc *ei;

        ei = alloc_inode_sb(sb, sock_inode_cachep, GFP_KERNEL);
        if (!ei)
                return NULL;
        init_waitqueue_head(&ei->socket.wq.wait);
        ei->socket.wq.fasync_list = NULL;
        ei->socket.wq.flags = 0;

        ei->socket.state = SS_UNCONNECTED;
        ei->socket.flags = 0;
        ei->socket.ops = NULL;
        ei->socket.sk = NULL;
        ei->socket.file = NULL;

        return &ei->vfs_inode;
}
```
