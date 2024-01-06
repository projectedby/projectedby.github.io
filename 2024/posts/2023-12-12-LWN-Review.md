---
layout: 'index'
view: 'post'
permalink: '/posts/2023/12/12/LWN-Review.html'
opengraph:
    site:
        name: 'ProjectedBy/Sub'
        url: '/'
date: '2023/12/12 14:52:00'
title: 'LWN Review'
description: ""
category: 'LWN Review'
tags: ['LWN Review']
---

Kernel Samepage Merging (KSM) 을 이용해서 


Kernel Samepage Merging (KSM) Usage at Meta and future Improvements

## An overview of kernel samepage merging (KSM)

[An overview of kernel samepage merging (KSM)](https://lwn.net/Articles/953141/)
<date>November 29, 2023<date>
<author>Jake Edge<author>
<url>https://lwn.net/Articles/953141/</url>

https://lpc.events/event/17/contributions/1625/attachments/1320/2649/KSM.pdf
https://lpc.events/event/17/contributions/1625
https://www.kernel.org/doc/html/v6.6/admin-guide/mm/ksm.html

In the Kernel Summit track at the 2023 Linux Plumbers Conference (LPC), Stefan Roesch led a session on kernel samepage merging (KSM). He gave an overview of the feature and described some recent changes to KSM. He showed how an application can enable KSM to deduplicate its memory and how the feature can be evaluated to determine whether it is a good fit for new workloads. In addition, he provided some real-world data of the benefits from his workplace at Meta.

KSM basics

The high-level summary of KSM is "very simple": it is simply a scheme to deduplicate anonymous pages by sharing a single copy. It was added to the kernel in 2009, so it is not a new feature, but there has been increased interest in it over the last two years. The original use case was for deduplicating the memory of virtual machines (VMs), but there are other use cases as well.

In order to do its job, KSM has a kernel thread, ksmd, that scans anonymous pages in virtual memory areas (VMAs) that have KSM enabled, which Roesch calls the "candidate pages". It operates in three major phases, using a hash of the contents of the page to quickly compare them against the hashes of other pages to determine if the page is duplicated (or to see if its contents have changed). An rmap_item is created for each candidate to track its hash; if a candidate's hash changes frequently, it is not a good choice for deduplication.

In the second phase, any candidates that have not changed get added to an "unstable" tree; if the candidate is already found to be on the unstable tree, though, it gets moved to the "stable" tree. At that point, other pages with the same contents are switched to use a single page on the stable tree. A copy-on-write (CoW) mechanism is used to ensure that writes to any of the copies are handled correctly.

There are two ways to add an anonymous page to the candidate set. The "old way" is to use the madvise() system call, while the new one uses the prctl() system call; the latter was developed by Roesch. Not all memory regions are suitable for KSM, so there are exclusions for regions using DAX, hugetlb, and shared VMAs, he said.

The madvise() mechanism uses a flag, MADV_MERGEABLE, to indicate memory regions for KSM to operate on; if it is a compatible region, its pages are added to the candidates. The problem with that approach is that you had to guess which memory regions will benefit because there was no feedback on how well (or poorly) the deduplication is doing for the region.

The new prctl()-based method was added in the 6.4 kernel; the PR_SET_MEMORY_MERGE flag can be used to enable KSM for all compatible VMAs in a process. That setting is also inherited when the process forks, so KSM will be enabled for compatible VMAs in any children as well. The PR_GET_MEMORY_MERGE flag can be used to query whether KSM is enabled for the process.

System-wide configuration of KSM is done through the /sys/kernel/mm/ksm sysfs interface; there are multiple files in that directory, both for monitoring and configuring the feature. The run file is used to enable or disable the feature on the system, pages_to_scan determines how many pages are scanned each time ksmd wakes up, and sleep_millisecs sets how frequently the scans are done. Those latter two govern how aggressively KSM operates.

For monitoring, there are a few files in the sysfs directory, as well as in the /proc/PID directory. In particular, the /proc/PID/ksm_stat file has some information about KSM for the process, while some extra KSM information was added to the smaps and smaps_rollups files for the 6.6 kernel. That information can be used to see which VMAs are benefiting from KSM.

The monitoring files in /sys/kernel/mm/ksm include system-wide measurements of KSM, such as pages_shared for the number of pages shared via KSM, pages_sharing for the number of references to KSM shared pages (thus how many pages are being deduplicated), pages_unshared, which is the number of non-changing pages that are unique, thus unshared, and pages_volatile that counts the pages that changed too rapidly. The pages_scanned file was added for 6.6 to count the total pages scanned, which can be combined with full_scans, the count of scans completed, to determine how much work is being done in the scan phase.

One challenge is that, prior to the 6.4 kernel, it was not possible to figure out how long the scans were taking. He added some tracepoints to KSM that allow measuring the scan time; ksm_start_scan and ksm_stop_scan are the two most important tracepoints, but there are a handful of others that are useful for more-specialized investigation.

At Meta

He then turned to how Meta is using KSM. The Instagram web application was suffering from both memory and CPU pressure on older server systems. The workload is characterized by a single controller process and 32 or more worker processes; the number of workers scales based on the size of the system. The workers load their interpreter into memory when they start up and they also share a lot of other data structures that get loaded on demand.

The Meta engineers thought that KSM would work well for that workload because there is a lot of memory that can potentially be shared. At the time, the only way to enable KSM was via the madvise() call. The workers are run in control groups (cgroups) that are started by systemd, so the idea of process-level KSM enabling came up, along with the idea of inheriting that state across fork() .

That is where the prctl() flag, which was added for 6.4, came from. At the same time, systemd was modified to add the MemoryKSM parameter to enable KSM for a systemd service. The advantage of this approach is that the application code does not need to change at all to take advantage of KSM.

When he first started testing KSM on the workload, the "results were very disappointing to say the least", Roesch said; there was no real sharing of memory happening. He realized that the default pages_to_scan value was set to 100, which is "way too low"; later he noticed that the documentation says that the default is only useful for demo purposes. There were no tracepoints available at the time, either, which made it more difficult to track the problem down.

It turns out that 4000-5000 is a good compromise value for pages_to_scan on the Instagram workload. Other workloads that he has tested require 2000-3000 for that parameter. It is important that people know that the value needs to be changed; looking at the memory savings and the amount of time it takes to do a full scan are good hints for determining the best value. If it is taking 20 minutes to do a full scan, that is an indication the pages_to_scan is too low; Meta tries to keep the scan time at around two to three minutes, he said.

He showed some numbers for a typical workload (which can be seen in his slides or the YouTube video of the talk). There were around 73,000 pages_shared with 2.1 million references to them (i.e. pages_sharing). That means a savings of around 6GB of memory on a 64GB machine, "which is, for us, a huge saving". If you consider the fleet of systems at Meta, that savings multiplies greatly, Roesch said.

Optimizations
Once Meta started looking more closely at the scanning, it was clear that KSM was scanning a huge number of pages, especially during the initial ramp-up as the workers are being started. Even after it reaches something of a steady state, there are lots of pages being repeatedly scanned, but they are unique so they never get shared. That led to the idea of skipping pages as an optimization to reduce CPU usage.

The "smart scan" optimization feature, which has been merged for the 6.7 kernel, stores a skip count with each rmap_item that governs whether the page is skipped in the processing. The skip count increases (to a maximum of eight scan cycles that will be skipped) each time the page is found to be unique again once its skip count is reached. Smart scan is enabled by default and it reduces the number of pages scanned per cycle by 10-20%.

An optimization that is being discussed would help tune the number of pages to scan. Right now, that value needs to be set based on the ramp-up time where more than twice the number of pages need to scanned per cycle; once the steady state is reached, the pages_to_scan value could be reduced. Other workloads have shown similar behavior, so the "auto-tune" optimization could manage how aggressive the page scans are. The idea would be to identify a target for how long it should take to scan all of the candidate pages, which is what auto-tune would try to optimize. There would also be minimum and maximum CPU usage percentages that would limit the scans as well.

The results from auto-tune so far are promising. At startup, the pages_to_scan gets set to 5000-6000, but that gets reduced to 2500 or even less once the system reaches the steady state. That results in a CPU usage savings of 20-30% for ksmd. Configuration using a target scan time and CPU usage limits is more meaningful to administrators, as well, he said.

Evaluating new workloads
The easiest way to enable KSM for an application is by using the prctl() flag for the process. That can be done by changing the application itself, using the systemd parameter, or by running the program with an LD_PRELOAD library with a function that gets called at program load time. The last option works, but the first two are preferred, he said.

The next step is to run the program on a representative workload. The /sys/kernel/mm/ksm/general_profit file can be consulted to see how much memory is being saved; that measure subtracts out the memory used by KSM itself. The /proc files can be consulted for further per-process information as well.

To get meaningful data, though, it makes sense to rerun the test with different pages_to_scan values. How aggressive the page scan should be depends on the workload, so it is important to run the tests long enough to get the full picture. He reiterated that the default value for pages_to_scan is not at all adequate, so it will need to be adjusted.

Often, it is the case that an application has certain VMAs that benefit from KSM and others that do not. The /proc/PID/smaps file now has entries for KSM that will help show which VMAs are seeing the most benefit. Once that is known, the prctl() call can be removed and separate madvise() calls can be made for just those VMAs. One general piece of advice that he had is that smaller page sizes work better with KSM because there is more likelihood of sharing.

Today, evaluating a new workload for KSM requires running experiments with KSM enabled, but there may be situations where KSM cannot be enabled or these kinds of experiments cannot be run. He has some ideas on ways to evaluate workloads and was looking for feedback on them. One is an in-kernel approach and the other uses the drgn kernel debugger.

He has just hacked something together for drgn at this point, which he has not yet released, but the idea is to go through all the VMAs and collect the hashes for the pages, storing them in Python dictionaries. That information can be processed to see how much sharing can be done. It is fairly simple, but is also rather slow; if only a few processes are examined, it is "probably OK", but if the whole system is to be analyzed, "we need to do something else".

An in-kernel alternative would provide a means to calculate the hashes for the pages so that the sharing could be evaluated. A more advanced scheme would actually maintain the unstable and stable trees but do no merging; that would provide more accurate information about how much sharing can be done, but would be more expensive. These are some ideas he is considering because Meta has other workloads that might benefit from KSM, but running experiments to figure out which would benefit is rather time-consuming.

There are some security issues to consider with regard to KSM, though "if you control your workload then this is less of a worry". There are known side-channel attacks against KSM, however—he linked to two papers in his slides—so that should be factored into the decision about using KSM. In addition, KSM does not make sense for all workloads; in particular, latency-sensitive workloads are not good candidates for KSM.

He wrapped up by recounting the KSM changes that entered in kernel in 6.1, 6.4, 6.6, and in the upcoming 6.7, with a nod to the auto-tune feature that will likely come before long. He also credited several of his colleagues for work on the feature and the systemd developers for helping him on that piece of the puzzle.

Omar Sandoval asked whether auto-tune was being done in the kernel or if it was driven by user space. Roesch said that it was all done in the kernel based on the three parameters (target scan time, CPU min/max). There are default values for those that should be fine for most workloads, but may need tweaking based on the number of pages and the CPU availability.

Another question was about the CPU and memory overhead for enabling KSM. Roesch said there is a formula in the documentation to calculate the memory overhead, but that it is not much; there are the rmap_item entries, which includes the unstable tree that is overlaid on it, plus the stable tree. The CPU overhead depends on how aggressively the scans are done; on a typical Instagram Skylake system during startup "we see up to 60% CPU usage for the ksmd kernel background thread", which drops to around 30% in the steady state.

[I would like to thank LWN's travel sponsor, the Linux Foundation, for assistance with my travel to Richmond for LPC.]


- 애플리케이션을 통해 KSM이 메모리를 중복 제거할 수 있는 방법
- 기능을 평가하여 새로운 워크로드에 적합한지 여부를 결정하는 방법

2023 LPC(Linux Plumbers Conference ) 의 Kernel Summit 트랙 에서 Stefan Roesch는 KSM( 커널 동일 페이지 병합 ) 세션을 이끌었습니다 . 그는 기능에 대한 개요를 설명하고 KSM의 최근 변경 사항을 설명했습니다 . 그는 애플리케이션을 통해 KSM이 메모리를 중복 제거할 수 있는 방법과 기능을 평가하여 새로운 워크로드에 적합한지 여부를 결정하는 방법을 보여주었습니다. 또한 그는 Meta라는 직장에서 얻을 수 있는 이점에 대한 실제 데이터를 제공했습니다.

- KSM의 상위 수준 요약은 "매우 간단"합니다. 이는 단일 복사본을 공유하여 익명 페이지의 중복을 제거하는 단순한 방식
- 원래 사용 사례는 가상 머신(VM)의 메모리 중복을 제거하는 것이었지만 다른 사용 사례 존재

KSM 기본
KSM의 상위 수준 요약은 "매우 간단"합니다. 이는 단일 복사본을 공유하여 익명 페이지의 중복을 제거하는 단순한 방식입니다. 2009년에 커널에 추가되었기 때문에 새로운 기능은 아니지만 지난 2년 동안 이에 대한 관심이 높아졌습니다. 원래 사용 사례는 가상 머신(VM)의 메모리 중복을 제거하는 것이었지만 다른 사용 사례도 있습니다.

- 작업을 수행하기 위해 KSM에는 KSM이 활성화된 VMA(가상 메모리 영역)에서 익명 페이지를 검색하는 커널 스레드 ksmd 가 있으며 Roesch는 이를 "후보 페이지"라고 부름
- 페이지 내용의 해시를 사용하여 다른 페이지의 해시와 신속하게 비교하여 페이지가 중복되었는지 확인(또는 내용이 변경되었는지 확인)하는 세 가지 주요 단계로 작동
- 해시를 추적하기 위해 각 후보에 대해 rmap_item이 생성
- 후보의 해시가 자주 변경되는 경우 중복 제거에 적합한 선택이 아님

작업을 수행하기 위해 KSM에는 KSM이 활성화된 VMA(가상 메모리 영역)에서 익명 페이지를 검색하는 커널 스레드 ksmd 가 있으며 Roesch는 이를 "후보 페이지"라고 부릅니다. 페이지 내용의 해시를 사용하여 다른 페이지의 해시와 신속하게 비교하여 페이지가 중복되었는지 확인(또는 내용이 변경되었는지 확인)하는 세 가지 주요 단계로 작동합니다. 해시를 추적하기 위해 각 후보에 대해 rmap_item이 생성 됩니다 . 후보의 해시가 자주 변경되는 경우 중복 제거에 적합한 선택이 아닙니다.

- 두 번째 단계에서는 변경되지 않은 모든 후보가 "불안정한" 트리에 추가
- 그러나 후보가 이미 불안정한 트리에 있는 것으로 확인되면 "안정적인" 트리로 이동
- 이 시점에서 동일한 내용을 가진 다른 페이지는 안정 트리의 단일 페이지를 사용하도록 전환
- CoW(기록 중 복사) 메커니즘은 복사본에 대한 쓰기가 올바르게 처리되도록 보장하는 데 사용

두 번째 단계에서는 변경되지 않은 모든 후보가 "불안정한" 트리에 추가됩니다. 그러나 후보가 이미 불안정한 트리에 있는 것으로 확인되면 "안정적인" 트리로 이동됩니다. 이 시점에서 동일한 내용을 가진 다른 페이지는 안정 트리의 단일 페이지를 사용하도록 전환됩니다. CoW(기록 중 복사) 메커니즘은 복사본에 대한 쓰기가 올바르게 처리되도록 보장하는 데 사용됩니다.

- 후보 세트에 익명 페이지를 추가하는 방법에는 두 가지
- "기존 방법"은 madvise() 시스템 호출을 사용
- 새로운 방법은 prctl() 시스템 호출을 사용
    - 모든 메모리 영역이 KSM에 적합한 것은 아니므로 DAX, hugetlb 및 공유 VMA를 사용하는 영역은 제외

후보 세트에 익명 페이지를 추가하는 방법에는 두 가지가 있습니다. "기존 방법"은 madvise() 시스템 호출을 사용하는 반면, 새로운 방법은 prctl() 시스템 호출을 사용합니다. 후자는 Roesch에 의해 개발되었습니다. 모든 메모리 영역이 KSM에 적합한 것은 아니므로 DAX, hugetlb 및 공유 VMA를 사용하는 영역은 제외된다고 그는 말했습니다.

- madvise () 메커니즘은 MADV_MERGEABLE 플래그를 사용하여 KSM이 작동할 메모리 영역을 나타냄
- 호환되는 지역인 경우 해당 페이지가 후보에 추가
- 이 접근 방식의 문제점은 해당 영역에서 중복 제거가 얼마나 잘 수행되는지(또는 제대로 수행되지 않는지)에 대한 피드백이 없기 때문에 어떤 메모리 영역이 도움이 될지 추측해야 한다는 것

madvise () 메커니즘은 MADV_MERGEABLE 플래그를 사용하여 KSM이 작동할 메모리 영역을 나타냅니다. 호환되는 지역인 경우 해당 페이지가 후보에 추가됩니다. 이 접근 방식의 문제점은 해당 영역에서 중복 제거가 얼마나 잘 수행되는지(또는 제대로 수행되지 않는지)에 대한 피드백이 없기 때문에 어떤 메모리 영역이 도움이 될지 추측해야 한다는 것입니다.

- 새로운 prctl() 기반 메소드가 6.4 커널에 추가
- PR_SET_MEMORY_MERGE 플래그를 사용하면 프로세스의 모든 호환 가능한 VMA에 대해 KSM을 활성화할 수 있음
- 해당 설정은 프로세스가 분기될 때 상속되므로 모든 하위 항목의 호환 가능한 VMA에도 KSM이 활성화
- PR_GET_MEMORY_MERGE 플래그를 사용하여 KSM이 프로세스에 대해 활성화되었는지 여부를 쿼리할 수 있음

새로운 prctl() 기반 메소드가 6.4 커널에 추가되었습니다. PR_SET_MEMORY_MERGE 플래그를 사용하면 프로세스의 모든 호환 가능한 VMA에 대해 KSM을 활성화할 수 있습니다 . 해당 설정은 프로세스가 분기될 때 상속되므로 모든 하위 항목의 호환 가능한 VMA에도 KSM이 활성화됩니다. PR_GET_MEMORY_MERGE 플래그를 사용하여 KSM이 프로세스에 대해 활성화되었는지 여부를 쿼리할 수 있습니다 .

- KSM의 시스템 전체 구성은 /sys/kernel/mm/ksm sysfs 인터페이스를 통해 수행
    - Pages_to_scan: ksmd가 깨어날 때마다 스캔되는 페이지 수를 결정
    - sleep_millisecs: 스캔이 수행되는 빈도를 설정
    - Pages_to_scan & sleep_millisecs: KSM이 얼마나 공격적으로 운영되는지를 결정

KSM의 시스템 전체 구성은 /sys/kernel/mm/ksm sysfs 인터페이스를 통해 수행됩니다. 해당 디렉터리에는 기능을 모니터링하고 구성하기 위한 여러 파일이 있습니다. 실행 파일 은 시스템의 기능을 활성화하거나 비활성화하는 데 사용되며, Pages_to_scan은 ksmd가 깨어날 때마다 스캔되는 페이지 수를 결정하고 , sleep_millisecs는 스캔이 수행되는 빈도를 설정합니다. 후자의 두 가지는 KSM이 얼마나 공격적으로 운영되는지를 결정합니다.

- 모니터링을 위해 sysfs 디렉터리
- /proc/PID 디렉터리에 몇 개의 파일
    - /proc/PID/ksm_stat 파일에는 프로세스의 KSM에 대한 일부 정보가 포함
    - 6.6 커널의 경우 smaps 및 smaps_rollups 파일에 일부 추가 KSM 정보가 추
    - 해당 정보를 사용하여 어떤 VMA가 KSM의 이점을 누리고 있는지 확인할 수 있음

모니터링을 위해 sysfs 디렉터리와 /proc/PID 디렉터리에 몇 개의 파일이 있습니다. 특히 /proc/PID/ksm_stat 파일에는 프로세스의 KSM에 대한 일부 정보가 포함되어 있으며, 6.6 커널의 경우 smaps 및 smaps_rollups 파일에 일부 추가 KSM 정보가 추가되었습니다. 해당 정보를 사용하여 어떤 VMA가 KSM의 이점을 누리고 있는지 확인할 수 있습니다.

/sys/kernel/mm/ksm 의 모니터링 파일에는 KSM을 통해 공유되는 페이지 수에 대한 페이지 _ 공유 , KSM 공유 페이지에 대한 참조 수에 대한 페이지_공유 (따라서 중복 제거되는 페이지 수 )와 같은 KSM의 시스템 전체 측정값이 포함됩니다. ), 페이지_unshared 는 고유하여 공유되지 않은 변경되지 않는 페이지 수이며, 너무 빠르게 변경된 페이지를 계산하는 page_휘발성입니다 . Pages_scanned 파일은 스캔 된 총 페이지 수를 계산하기 위해 6.6에 추가되었으며, 이는 완료된 스캔 수인 full_scans 와 결합되어 스캔 단계에서 수행되는 작업의 양을 확인할 수 있습니다.

<!-- 영문을 작성하자. -->

- 6.4 커널 이전에는 스캔에 소요되는 시간을 파악하는 것이 불가능

한 가지 문제는 6.4 커널 이전에는 스캔에 소요되는 시간을 파악하는 것이 불가능했다는 것입니다. 그는 스캔 시간을 측정할 수 있는 몇 가지 추적점을 KSM에 추가했습니다. ksm_start_scan 및 ksm_stop_scan 은 가장 중요한 두 가지 추적점이지만 보다 전문적인 조사에 유용한 몇 가지 다른 추적점이 있습니다.

메타에서
그런 다음 그는 Meta가 KSM을 어떻게 사용하는지 살펴보았습니다. Instagram 웹 애플리케이션은 오래된 서버 시스템의 메모리와 CPU 압박으로 인해 어려움을 겪고 있었습니다. 워크로드는 단일 컨트롤러 프로세스와 32개 이상의 작업자 프로세스로 특징 지어집니다. 작업자 수는 시스템 크기에 따라 달라집니다. 작업자는 시작할 때 인터프리터를 메모리에 로드하고 요청 시 로드되는 다른 많은 데이터 구조도 공유합니다.

- Meta 엔지니어들은 잠재적으로 공유할 수 있는 메모리가 많기 때문에 KSM이 해당 작업 부하에 적합할 것이라고 생각

- 이것이 6.4에 추가된 prctl() 플래그의 출처입니다. 동시에 systemd는 systemd 서비스에 대해 KSM을 활성화하기 위해 MemoryKSM 매개 변수를 추가하도록 수정 되었습니다. 이 접근 방식의 장점은 KSM을 활용하기 위해 애플리케이션 코드를 전혀 변경할 필요가 없다는 것입니다.

Meta 엔지니어들은 잠재적으로 공유할 수 있는 메모리가 많기 때문에 KSM이 해당 작업 부하에 적합할 것이라고 생각했습니다. 당시 KSM을 활성화하는 유일한 방법은 madvise() 호출을 통해서였습니다. 작업자는 systemd에 의해 시작되는 제어 그룹(cgroup)에서 실행되므로 프로세스 수준 KSM 활성화 아이디어와 해당 상태를 fork() 에서 상속한다는 아이디어가 나타났습니다 .

이것이 6.4에 추가된 prctl() 플래그의 출처입니다. 동시에 systemd는 systemd 서비스에 대해 KSM을 활성화하기 위해 MemoryKSM 매개 변수를 추가하도록 수정 되었습니다. 이 접근 방식의 장점은 KSM을 활용하기 위해 애플리케이션 코드를 전혀 변경할 필요가 없다는 것입니다.

Roesch는 워크로드에서 KSM을 처음 테스트하기 시작했을 때 "결과는 말할 것도 없이 매우 실망스러웠습니다"라고 말했습니다. 실제 메모리 공유가 발생하지 않았습니다. 그는 기본 페이지_to_scan 값이 "너무 낮은" 100으로 설정되어 있다는 것을 깨달았습니다. 나중에 그는 기본값이 데모 목적으로만 유용하다고 문서에 나와 있는 것을 발견했습니다. 당시에도 사용 가능한 추적점이 없었기 때문에 문제를 추적하기가 더 어려웠습니다.

4000-5000은 Instagram 워크로드에서 Pages_to_scan 에 대한 적절한 절충 값인 것으로 나타났습니다 . 그가 테스트한 다른 워크로드에는 해당 매개변수에 2000~3000이 필요합니다. 사람들이 가치를 변경해야 한다는 것을 아는 것이 중요합니다. 메모리 절약량과 전체 검색을 수행하는 데 걸리는 시간을 살펴보는 것은 최상의 값을 결정하는 데 좋은 힌트가 됩니다. 전체 검색을 수행하는 데 20분이 걸리는 경우 이는 페이지_to_scan이 너무 낮다는 의미입니다. 메타는 스캔 시간을 2~3분 내외로 유지하려고 노력한다고 말했다.

그는 일반적인 작업 부하에 대한 몇 가지 수치를 보여주었습니다(그의 슬라이드 나 강연이 담긴 YouTube 동영상 에서 볼 수 있음 ). 약 73,000개의 페이지 공유가 있었고 이에 대한 참조는 210만 개였습니다(예: 페이지 공유 ). 이는 64GB 시스템에서 약 6GB의 메모리가 절약된다는 의미이며, "이는 우리에게 엄청난 절약입니다." Meta의 시스템을 고려하면 절감액이 크게 증가한다고 Roesch는 말했습니다.

최적화
Meta가 스캐닝을 좀 더 자세히 살펴보기 시작하자 KSM이 특히 작업자가 시작되는 초기 램프업 동안 엄청난 수의 페이지를 스캐닝하고 있다는 것이 분명해졌습니다. 일정한 상태에 도달한 후에도 반복적으로 스캔되는 페이지가 많지만 고유하므로 공유되지 않습니다. 이로 인해 CPU 사용량을 줄이기 위한 최적화로 페이지를 건너뛰는 아이디어가 탄생했습니다.

6.7 커널에 병합된 "스마트 스캔" 최적화 기능은 처리 중 페이지 건너뛰기 여부를 제어하는 ​​각 rmap_item 과 함께 건너뛰기 횟수를 저장합니다 . 건너뛰기 횟수에 도달한 후 페이지가 다시 고유한 것으로 확인될 때마다 건너뛰기 횟수가 증가합니다(건너뛸 최대 8개의 스캔 주기까지). 스마트 스캔은 기본적으로 활성화되어 있으며 주기당 스캔되는 페이지 수를 10-20% 줄입니다.

논의 중인 최적화는 스캔할 페이지 수를 조정하는 데 도움이 됩니다. 현재 해당 값은 주기당 스캔해야 하는 페이지 수가 두 배 이상 필요한 램프업 시간을 기준으로 설정되어야 합니다. 안정된 상태에 도달하면 Pages_to_scan 값이 줄어들 수 있습니다. 다른 워크로드에서도 유사한 동작이 나타났으므로 "자동 조정" 최적화를 통해 페이지 검색이 얼마나 공격적인지 관리할 수 있습니다. 아이디어는 모든 후보 페이지를 스캔하는 데 걸리는 시간에 대한 목표를 식별하는 것입니다. 이는 자동 조정이 최적화하려고 시도하는 것입니다. 또한 스캔을 제한하는 최소 및 최대 CPU 사용량 비율도 있습니다.

지금까지의 자동 조정 결과는 유망합니다. 시작 시 페이지_to_scan은 5000-6000으로 설정되지만 시스템이 안정된 상태에 도달하면 2500 이하로 줄어듭니다. 결과적으로 ksmd 의 CPU 사용량이 20~30% 절약됩니다 . 목표 스캔 시간과 CPU 사용량 제한을 사용한 구성은 관리자에게도 더 의미가 있다고 그는 말했습니다.

새로운 워크로드 평가
애플리케이션에 대해 KSM을 활성화하는 가장 쉬운 방법은 프로세스에 대해 prctl() 플래그를 사용하는 것입니다. 이는 애플리케이션 자체를 변경하거나, systemd 매개변수를 사용하거나, 프로그램 로드 시 호출되는 함수가 있는 LD_PRELOAD 라이브러리 로 프로그램을 실행하여 수행할 수 있습니다 . 마지막 옵션이 효과가 있지만 처음 두 가지 옵션이 더 선호된다고 그는 말했습니다.

다음 단계는 대표적인 워크로드에서 프로그램을 실행하는 것입니다. / sys /kernel/mm/ksm/general_profit 파일을 참조하여 얼마나 많은 메모리가 절약되고 있는지 확인할 수 있습니다. 해당 측정값은 KSM 자체에서 사용하는 메모리를 뺍니다. 추가 프로세스별 정보는 /proc 파일 을 참조할 수도 있습니다.

하지만 의미 있는 데이터를 얻으려면 다른 page_to_scan 값을 사용하여 테스트를 다시 실행하는 것이 좋습니다 . 페이지 스캔의 강도는 작업 부하에 따라 다르므로 전체 그림을 얻을 수 있을 만큼 오랫동안 테스트를 실행하는 것이 중요합니다. 그는 Pages_to_scan 의 기본값이 전혀 적절하지 않으므로 조정이 필요하다고 반복해서 말했습니다.

애플리케이션에는 KSM의 혜택을 받는 특정 VMA와 그렇지 않은 VMA가 있는 경우가 많습니다. 이제 / proc/PID/smaps 파일에는 어떤 VMA가 가장 많은 이점을 얻고 있는지 보여주는 KSM 항목이 있습니다. 이를 알고 나면 prctl() 호출을 제거하고 해당 VMA에 대해서만 별도의 madvise() 호출을 수행할 수 있습니다. 그가 얻은 일반적인 조언 중 하나는 공유 가능성이 더 높기 때문에 더 작은 페이지 크기가 KSM에서 더 잘 작동한다는 것입니다.

현재 KSM에 대한 새로운 워크로드를 평가하려면 KSM을 활성화한 상태에서 실험을 실행해야 하지만 KSM을 활성화할 수 없거나 이러한 종류의 실험을 실행할 수 없는 상황이 있을 수 있습니다. 그는 작업 부하를 평가하는 방법에 대한 몇 가지 아이디어를 갖고 있으며 이에 대한 피드백을 찾고 있었습니다. 하나는 커널 내 접근 방식이고 다른 하나는 drgn 커널 디버거를 사용하는 것입니다 .

그는 이 시점에서 drgn을 위해 무언가를 함께 해킹했지만 아직 출시하지 않았습니다. 그러나 아이디어는 모든 VMA를 살펴보고 페이지의 해시를 수집하여 Python 사전에 저장하는 것입니다. 해당 정보를 처리하여 얼마나 많은 공유가 이루어질 수 있는지 확인할 수 있습니다. 상당히 간단하지만 속도가 다소 느립니다. 몇 가지 프로세스만 조사하면 "아마도 괜찮을 것"이지만 전체 시스템을 분석하려면 "다른 작업을 수행해야 합니다".

커널 내 대안은 공유를 평가할 수 있도록 페이지의 해시를 계산하는 수단을 제공합니다. 보다 발전된 방식은 실제로 불안정하고 안정적인 트리를 유지하지만 병합은 수행하지 않습니다. 얼마나 많은 공유가 이루어질 수 있는지에 대한 더 정확한 정보를 제공하지만 비용이 더 많이 듭니다. Meta에는 KSM의 이점을 누릴 수 있는 다른 워크로드가 있기 때문에 그가 고려하고 있는 몇 가지 아이디어입니다. 그러나 어떤 것이 이점이 될지 알아내기 위해 실험을 실행하는 것은 시간이 많이 걸립니다.

KSM과 관련하여 고려해야 할 몇 가지 보안 문제가 있지만 "작업 부하를 제어할 수 있다면 걱정할 필요가 없습니다". 그러나 KSM에 대한 알려진 부채널 공격이 있으므로(그는 자신의 슬라이드에 두 개의 논문을 연결함) KSM 사용을 결정할 때 이를 고려해야 합니다. 또한 KSM은 모든 작업 부하에 적합하지 않습니다. 특히 대기 시간에 민감한 워크로드는 KSM에 적합하지 않습니다.

그는 6.1, 6.4, 6.6 및 향후 6.7의 커널에 적용된 KSM 변경 사항에 대해 설명하고 머지않아 적용될 자동 조정 기능에 대한 고개를 끄덕이면서 마무리했습니다. 그는 또한 이 기능에 대한 작업을 수행한 동료 몇 명과 퍼즐 조각을 해결하는 데 도움을 준 시스템 개발자에게도 감사를 표했습니다.

Omar Sandoval은 자동 조정이 커널에서 수행되는지 아니면 사용자 공간에 의해 구동되는지 물었습니다. Roesch는 세 가지 매개변수(대상 스캔 시간, CPU 최소/최대)를 기반으로 이 모든 작업이 커널에서 수행되었다고 말했습니다. 대부분의 작업 부하에 적합한 기본값이 있지만 페이지 수와 CPU 가용성에 따라 조정이 필요할 수 있습니다.

또 다른 질문은 KSM 활성화를 위한 CPU 및 메모리 오버헤드에 관한 것이었습니다. Roesch는 문서에 메모리 오버헤드를 계산하는 공식이 있지만 그다지 많지는 않다고 말했습니다. 위에 겹쳐진 불안정한 트리와 안정적인 트리를 포함하는 rmap_item 항목이 있습니다 . CPU 오버헤드는 스캔이 얼마나 적극적으로 수행되는지에 따라 달라집니다. 일반적인 Instagram Skylake 시스템 시작 시 " ksmd 커널 백그라운드 스레드에 대한 CPU 사용량이 최대 60%까지 표시됩니다." 이는 정상 상태에서는 약 30%로 떨어집니다.

[LPC를 위해 리치몬드로 여행하는 데 도움을 준 LWN의 여행 후원자인 Linux Foundation에 감사의 말씀을 전하고 싶습니다.]
