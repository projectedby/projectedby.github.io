---
layout: 'index'
view: 'post'
permalink: '/posts/2023/12/22/Linux-Review.html'
opengraph:
    site:
        name: 'ProjectedBy/Sub'
        url: '/'
date: '2023/12/22 10:09:00'
title: 'Linux Review'
description: ""
category: 'LinuxReview'
tags: ['Linux', 'Review']
---

##

Controlling shadow-stack allocation in clone3()
By Jonathan Corbet

clone3()에서 섀도우 스택 할당 제어

December 7, 2023

User-space shadow stacks are a relatively new feature in Linux; support was only added for 6.6, and is limited to the x86 architecture. As support for other architectures (including arm64 and RISC-V) approaches readiness, though, more thought is going into the API for this feature. As a recent discussion on the integration of shadow stacks with the clone3() system call shows, there are still some details to be worked out.
A shadow stack is a copy of the current call stack that contains only return addresses; it is maintained by the CPU. While user-space code can access (and even modify) the shadow stack, that access is limited in a number of ways by the hardware. When a shadow stack is enabled, every function call results in the return address being pushed onto both the regular and the shadow stacks. Whenever a function returns, the return address on the regular stack is compared to the copy on the shadow stack; if the two don't match, the processor will trap and (normally) the affected process will be killed. This feature is meant to provide a defense against attacks based on overrunning stack-based variables, including return-oriented programming (ROP) attacks.

사용자 공간 섀도우 스택은 Linux의 비교적 새로운 기능입니다. 지원은 6.6에만 추가되었으며 x86 아키텍처로 제한됩니다. 하지만 다른 아키텍처(arm64 및 RISC-V 포함)에 대한 지원이 준비 단계에 가까워짐에 따라 이 기능에 대한 API에 대한 더 많은 고려가 이루어지고 있습니다. clone3() 시스템 호출과 섀도우 스택의 통합에 대한 최근 논의에서 알 수 있듯이 아직 해결해야 할 몇 가지 세부 사항이 있습니다.


섀도우 스택은 반환 주소만 포함하는 현재 호출 스택의 복사본입니다. 이는 CPU에 의해 유지됩니다. 사용자 공간 코드는 섀도우 스택에 액세스(심지어 수정)할 수 있지만 해당 액세스는 하드웨어에 의해 여러 가지 방식으로 제한됩니다. 섀도우 스택이 활성화되면 모든 함수 호출로 인해 반환 주소가 일반 스택과 섀도우 스택 모두에 푸시됩니다. 함수가 반환될 때마다 일반 스택의 반환 주소는 섀도우 스택의 복사본과 비교됩니다. 두 개가 일치하지 않으면 프로세서가 트랩되고 (일반적으로) 영향을 받는 프로세스가 종료됩니다. 이 기능은 ROP(반환 지향 프로그래밍) 공격을 포함하여 오버런 스택 기반 변수를 기반으로 하는 공격에 대한 방어를 제공하기 위한 것입니다.

There is code that will not work with a shadow stack, so the feature cannot be enabled by default. Thus, when a process is created, it does not have a shadow stack, even on an architecture that supports the feature; a shadow stack can be created and enabled with a prctl() call. If, however, a thread with a shadow stack already set up creates a new thread, the kernel will create and install a shadow stack for that thread before it begins execution; that ensures that the thread will never run without protection. As will be seen, though, there are reasons why a process may want a higher level of control over how that shadow stack is created.

섀도우 스택과 작동하지 않는 코드가 있으므로 해당 기능을 기본적으로 활성화할 수 없습니다. 따라서 프로세스가 생성되면 해당 기능을 지원하는 아키텍처에서도 섀도우 스택이 없습니다. prctl() 호출을 통해 섀도우 스택을 생성하고 활성화할 수 있습니다. 그러나 섀도우 스택이 이미 설정된 스레드가 새 스레드를 생성하는 경우 커널은 실행을 시작하기 전에 해당 스레드에 대한 섀도우 스택을 생성하고 설치합니다. 이는 스레드가 보호 없이 실행되지 않도록 보장합니다. 하지만 앞으로 살펴보겠지만 프로세스가 섀도우 스택 생성 방법에 대해 더 높은 수준의 제어를 원하는 데에는 이유가 있습니다.

In October, Mark Brown (who is working on the arm64 shadow-stack implementation) posted a patch series adding that control to clone3(), a relatively new system call that was designed to allow the addition of new features in this way. The initial version of the series added two fields to the clone_args structure used to pass parameters to clone3(): the address and size of the shadow stack to be provided to the new thread. Rick Edgecombe (who carried the x86 implementation over the finish line) quickly pointed out a problem with that API, though: the ability to place the shadow stack in memory could be used to put it in an inconvenient location — on top of another shadow stack, for example. Nothing good would come from such an action, and it could be used as an attack vector.

지난 10월 Mark Brown(arm64 섀도우 스택 구현 작업 중)은 이러한 방식으로 새로운 기능을 추가할 수 있도록 설계된 비교적 새로운 시스템 호출인 clone3()에 해당 제어 기능을 추가하는 패치 시리즈를 게시했습니다. 시리즈의 초기 버전에서는 매개변수를 clone3()에 전달하는 데 사용되는 clone_args 구조에 두 개의 필드, 즉 새 스레드에 제공될 섀도우 스택의 주소와 크기를 추가했습니다. 결승선에서 x86 구현을 수행한 Rick Edgecombe는 해당 API의 문제점을 재빠르게 지적했습니다. 하지만 섀도우 스택을 메모리에 배치하는 기능은 이를 불편한 위치, 즉 다른 섀도우 스택 위에 배치하는 데 사용될 수 있습니다. , 예를 들어. 그러한 행동에서는 좋은 결과가 나올 수 없으며 공격 벡터로 사용될 수 있습니다.

After some discussion, it was concluded that, while it might be useful to allow user space to be able to position the shadow stack exactly, there was no overwhelming need for that capability. So, in subsequent versions of the series (including the current fourth revision), only the size of the desired shadow stack can be provided to clone3(), in a clone_args field called, unsurprisingly, shadow_stack_size. If that size is provided, it will be used by the kernel to create the new thread's shadow stack; otherwise the default size (which is equal to the size of the regular stack) will be used instead.

몇 가지 논의 끝에 사용자 공간이 섀도우 스택을 정확하게 배치할 수 있도록 허용하는 것이 유용할 수 있지만 해당 기능이 압도적으로 필요하지는 않다는 결론이 나왔습니다. 따라서 시리즈의 후속 버전(현재 네 번째 개정 포함)에서는 원하는 섀도우 스택의 크기만 clone3()에 제공될 수 있으며, 이는 놀랍게도 Shadow_stack_size라는 clone_args 필드에 있습니다. 해당 크기가 제공되면 커널에서 새 스레드의 섀도우 스택을 생성하는 데 사용됩니다. 그렇지 않으면 기본 크기(일반 스택의 크기와 동일)가 대신 사용됩니다.

By version 3, posted in in late November, the patch set appeared to be settling down. Christian Brauner, though, questioned whether this API was worth adding, worrying that it was a step toward turning clone3() (which he created) into "a fancier version of prctl()". He wondered why it was necessary to allow user space to affect the size of the shadow stack at thread-creation time. Recognizing that he perhaps did not fully understand the problem, he asked a few questions about the motivations for this change.

11월 말에 게시된 버전 3에서는 패치 세트가 안정되는 것처럼 보였습니다. 그러나 Christian Brauner는 이 API가 (자신이 만든) clone3()을 "prctl()의 더 멋진 버전"으로 바꾸는 단계라고 우려하면서 이 API를 추가할 가치가 있는지 의문을 제기했습니다. 그는 스레드 생성 시 사용자 공간이 섀도우 스택의 크기에 영향을 미치도록 허용하는 것이 왜 필요한지 궁금했습니다. 그는 문제를 완전히 이해하지 못했을 수도 있음을 인식하고 이러한 변화의 동기에 대해 몇 가지 질문을 했습니다.

One of those motivations is to prevent over-allocation of the shadow stack, which can result from the current policy of allocating the shadow stack with a size equal to that of the regular stack. Szabolcs Nagy explained the problem in this case: if a thread is created with a large (regular) stack, perhaps so that it can store a large array of data there, the shadow stack will be just as large, and almost all of that space will be wasted. For a single thread, perhaps that waste could be tolerated, but in an application with a large number of threads, it could add up to a lot of lost memory.

이러한 동기 중 하나는 섀도우 스택을 일반 스택과 동일한 크기로 할당하는 현재 정책으로 인해 발생할 수 있는 섀도우 스택의 과잉 할당을 방지하는 것입니다. Szabolcs Nagy는 이 경우의 문제를 설명했습니다. 스레드가 큰(일반) 스택으로 생성되어 거기에 큰 데이터 배열을 저장할 수 있는 경우 섀도우 스택도 그만큼 커지고 해당 공간의 거의 전부가 됩니다. 낭비될 것이다. 단일 스레드의 경우 이러한 낭비는 허용될 수 있지만 스레드 수가 많은 애플리케이션에서는 메모리 손실이 커질 수 있습니다.

There is also a case where an equally sized shadow stack could be too small. The sigaltstack() system call allows a thread to set up an alternative stack to be used for signal delivery. Even when a thread is switched to its alternative stack, though, it continues to use the same shadow stack. If the thread exhausts the regular stack, then handles a signal (perhaps even caused by running out of stack space) with a deep call chain on an alternative stack, the shadow stack could overflow.

동일한 크기의 섀도우 스택이 너무 작은 경우도 있습니다. sigaltstack() 시스템 호출을 사용하면 스레드가 신호 전달에 사용할 대체 스택을 설정할 수 있습니다. 그러나 스레드가 대체 스택으로 전환되더라도 계속해서 동일한 섀도우 스택을 사용합니다. 스레드가 일반 스택을 모두 소모한 다음 대체 스택의 깊은 호출 체인을 사용하여 신호(스택 공간 부족으로 인해 발생할 수도 있음)를 처리하는 경우 섀도우 스택이 오버플로될 수 있습니다.

The kernel can try to make an educated guess as to what the optimal shadow-stack size might be, but it will remain a guess. As Brown pointed out, the only way to improve on that guess is to accept information from user space, which (presumably) has a better idea of what its needs are. Creating a new thread without a shadow stack and letting that thread map one explicitly would be one way to solve the problem; creating a suitably sized shadow stack in clone3(), though, ensures that the new thread will never run without shadow-stack coverage.

커널은 최적의 섀도우 스택 크기가 얼마인지에 대해 정보를 바탕으로 추측을 시도할 수 있지만 이는 추측으로 유지됩니다. Brown이 지적했듯이, 이러한 추측을 개선하는 유일한 방법은 사용자 공간에서 정보를 받아들이는 것입니다. 사용자 공간은 (아마도) 자신에게 필요한 것이 무엇인지 더 잘 알고 있습니다. 섀도우 스택 없이 새 스레드를 생성하고 해당 스레드를 명시적으로 매핑하도록 하는 것은 문제를 해결하는 한 가지 방법이 될 것입니다. 하지만 clone3()에서 적절한 크기의 섀도우 스택을 생성하면 새 스레드가 섀도우 스택 적용 범위 없이 실행되지 않습니다.

Brauner seemed to accept the reasoning behind the addition of this feature to clone3(), but he worried that there is currently only one architecture with shadow-stack support in the mainline currently. The addition of others, he hinted, could drive changes in the proposed API; he suggested keeping the clone3() changes out of the mainline until arm64 support has been merged. Brown was amenable to that plan for now, as long as the arm64 and clone3() changes could be merged together.

Brauner는 이 기능을 clone3()에 추가한 이유를 인정하는 것처럼 보였지만 현재 메인라인에서 섀도우 스택을 지원하는 아키텍처가 단 하나뿐이라는 점을 걱정했습니다. 그는 다른 기능을 추가하면 제안된 API에 변화가 생길 수 있다고 암시했습니다. 그는 arm64 지원이 병합될 때까지 clone3() 변경 사항을 메인라인에서 유지하도록 제안했습니다. Brown은 arm64 및 clone3() 변경 사항이 함께 병합될 수 있는 한 현재로서는 해당 계획을 따를 수 있었습니다.

That seems likely to be how things will go from here. The merging of arm64 shadow-stack support appears to be on a slow path while the user-space side is being finalized, so it may be a while before all this work lands in a mainline kernel. If all goes well, though, it will eventually be possible to control the size of the shadow stack given to new threads on all architectures that implement shadow stacks.

여기서부터는 상황이 어떻게 진행될 것 같습니다. arm64 섀도우 스택 지원 병합은 사용자 공간 측면이 마무리되는 동안 느린 경로에 있는 것으로 보이므로 이 모든 작업이 메인라인 커널에 도달하기까지는 다소 시간이 걸릴 수 있습니다. 그러나 모든 것이 순조롭게 진행된다면 결국 섀도우 스택을 구현하는 모든 아키텍처의 새 스레드에 제공되는 섀도우 스택의 크기를 제어하는 것이 가능해질 것입니다.


-----

사용자 공간 섀도우 스택은 사용자 공간에서 실행되는 프로세스의 스택을 보호하기 위한 메커니즘입니다. 섀도우 스택은 실제 스택과 동일한 크기와 구조를 갖는 가상 스택입니다. 섀도우 스택은 실제 스택의 모든 쓰기 작업을 모니터링하고, 악의적인 코드가 스택을 조작하는 것을 방지합니다.

사용자 공간 섀도우 스택은 다음과 같은 방식으로 작동합니다.

프로세스가 시작되면 커널은 실제 스택과 동일한 크기와 구조를 갖는 섀도우 스택을 생성합니다.
프로세스가 스택에 데이터를 쓰면 커널은 실제 스택과 섀도우 스택에 동일한 데이터를 씁니다.
프로세스가 스택에서 데이터를 읽으면 커널은 실제 스택에서 데이터를 읽고, 섀도우 스택의 데이터와 비교합니다.
섀도우 스택을 사용하면 다음과 같은 보안 이점을 제공할 수 있습니다.

스택 오버플로 공격 방지: 섀도우 스택을 사용하면 악의적인 코드가 스택을 오버플로우하여 메모리를 덮어쓰는 것을 방지할 수 있습니다.
ROP 공격 방지: ROP 공격은 악의적인 코드가 스택에 저장된 라이브러리 함수의 주소를 사용하여 시스템을 제어하는 공격입니다. 섀도우 스택을 사용하면 악의적인 코드가 스택에 저장된 라이브러리 함수의 주소를 조작하는 것을 방지할 수 있습니다.
XSS 공격 방지: XSS 공격은 악의적인 코드가 웹 브라우저의 스택을 조작하여 사용자의 브라우저를 악의적인 웹 사이트로 리디렉션하는 공격입니다. 섀도우 스택을 사용하면 악의적인 코드가 웹 브라우저의 스택을 조작하는 것을 방지할 수 있습니다.
사용자 공간 섀도우 스택은 다음과 같은 단점이 있습니다.

성능 저하: 섀도우 스택을 사용하면 스택에 쓰기 작업을 할 때마다 커널이 실제 스택과 섀도우 스택에 동일한 데이터를 써야 하므로 성능이 저하될 수 있습니다.
구현 복잡성: 섀도우 스택을 구현하려면 커널과 사용자 공간의 코드가 모두 수정되어야 하므로 구현이 복잡할 수 있습니다.
사용자 공간 섀도우 스택은 스택 공격으로부터 시스템을 보호하는 효과적인 방법입니다. 그러나 성능 저하와 구현 복잡성의 단점을 고려해야 합니다.




The kernel has recently added support for shadow stacks, currently x86 only using their CET feature but both arm64 and RISC-V have equivalent features (GCS and Zisslpcfi respectively), I am actively working on GCS[1].  With shadow stacks the hardware maintains an additional stack containing only the return addresses for branch instructions which is not generally writeable by userspace and ensures that any returns are to the recorded addresses.  This provides some protection against ROP attacks and making it easier to collect call stacks.  These shadow stacks are allocated in the address space of the userspace process.

Our API for shadow stacks does not currently offer userspace any flexiblity for managing the allocation of shadow stacks for newly created threads, instead the kernel allocates a new shadow stack with the same size as the normal stack whenever a thread is created with the feature enabled.  The stacks allocated in this way are freed by the kernel when the thread exits or shadow stacks are disabled for the thread.  This lack of flexibility and control isn't ideal, in the vast majority of cases the shadow stack will be over allocated and the implicit allocation and deallocation is not consistent with other interfaces.  As far as I can tell the interface is done in this manner mainly because the shadow stack patches were in development since before clone3() was implemented.

커널은 최근 섀도우 스택에 대한 지원을 추가했습니다. 현재 x86은 CET 기능만 사용하지만 arm64와 RISC-V는 모두 동등한 기능(각각 GCS 및 Zisslpcfi)을 가지고 있습니다. 저는 GCS[1]에 적극적으로 작업하고 있습니다. 섀도우 스택을 사용하면 하드웨어는 일반적으로 사용자 공간에서 쓸 수 없는 분기 명령에 대한 반환 주소만 포함하는 추가 스택을 유지하고 모든 반환이 기록된 주소로 이루어지도록 보장합니다. 이는 ROP 공격으로부터 어느 정도 보호를 제공하고 호출 스택을 더 쉽게 수집할 수 있게 해줍니다. 이러한 섀도우 스택은 사용자 공간 프로세스의 주소 공간에 할당됩니다.

섀도우 스택용 API는 현재 새로 생성된 스레드에 대한 섀도우 스택 할당을 관리하기 위한 유연성을 사용자 공간에 제공하지 않습니다. 대신 커널은 기능이 활성화된 스레드가 생성될 때마다 일반 스택과 동일한 크기의 새 섀도우 스택을 할당합니다. 이러한 방식으로 할당된 스택은 스레드가 종료되거나 스레드에 대해 섀도우 스택이 비활성화될 때 커널에 의해 해제됩니다. 이러한 유연성 및 제어 부족은 이상적이지 않습니다. 대부분의 경우 섀도우 스택은 초과 할당되고 암시적 할당 및 할당 해제는 다른 인터페이스와 일치하지 않습니다. 내가 알 수 있는 한 인터페이스는 주로 clone3()이 구현되기 전부터 섀도우 스택 패치가 개발 중이었기 때문에 이런 방식으로 수행되었습니다.

Since clone3() is readily extensible let's add support for specifying a shadow stack when creating a new thread or process in a similar manner to how the normal stack is specified, keeping the current implicit allocation behaviour if one is not specified either with clone3() or through the use of clone().  When the shadow stack is specified explicitly the kernel will not free it, the inconsistency with implicitly allocated shadow stacks is a bit awkward but that's existing ABI so we can't change it.

The memory provided must have been allocated for use as a shadow stack, the expectation is that this will be done using the map_shadow_stack() syscall.  I opted not to add validation for this in clone3() since it will be enforced by hardware anyway.

clone3()은 쉽게 확장 가능하므로 일반 스택이 지정되는 방식과 비슷한 방식으로 새 스레드나 프로세스를 생성할 때 섀도우 스택을 지정하는 지원을 추가하고, clone3()로 지정되지 않은 경우 현재 암시적 할당 동작을 유지합니다. 또는 clone()을 사용하여 가능합니다. 섀도우 스택이 명시적으로 지정되면 커널은 이를 해제하지 않으며, 암시적으로 할당된 섀도우 스택과의 불일치는 약간 어색하지만 이는 기존 ABI이므로 변경할 수 없습니다.

제공된 메모리는 섀도우 스택으로 사용하기 위해 할당되어야 하며, 이는 map_shadow_stack() 시스템 호출을 사용하여 수행될 것으로 예상됩니다. 어쨌든 하드웨어에 의해 시행될 것이기 때문에 clone3()에 이에 대한 유효성 검사를 추가하지 않기로 결정했습니다.

Please note that the x86 portions of this code are build tested only, I don't appear to have a system that can run CET avaible to me, I have done testing with an integration into my pending work for GCS.  There is some possibility that the arm64 implementation may require the use of clone3() and explicit userspace allocation of shadow stacks, this is still under discussion.

A new architecture feature Kconfig option for shadow stacks is added as here, this was suggested as part of the review comments for the arm64 GCS series and since we need to detect if shadow stacks are supported it seemed sensible to roll it in here.

The selftest portions of this depend on 34dce23f7e40 ("selftests/clone3: Report descriptive test names") in -next[2].

이 코드의 x86 부분은 빌드 테스트만 수행되었으며 CET를 실행할 수 있는 시스템이 없는 것 같습니다. GCS에 대해 보류 중인 작업에 대한 통합 테스트를 완료했습니다. arm64 구현에는 clone3() 사용과 섀도우 스택의 명시적인 사용자 공간 할당이 필요할 수 있는 가능성이 있습니다. 이에 대해서는 아직 논의 중입니다.

섀도우 스택을 위한 새로운 아키텍처 기능인 Kconfig 옵션이 여기에 추가되었습니다. 이는 arm64 GCS 시리즈에 대한 검토 의견의 일부로 제안되었으며 섀도우 스택이 지원되는지 감지해야 하기 때문에 여기에 포함시키는 것이 합리적으로 보였습니다.

이것의 자체 테스트 부분은 -next[2]의 34dce23f7e40("selftests/clone3: 보고서 설명 테스트 이름")에 따라 다릅니다.

## 리눅스 리뷰 #4 리눅스 6.6 부터 새도우 스택에 대한 지원

리눅스 6.6 에서 새도우 스택에 대한 지원 시작했습니다. 현재는 x86 아키텍처에 대한 지원만 하고 있는데, 많은 아키텍처로 구현되어져 나갈 듯 보입니다.

새도우 스택은 사용자 공간에서 실행되는 프로세스의 스택을 보호하기 위한 매커니즘으로 프로세스 호출 스택과 동일한 크기와 구조를 가지는 복사본(가상 스택)을 통하여 실제 쓰기 작업을 모니터링하고 악의적은 공격자에 의해서 스택이 오염되는 것을 방지할 수 있습니다. 즉, 스택오버플로우나 ROP (Return oriented programming) attack 을 방지할 수 있습니다. 다만, 모니터링에 대한 비용이 발생하여 성능이 저하될 수 있고, 구현은 복잡합니다.

리눅스에서 prctl(...) 호출을 통하여 새도우 스택을 생성하고 활성화할 수 있습니다.

현재의 구현에서

- 스레드가 생성될 때마다 일반 스택과 동일한 크기의 새로운 새도우 스택을 할당하는데, 스레드가 큰 스택으로 생성되어 그곳에 큰 데이터 배열이 저장될 수 있는데, 이것은 데이터의 크기만큼 공간 낭비로 이어질 수 있습니다. 단일 스레드라면 큰 문제가 없지만, 멀티스레드의 경우 각 스레드당 공간이 낭비되는 것입니다.

- 오히려 새도우 스택이 너무 작은 경우는 스레드가 더 이상 사용할 스택이 없을 경우 대체 스택을 사용하게 되는데, 이럴 경우 새도우 스택의 크기가 작기 때문에, 새도우 스택에 스택 오버플로우가 발생할 수 있습니다.

그렇기 때문에 clone3(...) 함수에 새 스레드에 생성될 스택의 주소와 크기를 조정할 수 있는 기능이 추가되었습니다.

오래된 해커들은 해킹하기도 힘들어 보이네요. 🤪

https://lore.kernel.org/lkml/dc9a3dd544bbf859142c5582011a924b1c1bf6ed.camel@intel.com/T/


사용자 공간 섀도우 스택은 사용자 공간에서 실행되는 프로세스의 스택을 보호하기 위한 메커니즘

섀도우 스택은 실제 스택과 동일한 크기와 구조를 갖는 가상 스택

섀도우 스택은 실제 스택의 모든 쓰기 작업을 모니터링하고, 악의적인 코드가 스택을 조작하는 것을 방지



프로세스가 시작되면 커널은 실제 스택과 동일한 크기와 구조를 갖는 섀도우 스택을 생성

프로세스가 스택에 데이터를 쓰면 커널은 실제 스택과 섀도우 스택에 동일한 데이터를 씁

프로세스가 스택에서 데이터를 읽으면 커널은 실제 스택에서 데이터를 읽고, 섀도우 스택의 데이터와 비교


스택 오버플로 공격 방지: 섀도우 스택을 사용하면 악의적인 코드가 스택을 오버플로우하여 메모리를 덮어쓰는 것을 방지

ROP 공격 방지: ROP 공격은 악의적인 코드가 스택에 저장된 라이브러리 함수의 주소를 사용하여 시스템을 제어하는 공격

섀도우 스택을 사용하면 악의적인 코드가 스택에 저장된 라이브러리 함수의 주소를 조작하는 것을 방지

XSS 공격 방지: XSS 공격은 악의적인 코드가 웹 브라우저의 스택을 조작하여 사용자의 브라우저를 악의적인 웹 사이트로 리디렉션하는 공격

단점

성능 저하: 섀도우 스택을 사용하면 스택에 쓰기 작업을 할 때마다 커널이 실제 스택과 섀도우 스택에 동일한 데이터를 써야 하므로 성능이 저하

구현 복잡성: 섀도우 스택을 구현하려면 커널과 사용자 공간의 코드가 모두 수정되어야 하므로 구현이 복잡할 수 있음


-----


사용자 공간 섀도우 스택은 Linux의 비교적 새로운 기능입니다. 지원은 6.6에만 추가되었으며 x86 아키텍처로 제한

섀도우 스택은 반환 주소만 포함하는 현재 호출 스택의 복사본(이는 CPU에 의해 유지)

섀도우 스택이 활성화되면 모든 함수 호출로 인해 반환 주소가 일반 스택과 섀도우 스택 모두에 푸시

함수가 반환될 때마다 일반 스택의 반환 주소는 섀도우 스택의 복사본과 비교


두 개가 일치하지 않으면 프로세서가 트랩되고 (일반적으로) 영향을 받는 프로세스가 종료

ROP(반환 지향 프로그래밍) 공격을 포함하여 오버런 스택 기반 변수를 기반으로 하는 공격에 대한 방어를 제공하기 위한 것

섀도우 스택과 작동하지 않는 코드가 있으므로 해당 기능을 기본적으로 활성화할 수 없음

prctl() 호출을 통해 섀도우 스택을 생성하고 활성화할 수 있음

지난 10월 Mark Brown(arm64 섀도우 스택 구현 작업 중)은 이러한 방식으로 새로운 기능을 추가할 수 있도록 설계된 비교적 새로운 시스템 호출인 clone3()에 해당 제어 기능을 추가하는 패치 시리즈를 게시

몇 가지 논의 끝에 사용자 공간이 섀도우 스택을 정확하게 배치할 수 있도록 허용하는 것이 유용할 수 있지만 해당 기능이 압도적으로 필요하지는 않다는 결론

스레드 생성 시 사용자 공간이 섀도우 스택의 크기에 영향을 미치도록 허용하는 것이 왜 필요한지 궁금

섀도우 스택을 일반 스택과 동일한 크기로 할당하는 현재 정책으로 인해 발생할 수 있는 섀도우 스택의 과잉 할당을 방지

스레드가 큰(일반) 스택으로 생성되어 거기에 큰 데이터 배열을 저장할 수 있는 경우 섀도우 스택도 그만큼 커지고 해당 공간의 거의 전부가 됩 - 낭비

단일 스레드의 경우 이러한 낭비는 허용될 수 있지만 스레드 수가 많은 애플리케이션에서는 메모리 손실이 커질 수 있음

동일한 크기의 섀도우 스택이 너무 작은 경우도 있습니다. sigaltstack() 시스템 호출을 사용하면 스레드가 신호 전달에 사용할 대체 스택을 설정할 수 있습니다. 그러나 스레드가 대체 스택으로 전환되더라도 계속해서 동일한 섀도우 스택을 사용합니다. 스레드가 일반 스택을 모두 소모한 다음 대체 스택의 깊은 호출 체인을 사용하여 신호(스택 공간 부족으로 인해 발생할 수도 있음)를 처리하는 경우 섀도우 스택이 오버플로될 수 있습니다.

clone3()에서 적절한 크기의 섀도우 스택을 생성하면 새 스레드가 섀도우 스택 적용 범위 없이 실행되지 않음

섀도우 스택을 지원하는 아키텍처가 단 하나뿐

면 결국 섀도우 스택을 구현하는 모든 아키텍처의 새 스레드에 제공되는 섀도우 스택의 크기를 제어하는 것이 가능해질 것


----

새도우 스택을 사용하면 하드웨어는 일반적으로 사용자 공간에서 쓸 수 없는 분기 명령에 대한 반환 주소만 포함하는 추가 스택을 유지하고 모든 반환이 기록된 주소로 이루어지도록 보장

이는 ROP 공격으로부터 어느 정도 보호를 제공하고 호출 스택을 더 쉽게 수집할 수 있게 해

이러한 섀도우 스택은 사용자 공간 프로세스의 주소 공간에 할당


섀도우 스택용 API는 현재 새로 생성된 스레드에 대한 섀도우 스택 할당을 관리하기 위한 유연성을 사용자 공간에 제공하지 않습니다. 대신 커널은 기능이 활성화된 스레드가 생성될 때마다 일반 스택과 동일한 크기의 새 섀도우 스택을 할당합니다. 이러한 방식으로 할당된 스택은 스레드가 종료되거나 스레드에 대해 섀도우 스택이 비활성화될 때 커널에 의해 해제됩니다. 이러한 유연성 및 제어 부족은 이상적이지 않습니다. 대부분의 경우 섀도우 스택은 초과 할당되고 암시적 할당 및 할당 해제는 다른 인터페이스와 일치하지 않습니다. 내가 알 수 있는 한 인터페이스는 주로 clone3()이 구현되기 전부터 섀도우 스택 패치가 개발 중이었기 때문에 이런 방식으로 수행되었습니다.

