---
layout: 'index'
view: 'post'
permalink: '/posts/2023/12/16/Linux-Review.html'
opengraph:
    site:
        name: 'ProjectedBy/Sub'
        url: '/'
date: '2023/12/16 11:05:00'
title: 'Linux Review'
description: ""
category: 'LinuxReview'
tags: ['Linux', 'Review']
---

## TCP SPLICING

TCP splicing is a technique that joins two TCP connections by segment translation. It's also known as "delayed binding".

TCP 스플라이싱은 TCP 연결을 가로채고 리디렉션하는 작업으로 로드 밸런싱 시나리오에서 유용하게 적용할 수 있는 방법입니다.

일반적인 방법은 어플리케이션에서 READ & WRITE 를 통하여 트래픽을 전달하는 방법이 있습니다. 이 방법은 사용자 공간에 카피가 일어나기 때문에 비효율적인 측면이 있습니다. 이 비효율성을 줄이기 위해서 리눅스에서는 sendfile, splice, vmsplice 와 같은 방법을 제공합니다. 다만, 사용자 공간에 데이터가 복사되지 않기 때문에, 사용자 공간의 프로그램을 깨워서 작업을 해주어야 하는 비용이 존재합니다.

커널 4.14 에서 `BPF_MAP_TYPE_SOCKMAP` 소개 되었는데, 프로그램의 도움으로 소켓 간에 소켓버퍼를 리디렉션하거나 소켓 수준에서 정책을 적용하는 데 사용할 수 있게 되었습니다. 즉, 이를 통하여 로드밸런싱, 네트워크 최적화를 위한 로직을 수행하기 위해서 사용자 공간에서 수행할 수 밖에 없었던 비용을 전적으로 커널 공간으로 위임할 수 있는 방법이 생긴 것입니다.

하지만, 2019년 당시 벤치마킹으로 SOCKETMAP 은 버그가 존재하였고, 그리 좋지 않은 벤치마킹의 결과였습니다. 벤치마크에 따르면 성능 저하, 높은 지터(깨우기) 및 몇 가지 버그로 인해 아직 적용할 수 있는 상태는 아닌 듯 합니다. 하지만, 비동기식, 커널 전용, 불필요한 데이터 복사를 완전히 방지하는 등의 모든 조건을 선택하여 다른 접근 방식보다 훨씬 더 나은 성능을 발휘할 가능성이 있습니다. SOCKMAP은 여러 소켓에 걸쳐 데이터를 파이프할 수 있고 서로 데이터를 보낼 수 있는 완전한 연결 메시까지 구현 가능하게 될 수도 있습니다.

이 글의 시점이 2019년이었는데, 2023년인 지금은 eBPF/SocketMap 이 어떻게 변화되었는지 궁금해지는 아티클입니다.

오래된 아티클이지만 유용한 정보여서 공유 드립니다.

https://blog.cloudflare.com/sockmap-tcp-splicing-of-the-future





이것이 전부는 아닙니다. SOCKMAP은 여러 소켓에 걸쳐 데이터를 파이프할 수 있습니다. 서로 데이터를 보낼 수 있는 완전한 연결 메시를 상상할 수 있습니다. 또한 기본 애플리케이션 프레이밍을 오프로드하는 데 사용할 수 있는 strparser API를 공개합니다. kTLS와 결합하면 투명한 암호화와 결합할 수 있습니다. 게다가 UDP 지원을 추가한다는 소문도 있습니다. 가능성은 무한합니다.

최근 eBPF 혁신으로 커널이 폭발적으로 성장하고 있습니다. 우리는 최신 eBPF 인터페이스에 의해 노출된 가능성의 표면만을 긁어낸 것 같습니다.

처음에 SOCKMAP을 제안하고 개념 증명을 작성했으며 이제 우리가 발견한 버그를 실제로 수정한 Jakub Sitnicki에게 많은 감사를 드립니다. 바르샤바 사무실 힘내세요!




BPF_MAP_TYPE_SOCKMAP was introduced in kernel version 4.14

BPF_MAP_TYPE_SOCKMAP 및 BPF_MAP_TYPE_SOCKHASH 맵은 BPF 도우미 bpf_sk_redirect_map(), bpf_sk_redirect_hash(), bpf_msg_redirect_map() 및 BPF(평결) 프로그램의 도움으로 소켓 간에 skb를 리디렉션하거나 소켓 수준에서 정책을 적용하는 데 사용할 수 있습니다. bpf_msg_redirect_hash().




BPF_MAP_TYPE_SOCKMAP and BPF_MAP_TYPE_SOCKHASH maps can be used to redirect skbs between sockets or to apply policy at the socket level based on the result of a BPF (verdict) program with the help of the BPF helpers bpf_sk_redirect_map(), bpf_sk_redirect_hash(), bpf_msg_redirect_map() andBPF_MAP_TYPE_SOCKMAP and BPF_MAP_TYPE_SOCKHASH maps can be used to redirect skbs between sockets or to apply policy at the socket level based on the result of a BPF (verdict) program with the help of the BPF helpers bpf_sk_redirect_map(), bpf_sk_redirect_hash(), bpf_msg_redirect_map() and bpf_msg_redirect_hash().
​
314 / 5,000
Translation results
Translation result
BPF_MAP_TYPE_SOCKMAP 및 BPF_MAP_TYPE_SOCKHASH 맵은 BPF 도우미 bpf_sk_redirect_map(), bpf_sk_redirect_hash(), bpf_msg_redirect_map() 및 BPF(평결) 프로그램의 도움으로 소켓 간에 skb를 리디렉션하거나 소켓 수준에서 정책을 적용하는 데 사용할 수 있습니다. bpf_msg_redirect_hash().

eBPF(Extended Berkeley Packet Filter)는 커널 소스 코드를 변경하거나 추가 모듈을 추가하지 않고도 프로그램을 운영체제의 커널 공간에서 실행하는 기술입니다.

eBPF는 리눅스 커널에서 일어나는 다양한 이벤트들에 대해 사용자 정의된 함수들이 커널 내 샌드박스 환경에서 동작하게끔 하는 기술입니다.



SOCKMAP: 



이 기술에는 여러 가지 이점이 있습니다. 첫째, 데이터는 사용자 공간에 복사되지 않습니다. 둘째, 사용자 공간 프로그램을 깨울 필요가 없습니다. 모든 작업은 커널에서 수행됩니다. 아주 멋지지 않나요?

- Splicing: 사용자 공간 프로그램을 깨우고 데이터 조각을 전달하기 위해 두 개의 syscall을 만들어야 함
- 

우리는 여전히 사용자 공간 프로그램을 깨우고 데이터 조각을 전달하기 위해 두 개의 syscall을 만들어야 하지만 최소한 모든 복사는 피합니다.

- 전달된 모든 패킷에 대해 여러 개의 syscall 비용의 증가
- 데이터를 전달하려면 사용자 공간 프로세스를 자주 깨워야 함(스케줄러에 따라 이로 인해 테일 대기 시간이 저하 가능)
- 데이터를 커널에서 사용자 공간으로 복사한 다음 즉시 커널로 다시 복사비용





| Method   | Between                | avoid user-space memory | zerocopy |
| -------- | ---------------------- | ----------------------- | -------- |
| sendfile | disk file --> socket   | yes                     | no       |
| splice   | pipe <--> socket       | yes                     | yes?     |
| vmsplice | memory region --> pipe | no                      | yes      |



TCP 스플라이싱은 컴퓨터 네트워킹에서 성능을 향상하고 대기 시간을 줄이기 위해 사용되는 기술입니다. 여기에는 연결을 프록시하거나 종료할 필요 없이 TCP 연결을 가로채고 리디렉션하는 작업이 포함됩니다. 이를 통해 두 엔드포인트 간에 보다 효율적인 데이터 전송이 가능해집니다. TCP 스플라이싱은 네트워크 최적화 및 로드 밸런싱 시나리오에 자주 사용됩니다.

[SOCKMAP - TCP splicing of the future](https://blog.cloudflare.com/sockmap-tcp-splicing-of-the-future)
<date>2019. 02. 18.</date>
<author>Marek Majkowski</author>
<url>https://blog.cloudflare.com/sockmap-tcp-splicing-of-the-future</url>

최근에 우리는 TCP 소켓 스플라이싱 API인 역방향 프록시의 성배를 우연히 발견했습니다. 아시다시피 우리는 역방향 프록시 서비스의 글로벌 네트워크를 운영하고 있기 때문에 이것이 우리의 관심을 끌었습니다. __적절한 TCP 소켓 연결은 사용자 공간 프로세스의 로드를 줄이고 보다 효율적인 데이터 전달을 가능하게 합니다.__ 우리는 Linux 커널의 SOCKMAP 인프라가 이러한 목적으로 재사용될 수 있다는 것을 깨달았습니다. SOCKMAP은 매우 유망한 API이며 소프트웨어 프록시와 같은 데이터 집약적 애플리케이션의 아키텍처에 구조적 변화를 일으킬 가능성이 높습니다.

- Linux 커널의 `SOCKMAP` 인프라를 TCP 소켓 연결에 대하여 사용자 공간 프로세스의 로드를 줄이고 보다 효율적인 데이터 전달을 가능하게 할 수 있다.

Recently we stumbled upon the holy grail for reverse proxies - a TCP socket splicing API. This caught our attention because, as you may know, we run a global network of reverse proxy services. Proper TCP socket splicing reduces the load on userspace processes and enables more efficient data forwarding. We realized that Linux Kernel's SOCKMAP infrastructure can be reused for this purpose. SOCKMAP is a very promising API and is likely to cause a tectonic shift in the architecture of data-heavy applications like software proxies.

31958194737_e06ecd6fcc_o

Image by Mustad Marine public domain
But let’s rewind a bit.

- L7 Proxy 의 문제
    - 사용자 공간에서 대량의 데이터를 전송하는 것은 비효율적
    - Linux는 이 문제를 해결하기 위해 몇 가지 특수한 syscall을 제공
        - sendfile 시스템 호출을 사용하면 대용량 파일을 디스크에서 소켓으로 전송하는 속도를 높일 수 있음
        - splice: 전통적인 프록시가 두 TCP 소켓 간에 데이터를 전달하는 데 사용
        - vmsplice: 복사하지 않고 메모리 버퍼를 파이프에 고정할 수 있지만 올바르게 사용하기는 매우 어려움


Birthing pains of L7 proxies
Transmitting large amounts of data from userspace is inefficient. Linux provides a couple of specialized syscalls that aim to address this problem. For example, the sendfile(2) syscall (which Linus doesn't like) can be used to speed up transferring large files from disk to a socket. Then there is splice(2) which traditional proxies use to forward data between two TCP sockets. Finally, vmsplice can be used to stick memory buffer into a pipe without copying, but is very hard to use correctly.

Sadly, sendfile, splice and vmsplice are very specialized, synchronous and solve only one part of the problem - they avoid copying the data to userspace. They leave other efficiency issues unaddressed.

- 안타깝게도 sendfile, splice 및 vmsplice는 매우 전문화되고 동기식이며 데이터를 사용자 공간에 복사하지 않음

| Method   | Between                | avoid user-space memory | zerocopy |
| -------- | ---------------------- | ----------------------- | -------- |
| sendfile | disk file --> socket   | yes                     | no       |
| splice   | pipe <--> socket       | yes                     | yes?     |
| vmsplice | memory region --> pipe | no                      | yes      |

대량의 데이터를 전달하는 프로세스는 세 가지 문제에 직면합니다.

- Syscall 비용: 전달된 모든 패킷에 대해 여러 개의 syscall을 만드는 것은 비용이 많이 듭니다.
- 깨우기 대기 시간: 데이터를 전달하려면 사용자 공간 프로세스를 자주 깨워야 합니다. 스케줄러에 따라 이로 인해 테일 대기 시간이 저하될 수 있습니다.
- 복사 비용: 데이터를 커널에서 사용자 공간으로 복사한 다음 즉시 커널로 다시 복사하는 것은 무료가 아니며 측정 가능한 비용이 추가됩니다.


Processes that forward large amounts of data face three problems:

Syscall cost: making multiple syscalls for every forwarded packet is costly.

Wakeup latency: the user-space process must be woken up often to forward the data. Depending on the scheduler, this may result in poor tail latency.

Copying cost: copying data from kernel to userspace and then immediately back to the kernel is not free and adds up to a measurable cost.

Many tried
Forwarding data between TCP sockets is a common practice. It's needed for:

Transparent forward HTTP proxies, like Squid.
Reverse caching HTTP proxies, like Varnish or NGINX.
Load balancers, like HAProxy, Pen or Relayd.
Over the years there have been many attempts to reduce the cost of dumb data forwarding between TCP sockets on Linux. This issue is generally called “TCP splicing”, “L7 splicing”, or “Socket splicing”.

- 수년에 걸쳐 Linux의 TCP 소켓 간 멍청한 데이터 전달 비용을 줄이려는 많은 시도가 있었습니다. 이 문제를 일반적으로 "TCP 스플라이싱", "L7 스플라이싱" 또는 "소켓 스플라이싱"이라고 합니다.

Let’s compare the usual ways of doing TCP splicing. To simplify the problem, instead of writing a rich Layer 7 TCP proxy, we'll write a trivial TCP echo server.

It's not a joke. An echo server can illustrate TCP socket splicing well. You know - "echo" basically splices the socket… with itself!

1. 일반적인 방법 Read & Write Loop

Naive: read write loop

The naive TCP echo server would look like:

```
while data:
    data = read(sd, 4096)
    writeall(sd, data)
```

Nothing simpler. On a blocking socket this is a totally valid program, and will work just fine. For completeness I prepared full code here.

2. Splice: 시스템콜

소켓의 TCP 버퍼와 파이프의 버퍼 간에 데이터를 이동하도록 커널에 지시할 수 있음

데이터는 커널 측 버퍼에 남아 있습니다. 이는 사용자 공간과 커널 공간 사이에서 불필요하게 데이터를 복사해야 하는 문제를 해결

SPLICE_F_MOVE 플래그를 사용하면 커널은 전체 데이터 카피를 피할 수 있다. (With the SPLICE_F_MOVE flag the kernel may be able to avoid copying the data at all!)


Linux에는 놀라운 splice(2) syscall이 있습니다. 소켓의 TCP 버퍼와 파이프의 버퍼 간에 데이터를 이동하도록 커널에 지시할 수 있습니다. 데이터는 커널 측 버퍼에 남아 있습니다. 이는 사용자 공간과 커널 공간 사이에서 불필요하게 데이터를 복사해야 하는 문제를 해결합니다. SPLICE_F_MOVE 플래그를 사용하면 커널이 데이터 복사를 전혀 피할 수 있습니다!

우리는 여전히 사용자 공간 프로그램을 깨우고 데이터 조각을 전달하기 위해 두 개의 syscall을 만들어야 하지만 최소한 모든 복사는 피합니다. 전체 소스.

Splice: specialized syscall

Linux has an amazing splice(2) syscall. It can tell the kernel to move data between a TCP buffer on a socket and a buffer on a pipe. The data remains in the buffers, on the kernel side. This solves the problem of needlessly having to copy the data between userspace and kernel-space. With the SPLICE_F_MOVE flag the kernel may be able to avoid copying the data at all!

Our program using splice() looks like:

pipe_rd, pipe_wr = pipe()
fcntl(pipe_rd, F_SETPIPE_SZ, 4096);

while n:
    n = splice(sd, pipe_wr, 4096)
    splice(pipe_rd, sd, n)
We still need wake up the userspace program and make two syscalls to forward any piece of data, but at least we avoid all the copying. Full source.

3. io_submit: Using Linux AIO API

4. SOCKMAP: The ultimate weapon

bpf_sk_redirect_map에 대한 호출이 모든 작업을 수행합니다. 커널에 알려줍니다. 수신된 패킷의 경우 일부 소켓의 수신 큐에서 인덱스 0 아래 sock_map에 있는 소켓의 전송 큐로 리디렉션하세요. 우리의 경우에는 동일한 소켓입니다! 여기서 우리는 에코 서버가 수행해야 하는 작업을 정확히 달성했지만 순전히 eBPF에서만 수행했습니다.

- eBPF 에 대하 설명이 필요

- 이 기술에는 여러 가지 이점이 있습니다. 첫째, 데이터는 사용자 공간에 복사되지 않습니다. 둘째, 사용자 공간 프로그램을 깨울 필요가 없습니다. 모든 작업은 커널에서 수행됩니다. 아주 멋지지 않나요?

io_submit: Using Linux AIO API
In a previous blog post about io_submit() we proposed using the AIO interface with network sockets. Read the blog post for details, but here is the prepared program that has the echo server loop implemented with only a single syscall.

452423494_31aa5caca5_z-1

Image by jrsnchzhrs By-Nd 2.0
SOCKMAP: The ultimate weapon
In recent years Linux Kernel introduced an eBPF virtual machine. With it, user-space programs can run specialized, non-turing-complete bytecode in the kernel context. Nowadays it's possible to select eBPF programs for dozens of use cases, ranging from packet filtering, to policy enforcement.

From Kernel 4.14 Linux got new eBPF machinery that can be used for socket splicing - SOCKMAP. It was created by John Fastabend at Cilium.io, exposing the Strparser interface to eBPF programs. Cilium uses SOCKMAP for Layer 7 policy enforcement, and all the logic it uses is embedded in an eBPF program. The API is not well documented, requires root and, from our experience, is slightly buggy. But it's very promising. Read more:

LPC2018 - Combining kTLS and BPF for Introspection and Policy Enforcement Paper Video Slides
Original SOCKMAP commit
This is how to use SOCKMAP: SOCKMAP or specifically "BPF_MAP_TYPE_SOCKMAP", is a type of an eBPF map. This map is an "array" - indices are integers. All this is pretty standard. The magic is in the map values - they must be TCP socket descriptors.

This map is very special - it has two eBPF programs attached to it. You read it right: the eBPF programs live attached to a map, not attached to a socket, cgroup or network interface as usual. This is how you would set up SOCKMAP in user program:

sock_map = bpf_create_map(BPF_MAP_TYPE_SOCKMAP, sizeof(int), sizeof(int), 2, 0)

prog_parser = bpf_load_program(BPF_PROG_TYPE_SK_SKB, ...)
prog_verdict = bpf_load_program(BPF_PROG_TYPE_SK_SKB, ...)
bpf_prog_attach(prog_parser, sock_map, BPF_SK_SKB_STREAM_PARSER)
bpf_prog_attach(prog_verdict, sock_map, BPF_SK_SKB_STREAM_VERDICT)
Ta-da! At this point we have an established sock_map eBPF map, with two eBPF programs attached: parser and verdict. The next step is to add a TCP socket descriptor to this map. Nothing simpler:

int idx = 0;
int val = sd;
bpf_map_update_elem(sock_map, &idx, &val, BPF_ANY);
At this point the magic happens. From now on, each time our socket sd receives a packet, prog_parser and prog_verdict are called. Their semantics are described in the strparser.txt and the introductory SOCKMAP commit. For simplicity, our trivial echo server only needs the minimal stubs. This is the eBPF code:

SEC("prog_parser")
int _prog_parser(struct __sk_buff *skb)
{
	return skb->len;
}

SEC("prog_verdict")
int _prog_verdict(struct __sk_buff *skb)
{
	uint32_t idx = 0;
	return bpf_sk_redirect_map(skb, &sock_map, idx, 0);
}
Side note: for the purposes of this test program, I wrote a minimal eBPF loader. It has no dependencies (neither bcc, libelf, or libbpf) and can do basic relocations (like resolving the sock_map symbol mentioned above). See the code.

The call to bpf_sk_redirect_map is doing all the work. It tells the kernel: for the received packet, please oh please redirect it from a receive queue of some socket, to a transmit queue of the socket living in sock_map under index 0. In our case, these are the same sockets! Here we achieved exactly what the echo server is supposed to do, but purely in eBPF.

This technology has multiple benefits. First, the data is never copied to userspace. Secondly, we never need to wake up the userspace program. All the action is done in the kernel. Quite cool, isn't it?

We need one more piece of code, to hang the userspace program until the socket is closed. This is best done with good old poll(2):

/* Wait for the socket to close. Let SOCKMAP do the magic. */
struct pollfd fds[1] = {
    {.fd = sd, .events = POLLRDHUP},
};
poll(fds, 1, -1);
Full code.

The benchmarks
At this stage we have presented four simple TCP echo servers:

naive read-write loop
splice
io_submit
SOCKMAP
To recap, we are measuring the cost of three things:

Syscall cost
Wakeup latency, mostly visible as tail latency
The cost of copying data
Theoretically, SOCKMAP should beat all the others:

syscall cost	waking up userspace	copying cost
read write loop	2 syscalls	yes	2 copies
splice	2 syscalls	yes	0 copy (?)
io_submit	1 syscall	yes	2 copies
SOCKMAP	none	no	0 copies
Show me the numbers
This is the part of the post where I'm showing you the breathtaking numbers, clearly showing the different approaches. Sadly, benchmarking is hard, and well... SOCKMAP turned out to be the slowest. It's important to publish negative results so here they are.

Our test rig was as follows:

Two bare-metal Xeon servers connected with a 25Gbps network.
Both have turbo-boost disabled, and the testing programs are CPU-pinned.
For better locality we localized RX and TX queues to one IRQ/CPU each.
The testing server runs a script that sends 10k batches of fixed-sized blocks of data. The script measures how long it takes for the echo server to return the traffic.
We do 10 separate runs for each measured echo-server program.
TCP: "cubic" and NONAGLE=1.
Both servers run the 4.14 kernel.
Our analysis of the experimental data identified some outliers. We think some of the worst times, manifested as long echo replies, were caused by unrelated factors such as network packet loss. In the charts presented we, perhaps controversially, skip the bottom 1% of outliers in order to focus on what we think is the important data.

Furthermore, we spotted a bug in SOCKMAP. Some of the runs were delayed by up to whopping 64ms. Here is one of the tests:

Values min:236.00 avg:669.28 med=390.00 max:78039.00 dev:3267.75 count:2000000
Values:
 value |-------------------------------------------------- count
     1 |                                                   0
     2 |                                                   0
     4 |                                                   0
     8 |                                                   0
    16 |                                                   0
    32 |                                                   0
    64 |                                                   0
   128 |                                                   0
   256 |                                                   3531
   512 |************************************************** 1756052
  1024 |                                             ***** 208226
  2048 |                                                   18589
  4096 |                                                   2006
  8192 |                                                   9
 16384 |                                                   1
 32768 |                                                   0
 65536 |                                                   11585
131072 |                                                   1
The great majority of the echo runs (of 128KiB in this case) were finished in the 512us band, while a small fraction stalled for 65ms. This is pretty bad and makes comparison of SOCKMAP to other implementations pretty meaningless. This is a second reason why we are skipping 1% of worst results from all the runs - it makes SOCKMAP numbers way more usable. Sorry.

2MiB blocks - throughput
The fastest of our programs was doing ~15Gbps over one flow, which seems to be a hardware limit. This is very visible in the first iteration, which shows the throughput of our echo programs.

This test shows: Time to transmit and receive 2MiB blocks of data, via our tested echo server. We repeat this 10k times, and run the test 10 times. After stripping the worst 1% numbers we get the following latency distribution:

numbers-2mib-2

This charts shows that both naive read+write and io_submit programs were able to achieve 1500us mean round trip time for TCP echo server of 2MiB blocks.

Here we clearly see that splice and SOCKMAP are slower than others. They were CPU-bound and unable to reach the line rate. We have raised the unusual splice performance problems in the past, but perhaps we should debug it one more time.

For each server we run the tests twice: without and with SO_BUSYPOLL setting. This setting should remove the "wakeup latency" and greatly reduce the jitter. The results show that naive and io_submit tests are almost identical. This is perfect! BUSYPOLL does indeed reduce the deviation and latency, at a cost of more CPU usage. Notice that neither splice nor SOCKMAP are affected by this setting.

16KiB blocks - wakeup time
Our second run of tests was with much smaller data sizes, sending tiny 16KiB blocks at a time. This test should illustrate the "wakeup time" of the tested programs.

numbers-16kib-1

In this test the non-BUSYPOLL runs of all the programs look quite similar (min and max values), with SOCKMAP being the exception. This is great - we can speculate the wakeup time is comparable. Surprisingly, the splice has slightly better median time from others. Perhaps this can be explained by CPU artifacts, like having better CPU cache locality due to less data copying. SOCKMAP is again, slowest with worst max and median times. Boo.

Remember we truncated the worst 1% of the data - we artificially shortened the "max" values.

TL;DR
In this blog post we discussed the theoretical benefits of SOCKMAP. Sadly, we noticed it's not ready for prime time yet. We compared it against splice, which we noticed didn't benefit from BUSYPOLL and had disappointing performance. We noticed that the naive read/write loop and iosubmit approaches have exactly the same performance characteristics and do benefit from BUSYPOLL to reduce jitter (wakeup time).

If you are piping data between TCP sockets, you should definitely take a look at SOCKMAP. While our benchmarks show it's not ready for prime time yet, with poor performance, high jitter and a couple of bugs, it's very promising. We are very excited about it. It's the first technology on Linux that truly allows the user-space process to offload TCP splicing to the kernel. It also has potential for much better performance than other approaches, ticking all the boxes of being async, kernel-only and totally avoiding needless copying of data.

This is not everything. SOCKMAP is able to pipe data across multiple sockets - you can imagine a full mesh of connections being able to send data to each other. Furthermore it exposes the strparser API, which can be used to offload basic application framing. Combined with kTLS you can combine it with transparent encryption. Furthermore, there are rumors of adding UDP support. The possibilities are endless.

Recently the kernel has been exploding with eBPF innovations. It seems like we've only just scratched the surface of the possibilities exposed by the modern eBPF interfaces.

Many thanks to Jakub Sitnicki for suggesting SOCKMAP in the first place, writing the proof of concept and now actually fixing the bugs we found. Go strong Warsaw office!

We protect entire corporate networks, help customers build Internet-scale applications efficiently, accelerate any website or Internet application, ward off DDoS attacks, keep hackers at bay, and can help you on your journey to Zero Trust.

Visit 1.1.1.1 from any device to get started with our free app that makes your Internet faster and safer.

To learn more about our mission to help build a better Internet, start here. If you're looking for a new career direction, check out our open positions.

이 블로그 게시물에서 우리는 SOCKMAP의 이론적 이점에 대해 논의했습니다. 안타깝게도 아직 황금 시간대에 사용할 준비가 되지 않은 것으로 나타났습니다. 우리는 이것을 BUSYPOLL의 이점을 얻지 못하고 실망스러운 성능을 보인 splice와 비교했습니다. 우리는 순진한 읽기/쓰기 루프와 iosubmit 접근 방식이 정확히 동일한 성능 특성을 가지며 지터(깨우기 시간)를 줄이기 위해 BUSYPOLL의 이점을 누리는 것을 확인했습니다.

TCP 소켓 간에 데이터를 파이핑하는 경우 반드시 SOCKMAP을 살펴봐야 합니다. 벤치마크에 따르면 성능 저하, 높은 지터 및 몇 가지 버그로 인해 아직 전성기를 맞이할 준비가 되지 않았지만 매우 유망합니다. 우리는 그것에 대해 매우 기대하고 있습니다. 이는 사용자 공간 프로세스가 TCP 스플라이싱을 커널로 오프로드할 수 있도록 하는 Linux의 최초 기술입니다. 또한 비동기식, 커널 전용, 불필요한 데이터 복사를 완전히 방지하는 등의 모든 조건을 선택하여 다른 접근 방식보다 훨씬 더 나은 성능을 발휘할 가능성이 있습니다.

이것이 전부는 아닙니다. SOCKMAP은 여러 소켓에 걸쳐 데이터를 파이프할 수 있습니다. 서로 데이터를 보낼 수 있는 완전한 연결 메시를 상상할 수 있습니다. 또한 기본 애플리케이션 프레이밍을 오프로드하는 데 사용할 수 있는 strparser API를 공개합니다. kTLS와 결합하면 투명한 암호화와 결합할 수 있습니다. 게다가 UDP 지원을 추가한다는 소문도 있습니다. 가능성은 무한합니다.

최근 eBPF 혁신으로 커널이 폭발적으로 성장하고 있습니다. 우리는 최신 eBPF 인터페이스에 의해 노출된 가능성의 표면만을 긁어낸 것 같습니다.

처음에 SOCKMAP을 제안하고 개념 증명을 작성했으며 이제 우리가 발견한 버그를 실제로 수정한 Jakub Sitnicki에게 많은 감사를 드립니다. 바르샤바 사무실 힘내세요!