---
layout: 'index'
view: 'post'
permalink: '/posts/2023/12/20/Linux-Kernel.html'
opengraph:
    site:
        name: 'ProjectedBy/Sub'
        url: '/'
date: '2023/12/20 20:24:00'
title: 'Linux Kernel'
description: ""
category: 'Linux Kernel'
tags: ['Linux Kernel']
---

## 리눅스 커널 코드 스니펫 #15 6.6.4 net/socket.c:154 file_operations socket_file_ops: const struct

이 구조체는 일반적인 파일 연산을 소켓과 관련한 특수한 함수로 매핑하는 역할을 합니다. 객체 지향의 클래스로 생각한다면 가상 함수라고 생각하셔도 됩니다. 이 구조체는 미리 정적으로 정의되어 있으며, `sock_alloc_file` 함수에서 소켓을 통해 파일 객체를 생성할 때 `alloc_file_pseudo` 함수를 호출하는데, 이때 파라미터로 전달됩니다.

- owner: 모듈의 소유자 (THIS_MODULE)
- llseek: 소켓에서는 지원하지 않기 때문에 no_llseek 으로 설정
- read_iter: 파일에서 데이터를 읽는 함수
- write_iter: 파일에 데이터를 쓰는 함수
- poll: 파일에 읽기 또는 쓰기 이벤트가 발생했는지 확인하는 함수
- unlocked_ioctl: 소켓 제어 명령을 수행하는 함수
- compat_ioctl: ioctl 의 호환성을 위하여 이전 구현을 지원하기 함수로 CONFIG_COMPAT 설정으로 컴파일을 해야 합니다.
- uring_cmd: io_uring을 사용하는 소켓 연산을 수행하는 함수
- mmap: 소켓의 메모리를 프로세스 메모리에 매핑하는 함수
- release: 파일이 닫힐 때 호출되는 함수
- fasync: 파일에 대한 비동기 통지를 설정하는 함수
- splice_write: splice 시스템 콜을 통해 데이터를 소켓에 쓰는 함수
- splice_read: splice 시스템 콜을 통해 소켓에서 데이터를 읽는 함수
- splice_eof: splice 시스템 콜을 통해 파일의 끝을 알리는 함수
- show_fdinfo: 파일의 정보를 seq_file 구조체에 출력하는 함수

빌드 시점에 각 모듈에 고유한 심볼 __this_module이 정의되고, THIS_MODULE 매크로는 이 모듈에 대한 참조를 반환하는데, 이 정보에는 참조 카운팅, 디버깅을 위한 메타 정보들이 들어 있습니다.

```c
// net/socket.c:154

/*
 *      Socket files have a set of 'special' operations as well as the generic file ones. These don't appear
 *      in the operation structures but are done directly via the socketcall() multiplexor.
 */

static const struct file_operations socket_file_ops = {
        .owner =        THIS_MODULE,
        .llseek =       no_llseek,
        .read_iter =    sock_read_iter,
        .write_iter =   sock_write_iter,
        .poll =         sock_poll,
        .unlocked_ioctl = sock_ioctl,
#ifdef CONFIG_COMPAT
        .compat_ioctl = compat_sock_ioctl,
#endif
        .uring_cmd =    io_uring_cmd_sock,
        .mmap =         sock_mmap,
        .release =      sock_close,
        .fasync =       sock_fasync,
        .splice_write = splice_to_socket,
        .splice_read =  sock_splice_read,
        .splice_eof =   sock_splice_eof,
  
        .show_fdinfo =  sock_show_fdinfo,
};
```