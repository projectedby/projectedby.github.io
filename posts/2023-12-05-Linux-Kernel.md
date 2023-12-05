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

```c
struct kiocb {
	struct file		*ki_filp;
	loff_t			ki_pos;
	void (*ki_complete)(struct kiocb *iocb, long ret);
	void			*private;
	int			ki_flags;
	u16			ki_ioprio; /* See linux/ioprio.h */
	union {
		/*
		 * Only used for async buffered reads, where it denotes the
		 * page waitqueue associated with completing the read. Valid
		 * IFF IOCB_WAITQ is set.
		 */
		struct wait_page_queue	*ki_waitq;
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
