---
layout: 'index'
view: 'post'
permalink: '/posts/2023/12/29/Linux-Kernel.html'
opengraph:
    site:
        name: 'ProjectedBy/Sub'
        url: '/'
date: '2023/12/29 10:48:00'
title: 'Linux Kernel'
description: ""
category: 'Linux Kernel'
tags: ['Linux Kernel']
---

## 리눅스 커널 코드 스니펫 #19 6.6.4 net/socket.c:275 move_addr_to_user(kaddr: struct sockaddr *, klen: int, uaddr: <<__user>> void *, ulen: <<__user>> int *)

The value pointed to by ulen on entry is the buffer length available.
This is overwritten with the buffer space used. -EINVAL is returned if an overlong buffer is specified or a negative buffer size. -EFAULT is returned if either the buffer or the length field are not accessible.

After copying the data up to the limit the user specifies, the true length of the data is written over the length limit the user specified. Zero is returned for a success.

항목 시 ulen이 가리키는 값은 사용 가능한 버퍼 길이입니다.
이는 사용된 버퍼 공간으로 덮어쓰여집니다. -EINVAL은 너무 긴 버퍼가 지정되거나 음수 버퍼 크기인 경우 반환됩니다. -EFAULT는 버퍼 또는 길이 필드에 액세스할 수 없는 경우 반환됩니다.

사용자가 지정한 길이까지 데이터를 복사한 후, 사용자가 지정한 길이만큼 데이터의 실제 길이가 기록됩니다. 성공하면 0이 반환됩니다.

"fromlen은 잘리기 전의 값을 참조해야 합니다.."

----

리눅스 커널 코드 스니펫 #19 6.6.4 net/socket.c:275 move_addr_to_user(kaddr: struct sockaddr *, klen: int, uaddr: <<__user>> void *, ulen: <<__user>> int *)

커널 공간의 소켓 주소 정보를 사용자 공간으로 복사하는 함수입니다. klen 의 크기가 sizeof(struct sockaddr_storage) 크다면 그것은 버그이기에 미리 정의된 매크로를 이용하여 버그를 알리게 됩니다. 이 버그가 발생하면 궁극적으로는 ./include/linux/compiler.h:136 에서 __builtin_unreachable() 함수를 호출하도록 되어 있는데, __builtin_unreachable() 의 설명은 GCC 문서에서 확인할 수 있습니다. BUG_ON 조건에 부합되면, 프로그램은 Segment Fault 를 발생시킬 것입니다. move_addr_to_kernel 함수와는 반대로 먼저 소켓 주소의 유효성을 검사한 후에 그것을 사용자 공간의 메모리로 복사합니다.

```c
// net/socket.c:275

/**
 *      move_addr_to_user       -       copy an address to user space
 *      @kaddr: kernel space address
 *      @klen: length of address in kernel
 *      @uaddr: user space address
 *      @ulen: pointer to user length field
 *
 *      The value pointed to by ulen on entry is the buffer length available.
 *      This is overwritten with the buffer space used. -EINVAL is returned
 *      if an overlong buffer is specified or a negative buffer size. -EFAULT
 *      is returned if either the buffer or the length field are not
 *      accessible.
 *      After copying the data up to the limit the user specifies, the true
 *      length of the data is written over the length limit the user
 *      specified. Zero is returned for a success.
 */

static int move_addr_to_user(struct sockaddr_storage *kaddr, int klen,
                             void __user *uaddr, int __user *ulen)
{
        int err;
        int len;

        BUG_ON(klen > sizeof(struct sockaddr_storage));
        err = get_user(len, ulen);
        if (err)
                return err;
        if (len > klen)
                len = klen;
        if (len < 0)
                return -EINVAL;
        if (len) {
                if (audit_sockaddr(klen, kaddr))
                        return -ENOMEM;
                if (copy_to_user(uaddr, kaddr, len))
                        return -EFAULT;
        }
        /*
         *      "fromlen shall refer to the value before truncation.."
         *                      1003.1g
         */
        return __put_user(klen, ulen);
}
```