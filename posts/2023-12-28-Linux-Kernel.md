---
layout: 'index'
view: 'post'
permalink: '/posts/2023/12/28/Linux-Kernel.html'
opengraph:
    site:
        name: 'ProjectedBy/Sub'
        url: '/'
date: '2023/12/28 10:27:00'
title: 'Linux Kernel'
description: ""
category: 'Linux Kernel'
tags: ['Linux Kernel']
---

## 리눅스 커널 코드 스니펫 #18 6.6.4 net/socket.c:247 move_addr_to_kernel(uaddr: <<__user>> void *, ulen: int, kaddr: struct sockaddr_storage *): int

사용자 공간의 소켓 주소를 커널 공간의 소켓 주소 저장소로 복사하는 함수입니다. ulen 이 크기가 0보다 작은 값이거나 sockaddr_storage 구조체 크기보다 크면 잘못된 값을 뜻하는 -EINVAL 를 리턴하고, 크기가 0이면 아무런 작업이 이루지지 않았기 때문에 0이 리턴됩니다. 이렇게 에러처리가 끝난 후에 copy_from_user 함수를 사용하여 사용자 공간의 소켓 주소를 커널 공간의 주소로 복사합니다. 복사한 이후에 추가적으로 audit_sockaddr 함수를 호출하여 소켓 주소가 올바른지 확인하는 작업을 거친 후에 audit_sockaddr 함수의 리턴 값을 리턴합니다. 

```c
// net/socket.c:247

/**
 *      move_addr_to_kernel     -       copy a socket address into kernel space
 *      @uaddr: Address in user space
 *      @kaddr: Address in kernel space
 *      @ulen: Length in user space
 *
 *      The address is copied into kernel space. If the provided address is
 *      too long an error code of -EINVAL is returned. If the copy gives
 *      invalid addresses -EFAULT is returned. On a success 0 is returned.
 */

int move_addr_to_kernel(void __user *uaddr, int ulen, struct sockaddr_storage *kaddr)
{
        if (ulen < 0 || ulen > sizeof(struct sockaddr_storage))
                return -EINVAL;
        if (ulen == 0)
                return 0;
        if (copy_from_user(kaddr, uaddr, ulen))
                return -EFAULT;
        return audit_sockaddr(ulen, kaddr);
}
```