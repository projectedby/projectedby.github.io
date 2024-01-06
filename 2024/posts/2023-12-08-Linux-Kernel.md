---
layout: 'index'
view: 'post'
permalink: '/posts/2023/12/08/Linux-Kernel.html'
opengraph:
    site:
        name: 'ProjectedBy/Sub'
        url: '/'
date: '2023/12/08 10:14:00'
title: 'Linux Kernel'
description: ""
category: 'Linux Kernel'
tags: ['Linux Kernel']
---

## 리눅스 커널 스니펫 6.6.4 net/socket.c:1141 sock_write_iter(iocb: struct kiocb *, from: struct iov_iter *): ssize_t

`sock_write_iter(...)` 함수는 소켓 쓰기를 반복적으로 수행하는 함수입니다. 반복적 쓰기를 위한 I/O Vector 와 커널 I/O 컨트롤 블록을 파라미터로 받아서, 반복적 쓰기를 수행합니다. 커널 I/O 컨트롤 블록의 파일 정보에 존재하는 소켓 정보를 초기화하고 메시지 헤더에 메시지 반복자 필드에 I/O Vector 를 메시지 I/O 컨트롤 블록에 커널 I/O 컨트롤 블록을 대입하고, 컨트롤 블록의 위치가 0이 아니면 잘못된 위치임을 나타내는 -ESPIPE 를 리턴합니다. 만약에 파일이 논블록이거나 비동기 I/O 를 지원하게 되면 `IOCB_NOWAIT`, 메시지 헤더의 플래그에 `MSG_DONTWAIT`를 설정합니다. 그리고 소켓 타입이 SOCK_SEQPACKET 이면 MSG_EOR 플래그를 설정하여 메시지 데이터의 레코드가 끝임을 표시하게 됩니다. 이렇게 메시지 헤더를 초기화하고 에러처리를 한 후에 `__sock_sendmsg(...)` 함수를 호출하여 메시지 전송을 수행하며 전송이 끝나면 `from: struct iov_iter *` 변수에 갱신된 메시지 반복자를 대입하고, `__sock_sendmsg(...)` 함수의 리턴 값을 리턴하게 됩니다. 리턴 값은 0(성공), -1(실패), 0 보다 클 경우 보낸 데이터의 크기입니다. 보통 보낸 데이터 크기는 `__sock_sendmsg(...) 의 리턴값 - sizeof(struct msghdr) - sizeof(struct iovec)`로 계산할 수 있습니다.

```c
// net/socket.c:1141

static ssize_t sock_write_iter(struct kiocb *iocb, struct iov_iter *from)
{
        struct file *file = iocb->ki_filp;
        struct socket *sock = file->private_data;
        struct msghdr msg = {.msg_iter = *from,
                             .msg_iocb = iocb};
        ssize_t res;

        if (iocb->ki_pos != 0)
                return -ESPIPE;

        if (file->f_flags & O_NONBLOCK || (iocb->ki_flags & IOCB_NOWAIT))
                msg.msg_flags = MSG_DONTWAIT;

        if (sock->type == SOCK_SEQPACKET)
                msg.msg_flags |= MSG_EOR;

        res = __sock_sendmsg(sock, &msg);
        *from = msg.msg_iter;
        return res;
}
```