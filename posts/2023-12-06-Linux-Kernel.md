---
layout: 'index'
view: 'post'
permalink: '/posts/2023/12/06/Linux-Kernel.html'
opengraph:
    site:
        name: 'ProjectedBy/Sub'
        url: '/'
date: '2023/12/06 11:54:00'
title: 'Linux Kernel'
description: ""
category: 'Linux Kernel'
tags: ['Linux Kernel']
---

./include/linux/uio.h:41

| Member    | Type | Description |
| --------- | ---- | ----------- |
| iter_type | u8   | -           |

커널의 가장 일반적인 작업 중 하나는 사용자 공간에서 제공하는 데이터 버퍼를 여러 청크로 처리하는 것입니다. 아마도 이는 커널 코드가 종종 잘못되어 버그가 발생하고 보안 문제가 발생할 수 있는 작업입니다. 커널에는 이 작업을 더 간단하게 만들기 위한 기본 요소("iov_iter"라고 함)가 포함되어 있습니다. iov_iter 사용은 현재 대부분 메모리 관리 및 파일 시스템 계층으로 제한되어 있지만 천천히 커널의 다른 부분으로 확산되고 있습니다. 이 인터페이스는 현재 문서화되어 있지 않습니다. 이 기사에서는 이 문제를 해결하려고 시도할 것입니다.

One of the most common tasks in the kernel is processing a buffer of data supplied by user space, possibly in several chunks. Perhaps unsurprisingly, this is a task that kernel code often gets wrong, leading to bugs and, possibly, security problems. The kernel contains a primitive (called "iov_iter") meant to make this task simpler. While iov_iter use is mostly confined to the memory-management and filesystem layers currently, it is slowly spreading out into other parts of the kernel. This interface is currently undocumented, a situation this article will attempt to remedy.

네트워크 프로그래밍을 하던, 아니면 단순한 File I/O를 수행하던 read/write함수는 한 번쯤은 사용해 보았으리라 생각한다. 그런데, 만약에 전송하는 데이터가 여러 버퍼에 나뉘어져 있다면 어떻게 해야할까. 아니면 한 데이터를 일정 크기로 끊어서 여러 버퍼에 나눠 저장해야 한다면?물론 read/write함수를 버퍼의 개수만큼 호출하면 매우 간단할 것이다. 그런데, 만약 나뉘어진 버퍼의 개수가 천 단위를 넘어간다면 어떻게 될까? 그래도 read/write를 버퍼 개수만큼 호출하면 될까?여기서 왜 안되는지 묻는 사람들이 있을지도 모르겠지만, 리눅스 커널은 User-mode와 Kernel-mode로 나뉘어 있다는 것을 기억하자. 비록 우리가 빌드해서 실행시키는 프로그램 자체는 User-mode에서 동작하지만, 실제 장치에 접근해야 하는 read/write함수는 Kernel-mode에서 수행될 수 밖에 없다. 즉, Syscall인 read/write함수를 호출하게 되면, User-mode에서 Kernel-mode로 Context switch가 일어나게 된다. 이 Context switch 과정에서 Register나 기타 여러 프로그램의 수행 정보를 메모리에 저장하고, 페이징 모듈은 프로세스 매핑 메모리에서 커널 메모리 영역으로의 전환을 시도하게 된다. 즉, 필연적으로 Overhead가 발생할 수 밖에 없다는 것이다. 다시 돌아와서, 만약 버퍼가 수천개가 있다고 read/write를 수천번 시도하게 된다면 Context switch도 수천번 일어나게 된다는 것. 그만큼 수행시간에 있어서 더 많은 Cost를 소모하게 된다.즉, User-mode와 Kernel-mode사이의 전환을 최소화 하면서 동시에 여러 버퍼에 대한 작업을 할 수 있는 Syscall이 필요하게 된 것이다.그리고 그것이 readv/writev이다.본격적인 readv/writev에 대한 설명에 앞서, readv/writev의 효율성을 확인하기 위해 24Byte크기의 char형 버퍼 1024개를 대상으로 read-readv의 퍼포먼스 테스트를 진행해 보았다.
출처: https://revdev.tistory.com/55 [Segmentation Fault:티스토리]






```c
struct iov_iter {
        u8 iter_type;
        bool copy_mc;
        bool nofault;
        bool data_source;
        bool user_backed;
        union {
                size_t iov_offset;
                int last_offset;
        };
        /*
         * Hack alert: overlay ubuf_iovec with iovec + count, so
         * that the members resolve correctly regardless of the type
         * of iterator used. This means that you can use:
         *
         * &iter->__ubuf_iovec or iter->__iov
         *
         * interchangably for the user_backed cases, hence simplifying
         * some of the cases that need to deal with both.
         */
        union {
                /*
                 * This really should be a const, but we cannot do that without
                 * also modifying any of the zero-filling iter init functions.
                 * Leave it non-const for now, but it should be treated as such.
                 */
                struct iovec __ubuf_iovec;
                struct {
                        union {
                                /* use iter_iov() to get the current vec */
                                const struct iovec *__iov;
                                const struct kvec *kvec;
                                const struct bio_vec *bvec;
                                struct xarray *xarray;
                                void __user *ubuf;
                        };
                        size_t count;
                };
        };
        union {
                unsigned long nr_segs;
                loff_t xarray_start;
        };
};
```