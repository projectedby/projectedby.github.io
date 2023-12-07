---
layout: 'index'
view: 'post'
permalink: '/posts/2023/12/07/Linux-Kernel.html'
opengraph:
    site:
        name: 'ProjectedBy/Sub'
        url: '/'
date: '2023/12/07 10:35:00'
title: 'Linux Kernel'
description: ""
category: 'Linux Kernel'
tags: ['Linux Kernel']
---

커널의 구조와 기능을 이해한다. 리눅스 커널은 다음과 같은 주요 부분으로 구성됩니다.

- 시스템 콜: 사용자 공간 애플리케이션이 하드웨어에 직접 액세스할 수 있도록 하는 인터페이스
- 프로세스 관리: 프로세스 생성, 실행, 종료 등을 관리하는 기능
- 메모리 관리: 메모리의 할당, 할당 해제, 보호 등을 관리하는 기능
- 파일 시스템: 파일과 디렉토리를 생성, 삭제, 읽기, 쓰기 등을 관리하는 기능
- 네트워크: 네트워크 연결, 패킷 전송, 수신 등을 관리하는 기능
- 장치 드라이버: 하드웨어 장치를 제어하는 기능

- 커널의 자료구조와 알고리즘: 커널에서 사용되는 자료구조와 알고리즘을 분석하여 효율성과 성능을 평가할 수 있습니다.
- 커널의 보안: 커널에서 발생할 수 있는 보안 취약점을 분석하여 보안을 강화할 수 있습니다.
- 커널의 성능: 커널의 성능을 측정하여 성능을 향상시킬 수 있는 방법을 찾을 수 있습니다.



sock_read_iter 함수는 리눅스 커널의 네트워크 소켓 API에 포함된 함수입니다. 이 함수는 소켓에서 데이터를 읽는 반복자(iterator)를 제공합니다.

sock_read_iter 함수는 다음과 같은 매개변수를 사용합니다.

sock: 읽을 소켓의 파일 디스크립터
buf: 읽은 데이터를 저장할 버퍼
len: 읽을 데이터의 크기
user_data: 반복자 함수에 전달할 사용자 데이터
read_iter: 반복자 함수의 주소
sock_read_iter 함수는 반복자 함수를 호출하여 소켓에서 데이터를 읽습니다. 반복자 함수는 다음과 같은 매개변수를 사용합니다.

user_data: sock_read_iter 함수에서 전달한 사용자 데이터
size: 읽은 데이터의 크기
반복자 함수는 읽은 데이터의 크기가 0이면 반복을 종료합니다.

sock_read_iter 함수를 사용하면 다음과 같이 소켓에서 데이터를 읽을 수 있습니다.

```c
struct sock *sock;
char buf[1024];

sock = sock_create(AF_INET, SOCK_STREAM, 0);
sock_connect(sock, (struct sockaddr *)&addr, sizeof(addr));

while (1) {
    size = sock_read_iter(sock, buf, sizeof(buf), NULL, read_iter);
    if (size == 0)
        break;

    // 읽은 데이터를 처리합니다.
}

sock_close(sock);
```

코드를 사용할 때는 주의하시기 바랍니다. 자세히 알아보기
위 코드는 TCP 소켓을 생성하고 서버에 연결합니다. 그런 다음, sock_read_iter 함수를 사용하여 소켓에서 데이터를 읽습니다. 반복자 함수 read_iter는 읽은 데이터의 크기가 0이면 반복을 종료합니다.

sock_read_iter 함수는 다음과 같은 장점을 제공합니다.

소켓에서 데이터를 읽는 반복자를 제공합니다.
반복자 함수를 사용하여 데이터 처리를 분리할 수 있습니다.
데이터 처리를 비동기적으로 수행할 수 있습니다.
sock_read_iter 함수는 다음과 같은 단점을 제공합니다.

반복자 함수를 작성해야 합니다.
반복자 함수의 구현이 복잡할 수 있습니다.

```c
static ssize_t sock_read_iter(struct kiocb *iocb, struct iov_iter *to)
{
        커널 I/O 컨트롤 블록에서 파일 참조와 소켓 참조를 추출하고,
        메세지 헤더 구조체에 I/O Vector 반복자와 비동기로 I/O 요청을 처리하기 위하여 커널 I/O 컨트롤 블록을 대입하고, 만약에 파일이 논블록이거나 비동기 I/O 플래그가 설정되어 있는 경우, 메시지 헤더에 `MSG_DONTWAIT`을 설정합니다.
        
        커널 I/O 컨트롤 블록의 파일 위치가 0이 아니면, 잘못된 위치를 읽으려 한다고, -ESPIPE 를 리턴합니다.
        반복자의 카운트가 0인 경우는 0을 리턴합니다.

        에러처리가 끝나면 실제 `sock_recvmsg` 함수를 호출하여 소켓을 통해 메시지를 수신하고,
        I/O Vector 변수에 새롭게 갱신된 메시지 반복자를 설정한 후에 `sock_recvmsg`의 리턴 값을 그대로 리턴하게 됩니다.
        리턴 값은 0(성공), -1(실패), 혹은 읽은 크기를 나타냅니다. 



 *      As we do 4.4BSD message passing we use a 4.4BSD message passing system, not 4.3. Thus msg_accrights(len) are now missing. They belong in an obscure libc emulation or the bin.
 *      
 *      belong in an obscure libc emulation or the bin.

        struct file *file = iocb->ki_filp;
        struct socket *sock = file->private_data;
        struct msghdr msg = {.msg_iter = *to,
                             .msg_iocb = iocb};
        ssize_t res;

        if (file->f_flags & O_NONBLOCK || (iocb->ki_flags & IOCB_NOWAIT))
                msg.msg_flags = MSG_DONTWAIT;

        if (iocb->ki_pos != 0)
                return -ESPIPE;

        if (!iov_iter_count(to))        /* Match SYS5 behaviour */
                return 0;

        res = sock_recvmsg(sock, &msg, msg.msg_flags);
        *to = msg.msg_iter;
        return res;
}
```

함수는 소켓에서 데이터를 읽는 반복자(iterator)

- 반복자 함수를 사용하여 데이터 처리를 분리
- 데이터 처리를 비동기적으로 수행

- 반복자 함수를 작성
- 반복자 함수의 구현이 복잡

sock_read_iter는 소켓에서 메시지를 수신할 때 실행됩니다.
그래프를 보면 메인 프로그램의 CPU 사용량이 대부분 연결에서 데이터를 읽는 데 소비된다는 결론을 내릴 수 있습니다.



----

./net/socket.c:1119

```c
// ./net/socket.c:1119

static ssize_t sock_read_iter(struct kiocb *iocb, struct iov_iter *to)
{
        struct file *file = iocb->ki_filp;
        struct socket *sock = file->private_data;
        struct msghdr msg = {.msg_iter = *to,
                             .msg_iocb = iocb};
        ssize_t res;

        if (file->f_flags & O_NONBLOCK || (iocb->ki_flags & IOCB_NOWAIT))
                msg.msg_flags = MSG_DONTWAIT;

        if (iocb->ki_pos != 0)
                return -ESPIPE;

        if (!iov_iter_count(to))        /* Match SYS5 behaviour */
                return 0;

        res = sock_recvmsg(sock, &msg, msg.msg_flags);
        *to = msg.msg_iter;
        return res;
}
```

커널 I/O 컨트롤 블록에서 파일 참조와 소켓 참조를 추출하고,
메세지 헤더 구조체에 I/O Vector 반복자와 비동기로 I/O 요청을 처리하기 위하여 커널 I/O 컨트롤 블록을 대입하고, 만약에 파일이 논블록이거나 비동기 I/O 플래그가 설정되어 있는 경우, 메시지 헤더에 `MSG_DONTWAIT`을 설정합니다.

커널 I/O 컨트롤 블록의 파일 위치가 0이 아니면, 잘못된 위치를 읽으려 한다고, -ESPIPE 를 리턴합니다.
반복자의 카운트가 0인 경우는 0을 리턴합니다.

에러처리가 끝나면 실제 `sock_recvmsg` 함수를 호출하여 소켓을 통해 메시지를 수신하고,
I/O Vector 변수에 새롭게 갱신된 메시지 반복자를 설정한 후에 `sock_recvmsg`의 리턴 값을 그대로 리턴하게 됩니다.
리턴 값은 0(성공), -1(실패), 혹은 읽은 크기를 나타냅니다.