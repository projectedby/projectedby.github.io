---
layout: 'index'
view: 'post'
permalink: '/posts/2023/12/16/Linux-Kernel.html'
opengraph:
    site:
        name: 'ProjectedBy/Sub'
        url: '/'
date: '2023/12/16 10:17:00'
title: 'Linux Kernel'
description: ""
category: 'Linux Kernel'
tags: ['Linux Kernel']
---

## 리눅스 소켓 코드 스니펫 #12 6.6.4 net/socket.c:1095 `sock_splice_read(file: struct file *, ppos: loff_t *, pipe: struct pipe_inode_info *, len: size_t, flags: unsigned int): ssize_t`

소켓에서 데이터를 읽어서 파이프로 전송하는 함수입니다. 이 함수를 사용하여 소켓을 통해 수신한 데이터를 다른 프로세스로 쉽게 전달할 수 있습니다.
내부적으로 소켓 프로토콜의 `ops->splice_read` 함수가 존재하는지 확인하고 소켓의 프로토콜에 알맞은 스플라이싱 읽기 함수가 존재하면 그 함수를 통하여 스플라이싱 읽기를 수행하고, 그렇지 않으면 일반적인 스플라이싱 읽기 함수인 `copy_splice_read(...)` 를 호출하고 그 리턴 값을 반환합니다. 리턴 값은 읽은 데이터 크기입니다. 스플라이싱을 지원하는 소켓인지 확인해야 할 필요성이 있습니다.

파라미터

- `file: struct file *`: 스플라이싱을 수행할 파일 구조체
- `ppos: loff_t *`: 파일 오프셋
- `pipe: struct pipe_inode_info *`: 데이터를 전달할 파이프 정보
- `len: size_t`: 읽을 데이터의 크기
- `flags: unsigned int`: 스플라이싱 옵션

초기화 변수

- `sock: struct socket *`: 파일 구조체의 private_data 필드에 저장된 소켓 구조체를 할당
- `ops: const struct proto_ops *`: 소켓 프로토콜의 ops 구조체에 대한 참조

```c
static ssize_t sock_splice_read(struct file *file, loff_t *ppos,
                                struct pipe_inode_info *pipe, size_t len,
                                unsigned int flags)
{
        struct socket *sock = file->private_data;
        const struct proto_ops *ops;

        ops = READ_ONCE(sock->ops);
        if (unlikely(!ops->splice_read))
                return copy_splice_read(file, ppos, pipe, len, flags);

        return ops->splice_read(sock, ppos, pipe, len, flags);
}
```