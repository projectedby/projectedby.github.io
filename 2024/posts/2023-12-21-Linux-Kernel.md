---
layout: 'index'
view: 'post'
permalink: '/posts/2023/12/21/Linux-Kernel.html'
opengraph:
    site:
        name: 'ProjectedBy/Sub'
        url: '/'
date: '2023/12/21 15:47:00'
title: 'Linux Kernel'
description: ""
category: 'Linux Kernel'
tags: ['Linux Kernel']
---

## 리눅스 커널 코드 스니펫 6.6.4 net/socket.c:174 pf_family_names: const char *[]

각각의 프로토콜 정수 값과 문자열을 매핑한 데이터입니다.

PF_UNSPEC: 지정되지 않은 프로토콜
PF_UNIX/PF_LOCAL: 유닉스 혹은 로컬 프로토콜
PF_INET: 인터넷 프로토콜
PF_AX25: Amateur Radio AX.25 프로토콜
PF_IPX: Novell IPX 프토토콜
PF_APPLETALK: 애플토크 프로토콜
PF_NETROM: 아마추어 라디오 네트워킹에 사용되는 프로토콜
PF_BRIDGE: 다중 프로토콜 브리지에 사용되는 프로토콜
PF_ATMPVC: ATM 네트워크에서 가상 회선을 생성하고 관리하는 데 사용되는 프로토콜
PF_X25: X.25 네트워크에서 연결 지향 데이터 전송을 제공하는 프로토콜입
PF_INET6: 인터넷 버전 6 프로토콜
PF_ROSE: X.25 네트워크에서 향상된 기능을 제공하기 위해 개발된 프로토콜
PF_DECnet: Digital Equipment Corporation (DEC)가 개발한 DECnet 네트워크를 위한 프로토콜
PF_NETBEUI: IBM에서 개발한 비연결형 데이터그램 프로토콜
PF_SECURITY: 실제 프로토콜이 아니며, 보안 관련 기능을 제공하기 위해 사용
PF_KEY: IPsec을 포함한 다양한 보안 프로토콜에서 사용되는 키 관리 프로토콜
PF_NETLINK/PF_ROUTE: 네트워크 경로 정보를 교환하기 위해 사용되는 프로토콜
PF_PACKET: 이더넷, 토큰링, FDDI와 같은 하위 계층 프로토콜을 직접 제어할 수 있는 프로토콜
PF_ASH:  IBM에서 개발한 애플리케이션 계층 소켓 프로토콜
PF_ECONET: Acorn Computers에서 개발한 네트워크 프로토콜
PF_ATMSVC: ATM 네트워크에서 사용되는 프로토콜
PF_RDS: 신뢰할 수 있는 데이터그램 소켓 프로토콜
PF_SNA: IBM Systems Network Architecture(SNA)에서 사용되는 프로토콜
PF_IRDA: 근거리 무선 통신(NFC) 프로토콜인 인프라레드(IR)을 사용하여 데이터를 전송하는 프로토콜
PF_PPPOX: PPP(Point-to-Point Protocol)를 통해 데이터를 전송하는 프로토콜
PF_WANPIPE: WANPIPE API를 사용하여 WAN 연결을 제공하는 프로토콜
PF_LLC: IEEE 802.2 LLC(Logical Link Control) 프로토콜을 사용하여 데이터를 전송하는 프로토콜
PF_IB: InfiniBand(IB) 네트워크를 통해 데이터를 전송하는 프로토콜
PF_MPLS: 멀티 프로토콜 레이블 스위칭(MPLS)을 사용하여 데이터를 전송하는 프로토콜
PF_CAN: CAN(Controller Area Network)을 사용하여 데이터를 전송하는 프로토콜
PF_TIPC: TIPC(Traffic Control In Packets)를 사용하여 데이터를 전송하는 프로토콜
PF_BLUETOOTH: Bluetooth 네트워크를 통해 데이터를 전송하는 프로토콜
PF_IUCV: Intel I/O Virtualization Connectivity(IUCV)를 사용하여 데이터를 전송하는 프로토콜
PF_RXRPC: Remote Procedure Call(RPC)을 사용하여 데이터를 전송하는 프로토콜
PF_ISDN: Integrated Services Digital Network(ISDN)을 사용하여 데이터를 전송하는 프로토콜
PF_PHONET: Phonet 네트워크를 통해 데이터를 전송하는 프로토콜
PF_IEEE802154: IEEE 802.15.4 표준을 사용하여 데이터를 전송하는 프로토콜
PF_CAIF: Cellular Application Interface(CAIF)를 사용하여 데이터를 전송하는 프로토콜
PF_ALG: Crypto API 를 위한 프로토콜
PF_NFC: 근거리 무선통신(NFC) 장치 간에 데이터를 전송하는 프로토콜
PF_VSOCK: 가상 머신(VM) 간에 통신하는 데 사용되는 프로토콜
PF_KCM: 커널 모드에서 실행되는 애플리케이션 간에 안전하고 효율적으로 통신을 위한 프로토콜
PF_QIPCRTR: Qualcomm IPC Router(QIPCRTR)을 통해 Qualcomm 프로세서 내에서 통신을 제공하는 프로토콜
PF_SMC: System Management Controller(SMC)을 통해 하드웨어 컴포넌트 간에 통신을 제공하는 프로토콜
PF_XDP: 리눅스의 네트워크 패킷이 커널에 도달하기 전에 패킷을 처리할 수 있도록 패킷을 필터링하는데 사용되는 프로토콜
PF_MCTP: 리눅스의 관리 구성 요소 간의 통신을 위한 메시지 전송 프로토콜

대략적으로 네트워크를 위한 프로토콜과 프로세스 상호간의 통신을 위한 IPC 등의 프로토콜로 나뉘어집니다.

```c
// net/socket.c:174

static const char * const pf_family_names[] = {
        [PF_UNSPEC]     = "PF_UNSPEC",
        [PF_UNIX]       = "PF_UNIX/PF_LOCAL",
        [PF_INET]       = "PF_INET",
        [PF_AX25]       = "PF_AX25",
        [PF_IPX]        = "PF_IPX",
        [PF_APPLETALK]  = "PF_APPLETALK",
        [PF_NETROM]     = "PF_NETROM",
        [PF_BRIDGE]     = "PF_BRIDGE",
        [PF_ATMPVC]     = "PF_ATMPVC",
        [PF_X25]        = "PF_X25",
        [PF_INET6]      = "PF_INET6",
        [PF_ROSE]       = "PF_ROSE",
        [PF_DECnet]     = "PF_DECnet",
        [PF_NETBEUI]    = "PF_NETBEUI",
        [PF_SECURITY]   = "PF_SECURITY",
        [PF_KEY]        = "PF_KEY",
        [PF_NETLINK]    = "PF_NETLINK/PF_ROUTE",
        [PF_PACKET]     = "PF_PACKET",
        [PF_ASH]        = "PF_ASH",
        [PF_ECONET]     = "PF_ECONET",
        [PF_ATMSVC]     = "PF_ATMSVC",
        [PF_RDS]        = "PF_RDS",
        [PF_SNA]        = "PF_SNA",
        [PF_IRDA]       = "PF_IRDA",
        [PF_PPPOX]      = "PF_PPPOX",
        [PF_WANPIPE]    = "PF_WANPIPE",
        [PF_LLC]        = "PF_LLC",
        [PF_IB]         = "PF_IB",
        [PF_MPLS]       = "PF_MPLS",
        [PF_CAN]        = "PF_CAN",
        [PF_TIPC]       = "PF_TIPC",
        [PF_BLUETOOTH]  = "PF_BLUETOOTH",
        [PF_IUCV]       = "PF_IUCV",
        [PF_RXRPC]      = "PF_RXRPC",
        [PF_ISDN]       = "PF_ISDN",
        [PF_PHONET]     = "PF_PHONET",
        [PF_IEEE802154] = "PF_IEEE802154",
        [PF_CAIF]       = "PF_CAIF",
        [PF_ALG]        = "PF_ALG",
        [PF_NFC]        = "PF_NFC",
        [PF_VSOCK]      = "PF_VSOCK",
        [PF_KCM]        = "PF_KCM",
        [PF_QIPCRTR]    = "PF_QIPCRTR",
        [PF_SMC]        = "PF_SMC",
        [PF_XDP]        = "PF_XDP",
        [PF_MCTP]       = "PF_MCTP",
};
```