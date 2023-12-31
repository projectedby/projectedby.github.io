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


iov_iter 개념은 새로운 것이 아닙니다. 이 API는 2007년 Nick Piggin에 의해 2.6.24 커널에 처음 추가되었습니다. 그러나 작년에 이 API를 확장하고 커널의 더 많은 부분에서 사용하려는 노력이 있었습니다. 예를 들어 3.19 병합 창에서는 네트워킹 하위 시스템으로의 첫 번째 단계를 확인해야 합니다.

The iov_iter concept is not new; it was first added by Nick Piggin for the 2.6.24 kernel in 2007. But there has been an effort over the last year to expand this API and use it in more parts of the kernel; the 3.19 merge window should see it making its first steps into the networking subsystem, for example.

An iov_iter structure is essentially an iterator for working through an iovec structure, defined in <uapi/linux/uio.h> as:

```c
    struct iovec
    {
	void __user *iov_base;
	__kernel_size_t iov_len;
    };
```

This structure matches the user-space iovec structure defined by POSIX and used with system calls like readv(). As the "vec" portion of the name would suggest, iovec structures tend to come in arrays; as a whole, an iovec describes a buffer that may be scattered in both physical and virtual memory.

이 구조는 POSIX에서 정의하고 readv()와 같은 시스템 호출과 함께 사용되는 사용자 공간 iovec 구조와 일치합니다. 이름의 "vec" 부분에서 알 수 있듯이 iovec 구조는 배열로 나타나는 경향이 있습니다. 전체적으로 iovec은 물리적 메모리와 가상 메모리 모두에 분산될 수 있는 버퍼를 설명합니다.

The actual iov_iter structure is defined in <linux/uio.h>:

```c
    struct iov_iter {
	int type;
	size_t iov_offset;
	size_t count;
	const struct iovec *iov; /* SIMPLIFIED - see below */
	unsigned long nr_segs;
    };
```

The type field describes the type of the iterator. It is a bitmask containing, among other things, either READ or WRITE depending on whether data is being read into the iterator or written from it. The data direction, thus, refers not to the iterator itself, but to the other part of the data transaction; an iov_iter created with a type of READ will be written to.

Beyond that, iov_offset contains the offset to the first byte of interesting data in the first iovec pointed to by iov. The total amount of data pointed to by the iovec array is stored in count, while the number of iovec structures is stored in nr_segs. Note that most of these fields will change as code "iterates" through the buffer. They describe a cursor into the buffer, rather than the buffer as a whole.

type 필드는 반복자의 유형을 설명합니다. 이는 데이터가 반복기로 읽혀지는지 아니면 쓰여지는지에 따라 무엇보다도 READ 또는 WRITE를 포함하는 비트마스크입니다. 따라서 데이터 방향은 반복자 자체가 아니라 데이터 트랜잭션의 다른 부분을 나타냅니다. READ 유형으로 생성된 iov_iter가 기록됩니다.

그 외에도 iov_offset에는 iov가 가리키는 첫 번째 iovec에 있는 관심 데이터의 첫 번째 바이트에 대한 오프셋이 포함되어 있습니다. iovec 배열이 가리키는 데이터의 총량은 count에 저장되고, iovec 구조의 수는 nr_segs에 저장됩니다. 이러한 필드의 대부분은 코드가 버퍼를 통해 "반복"됨에 따라 변경됩니다. 이는 버퍼 전체가 아닌 버퍼에 대한 커서를 설명합니다.

Working with struct iov_iter
Before use, an iov_iter must be initialized to contain an (already populated) iovec with:

    void iov_iter_init(struct iov_iter *i, int direction,
		       const struct iovec *iov, unsigned long nr_segs,
		       size_t count);
Then, for example, data can be moved between the iterator and user space with either of:

    size_t copy_to_iter(void *addr, size_t bytes, struct iov_iter *i);
    size_t copy_from_iter(void *addr, size_t bytes, struct iov_iter *i);
The naming here can be a little confusing until one gets the hang of it. A call to copy_to_iter() will copy bytes data from the buffer at addr to the user-space buffer indicated by the iterator. So copy_to_iter() can be thought of as being like a variant of copy_to_user() that takes an iterator rather than a single buffer. Similarly, copy_from_iter() will copy the data from the user-space buffer to addr. The similarity with copy_to_user() continues through to the return value, which is the number of bytes not copied.

Note that these calls will "advance" the iterator through the buffer to correspond to the amount of data transferred. In other words, the iov_offset, count, nr_segs, and iov fields of the iterator will all be changed as needed. So two calls to copy_from_iter() will copy two successive areas from user space. Among other things, this means that the code owning the iterator must remember the base address for the iovec array, since the iov value in the iov_iter structure may change.

Various other functions exist. To move data referenced by a page structure into or out of an iterator, use:

    size_t copy_page_to_iter(struct page *page, size_t offset, size_t bytes,
			     struct iov_iter *i);
    size_t copy_page_from_iter(struct page *page, size_t offset, size_t bytes,
			       struct iov_iter *i);
Only the single page provided will be copied to or from, so these functions should not be asked to copy data that would cross the page boundary.

Code running in atomic context can attempt to obtain data from user space with:

    size_t iov_iter_copy_from_user_atomic(struct page *page, struct iov_iter *i,
					  unsigned long offset, size_t bytes);
Since this copy will be done in atomic mode, it will only succeed if the data is already resident in RAM; callers must thus be prepared for a higher-than-normal chance of failure.

If it is necessary to map the user-space buffer into the kernel, one of these calls can be used:

    ssize_t iov_iter_get_pages(struct iov_iter *i, struct page **pages,
                               size_t maxsize, unsigned maxpages, size_t *start);
    ssize_t iov_iter_get_pages_alloc(struct iov_iter *i, struct page ***pages, 
    	    			     size_t maxsize, size_t *start);

Either function turns into a call to get_user_pages_fast(), causing (hopefully) the pages to be brought in and their locations stored in the pages array. The difference between them is that iov_iter_get_pages() expects the pages array to be allocated by the caller, while iov_iter_get_pages_alloc() will do the allocation itself. In that case, the array returned in pages must eventually be freed with kvfree(), since it might have been allocated with either kmalloc() or vmalloc().

Advancing through the iterator without moving any data can be done with:

    void iov_iter_advance(struct iov_iter *i, size_t size);
The buffer referred to by an iterator (or a portion thereof) can be cleared with:

    size_t iov_iter_zero(size_t bytes, struct iov_iter *i);
Information about the iterator is available from a number of helper functions:

    size_t iov_iter_single_seg_count(const struct iov_iter *i);
    int iov_iter_npages(const struct iov_iter *i, int maxpages);
    size_t iov_length(const struct iovec *iov, unsigned long nr_segs);

A call to iov_iter_single_seg_count() returns the length of the data in the first segment of the buffer. iov_iter_npages() reports the number of pages occupied by the buffer in the iterator, while iov_length() returns the total data length. The latter function must be used with care, since it trusts the len field in the iovec structures. If that data comes from user space, it could cause integer overflows in the kernel.

사용하기 전에 iov_iter는 다음과 같이 (이미 채워진) iovec을 포함하도록 초기화되어야 합니다.

    void iov_iter_init(struct iov_iter *i, int direction,
		       const struct iovec *iov, unsigned long nr_segs,
		       size_t count);

그런 다음 예를 들어 다음 중 하나를 사용하여 반복자와 사용자 공간 간에 데이터를 이동할 수 있습니다.

    size_t copy_to_iter(void *addr, size_t bytes, struct iov_iter *i);
    size_t copy_from_iter(void *addr, size_t bytes, struct iov_iter *i);

여기의 이름은 익숙해질 때까지 약간 혼란스러울 수 있습니다. copy_to_iter()에 대한 호출은 addr에 있는 버퍼의 바이트 데이터를 반복자가 가리키는 사용자 공간 버퍼로 복사합니다. 따라서 copy_to_iter()는 단일 버퍼가 아닌 반복자를 사용하는 copy_to_user()의 변형과 같다고 생각할 수 있습니다. 마찬가지로, copy_from_iter()는 사용자 공간 버퍼에서 addr로 데이터를 복사합니다. copy_to_user()와의 유사성은 복사되지 않은 바이트 수인 반환 값까지 계속됩니다.

이러한 호출은 전송된 데이터 양에 맞춰 버퍼를 통해 반복자를 "전진"시킵니다. 즉, 반복자의 iov_offset, count, nr_segs 및 iov 필드가 모두 필요에 따라 변경됩니다. 따라서 copy_from_iter()에 대한 두 번의 호출은 사용자 공간에서 두 개의 연속 영역을 복사합니다. 무엇보다도 이는 iov_iter 구조의 iov 값이 변경될 수 있으므로 반복자를 소유하는 코드가 iovec 배열의 기본 주소를 기억해야 함을 의미합니다.

그 외 다양한 기능이 존재합니다. 페이지 구조에서 참조하는 데이터를 반복기 안팎으로 이동하려면 다음을 사용하세요.

```c
    size_t copy_page_to_iter(struct page *page, size_t offset, size_t bytes,
			     struct iov_iter *i);
    size_t copy_page_from_iter(struct page *page, size_t offset, size_t bytes,
			       struct iov_iter *i);
```

제공된 단일 페이지만 복사되거나 복사되므로 페이지 경계를 넘는 데이터를 복사하도록 이러한 함수에 요청하면 안 됩니다.

원자적 컨텍스트에서 실행되는 코드는 다음을 사용하여 사용자 공간에서 데이터를 얻으려고 시도할 수 있습니다.

    size_t iov_iter_copy_from_user_atomic(struct page *page, struct iov_iter *i,
					  unsigned long offset, size_t bytes);

이 복사는 원자 모드에서 수행되므로 데이터가 이미 RAM에 있는 경우에만 성공합니다. 따라서 발신자는 평소보다 높은 실패 가능성에 대비해야 합니다.

사용자 공간 버퍼를 커널에 매핑해야 하는 경우 다음 호출 중 하나를 사용할 수 있습니다.

```c
    ssize_t iov_iter_get_pages(struct iov_iter *i, struct page **pages,
                               size_t maxsize, unsigned maxpages, size_t *start);
    ssize_t iov_iter_get_pages_alloc(struct iov_iter *i, struct page ***pages, 
    	    			     size_t maxsize, size_t *start);
```

두 함수 모두 get_user_pages_fast()에 대한 호출로 바뀌어 (희망적으로) 페이지를 가져오고 해당 위치를 페이지 배열에 저장합니다. 둘 사이의 차이점은 iov_iter_get_pages()는 페이지 배열이 호출자에 의해 할당될 것으로 예상하는 반면 iov_iter_get_pages_alloc()은 할당 자체를 수행한다는 것입니다. 이 경우 페이지에 반환된 배열은 kmalloc() 또는 vmalloc()을 사용하여 할당되었을 수 있으므로 결국 kvfree()를 사용하여 해제되어야 합니다.

데이터를 이동하지 않고 반복기를 통해 진행하는 방법은 다음과 같습니다.

```c
    void iov_iter_advance(struct iov_iter *i, size_t size);
```

반복자(또는 그 일부)가 참조하는 버퍼는 다음을 사용하여 지울 수 있습니다.

```c
    size_t iov_iter_zero(size_t bytes, struct iov_iter *i);
```

반복자에 대한 정보는 다양한 도우미 함수에서 사용할 수 있습니다.

```c
    size_t iov_iter_single_seg_count(const struct iov_iter *i);
    int iov_iter_npages(const struct iov_iter *i, int maxpages);
    size_t iov_length(const struct iovec *iov, unsigned long nr_segs);
```

iov_iter_single_seg_count()를 호출하면 버퍼의 첫 번째 세그먼트에 있는 데이터 길이가 반환됩니다. iov_iter_npages()는 반복기에서 버퍼가 차지하는 페이지 수를 보고하는 반면, iov_length()는 총 데이터 길이를 반환합니다. 후자의 함수는 iovec 구조의 len 필드를 신뢰하므로 주의해서 사용해야 합니다. 해당 데이터가 사용자 공간에서 오는 경우 커널에서 정수 오버플로가 발생할 수 있습니다.

Not just iovecs

위에 표시된 struct iov_iter의 정의는 실제로 커널에서 발견되는 정의와 일치하지 않습니다. iov 배열의 단일 필드 대신 실제 구조는 다음과 같습니다(3.18).

```c
    union {
	const struct iovec *iov;
	const struct bio_vec *bvec;
    };
```

즉, iov_iter 구조도 블록 계층에서 사용되는 BIO 구조와 작동하도록 설정됩니다. 이러한 반복자는 유형 필드 비트마스크에 ITER_BVEC를 포함시켜 표시됩니다. 이러한 반복자가 생성되면 위의 모든 호출은 iovec 구조를 사용하는 "일반적인" 반복자처럼 작동합니다. 현재 커널에서 BIO 기반 반복자의 사용은 최소화되어 있습니다. 이는 swap 및 splice() 코드에서만 찾을 수 있습니다.

3.19 커널에서는 위에서 언급한 모든 기능을 구현하는 데 필요한 방대한 양의 상용구 코드를 줄이기 위해 iov_iter 코드가 크게 재작성될 가능성이 높습니다. 나중에 코드는 실제로 더 짧아지지만 필요에 따라 필요한 상용구를 생성하기 위해 약간 무서운 전처리기 매크로 마법을 상당히 많이 도입하는 대가를 치르게 됩니다.

"사용자 공간" 버퍼가 실제로 커널 공간에 있는 경우 iov_iter 코드는 이미 작동합니다. 3.19에서는 모든 것이 조금 공식화되고 최적화될 것입니다. 이러한 반복자는 다음을 사용하여 생성됩니다.

```c
    void iov_iter_kvec(struct iov_iter *i, int direction,
		       const struct kvec *iov, unsigned long nr_segs,
		       size_t count);
```

이 경우 위에 표시된 공용체에 새로운 kvec 필드도 추가됩니다.

마지막으로 네트워킹 사례를 돕기 위해 일부 기능이 추가되었습니다. 예를 들어 버퍼를 복사하고 프로세스에서 체크섬을 생성하는 것이 가능합니다.

최종 결과는 iov_iter 인터페이스가 사용자 공간 버퍼 처리와 관련된 많은 복잡성을 숨기는 표준 방법으로 천천히 자리잡고 있다는 것입니다. 앞으로는 더 많은 곳에서 사용이 장려될 것으로 예상됩니다. 7년 정도 밖에 걸리지 않았지만 iov_iter는 대부분의 커널 개발자가 알고 싶어하는 인터페이스가 되는 지점에 도달한 것으로 보입니다.

커널에서 user_backed는 사용자 공간에서 관리되는 메모리를 나타내는 용어입니다. 사용자 공간에서 관리되는 메모리는 커널이 관리하는 메모리와 구별됩니다.



// ./include/linux/uio.h:41


----------------------------------------------------------

```c
// ./include/linux/uio.h:41
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

I/O Vector Iterator 구조체

커널의 가장 일반적인 작업 중 하나는 사용자 공간에서 제공하는 데이터 버퍼를 여러 청크(chunk)로 처리하는 것입니다. 아마도 이는 커널 코드가 종종 잘못되어 버그가 발생하고 보안 문제가 발생할 수 있는 작업인데, 이 작업을 더 간단하게 만들기 위해서 I/O Vector Iterator 가 포함되었습니다. (2007년 Nick Piggin이 2.6.24 커널에 처음 추가하였습니다.)

`iter_type: u8` - 반복자 유형
`copy_mc: bool` - 메모리 컨트롤러에서 카피가 발생하는 상태 표시
`nofault: bool` - 메모리 할당에 성공/실패 상태를 나타냄
`data_source: bool` - 데이터 소스
`user_backed: bool` - 사용자 공간에서 관리되는 메모리를 의미
`iov_offset: size_t` - I/O Vector 오프셋
`last_offset: int` - 마지막 오프셋
`__ubuf_iovec: struct iovec` - 사용자 공간에서 사용되는 I/O Vector 구조체
`__iov: const struct iovec *` - I/O 벡터 구조체
`kvec: const struct kvec *` - 배열로 관리되는 I/O 벡터 구조체
`bvec: const struct bio_vec *` - 블록 I/O 요청을 나타내는 구조체
`xarray: struct xarray *` - 리눅스 커널에서 매우 큰 포인터 배열처럼 동작하는 추상 데이터 타입
`ubuf: void __user *` - 사용자 공간의 버퍼
`count: size_t` - 이터레이션 카운트
`nr_segs: unsigned long` - I/O 요청이 몇 개의 I/O 버퍼로 구성되어 있는지 나타냄
`xarray_start: loff_t` - `xarray` 를 사용할 경우 버퍼의 시작 지점
