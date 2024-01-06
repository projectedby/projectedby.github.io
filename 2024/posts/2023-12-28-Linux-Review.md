---
layout: 'index'
view: 'post'
permalink: '/posts/2023/12/28/Linux-Review.html'
opengraph:
    site:
        name: 'ProjectedBy/Sub'
        url: '/'
date: '2023/12/28 10:44:00'
title: 'Linux Review'
description: ""
category: 'LinuxReview'
tags: ['Linux', 'Review']
---

## 

Using drgn on production kernels

프로덕션 커널에서 drgn 사용

By Jake Edge
November 28, 2023
LPC

The drgn Python-based kernel debugger was developed by Omar Sandoval for use in his job on the kernel team at Meta. He now spends most of his time working on drgn, both in developing new features for the tool and in using it to debug production problems at Meta, which gives him a view of both ends of that feedback loop. At the 2023 Linux Plumbers Conference (LPC), he led a session on drgn in the kernel debugging microconference, where he wanted to brainstorm on how to add some new features to the debugger and, in particular, how to allow them to work on production kernels.

1. drgn Python 기반 커널 디버거는 Omar Sandoval이 Meta의 커널 팀에서 업무에 사용하기 위해 개발

drgn Python 기반 커널 디버거는 Omar Sandoval이 Meta의 커널 팀에서 업무에 사용하기 위해 개발했습니다. 그는 이제 도구의 새로운 기능을 개발하고 이를 사용하여 Meta에서 생산 문제를 디버깅하는 데 대부분의 시간을 drgn 작업에 사용합니다. 이를 통해 피드백 루프의 양쪽 끝을 모두 볼 수 있습니다. 2023 LPC(Linux Plumbers Conference)에서 그는 커널 디버깅 마이크로컨퍼런스에서 drgn에 대한 세션을 이끌었습니다. 여기서 그는 디버거에 몇 가지 새로운 기능을 추가하는 방법, 특히 이러한 기능이 프로덕션에서 작동하도록 허용하는 방법에 대해 브레인스토밍하고 싶었습니다. 커널.

Quick intro

Sandoval had a presentation on drgn (which is pronounced "dragon") in 2019 that covered some of the basics of the tool, which has presumably evolved since then. He has given other in-depth talks on drgn, he said, but he would just be doing a quick introduction to the tool at the LPC session. After that, he wanted to focus on the two features, writing to memory and setting breakpoints, and to justify why his team wants to be able to do those things on kernels running in production ("as crazy as it sounds"). He hoped that the brainstorming could come up with both a mechanism for supporting the features and an API that is "friendly enough, but also not so dangerous in the sense that you won't accidentally do something that you didn't mean to do".

Drgn is a "programmable debugger"; rather than having built-in commands, it provides building blocks, representations of kernel objects, types, stack traces, and more, that can be used to create the tool needed for the job at hand. There are, for example, many kernel-specific helper functions that provide access to various internal data structures, such as to find task structures or to walk various slab caches. Those can be used in an interactive session and then turned into scripts that can be saved (or shared with others) for the next time a similar problem arises, he said.

빠른 소개

Sandoval은 2019년에 drgn("드래곤"으로 발음함)에 대한 프레젠테이션을 진행했는데, 이 프레젠테이션에서는 도구의 기본 사항 중 일부를 다루었는데, 이는 아마도 그 이후로 발전했을 것입니다. 그는 drgn에 대해 다른 심도 있는 강연을 했지만 LPC 세션에서 이 도구에 대해 간단히 소개할 뿐이라고 말했습니다. 그 후 그는 메모리에 쓰기와 중단점 설정이라는 두 가지 기능에 초점을 맞추고 그의 팀이 프로덕션에서 실행되는 커널에서 이러한 작업을 수행할 수 있기를 원하는 이유를 설명하고 싶었습니다("말도 안 되는 소리"). 그는 브레인스토밍을 통해 기능을 지원하는 메커니즘과 "충분히 친숙하면서도 의도하지 않은 일을 실수로 하지 않을 만큼 위험하지 않은" API를 모두 생각해 낼 수 있기를 바랐습니다. .

2. Drgn은 "프로그래밍 가능한 디버거"입니다.

3. 내장된 명령을 사용하는 대신 현재 작업에 필요한 도구를 만드는 데 사용할 수 있는 빌딩 블록, 커널 개체 표현, 유형, 스택 추적 등을 제공

Drgn은 "프로그래밍 가능한 디버거"입니다. 내장된 명령을 사용하는 대신 현재 작업에 필요한 도구를 만드는 데 사용할 수 있는 빌딩 블록, 커널 개체 표현, 유형, 스택 추적 등을 제공합니다. 예를 들어 작업 구조를 찾거나 다양한 슬랩 캐시를 탐색하는 등 다양한 내부 데이터 구조에 대한 액세스를 제공하는 커널별 도우미 함수가 많이 있습니다. 이는 대화형 세션에서 사용될 수 있으며 다음에 비슷한 문제가 발생할 때를 위해 저장(또는 다른 사람과 공유)할 수 있는 스크립트로 바뀔 수 있다고 그는 말했습니다.

He did a brief demo of drgn on a virtual machine on his laptop; the YouTube video of the presentation from the conference livestream is available for the curious. In the Python read-eval-print loop (REPL), he had a handful of import statements pre-typed and then proceeded to demonstrate some of the capabilities, such as looking up the idle task using its variable name (init_task) with one of the kernel helpers.

He also showed a loop using the for_each_task() kernel helper that found the task structure for a cat he had running in a shell; he could then print the stack trace for that task, which had all of the symbol information, filenames, and line numbers. He used the stack-frame number to index into an array to further investigate a particular stack frame, including things like its local variables and their values. There are also a large number of contributed scripts that consist of "people's debugging sessions" that can be examined in addition to all of the helpers that come with drgn.

All of what he had shown is read-only, however; you can read any memory in the live kernel or in a kernel dump. But users have been asking for read-write features for the live kernel for some time; that would allow overwriting memory and setting breakpoints in the running kernel. That makes sense for development workflows, Sandoval said; drgn could attach to the kernel running in QEMU using its GDB stub. That functionality is something that developers are used to when debugging, so he would like to support it in drgn.

그는 랩톱의 가상 머신에서 drgn에 대한 간단한 데모를 수행했습니다. 호기심이 있으신 분들은 컨퍼런스 실시간 스트리밍 프레젠테이션을 담은 YouTube 동영상을 시청하실 수 있습니다. Python REPL(읽기-평가-인쇄 루프)에서 그는 미리 입력된 몇 가지 import 문을 갖고 다음 중 하나를 사용하여 변수 이름(init_task)을 사용하여 유휴 작업을 조회하는 등 일부 기능을 시연했습니다. 커널 도우미.

그는 또한 쉘에서 실행 중인 고양이에 대한 작업 구조를 찾는 for_each_task() 커널 도우미를 사용하여 루프를 보여주었습니다. 그런 다음 그는 모든 기호 정보, 파일 이름 및 줄 번호가 포함된 해당 작업에 대한 스택 추적을 인쇄할 수 있었습니다. 그는 스택 프레임 번호를 사용하여 배열을 색인화하여 지역 변수 및 해당 값과 같은 항목을 포함하여 특정 스택 프레임을 추가로 조사했습니다. 또한 drgn과 함께 제공되는 모든 도우미 외에 검사할 수 있는 "사람들의 디버깅 세션"으로 구성된 다수의 기여 스크립트도 있습니다.

4. drgn은 GDB 스텁을 사용하여 QEMU에서 실행되는 커널에 연결할 수 있습니다

그러나 그가 보여준 모든 것은 읽기 전용입니다. 라이브 커널이나 커널 덤프에서 모든 메모리를 읽을 수 있습니다. 그러나 사용자들은 한동안 라이브 커널에 대한 읽기-쓰기 기능을 요구해 왔습니다. 그러면 실행 중인 커널에서 메모리를 덮어쓰고 중단점을 설정할 수 있습니다. 이는 개발 워크플로에 적합하다고 Sandoval은 말했습니다. drgn은 GDB 스텁을 사용하여 QEMU에서 실행되는 커널에 연결할 수 있습니다. 해당 기능은 개발자가 디버깅할 때 익숙한 기능이므로 drgn에서 지원하고 싶습니다.

He has a proposed memory-writing API that, at its most basic level, just takes a target address and buffer of bytes to write there, which makes the user responsible for figuring out the right address and how to place the values into the buffer correctly based on the kernel type. On top of that would be a more user-friendly interface that would mirror the read side to a certain extent; objects can be looked up, then their fields can be used as Python attributes, with drgn ensuring that the write is done correctly. It could potentially also take a Python dictionary with structure fields as keys to write a structure with those values. The API is still up for debate as he has not implemented anything yet.

"Breakpoints are a little more complicated, but not too much." There are a few different ways a user might want to set a breakpoint: by address, function name, function name and offset, or filename and line number. Then handling any breakpoints might be done with a synchronous event loop, where the events indicate which thread hit the breakpoint, allow access to things like the stack trace and local variables for the stack frames, and provide a way to resume the thread after the processing is done.

Once again, Sandoval said that he was interested in hearing about simpler alternatives or use cases that still needed to be covered. Chris Mason said that he wanted to be able to see when a frequently called function is being called from some other specific function; Sandoval said that could be done with his API just by looking at the stack frame in the breakpoint and resuming unless it is being called by the function of interest. Another attendee suggested watchpoints for memory, which Sandoval thought could be added to the API in a way similar to the set_breakpoint() call he was proposing.

6. 그는 가장 기본적인 수준에서 대상 주소와 바이트 버퍼를 사용하여 거기에 쓰기 위한 메모리 쓰기 API를 제안

그는 가장 기본적인 수준에서 대상 주소와 바이트 버퍼를 사용하여 거기에 쓰기 위한 메모리 쓰기 API를 제안했습니다. 이를 통해 사용자는 올바른 주소를 파악하고 값을 버퍼에 올바르게 배치하는 방법을 책임지게 됩니다. 커널 유형을 기반으로 합니다. 그 위에는 읽기 측면을 어느 정도 반영하는 보다 사용자 친화적인 인터페이스가 있을 것입니다. 객체를 조회한 다음 해당 필드를 Python 속성으로 사용할 수 있으며 drgn을 사용하면 쓰기가 올바르게 수행되었는지 확인할 수 있습니다. 해당 값으로 구조를 작성하기 위해 구조 필드가 있는 Python 사전을 키로 사용할 수도 있습니다. API는 아직 아무것도 구현하지 않았기 때문에 여전히 논쟁의 여지가 있습니다.

"중단점은 조금 더 복잡하지만 너무 많지는 않습니다." 사용자가 중단점을 설정하는 방법에는 주소, 함수 이름, 함수 이름 및 오프셋, 파일 이름 및 줄 번호 등 여러 가지가 있습니다. 그런 다음 중단점 처리는 동기 이벤트 루프를 통해 수행될 수 있습니다. 여기서 이벤트는 중단점에 도달한 스레드를 나타내고, 스택 추적 및 스택 프레임에 대한 로컬 변수에 대한 액세스를 허용하며, 처리 후 스레드를 재개하는 방법을 제공합니다. 수행.

다시 한 번 Sandoval은 더 간단한 대안이나 아직 다루어야 할 사용 사례에 대해 듣고 싶다고 말했습니다. Chris Mason은 자주 호출되는 함수가 다른 특정 함수에서 호출되는 시기를 확인할 수 있기를 원한다고 말했습니다. Sandoval은 중단점의 스택 프레임을 보고 관심 있는 함수에 의해 호출되지 않는 한 다시 시작하기만 하면 자신의 API로 이를 수행할 수 있다고 말했습니다. 또 다른 참석자는 Sandoval이 제안한 set_breakpoint() 호출과 유사한 방식으로 API에 추가할 수 있다고 생각한 메모리에 대한 감시점을 제안했습니다.

Because drgn is programmable, many of the different use cases can be handled with programs of different sorts, he said. If some of the use cases need a performance boost, perhaps BPF could be used to do things like pre-filter breakpoints. Another attendee suggested using drgn for doing error injection in testing, which Sandoval thought could fit right in, though there may be a need for a way to overwrite registers as part of the API.

Production

Those features are obviously useful in development, but his team at Meta has run into a few scenarios where it would be helpful to be able use them on production systems. For example, there have been cases where being able to overwrite some part of memory in the kernel would be enough to work around an emergency that has gotten people out of bed. It could be used to fix reference counts that are not getting decremented correctly, reset overflows or underflows of accounting information, change invalid states, and more.

A more concrete example is "an embarrassing bug in Btrfs" (fixed by this commit) where enabling asynchronous discard was not handled quite correctly. It manifested in reports of disks starting to run slowly, which was eventually tracked down to discards (i.e. telling the device that certain blocks are no longer used so that the it can do garbage collection on them) not being issued at all. After some "heroic debugging", the problem was tracked down and promptly fixed in the tree, but it would have been convenient to be able to run a drgn script on affected machines to change the single bit that would actually enable discard for the Btrfs mounts.

drgn은 프로그래밍이 가능하기 때문에 다양한 종류의 프로그램으로 다양한 사용 사례를 처리할 수 있다고 그는 말했습니다. 일부 사용 사례에 성능 향상이 필요한 경우 BPF를 사용하여 사전 필터 중단점과 같은 작업을 수행할 수 있습니다. 또 다른 참석자는 테스트 시 오류 주입을 위해 drgn을 사용할 것을 제안했는데, Sandoval은 API의 일부로 레지스터를 덮어쓰는 방법이 필요할 수 있지만 이것이 적합할 것이라고 생각했습니다.

생산

이러한 기능은 분명히 개발에 유용하지만 Meta의 그의 팀은 프로덕션 시스템에서 이러한 기능을 사용하는 것이 도움이 될 몇 가지 시나리오를 실행했습니다. 예를 들어, 커널에서 메모리의 일부를 덮어쓰는 것만으로도 사람들을 침대에서 일어나게 하는 긴급 상황을 해결하는 데 충분할 수 있는 경우가 있었습니다. 올바르게 감소하지 않는 참조 횟수를 수정하고, 회계 정보의 오버플로우 또는 언더플로우를 재설정하고, 유효하지 않은 상태를 변경하는 등의 작업에 사용할 수 있습니다.

보다 구체적인 예는 비동기 삭제 활성화가 올바르게 처리되지 않은 "Btrfs의 당황스러운 버그"(이 커밋으로 수정됨)입니다. 이는 디스크가 느리게 실행되기 시작한다는 보고에서 나타났으며 결국 폐기 항목(즉, 특정 블록이 더 이상 사용되지 않아 가비지 수집을 수행할 수 있도록 장치에 알리는 것)이 전혀 발행되지 않는 것으로 추적되었습니다. 일부 "영웅적인 디버깅" 후에 문제가 추적되어 트리에서 즉시 수정되었지만 영향을 받은 시스템에서 drgn 스크립트를 실행하여 Btrfs 마운트에 대해 실제로 폐기를 활성화하는 단일 비트를 변경할 수 있으면 편리했을 것입니다. .

There are "a lot of caveats about doing this in production", though. You have to be careful about what you are overwriting—and when—"race conditions are definitely a thing". It is not meant as a replacement for a live patch or an updated kernel, but is instead a test of the fix and a stopgap measure. He hoped that explained the why, so he wanted to turn to "all the crazy ways we might be able to do this".

For development, the solution is easy, Sandoval said, simply use the GDB stub that is provided by QEMU. He listed some possibilities for the production use case, starting with bringing back /dev/kmem, which is "almost a joke" of a suggestion. He mentioned an LWN article that celebrated its removal and he noted that the /dev/kmem interface to read and write the kernel's memory was a "beautiful thing for rootkits". Drgn is not a rootkit, but debuggers do share some elements with rootkits, so /dev/kmem would be the "most straightforward way to support this, but I don't think anyone is going to accept that patch".

An alternative might be a custom kernel module that is effectively /dev/kmem, which is not that much better, he said. But, in order to enable the feature, there will need to be some way to write values to an arbitrary address, so the key will be in getting the access controls right. BPF could perhaps be used, but that "kind of goes against everything that BPF believes in, which is that your program should be safe".

하지만 "프로덕션에서 이 작업을 수행하는 데에는 많은 주의 사항"이 있습니다. 무엇을 덮어쓰는지, 언제 덮어쓰는지에 대해 주의해야 합니다. "경합 조건은 확실히 문제입니다." 이는 라이브 패치나 업데이트된 커널을 대체하기 위한 것이 아니라 수정 사항에 대한 테스트이자 임시 조치입니다. 그는 그것이 이유를 설명해주기를 바랐기 때문에 "우리가 이 일을 할 수 있는 모든 미친 방법"을 사용하고 싶었습니다.

개발의 경우 솔루션은 간단하며 QEMU에서 제공하는 GDB 스텁을 사용하면 된다고 Sandoval은 말했습니다. 그는 제안의 "거의 농담"인 /dev/kmem을 다시 가져오는 것부터 시작하여 프로덕션 사용 사례에 대한 몇 가지 가능성을 나열했습니다. 그는 LWN 제거를 축하하는 기사를 언급했으며 커널 메모리를 읽고 쓰는 /dev/kmem 인터페이스가 "루트킷을 위한 아름다운 것"이라고 언급했습니다. Drgn은 루트킷이 아니지만 디버거는 루트킷과 일부 요소를 공유하므로 /dev/kmem은 "이를 지원하는 가장 간단한 방법이지만 누구도 해당 패치를 받아들이지 않을 것"입니다.

대안으로는 사실상 /dev/kmem인 맞춤형 커널 모듈이 있을 수 있지만 그다지 좋지는 않다고 그는 말했습니다. 그러나 이 기능을 활성화하려면 임의의 주소에 값을 쓸 수 있는 방법이 필요하므로 액세스 제어를 올바르게 수행하는 것이 핵심입니다. BPF를 사용할 수도 있지만 이는 "BPF가 믿는 모든 것, 즉 프로그램이 안전해야 한다는 모든 것에 위배됩니다".

Another possible approach would be to interface to kgdb, though Meta does not enable it in production kernels "but it's not the worst thing we could do". Kgdb already supports both memory writes and breakpoints, but, as far as he can tell, it was never intended to be used on a live, running system. For example, hitting a breakpoint stops every CPU, so drgn cannot still be running; perhaps it could be modified to only stop certain CPUs and leave one running for drgn.

An attendee asked why users would want other CPUs running when kgdb hits a breakpoint. The whole idea is that other CPUs cannot interfere with the state of the kernel at the time of the breakpoint. Sandoval said that works fine when there is another system that is driving the debugging, but that he wants to be able to log into a broken machine and run drgn there. Another audience member said that if there is a breakpoint set, drgn could cause it to be hit, leading to a deadlock.

Sandoval acknowledged that problem as a difficult one. His idea is to have a watchdog that would raise an non-maskable interrupt (NMI) to cancel the breakpoint in the deadlock situation. Kprobes were identified as another way to do breakpoints, which Sandoval thought might be workable. There would still need to be a kernel module that alerted drgn that the kprobe/breakpoint had been hit, as well as a watchdog for deadlock prevention, he said.

또 다른 가능한 접근 방식은 kgdb에 인터페이스하는 것입니다. 하지만 Meta는 프로덕션 커널에서 이를 활성화하지 않지만 "우리가 할 수 있는 최악의 일은 아닙니다". Kgdb는 이미 메모리 쓰기와 중단점을 모두 지원하지만 그가 아는 한 실제로 실행 중인 시스템에서 사용할 의도는 없었습니다. 예를 들어, 중단점에 도달하면 모든 CPU가 중지되므로 drgn은 계속 실행될 수 없습니다. 아마도 특정 CPU만 중지하고 drgn에 대해 하나는 실행되도록 수정될 수 있습니다.

참석자는 kgdb가 중단점에 도달할 때 왜 사용자가 다른 CPU가 실행되기를 원하는지 물었습니다. 전체적인 아이디어는 다른 CPU가 중단점 시점의 커널 상태를 방해할 수 없다는 것입니다. Sandoval은 디버깅을 구동하는 다른 시스템이 있을 때 제대로 작동하지만 손상된 시스템에 로그인하여 그곳에서 drgn을 실행할 수 있기를 원한다고 말했습니다. 또 다른 청중은 중단점이 설정되어 있으면 drgn으로 인해 중단점이 발생하여 교착 상태가 발생할 수 있다고 말했습니다.

산도발은 그 문제가 어려운 문제임을 인정했습니다. 그의 아이디어는 교착 상태 상황에서 중단점을 취소하기 위해 NMI(마스크 불가능 인터럽트)를 발생시키는 감시 장치를 갖는 것입니다. Kprobes는 중단점을 수행하는 또 다른 방법으로 확인되었으며 Sandoval은 이것이 실행 가능하다고 생각했습니다. kprobe/중단점에 도달했음을 drgn에 경고하는 커널 모듈과 교착 상태 방지를 위한 감시 장치가 여전히 필요하다고 그는 말했습니다.

The kernel lockdown mode was brought up as a potential problem area by a participant; it is meant to restrict any mechanisms that might alter the running kernel, and may well be enabled on many production kernels. So had Sandoval thought about how drgn might work with—or around—lockdown? It probably makes sense to just disable drgn support on locked-down kernels, Sandoval said.

When considering access control, the features that he wants to add to drgn are things that already could be done from a custom kernel module, thus CAP_SYS_MODULE and CAP_SYS_ADMIN could perhaps control access to whatever underlying mechanism is decided upon. There is the caveat that some organizations require signed kernel modules beyond just having the capabilities. That might mean that the drgn mechanism needs to validate the user based on keys on the kernel keyring in some fashion.

Stephen Brennan pointed out that Python itself loads lots of code from various locations on the system that needs to be somehow protected so that running drgn does not become a compromise vector. Sandoval said that he "kind of copped out and made it a per-user authentication thing", so that the user has to be careful about those kinds of things, but that type of access control has not worked out so well over the years, he said, pointing to setuid binaries in particular.

커널 잠금 모드는 참가자에 의해 잠재적인 문제 영역으로 제기되었습니다. 이는 실행 중인 커널을 변경할 수 있는 모든 메커니즘을 제한하기 위한 것이며 많은 프로덕션 커널에서 활성화될 수도 있습니다. 그렇다면 Sandoval은 Drgn이 폐쇄와 함께 또는 그 주변에서 어떻게 작동할 수 있는지 생각했습니까? Sandoval은 잠긴 커널에서 drgn 지원을 비활성화하는 것이 아마도 합리적일 것이라고 말했습니다.

액세스 제어를 고려할 때 그가 drgn에 추가하려는 기능은 이미 사용자 정의 커널 모듈에서 수행할 수 있는 기능이므로 CAP_SYS_MODULE 및 CAP_SYS_ADMIN은 결정된 기본 메커니즘에 대한 액세스를 제어할 수 있습니다. 일부 조직에서는 단순히 기능을 갖춘 것 이상으로 서명된 커널 모듈을 요구한다는 주의 사항이 있습니다. 이는 drgn 메커니즘이 어떤 방식으로든 커널 키링의 키를 기반으로 사용자의 유효성을 검사해야 함을 의미할 수 있습니다.

Stephen Brennan은 Python 자체가 drgn 실행이 손상 경로가 되지 않도록 보호해야 하는 시스템의 다양한 위치에서 많은 코드를 로드한다고 지적했습니다. Sandoval은 "일종의 조치를 취하여 이를 사용자별 인증으로 만들었습니다"라고 말하면서 사용자는 이러한 종류의 사항에 주의해야 하지만 이러한 유형의 액세스 제어는 수년 동안 그다지 잘 작동하지 않았습니다. 그는 특히 setuid 바이너리를 가리키며 말했습니다.

Instead of having full breakpoints in drgn, Mason said, there could be a limited set of things that can be done when the code is reached. That could then be turned into BPF or a kprobe, which would then need to be inserted into the kernel; it would not change the security picture at all, but would simplify the problem of stopping all the CPUs and prevent the deadlocks. Sandoval said that one of the things in that defined set would need to be writing memory, however, so some solution for that part of the problem would still be required.

As time ran out, he wrapped up by saying that he still had "more questions than answers", but encouraged attendees to find him later to discuss "more bad ideas"—or so that he could show them "cool drgn stuff", he said with a chuckle.

drgn에 완전한 중단점을 두는 대신 코드에 도달했을 때 수행할 수 있는 작업이 제한될 수 있다고 Mason은 말했습니다. 그런 다음 BPF 또는 kprobe로 변환될 수 있으며 커널에 삽입되어야 합니다. 보안 상황이 전혀 변경되지는 않지만 모든 CPU를 중지하는 문제를 단순화하고 교착 상태를 방지합니다. Sandoval은 정의된 세트의 항목 중 하나가 메모리를 쓰는 것이어야 하므로 문제의 해당 부분에 대한 일부 솔루션이 여전히 필요하다고 말했습니다.

시간이 다 되자 그는 여전히 "답변보다 질문이 더 많다"고 말하며 마무리했지만 참석자들에게 나중에 자신을 찾아 "더 나쁜 아이디어"에 대해 논의하거나 "멋진 약물"을 보여줄 수 있도록 격려했습니다. 웃으며 말했다.



[I would like to thank LWN's travel sponsor, the Linux Foundation, for assistance with my travel costs to Richmond for LPC.]


drgn
drgn (pronounced “dragon”) is a debugger with an emphasis on programmability. drgn exposes the types and variables in a program for easy, expressive scripting in Python. For example, you can debug the Linux kernel:

1. drgn("드래곤"으로 발음)은 프로그래밍 가능성에 중점을 둔 디버거
2. drgn은 Python에서 쉽고 표현력 있는 스크립팅을 위해 프로그램의 유형과 변수를 노출

3. Linux 커널을 디버깅할 수 있습니다.

drgn("드래곤"으로 발음)은 프로그래밍 가능성에 중점을 둔 디버거입니다. drgn은 Python에서 쉽고 표현력 있는 스크립팅을 위해 프로그램의 유형과 변수를 노출합니다. 예를 들어 Linux 커널을 디버깅할 수 있습니다.

from drgn.helpers.linux import list_for_each_entry
for mod in list_for_each_entry('struct module',
                               prog['modules'].address_of_(),
                               'list'):
   if mod.refcnt.counter > 10:
       print(mod.name)

(char [56])"snd"
(char [56])"evdev"
(char [56])"i915"

Although other debuggers like GDB have scripting support, drgn aims to make scripting as natural as possible so that debugging feels like coding. This makes it well-suited for introspecting the complex, inter-connected state in large programs.

4. drgn은 디버깅이 코딩처럼 느껴지도록 스크립팅을 최대한 자연스럽게 만드는 것을 목표

5. 대규모 프로그램에서 복잡하고 상호 연결된 상태를 검사하는 데 매우 적합

GDB와 같은 다른 디버거에는 스크립팅 지원이 있지만 drgn은 디버깅이 코딩처럼 느껴지도록 스크립팅을 최대한 자연스럽게 만드는 것을 목표로 합니다. 이는 대규모 프로그램에서 복잡하고 상호 연결된 상태를 검사하는 데 매우 적합합니다.

Additionally, drgn is designed as a library that can be used to build debugging and introspection tools; see the official tools.

drgn was developed at Meta for debugging the Linux kernel (as an alternative to the crash utility), but it can also debug userspace programs written in C. C++ support is in progress.

In addition to the main Python API, an experimental C library, libdrgn, is also available.

See the Installation instructions. Then, start with the User Guide.

drgn은 Linux 커널 디버깅을 위해(크래시 유틸리티의 대안으로) Meta에서 개발되었지만 C로 작성된 사용자 공간 프로그램도 디버깅할 수 있습니다. C++ 지원이 진행 중입니다.

기본 Python API 외에도 실험적인 C 라이브러리인 libdrgn도 사용할 수 있습니다.

설치 지침을 참조하세요. 그런 다음 사용자 가이드부터 시작하세요.

drgn debugs the running kernel by default; run sudo drgn. To debug a running program, run sudo drgn -p $PID. To debug a core dump (either a kernel vmcore or a userspace core dump), run drgn -c $PATH. Make sure to install debugging symbols for whatever you are debugging.

Then, you can access variables in the program with prog['name'] and access structure members with .:

1. drgn은 기본적으로 실행 중인 커널을 디버깅

2. sudo drgn

3. 실행 중인 프로그램을 디버깅하려면 sudo drgn -p $PID

4. 코어 덤프(커널 vmcore 또는 사용자 공간 코어 덤프)를 디버깅하려면 drgn -c $PATH를 실행

drgn은 기본적으로 실행 중인 커널을 디버깅합니다. sudo drgn을 실행하세요. 실행 중인 프로그램을 디버깅하려면 sudo drgn -p $PID를 실행합니다. 코어 덤프(커널 vmcore 또는 사용자 공간 코어 덤프)를 디버깅하려면 drgn -c $PATH를 실행합니다. 디버깅 중인 항목에 대해 디버깅 기호를 설치해야 합니다.

그런 다음 prog['name']을 사용하여 프로그램의 변수에 액세스하고 .:를 사용하여 구조 멤버에 액세스할 수 있습니다.

Core Concepts
The most important interfaces in drgn are programs, objects, and helpers.

Programs
A program being debugged is represented by an instance of the drgn.Program class. The drgn CLI is initialized with a Program named prog; unless you are using the drgn library directly, this is usually the only Program you will need.

A Program is used to look up type definitions, access variables, and read arbitrary memory:

1. drgn에서 가장 중요한 인터페이스는 프로그램, 객체, 도우미

핵심 개념
drgn에서 가장 중요한 인터페이스는 프로그램, 객체, 도우미입니다.

프로그램들
디버깅 중인 프로그램은 drgn.Program 클래스의 인스턴스로 표시됩니다. drgn CLI는 prog라는 프로그램으로 초기화됩니다. drgn 라이브러리를 직접 사용하지 않는 한 이는 일반적으로 필요한 유일한 프로그램입니다.

5. 프로그램은 유형 정의를 조회하고, 변수에 액세스하고, 임의의 메모리를 읽는 데 사용됩니다.

프로그램은 유형 정의를 조회하고, 변수에 액세스하고, 임의의 메모리를 읽는 데 사용됩니다.

drgn.Program.type(), drgn.Program.variable(), drgn.Program.constant() 및 drgn.Program.function() 메서드는 프로그램에서 이러한 다양한 항목을 조회합니다. drgn.Program.read()는 프로그램의 주소 공간에서 메모리를 읽습니다. [] 연산자는 변수, 상수 또는 함수를 조회합니다.





A kernel debugger that allows Python scripts to access data structures in a running kernel was the topic of Omar Sandoval's plenary session at the 2019 Linux Storage, Filesystem, and Memory-Management Summit (LSFMM). In his day job at Facebook, Sandoval does a fair amount of kernel debugging and he found the existing tools to be lacking. That led him to build drgn, which is a debugger built into a Python library.

Sandoval began with a quick demo of drgn (which is pronounced "dragon"). He was logged into a virtual machine (VM) and invoked the debugger on the running kernel with drgn -k. With some simple Python code in the REPL (read-eval-print loop), he was able to examine the superblock of the root filesystem and loop through the inodes cached in that superblock—with their paths. Then he did "something a little fancier" by only listing the inodes for files that are larger than 1MB. It showed some larger kernel modules, libraries, systemd, and so on.

He mostly works on Btrfs and the block layer, but he also tends to debug random kernel problems. Facebook has so many machines that there are "super rare, one-in-a-million bugs" showing up all the time. He often volunteers to take a look. In the process he got used to tools like GDB, crash, and eBPF, but found that he often wanted to be able to do arbitrarily complex analysis of kernel data structures, which is why he ended up building drgn.

1. Python 스크립트가 실행 중인 커널의 데이터 구조에 액세스할 수 있도록 하는 커널 디버거는 2019 LSFMM(Linux Storage, Filesystem, and Memory-Management Summit)에서 Omar Sandoval의 전체 세션의 주제

2. Facebook에서 근무하면서 Sandoval은 상당한 양의 커널 디버깅을 수행했지만 기존 도구가 부족하다는 사실을 발견


Python 스크립트가 실행 중인 커널의 데이터 구조에 액세스할 수 있도록 하는 커널 디버거는 2019 LSFMM(Linux Storage, Filesystem, and Memory-Management Summit)에서 Omar Sandoval의 전체 세션의 주제였습니다. Facebook에서 근무하면서 Sandoval은 상당한 양의 커널 디버깅을 수행했지만 기존 도구가 부족하다는 사실을 발견했습니다. 이로 인해 그는 Python 라이브러리에 내장된 디버거인 drgn을 구축하게 되었습니다.

Sandoval은 drgn("드래곤"으로 발음함)의 빠른 데모로 시작했습니다. 그는 가상 머신(VM)에 로그인하고 drgn -k를 사용하여 실행 중인 커널에서 디버거를 호출했습니다. REPL(읽기-평가-인쇄 루프)의 몇 가지 간단한 Python 코드를 사용하여 그는 루트 파일 시스템의 슈퍼블록을 검사하고 해당 슈퍼블록에 캐시된 inode를 해당 경로와 함께 루프할 수 있었습니다. 그런 다음 그는 1MB보다 큰 파일에 대한 inode만 나열하여 "조금 더 멋진 작업"을 수행했습니다. 더 큰 커널 모듈, 라이브러리, systemd 등이 표시되었습니다.

2. 그 과정에서 그는 GDB, crash, eBPF와 같은 도구에 익숙해졌지만 커널 데이터 구조에 대해 임의로 복잡한 분석을 수행할 수 있기를 원하는 경우가 많았고 이것이 결국 drgn을 구축하게 된 이유입니다.

그는 주로 Btrfs와 블록 레이어에 대해 작업하지만 무작위 커널 문제를 디버깅하는 경향도 있습니다. Facebook에는 시스템이 너무 많아서 "매우 희귀한, 백만 분의 1의 버그"가 항상 나타납니다. 그는 종종 자원해서 살펴보곤 합니다. 그 과정에서 그는 GDB, crash, eBPF와 같은 도구에 익숙해졌지만 커널 데이터 구조에 대해 임의로 복잡한 분석을 수행할 수 있기를 원하는 경우가 많았고 이것이 결국 drgn을 구축하게 된 이유입니다.

[Omar Sandoval]
GDB has some nice features, he said, including the ability to pretty-print types, variables, and expressions. But it is focused on a breakpoint style of debugging, which he cannot do on production systems. It has a scripting interface, but it is clunky and just wraps the existing GDB commands.

Crash is purpose built for kernel debugging; it knows about linked lists, structures, processes, and so on. But if you try to go beyond those things, you will hit a wall, Sandoval said. It is not particularly flexible; when he used it, he often had to dump a bunch of state and then post-process it.

BPF and BCC are awesome and he uses them all the time, but they are limited to times when you can reproduce the bug live. Many of the bugs he looks at are something that happened hours ago and locked up the machine, or he got a core dump and wants to understand why. BPF doesn't really cover this use case; it is more for tracing and is not really an interactive debugger.

3. GDB에는 유형, 변수 및 표현식을 예쁘게 인쇄하는 기능을 포함하여 몇 가지 멋진 기능이 있다고 그는 말했습니다. 그러나 그는 프로덕션 시스템에서는 수행할 수 없는 중단점 스타일의 디버깅에 중점을 두고 있습니다. 스크립팅 인터페이스가 있지만 투박하고 기존 GDB 명령을 래핑할 뿐입니다.

GDB에는 유형, 변수 및 표현식을 예쁘게 인쇄하는 기능을 포함하여 몇 가지 멋진 기능이 있다고 그는 말했습니다. 그러나 그는 프로덕션 시스템에서는 수행할 수 없는 중단점 스타일의 디버깅에 중점을 두고 있습니다. 스크립팅 인터페이스가 있지만 투박하고 기존 GDB 명령을 래핑할 뿐입니다.

4. Crash는 커널 디버깅을 위해 특별히 제작되었습니다. 연결된 목록, 구조, 프로세스 등에 대해 알고 있습니다. 그러나 그런 것들을 넘어서려고 하면 벽에 부딪힐 것이라고 산도발은 말했습니다. 특별히 유연하지는 않습니다. 그가 그것을 사용할 때, 그는 종종 많은 상태를 덤프한 다음 그것을 후처리해야 했습니다.

Crash는 커널 디버깅을 위해 특별히 제작되었습니다. 연결된 목록, 구조, 프로세스 등에 대해 알고 있습니다. 그러나 그런 것들을 넘어서려고 하면 벽에 부딪힐 것이라고 산도발은 말했습니다. 특별히 유연하지는 않습니다. 그가 그것을 사용할 때, 그는 종종 많은 상태를 덤프한 다음 그것을 후처리해야 했습니다.

5. BPF와 BCC는 훌륭하고 항상 사용하지만 버그를 실시간으로 재현할 수 있는 시간으로 제한됩니다. 그가 보는 버그 중 상당수는 몇 시간 전에 발생하여 시스템을 잠그거나 코어 덤프를 받고 그 이유를 알고 싶어하는 것입니다. BPF는 실제로 이 사용 사례를 다루지 않습니다. 이는 추적에 더 적합하며 실제로 대화형 디버거는 아닙니다.

BPF와 BCC는 훌륭하고 항상 사용하지만 버그를 실시간으로 재현할 수 있는 시간으로 제한됩니다. 그가 보는 버그 중 상당수는 몇 시간 전에 발생하여 시스템을 잠그거나 코어 덤프를 받고 그 이유를 알고 싶어하는 것입니다. BPF는 실제로 이 사용 사례를 다루지 않습니다. 이는 추적에 더 적합하며 실제로 대화형 디버거는 아닙니다.

Drgn makes it possible to write actual programs in a real programming language—depending on one's opinion of Python, anyway. It is much better than dumping things out to a text file and using shell scripts to process them or to use the Python bindings for GDB. He sometimes calls drgn a "debugger as a library" because it doesn't just provide a command prompt with a limited set of commands; instead, it magically wraps the types, variables, and such so that you can do anything you want with them. The User Guide and home page linked above are good places to start looking into all that it can do.

He launched into another demo that showed some of the power of drgn. It has both interactive and scripting modes. He started in an interactive session by looking at variables and noted that drgn returns an object that represents the variable; that object has additional information like the type (which is also an object), address, and, of course, value. But one can also implement list iteration, which he showed by following the struct task_struct chain from the init task down to its children.

While he had written the list iteration live in the demo, he pointed out that it would get tedious if you had to do so all of the time. Drgn provides a bunch of helper functions that can do those kinds of things. Currently, most of those are filesystem and block-layer helpers, but more could be added for networking and other subsystems.

He replayed an actual investigation that he and a colleague had done on a production server in a VM where the bug was reproduced. The production workload was a storage server for cold data; on it, disks that have not been used in a while are powered down to save power. So its disks tend to turn on and off a lot, which exposes kernel bugs. The cold-storage service ran in a container and it was reported that stopping the container would sometimes take forever.

5. Drgn을 사용하면 Python에 대한 개인의 의견에 따라 실제 프로그래밍 언어로 실제 프로그램을 작성할 수 있습니다.

Drgn을 사용하면 Python에 대한 개인의 의견에 따라 실제 프로그래밍 언어로 실제 프로그램을 작성할 수 있습니다. 텍스트 파일에 내용을 덤프하고 쉘 스크립트를 사용하여 처리하거나 GDB용 Python 바인딩을 사용하는 것보다 훨씬 낫습니다. 그는 때때로 drgn을 "라이브러리로서의 디버거"라고 부릅니다. 왜냐하면 Drgn은 단지 제한된 명령 세트가 포함된 명령 프롬프트만 제공하는 것이 아니기 때문입니다. 대신, 유형, 변수 등을 마술처럼 래핑하여 원하는 모든 작업을 수행할 수 있습니다. 위에 링크된 사용자 가이드와 홈 페이지는 이 앱이 수행할 수 있는 모든 작업을 살펴보기에 좋은 곳입니다.

6. rgn이 변수를 나타내는 개체를 반환한다는 점에 주목

7. 해당 객체에는 유형(객체이기도 함), 주소 및 값과 같은 추가 정보가 있습니다. 그러나 그는 초기화 작업에서 하위 항목까지 struct task_struct 체인을 따라가며 보여준 목록 반복을 구현

그는 drgn의 힘을 보여주는 또 다른 데모를 시작했습니다. 대화형 모드와 스크립팅 모드가 모두 있습니다. 그는 변수를 살펴보는 대화형 세션을 시작했으며 drgn이 변수를 나타내는 개체를 반환한다는 점에 주목했습니다. 해당 객체에는 유형(객체이기도 함), 주소 및 값과 같은 추가 정보가 있습니다. 그러나 그는 초기화 작업에서 하위 항목까지 struct task_struct 체인을 따라가며 보여준 목록 반복을 구현할 수도 있습니다.

그는 데모에서 목록 반복을 실시간으로 작성했지만 항상 그렇게 해야 한다면 지루할 것이라고 지적했습니다. Drgn은 이러한 종류의 작업을 수행할 수 있는 다양한 도우미 기능을 제공합니다. 현재 이들 중 대부분은 파일 시스템 및 블록 계층 도우미이지만 네트워킹 및 기타 하위 시스템을 위해 더 많은 기능이 추가될 수 있습니다.

그는 버그가 재현된 VM의 프로덕션 서버에서 그와 동료가 수행한 실제 조사를 다시 재생했습니다. 프로덕션 워크로드는 콜드 데이터용 스토리지 서버였습니다. 한동안 사용하지 않은 디스크의 전원을 꺼서 전력을 절약합니다. 따라서 디스크가 자주 켜지고 꺼지는 경향이 있어 커널 버그가 노출됩니다. 냉장 보관 서비스는 컨테이너에서 실행되었으며 컨테이너를 중지하는 데 시간이 오래 걸리는 경우도 있다고 보고되었습니다.

When he started looking at it, he realized that the container would eventually finish, but that it took a long time. That suggested some kind of a leak. He showed the process of working his way down through the block control group data structures and used the Python Set object type to track the number of unique request queues associated with the block control groups. He was also able to dig around in the radix tree associated with the ID allocator (IDA) used for identifying request queues to double check some of his results. In the end, it was determined that the request queues were leaking due to a reference cycle.

He mentioned another case where he used drgn to debug a problem with Btrfs unexpectedly returning ENOSPC. It turned out that it was reserving extra metadata space for orphaned files. Once he determined that, it was straightforward to figure out which application was creating these orphaned files; it could be restarted periodically until a real fix could be made to Btrfs. In addition, when he encounters a new subsystem in the kernel, he will often go in with drgn to figure out how all of the pieces fit together.

The core of drgn is a C library called libdrgn. If you hate Python and like error handling, you can use it directly, he said. There are pluggable backends for reading memory of various sorts, including /proc/kcore for the running kernel, a crash dump, or /proc/PID/mem for a running program. It uses DWARF to get the types and symbols, which is not the most convenient format to work with. He spent a surprising amount of time optimizing the access to the DWARF data. That interface is also pluggable, but he has only implemented DWARF so far.

그것을 보기 시작했을 때 그는 컨테이너가 결국 완성될 것이지만 시간이 오래 걸린다는 것을 깨달았습니다. 그것은 일종의 누출을 암시했습니다. 그는 블록 제어 그룹 데이터 구조를 통해 작업하는 프로세스를 보여주고 Python Set 개체 유형을 사용하여 블록 제어 그룹과 관련된 고유 요청 대기열 수를 추적했습니다. 그는 또한 요청 대기열을 식별하는 데 사용되는 ID 할당자(IDA)와 관련된 기수 트리를 탐색하여 일부 결과를 다시 확인할 수 있었습니다. 결국, 참조주기로 인해 요청 큐가 누출되는 것으로 판단되었습니다.

그는 Btrfs가 예기치 않게 ENOSPC를 반환하는 문제를 디버깅하기 위해 drgn을 사용한 또 다른 사례를 언급했습니다. 고아 파일을 위해 추가 메타데이터 공간을 예약하고 있는 것으로 나타났습니다. 그가 그것을 결정한 후에는 어떤 응용 프로그램이 이러한 분리된 파일을 생성하고 있는지 알아내는 것이 간단했습니다. Btrfs에 대한 실제 수정이 이루어질 때까지 주기적으로 다시 시작할 수 있습니다. 또한 커널에서 새로운 하위 시스템을 발견하면 drgn을 사용하여 모든 조각이 어떻게 조화를 이루는지 파악하는 경우가 많습니다.

drgn의 핵심은 libdrgn이라는 C 라이브러리입니다. Python을 싫어하고 오류 처리를 좋아한다면 직접 사용할 수 있다고 그는 말했습니다. 실행 중인 커널을 위한 /proc/kcore, 크래시 덤프 또는 실행 중인 프로그램을 위한 /proc/PID/mem을 포함하여 다양한 종류의 메모리를 읽기 위한 플러그형 백엔드가 있습니다. DWARF를 사용하여 유형과 기호를 가져오는데, 이는 작업하기에 가장 편리한 형식이 아닙니다. 그는 DWARF 데이터에 대한 액세스를 최적화하는 데 놀라운 시간을 보냈습니다. 해당 인터페이스도 플러그 가능하지만 그는 지금까지 DWARF만 구현했습니다.

That optimization work allows drgn to come up in about half a second, while crash takes around 15s. Because drgn comes up quickly, it will get used more; he still dreads having to start up crash.

There is a subset of a C interpreter embedded into drgn. That allows drgn to properly handle a bunch of corner cases, such as implicit conversions and integer promotion. It is prickly and took some effort, but it means that he has not run into any cases where the translated code does not work the way it does in the kernel.

The biggest missing feature is backtrace support, he said. You can only access global variables at this point, which is not a huge limitation, but he does sometimes have to use crash to get addresses and other information to plug into drgn. It is something that is "totally possible to do in drgn", but he has not gotten there yet. He would like to use BPF Type Format (BTF) instead of DWARF because it is much smaller and simpler. But the main limitation is that BTF does not handle variables; if and when it does, he will use it. A repository of useful drgn scripts and tools is in the works as well.

이러한 최적화 작업을 통해 drgn은 약 0.5초 만에 표시되는 반면 충돌은 약 15초가 소요됩니다. drgn이 빨리 나타나기 때문에 더 많이 사용될 것입니다. 그는 여전히 충돌을 시작해야 하는 것을 두려워합니다.

drgn에 포함된 C 인터프리터의 하위 집합이 있습니다. 이를 통해 drgn은 암시적 변환 및 정수 승격과 같은 여러 가지 특수한 경우를 적절하게 처리할 수 있습니다. 까다롭고 약간의 노력이 필요했지만 번역된 코드가 커널에서 작동하는 방식대로 작동하지 않는 경우는 한 번도 겪어보지 않았다는 의미입니다.

가장 큰 누락된 기능은 역추적 지원이라고 그는 말했습니다. 이 시점에서는 전역 변수에만 액세스할 수 있는데 이는 큰 제한은 아니지만 drgn에 연결할 주소 및 기타 정보를 가져오기 위해 때때로 crash를 사용해야 하는 경우도 있습니다. 그것은 "drgn에서 완전히 가능한" 일이지만 그는 아직 거기에 도달하지 못했습니다. 그는 훨씬 더 작고 간단하기 때문에 DWARF 대신 BTF(BPF Type Format)를 사용하고 싶어합니다. 그러나 주요 제한 사항은 BTF가 변수를 처리하지 않는다는 것입니다. 만약 그렇다면, 그는 그것을 사용할 것입니다. 유용한 drgn 스크립트 및 도구 저장소도 작업 중입니다.

Integration with BPF and BCC is something that has been nagging at him. The idea would be to use BPF for live debugging and drgn for after-the-fact debugging in some way. There is some overlap between the two, which he has not quite figured out how to unify. BPF is somewhat painful to work with due to its lack of loops, but drgn cannot really catch things as they happen. He has a "crazy insane idea" to have BPF breakpoints that call out to a user-space drgn program, but he is not at all sure it is possible.

That was the last session I was able to sit in on and this article completes LWN's LSFMM coverage. The talk on drgn made a nice segue for me, as I had to leave to catch a plane to (eventually) end up in Cleveland for PyCon.

BPF 및 BCC와의 통합은 그에게 잔소리였습니다. 아이디어는 어떤 방식으로든 라이브 디버깅에 BPF를 사용하고 사후 디버깅에 drgn을 사용하는 것입니다. 둘 사이에는 약간의 중복이 있는데, 그는 이를 통합하는 방법을 아직 파악하지 못했습니다. BPF는 루프가 없기 때문에 작업하기가 다소 어렵지만 drgn은 실제로 발생하는 상황을 포착할 수 없습니다. 그는 사용자 공간 drgn 프로그램을 호출하는 BPF 중단점을 갖는 "미친 미친 아이디어"를 가지고 있지만 그것이 가능하다고 전혀 확신하지 못합니다.

그것은 내가 참여할 수 있었던 마지막 세션이었으며 이 기사는 LWN의 LSFMM 보도를 마무리합니다. drgn에 대한 강연은 나에게 좋은 시간이 되었습니다. 왜냐하면 저는 PyCon을 위해 (결국) 클리블랜드에 도착하기 위해 비행기를 타러 떠나야 했기 때문입니다.


https://lwn.net/Articles/789641/

파이썬 스크립트 기반으로 실행 중인 커널을 디버깅할 수 있는 drgn을 소개해 드립니다.

Facebook에서 근무하면서 Sandoval은 상당한 양의 커널 디버깅을 수행했지만 기존 도구가 부족하다는 사실을 발견하고 Python 라이브러리에 내장된 디버거인 drgn을 개발하였습니다. 기존에 커널을 디버깅하기 위해서 GDB, Crash, BPF, BCC 등을 사용하였는데,

1. GDB 는 스크립트를 위한 인터페이스가 존재하지만 투박하고 기존 GDB 명령 이상의 것을 하기에는 불편함이 있음
2. Crash 기본 커널에 대한 디버깅 이외에 그를 통한 응용을 하기에는 부족함이 존재, 또한 많은 상태를 덤프한 후에 그것을 후처리 해야할 수 있음
3. BPF & BCC 는 실시간 디버깅에 대해서는 훌룡하지만, 코어 덤프 등을 통해서 이전에 발생한 버그를 재현하고 추적하기에는 부족함

등의 이유로 drgn 을 만들었다고 합니다.

drgn("드래곤"으로 발음)은 프로그래밍 가능성에 중점을 둔 디버거입니다. 

아래의 예시처럼 이미 만들어진 헬퍼의 list_for_each_entry 를 스크립트를 사용할 수 있습니다.

```py
from drgn.helpers.linux import list_for_each_entry
for mod in list_for_each_entry('struct module',
                               prog['modules'].address_of_(),
                               'list'):
   if mod.refcnt.counter > 10:
       print(mod.name)

(char [56])"snd"
(char [56])"evdev"
(char [56])"i915"
```

사용자가 직접 스크립트를 작성할 수도 있습니다.

```py
>>>def load_avg(avenrun):
    fixed_1=1<<11
    add=int(fixed_1/200)
    a=avenrun[0]+add
    b=avenrun[1]+add
    c=avenrun[2]+add
    str='{:0.2f}  ,  {:0.2f} ,  {:0.2f}'.format(float(load(a)), float(load(b)), float(load(c)))
    return str

>>>load_avg(prog['avenrun'])
```

복잡하고 상호 연결된 프로세스들의 상태를 검사하는데 유용할 수 있습니다.

기본적으로

$ sudo drgn

으로 실행 중인 커널을 디버깅할 수 있으며,

# sudo drgn -p $PID

를 통하여 실행 중인 프로세스를 디버깅할 수도 있습니다. 또한 코어 덤프를 디버깅하려면,

$ drgn -c $PATH

를 실행하면 됩니다.

이렇게 파이썬 스크립트를 통해서 개체를 소스 코드에서 사용하듯이 사용할 수 있는데, 예를 들어, 구조체 멤버는 점(.) 연산자로 액세스할 수 있고, 배열은 []로 첨자를 붙일 수 있으며, 산술을 수행할 수 있고, 객체를 비교할 수 있습니다.

```py
print(prog['init_task'].comm[0])
(char)115
print(repr(prog['init_task'].nsproxy.mnt_ns.mounts + 1))
Object(prog, 'unsigned int', value=34)
prog['init_task'].nsproxy.mnt_ns.pending_mounts > 0
False
```

https://drgn.readthedocs.io/en/latest/index.html
