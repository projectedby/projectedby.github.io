---
layout: 'index'
view: 'post'
permalink: '/posts/2023/12/04/Linux-Kernel.html'
opengraph:
    site:
        name: 'ProjectedBy/Sub'
        url: '/'
date: '2023/12/04 15:31:00'
title: 'Linux Kernel'
description: ""
category: 'Linux Kernel'
tags: ['Linux Kernel']
---

##

```c
static const struct file_operations socket_file_ops = {
	.owner =	THIS_MODULE,
	.llseek =	no_llseek,
	.read_iter =	sock_read_iter,
	.write_iter =	sock_write_iter,
	.poll =		sock_poll,
	.unlocked_ioctl = sock_ioctl,
#ifdef CONFIG_COMPAT
	.compat_ioctl = compat_sock_ioctl,
#endif
	.uring_cmd =    io_uring_cmd_sock,
	.mmap =		sock_mmap,
	.release =	sock_close,
	.fasync =	sock_fasync,
	.splice_write = splice_to_socket,
	.splice_read =	sock_splice_read,
	.splice_eof =	sock_splice_eof,
	.show_fdinfo =	sock_show_fdinfo,
};
```

```c
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

	if (!iov_iter_count(to))	/* Match SYS5 behaviour */
		return 0;

	res = sock_recvmsg(sock, &msg, msg.msg_flags);
	*to = msg.msg_iter;
	return res;
}
```

`sock_read_iter`함수는 소켓을 통해 메시지를 수신하는 함수입니다.


fs.h

커널의 I/O 제어 블럭(Kernel I/O Control Block) 구조체

`struct kiocb`는 커널 I/O 를 관리하는 I/O 제어 블록입니다. 이 구조체에는 처리 중인 파일 및 해당 오프셋과 같은 정보가 포함됩니다.

| Member      | Type          | Description |
| ----------- | ------------- | ----------- |
| ki_filp     | struct file * | 파일 포인터 |
| ki_pos      | loff_t        | 파일에서의 오프셋 |
| ki_complete | void (*ki_complete)(struct kiocb *iocb, long ret) | 파일 I/O 가 끝났을 때의 콜백함수로 ki_pos 에 끝난 지점의 오프셋이 저장됨 |
| private     | void *        | 이 구조체만을 위한 데이터 |
| ki_flags    | int           | 플래그 |
| ki_ioprio   | u16           | I/O 우선 순위 정보 |
| ki_waitq    | struct wait_page_queue | 비동기 버퍼 읽기를 위해서만 사용된다. 읽기가 완료와 관련 있는 페이지 대기열이 저장되고, 유효한 `IFF IOCB_WAITQ` 가 저장됨 |
| dio_complete | ssize_t (*dio_complete)(void *data) | I/O 완료 처리가 다시 전달되는 O_DIRECT IO 에서 사용할 수 있습니다. I/O 발행자가 `IOCB_DIO_CALLER_COMP`를 설정할 경우에만 설정될 수 있으며, 발행자는 `ki_complete`가 호출될 때 이 핸들러가 존재하는지 확인해야 합니다. 이 핸들러에 전달된 데이터는 `dio_complete`가 할당될 때 private 으로 할당되어야 합니다. |

```c
// ./include/linux/fs.h:371:395
struct kiocb {
        struct file             *ki_filp;
        loff_t                  ki_pos;
        void (*ki_complete)(struct kiocb *iocb, long ret);
        void                    *private;
        int                     ki_flags;
        u16                     ki_ioprio; /* See linux/ioprio.h */
        union {
                /*
                 * Only used for async buffered reads, where it denotes the
                 * page waitqueue associated with completing the read. Valid
                 * IFF IOCB_WAITQ is set.
                 */
                struct wait_page_queue  *ki_waitq;
                /*
                 * Can be used for O_DIRECT IO, where the completion handling
                 * is punted back to the issuer of the IO. May only be set
                 * if IOCB_DIO_CALLER_COMP is set by the issuer, and the issuer
                 * must then check for presence of this handler when ki_complete
                 * is invoked. The data passed in to this handler must be
                 * assigned to ->private when dio_complete is assigned.
                 */
                ssize_t (*dio_complete)(void *data);
        };
};
```

./include/linux/fs.h:992

```c
 986 /*
 987  * f_{lock,count,pos_lock} members can be highly contended and share
 988  * the same cacheline. f_{lock,mode} are very frequently used together
 989  * and so share the same cacheline as well. The read-mostly
 990  * f_{path,inode,op} are kept on a separate cacheline.
 991  */
 992 struct file {
 993         union {
 994                 struct llist_node       f_llist;
 995                 struct rcu_head         f_rcuhead;
 996                 unsigned int            f_iocb_flags;
 997         };
 998
 999         /*
1000          * Protects f_ep, f_flags.
1001          * Must not be taken from IRQ context.
1002          */
1003         spinlock_t              f_lock;
1004         fmode_t                 f_mode;
1005         atomic_long_t           f_count;
1006         struct mutex            f_pos_lock;
1007         loff_t                  f_pos;
1008         unsigned int            f_flags;
1009         struct fown_struct      f_owner;
1010         const struct cred       *f_cred;
1011         struct file_ra_state    f_ra;
1012         struct path             f_path;
1013         struct inode            *f_inode;       /* cached value */
1014         const struct file_operations    *f_op;
1015
1016         u64                     f_version;
1017 #ifdef CONFIG_SECURITY
1018         void                    *f_security;
1019 #endif
1020         /* needed for tty driver, and maybe others */
1021         void                    *private_data;
1022
1023 #ifdef CONFIG_EPOLL
1024         /* Used by fs/eventpoll.c to link all the hooks to this file */
1025         struct hlist_head       *f_ep;
1026 #endif /* #ifdef CONFIG_EPOLL */
1027         struct address_space    *f_mapping;
1028         errseq_t                f_wb_err;
1029         errseq_t                f_sb_err; /* for syncfs */
1030 } __randomize_layout
1031   __attribute__((aligned(4)));  /* lest something weird decides that 2 is OK */
```

./include/linux/pagemap.h:983:struct wait_page_queue {

```c
 983 struct wait_page_queue {
 984         struct folio *folio;
 985         int bit_nr;
 986         wait_queue_entry_t wait;
 987 };
```

./include/linux/mm_types.h:293:struct folio {

```c
/**
 * struct folio - Represents a contiguous set of bytes.
 * @flags: Identical to the page flags.
 * @lru: Least Recently Used list; tracks how recently this folio was used.
 * @mlock_count: Number of times this folio has been pinned by mlock().
 * @mapping: The file this page belongs to, or refers to the anon_vma for
 *    anonymous memory.
 * @index: Offset within the file, in units of pages.  For anonymous memory,
 *    this is the index from the beginning of the mmap.
 * @private: Filesystem per-folio data (see folio_attach_private()).
 * @swap: Used for swp_entry_t if folio_test_swapcache().
 * @_mapcount: Do not access this member directly.  Use folio_mapcount() to
 *    find out how many times this folio is mapped by userspace.
 * @_refcount: Do not access this member directly.  Use folio_ref_count()
 *    to find how many references there are to this folio.
 * @memcg_data: Memory Control Group data.
 * @_entire_mapcount: Do not use directly, call folio_entire_mapcount().
 * @_nr_pages_mapped: Do not use directly, call folio_mapcount().
 * @_pincount: Do not use directly, call folio_maybe_dma_pinned().
 * @_folio_nr_pages: Do not use directly, call folio_nr_pages().
 * @_hugetlb_subpool: Do not use directly, use accessor in hugetlb.h.
 * @_hugetlb_cgroup: Do not use directly, use accessor in hugetlb_cgroup.h.
 * @_hugetlb_cgroup_rsvd: Do not use directly, use accessor in hugetlb_cgroup.h.
 * @_hugetlb_hwpoison: Do not use directly, call raw_hwp_list_head().
 * @_deferred_list: Folios to be split under memory pressure.
 *
 * A folio is a physically, virtually and logically contiguous set
 * of bytes.  It is a power-of-two in size, and it is aligned to that
 * same power-of-two.  It is at least as large as %PAGE_SIZE.  If it is
 * in the page cache, it is at a file offset which is a multiple of that
 * power-of-two.  It may be mapped into userspace at an address which is
 * at an arbitrary page offset, but its kernel virtual address is aligned
 * to its size.
 */
struct folio {
        /* private: don't document the anon union */
        union {
                struct {
        /* public: */
                        unsigned long flags;
                        union {
                                struct list_head lru;
        /* private: avoid cluttering the output */
                                struct {
                                        void *__filler;
        /* public: */
                                        unsigned int mlock_count;
        /* private: */
                                };
        /* public: */
                        };
                        struct address_space *mapping;
                        pgoff_t index;
                        union {
                                void *private;
                                swp_entry_t swap;
                        };
                        atomic_t _mapcount;
                        atomic_t _refcount;
#ifdef CONFIG_MEMCG
                        unsigned long memcg_data;
#endif
        /* private: the union with struct page is transitional */
                };
                struct page page;
        };
        union {
                struct {
                        unsigned long _flags_1;
                        unsigned long _head_1;
                        unsigned long _folio_avail;
        /* public: */
                        atomic_t _entire_mapcount;
                        atomic_t _nr_pages_mapped;
                        atomic_t _pincount;
#ifdef CONFIG_64BIT
                        unsigned int _folio_nr_pages;
#endif
        /* private: the union with struct page is transitional */
                };
                struct page __page_1;
        };
        union {
                struct {
                        unsigned long _flags_2;
                        unsigned long _head_2;
        /* public: */
                        void *_hugetlb_subpool;
                        void *_hugetlb_cgroup;
                        void *_hugetlb_cgroup_rsvd;
                        void *_hugetlb_hwpoison;
        /* private: the union with struct page is transitional */
                };
        /* private: the union with struct page is transitional */
                };
                struct page page;
        };
        union {
                struct {
                        unsigned long _flags_1;
                        unsigned long _head_1;
                        unsigned long _folio_avail;
        /* public: */
                        atomic_t _entire_mapcount;
                        atomic_t _nr_pages_mapped;
                        atomic_t _pincount;
#ifdef CONFIG_64BIT
                        unsigned int _folio_nr_pages;
#endif
        /* private: the union with struct page is transitional */
                };
                struct page __page_1;
        };
        union {
                struct {
                        unsigned long _flags_2;
                        unsigned long _head_2;
        /* public: */
                        void *_hugetlb_subpool;
                        void *_hugetlb_cgroup;
                        void *_hugetlb_cgroup_rsvd;
                        void *_hugetlb_hwpoison;
        /* private: the union with struct page is transitional */
                };
```

