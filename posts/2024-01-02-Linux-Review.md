---
layout: 'index'
view: 'post'
permalink: '/posts/2024/01/02/Linux-Review.html'
opengraph:
    site:
        name: 'ProjectedBy/Sub'
        url: '/'
date: '2023/01/02 09:14:00'
title: 'Linux Review'
description: ""
category: 'LinuxReview'
tags: ['Linux', 'Review']
---

## 

Trust in and maintenance of filesystems

파일 시스템 신뢰 및 유지 관리

By Jonathan Corbet
November 21, 2023

Maintainers SummitThe Linux kernel supports a wide variety of filesystems, many of which are no longer in heavy use — or, perhaps, any use at all. The kernel code implementing the less-popular filesystems tends to be relatively unpopular as well, receiving little in the way of maintenance. Keeping old filesystems alive does place a burden on kernel developers, though, so it is not surprising that there is pressure to remove the least popular ones. At the 2023 Kernel Maintainers Summit, the developers talked about these filesystems and what can be done about them.
Christoph Hellwig started the discussion by saying that it is hard for developers to know how mature — how trustworthy and maintained — any given filesystem is; that can often only be determined by talking to its users. This information gap can be a bad thing, he said. User space (in the form of desktop environments in particular) has a strong urge to automatically mount filesystems, even those that are unmaintained, insecure, and untrustworthy. This automounting exposes the system to security threats and is always a bad idea, but it's a fact of life; maybe there needs to be a way for the kernel to indicate to user space that some filesystems are not suitable for mounting in this way.

관리자 서밋 Linux 커널은 다양한 파일 시스템을 지원하는데, 그 중 다수는 더 이상 많이 사용되지 않거나 전혀 사용되지 않을 수도 있습니다. 덜 인기 있는 파일 시스템을 구현하는 커널 코드도 상대적으로 인기가 없는 경향이 있어 유지 관리가 거의 필요하지 않습니다. 하지만 오래된 파일 시스템을 유지하는 것은 커널 개발자에게 부담이 되기 때문에 가장 인기가 없는 파일 시스템을 제거하라는 압력이 있다는 것은 놀라운 일이 아닙니다. 2023년 커널 유지관리자 서밋에서 개발자들은 이러한 파일 시스템과 이에 대해 수행할 수 있는 작업에 대해 이야기했습니다.

Christoph Hellwig는 특정 파일 시스템이 얼마나 성숙한지, 즉 얼마나 신뢰할 수 있고 유지 관리되는지 개발자가 알기 어렵다고 말하면서 토론을 시작했습니다. 이는 종종 사용자와 대화를 통해서만 결정될 수 있습니다. 이러한 정보 격차는 나쁜 것일 수 있다고 그는 말했습니다. 사용자 공간(특히 데스크톱 환경 형태)은 유지 관리가 안 되고 안전하지 않으며 신뢰할 수 없는 파일 시스템이라도 자동으로 마운트하려는 강한 충동을 갖고 있습니다. 이 자동 마운트는 시스템을 보안 위협에 노출시키며 항상 나쁜 생각이지만 이는 현실입니다. 어쩌면 일부 파일 시스템이 이러한 방식으로 마운트하기에 적합하지 않다는 것을 커널이 사용자 공간에 표시하는 방법이 필요할 수도 있습니다.

Another problem, he said, is fuzz testing. He appreciates all of the work that is going into fuzz-testing of filesystems, but it is not helpful if it is being directed at filesystems that are not going to be fixed. That is a waste of resources; the fuzzer should, instead, be directed at filesystems that will be fixed in response to problem reports.

The broader question, he continued, is how the kernel can do better at getting rid of old and unmaintained code. The process for doing so is always "very ad hoc"; typically, some maintainer gets angry and sends a removal patch, which is sometimes accepted. What comes next is typically a round of "whining in the Linux press". Other projects have "reasonable deprecation schedules", where features are annotated as being set for removal in a couple of releases unless somebody who cares puts in the time to maintain them properly. The kernel, perhaps, could benefit from something similar.

또 다른 문제는 퍼지 테스트라고 그는 말했습니다. 그는 파일 시스템의 퍼지 테스트에 들어가는 모든 작업을 높이 평가하지만, 수정되지 않을 파일 시스템에 대한 작업이라면 도움이 되지 않습니다. 이는 자원 낭비입니다. 대신 퍼저는 문제 보고에 따라 수정될 파일 시스템으로 향해야 합니다.

그는 계속해서 더 넓은 질문은 오래되고 유지 관리되지 않는 코드를 제거하는 데 커널이 어떻게 더 잘할 수 있느냐는 것입니다. 이를 수행하는 프로세스는 항상 "매우 임시적"입니다. 일반적으로 일부 관리자는 화를 내며 제거 패치를 보냅니다. 이는 때때로 허용됩니다. 다음에 오는 것은 일반적으로 "Linux 언론의 징징거림"입니다. 다른 프로젝트에는 "합리적인 지원 중단 일정"이 있습니다. 여기서는 관심 있는 사람이 해당 기능을 적절하게 유지 관리하기 위해 시간을 투자하지 않는 한 몇 번의 릴리스에서 기능이 제거되도록 설정된다는 주석이 표시됩니다. 아마도 커널도 비슷한 이점을 얻을 수 있을 것입니다.

He closed by mentioning the prospect of the European Cyber Resilience Act, which could put vendors of products containing the kernel at risk.

Steve Rostedt said that, since most users run the kernels provided by distributors, the right thing to do might be to educate those distributors about which filesystems are trustworthy. Hellwig responded that, if the community needs to educate in that way, it is doing something wrong; there should be a better way to communicate this information. Ted Ts'o said that there are hundreds of distributions out there; it would be necessary for the kernel community to decide which ones it cares about. It could be said, he suggested, that distributors that do not contribute back to the kernel do not matter.

그는 커널이 포함된 제품 공급업체를 위험에 빠뜨릴 수 있는 유럽 사이버 탄력성법(European Cyber Resilience Act)의 전망을 언급하며 마무리했습니다.

Steve Rostedt는 대부분의 사용자가 배포자가 제공한 커널을 실행하기 때문에 배포자에게 어떤 파일 시스템이 신뢰할 수 있는지 교육하는 것이 올바른 일이라고 말했습니다. Hellwig는 커뮤니티가 그런 식으로 교육해야 한다면 뭔가 잘못하고 있는 것이라고 대답했습니다. 이 정보를 전달하는 더 좋은 방법이 있어야 합니다. Ted Ts'o는 수백 개의 배포판이 있다고 말했습니다. 커널 커뮤니티가 어느 것에 관심을 갖는지 결정하는 것이 필요할 것입니다. 그는 커널에 다시 기여하지 않는 배포자는 중요하지 않다고 말할 수 있다고 제안했습니다.

Linus Torvalds responded that he does not want anybody who would make that argument as a developer on his kernel — a position that has not changed in decades, he said. Any approach that says "users don't matter" is wrong, he said. Hellwig answered that users need to know when a filesystem is broken. Dave Chinner suggested that the right approach is to talk to the people who are setting the automounting policies — and the GNOME developers in particular.

Linus Torvalds는 자신의 커널 개발자로서 그런 주장을 하는 사람을 원하지 않는다고 답했습니다. 이 입장은 수십 년 동안 변하지 않았다고 그는 말했습니다. "사용자는 중요하지 않다"는 접근 방식은 모두 잘못된 것이라고 그는 말했습니다. Hellwig는 파일 시스템이 언제 손상되었는지 사용자가 알아야 한다고 대답했습니다. Dave Chinner는 자동 마운트 정책을 설정하는 사람들, 특히 GNOME 개발자들과 대화하는 것이 올바른 접근 방식이라고 제안했습니다.

Communications

Kees Cook said that the maturity information for filesystems could be stored as a field in the MAINTAINERS file; noises in the room made it clear that this idea was not universally loved. Hellwig said that file is not the place to send users; perhaps, instead, the automounter could be taught to only mount filesystems at a given maturity level or above. Chinner noted that the XFS developers have shipped a udev rule saying "don't automount XFS filesystems" for some time; perhaps that policy should be centralized. Torvalds said that everybody agrees that the current "automount everything" policy is wrong, but it should not be blocked in the kernel; this is a problem for the desktop environments.

연락

Kees Cook은 파일 시스템의 성숙도 정보가 MAINTAINERS 파일의 필드로 저장될 수 있다고 말했습니다. 방 안의 소음을 보면 이 아이디어가 보편적으로 사랑받지 못한다는 것이 분명해졌습니다. Hellwig는 파일이 사용자를 보내는 장소가 아니라고 말했습니다. 아마도 그 대신에 주어진 성숙도 수준 이상의 파일 시스템만 마운트하도록 자동 마운트를 학습할 수 있을 것입니다. Chinner는 XFS 개발자가 한동안 "XFS 파일 시스템을 자동 마운트하지 마십시오"라는 udev 규칙을 제공했다고 언급했습니다. 아마도 그 정책은 중앙 집중화되어야 할 것입니다. Torvalds는 현재의 "모든 항목 자동 마운트" 정책이 잘못되었다는 점에 모두가 동의하지만 커널에서 이를 차단해서는 안 된다고 말했습니다. 이는 데스크탑 환경의 문제입니다.

Ts'o said that the problem comes down to communications; end users do not read kernel configurations or documentation folders. There is also no agreement on the acceptable level of risk; kernel developers worry about unmaintained filesystems, but GNOME developers think that everything should be automounted. That was a rule made by a product manager, he said, "and you don't argue with product managers". That, in turn, makes his life miserable as he is inundated with syzbot reports for crashes resulting from mounting malicious filesystems. The kernel, he concluded, should suggest a default policy that makes sense, but user space will make the decision.

If we had some sort of filesystem maturity model, Hellwig said, distributors would be able to use it to set an automounting policy. Josef Bacik said that it was just necessary to figure out a way to communicate this information to user space. Once that is in place, it's just a matter of waiting a couple of years for the tooling to be updated. He added that the more interesting problem was that of deprecation; there is no policy for doing that now. He would like a way to tag kernel features as being deprecated and slated for future removal. Greg Kroah-Hartman pointed out that this idea has been tried in the past (it was abandoned in 2012); Bacik said that it was time to try again.

Ts'o는 문제가 의사소통에 있다고 말했습니다. 최종 사용자는 커널 구성이나 문서 폴더를 읽지 않습니다. 허용 가능한 위험 수준에 대한 합의도 없습니다. 커널 개발자는 관리되지 않는 파일 시스템에 대해 걱정하지만 GNOME 개발자는 모든 것이 자동 마운트되어야 한다고 생각합니다. 이는 제품 관리자가 정한 규칙이며 "제품 관리자와 논쟁을 벌여서는 안 됩니다"라고 그는 말했습니다. 결과적으로 그는 악성 파일 시스템 탑재로 인한 충돌에 대한 syzbot 보고서가 넘쳐나므로 그의 삶을 비참하게 만듭니다. 그는 커널이 합리적인 기본 정책을 제안해야 하지만 결정은 사용자 공간이 내릴 것이라고 결론지었습니다.

Hellwig는 우리가 일종의 파일 시스템 성숙도 모델을 갖고 있다면 배포자가 이를 사용하여 자동 마운트 정책을 설정할 수 있을 것이라고 말했습니다. Josef Bacik은 이 정보를 사용자 공간에 전달하는 방법을 찾는 것이 필요하다고 말했습니다. 일단 그것이 적용되면 도구가 업데이트될 때까지 몇 년만 기다리면 됩니다. 그는 더 흥미로운 문제는 지원 중단 문제라고 덧붙였습니다. 지금은 그렇게 하기 위한 정책이 없습니다. 그는 커널 기능에 더 이상 사용되지 않으며 향후 제거 예정인 태그를 지정하는 방법을 원합니다. Greg Kroah-Hartman은 이 아이디어가 과거에 시도된 적이 있다고 지적했습니다(2012년에 폐기됨). Bacik은 이제 다시 시도해 볼 시간이라고 말했습니다.

Kroah-Hartman said that the kernel drops drivers all the time, and that perhaps the process should be formalized. Torvalds answered that he will always require a reason to deprecate code; the lack of reasons has annoyed him in the filesystem discussion, he said. He raised the "sysv" filesystem (used on Unix version 7 on PDP-11 machines and on some early proprietary x86 Unix systems) as an example; it is simple and places no burden on developers, so there is no reason to deprecate it. Bacik responded that there is no way to make changes to sysv and be sure of not breaking it; when Torvalds asked if anybody had encountered a problem with sysv, the answer from the room was "we don't know". He said that proved the lack of a cost, so nobody cares if sysv remains in the tree.

There was a side discussion on the differences between filesystems and drivers that started when Torvalds pointed out that there are many drivers in the kernel that receive little or no testing. Hellwig asserted that there are many drivers that have not worked for years. Kroah-Hartman said that there is no difference between drivers and filesystems, but Arnd Bergmann said that, for drivers, it's relatively clear when the associated hardware no longer exists. That is not the case for filesystems. Thomas Gleixner added that, if a driver stops working, it simply stops; a filesystem, instead, can silently corrupt data. Chinner agreed, pointing out that one cannot fix filesystem corruption with a reboot.

Kroah-Hartman은 커널이 항상 드라이버를 삭제하므로 프로세스가 공식화되어야 한다고 말했습니다. Torvalds는 코드를 더 이상 사용하지 않으려면 항상 이유가 필요하다고 대답했습니다. 그는 파일 시스템 논의에서 이유가 부족해서 짜증이 났다고 말했습니다. 그는 "sysv" 파일 시스템(PDP-11 시스템의 Unix 버전 7 및 일부 초기 독점 x86 Unix 시스템에서 사용됨)을 예로 들었습니다. 간단하고 개발자에게 부담을 주지 않으므로 더 이상 사용하지 않을 이유가 없습니다. Bacik은 sysv를 변경하고 이를 위반하지 않도록 할 수 있는 방법이 없다고 응답했습니다. Torvalds가 sysv에 문제가 발생한 사람이 있는지 물었을 때 그 방의 대답은 "우리는 모릅니다"였습니다. 그는 이것이 비용이 부족하다는 것을 증명했기 때문에 sysv가 트리에 남아 있는지 아무도 신경 쓰지 않는다고 말했습니다.

Torvalds가 커널에 테스트를 거의 또는 전혀 받지 않는 드라이버가 많다는 점을 지적하면서 시작된 파일 시스템과 드라이버의 차이점에 대한 부차적 논의가 있었습니다. Hellwig는 수년간 일하지 않은 운전자가 많다고 주장했습니다. Kroah-Hartman은 드라이버와 파일 시스템 사이에 차이가 없다고 말했지만 Arnd Bergmann은 드라이버의 경우 관련 하드웨어가 더 이상 존재하지 않는 것이 상대적으로 분명하다고 말했습니다. 파일 시스템의 경우에는 그렇지 않습니다. Thomas Gleixner는 운전자가 작동을 멈 추면 단순히 멈춘다고 덧붙였습니다. 대신 파일 시스템은 자동으로 데이터를 손상시킬 수 있습니다. Chinner는 재부팅으로 파일 시스템 손상을 해결할 수 없다는 점을 지적하면서 이에 동의했습니다.

Rostedt claimed that it is possible to test all of the filesystems in the tree, since there is no special hardware needed, but the filesystem developers disagreed. Chinner said that, without a mkfs tool, filesystem testing cannot be done; additionally, there is a need for a filesystem checker and integration with the fstests suite. Ts'o singled out the ntfs filesystem; the tools are proprietary, but the kernel developers took the kernel code without insisting that the tools be open.

According to Chinner, the quality of the kernel's filesystem implementations has improved greatly over the last decade or so. There are something like 2,000 tests in the fstests suite; it even has 200 Btrfs-specific tests, where recently there were none. The reliability of the filesystems covered by fstests has gone way up; developers know that the filesystems are good and can tell users so. For the other filesystems, nobody really knows.

Rostedt는 특별한 하드웨어가 필요하지 않기 때문에 트리의 모든 파일 시스템을 테스트하는 것이 가능하다고 주장했지만 파일 시스템 개발자들은 이에 동의하지 않았습니다. Chinner는 mkfs 도구 없이는 파일 시스템 테스트를 수행할 수 없다고 말했습니다. 또한 파일 시스템 검사기와 fstests 제품군과의 통합이 필요합니다. Ts'o는 ntfs 파일 시스템을 선택했습니다. 도구는 독점적이지만 커널 개발자는 도구가 공개되어야 한다고 주장하지 않고 커널 코드를 가져갔습니다.

Chinner에 따르면 지난 10년 동안 커널의 파일 시스템 구현 품질이 크게 향상되었습니다. fstests 모음에는 2,000개 정도의 테스트가 있습니다. 심지어 200개의 Btrfs 관련 테스트도 있는데 최근에는 전혀 테스트가 없었습니다. fstest가 적용되는 파일 시스템의 신뢰성이 크게 향상되었습니다. 개발자는 파일 시스템이 훌륭하다는 것을 알고 사용자에게 그렇게 말할 수 있습니다. 다른 파일 시스템의 경우 실제로는 아무도 모릅니다.

Torvalds pointed out that one of those other filesystems, reiserfs, is in fact deprecated and on its way out. It is possible to remove code that causes problems, but only if there is a good reason to do so. Reiserfs may still have a few users, given that SUSE defaulted to it for years, but he is happy to remove it — as long as there are no complaints, which might cause him to reconsider. Brauner asked for a proper path toward that removal, so that maintainers can effect removals without getting yelled at.

There was some discussion of how to communicate filesystem maturity information to user space. Ideas included an ELF section in module binaries, a kernel-configuration option, an interface for automounters, tainting the kernel when a low-quality filesystem is mounted, or requiring a special "I know it's deprecated" mount option. Dave Airlie suggested working with the udisks developers; Chinner said that he had tried that and "hit a brick wall" before just adding a udev rule instead. A few developers expressed frustration with a perceived inability to get a response from user-space developers on topics like this.

Torvalds는 다른 파일 시스템 중 하나인 reiserfs가 실제로 더 이상 사용되지 않으며 곧 종료될 예정이라고 지적했습니다. 문제를 일으키는 코드를 제거하는 것은 가능하지만 그렇게 해야 하는 타당한 이유가 있는 경우에만 가능합니다. Reiserfs에는 SUSE가 수년 동안 기본적으로 사용했기 때문에 여전히 소수의 사용자가 있을 수 있지만 재고할 수 있는 불만 사항이 없는 한 기꺼이 이를 제거했습니다. Brauner는 유지관리자가 소리를 지르지 않고 제거를 수행할 수 있도록 제거를 위한 적절한 경로를 요청했습니다.

파일 시스템 성숙도 정보를 사용자 공간에 전달하는 방법에 대한 논의가 있었습니다. 아이디어에는 모듈 바이너리의 ELF 섹션, 커널 구성 옵션, 자동 마운트를 위한 인터페이스, 저품질 파일 시스템이 마운트될 때 커널을 오염시키거나 특별한 "더 이상 사용되지 않는다는 것을 알고 있습니다" 마운트 옵션이 필요하다는 것이 포함되었습니다. Dave Airlie는 udisks 개발자와 협력할 것을 제안했습니다. Chinner는 udev 규칙을 대신 추가하기 전에 이를 시도했지만 "벽에 부딪혔다"고 말했습니다. 몇몇 개발자는 이와 같은 주제에 대해 사용자 공간 개발자로부터 응답을 얻을 수 없다는 인식에 대해 불만을 표시했습니다.

"Print a warning"

Torvalds said that there is no way to communicate this information to existing user space, since that code is not prepared to receive that message. Instead, he said, just outputting a warning with printk() can be effective; users see the errors and complain to their distributors. Suitable warnings could be added to the more questionable filesystems.

That, Kroah-Hartman said, requires coming up with a list of good and bad filesystems. Hellwig said that there would need to be at least three levels: "no trust", "generally maintained but don't mount untrusted images", and "well maintained". Torvalds said that this information could be given to the kernel when a filesystem is registered, and a warning printed if an untrusted filesystem is mounted. "Enough arguing", he said, it was time to just write a patch and try it.

"경고 인쇄"

Torvalds는 해당 코드가 해당 메시지를 수신할 준비가 되어 있지 않기 때문에 이 정보를 기존 사용자 공간에 전달할 방법이 없다고 말했습니다. 대신에 printk()로 경고를 출력하는 것이 효과적일 수 있다고 그는 말했습니다. 사용자는 오류를 보고 배포자에게 불만을 제기합니다. 더 의심스러운 파일 시스템에 적절한 경고를 추가할 수 있습니다.

Kroah-Hartman은 이를 위해서는 좋은 파일 시스템과 나쁜 파일 시스템의 목록을 작성해야 한다고 말했습니다. Hellwig는 "신뢰 없음", "일반적으로 유지 관리되지만 신뢰할 수 없는 이미지를 탑재하지 않음", "잘 유지 관리"라는 세 가지 수준이 필요하다고 말했습니다. Torvalds는 파일 시스템이 등록될 때 이 정보가 커널에 제공될 수 있으며 신뢰할 수 없는 파일 시스템이 마운트되면 경고가 인쇄된다고 말했습니다. "논쟁은 이제 그만"이라고 그는 말했습니다. 이제는 패치를 작성하고 시도해 볼 시간이었습니다.

The arguing was not done quite yet, though; Gleixner complained about architectures that do not keep up with low-level core-kernel changes. That leaves him having to figure out how to fix "25 PowerPC subarchitectures", an impossible task for a developer without the hardware and who is not an expert in that architecture. Might there be a way to tell architecture maintainers that they need to move forward to current APIs or the support will be removed?

Hellwig concurred with the problem, saying that there is an implicit assumption in the community that this sort of API cleanup is a low-priority task; as a result it is easily blocked. There needs to be a way to force developers to move to newer APIs. Bergmann mentioned the desire to remove high memory, but 32-bit Arm still needs it, so it cannot be removed from anywhere, imposing significant costs on the kernel as a whole. Chinner complained that increasing amounts of work are being placed on maintainers to keep old code working; maintainers are at the limit of what they can do now, and this path is unsustainable, he said.

하지만 논쟁은 아직 끝나지 않았습니다. Gleixner는 낮은 수준의 코어 커널 변경 사항을 따라잡지 못하는 아키텍처에 대해 불평했습니다. 이로 인해 그는 "25개의 PowerPC 하위 아키텍처"를 수정하는 방법을 찾아야 합니다. 이는 하드웨어가 없고 해당 아키텍처의 전문가가 아닌 개발자에게는 불가능한 작업입니다. 아키텍처 유지관리자에게 현재 API로 전환해야 하며 그렇지 않으면 지원이 제거될 것이라고 알릴 수 있는 방법이 있을까요?

Hellwig는 이러한 종류의 API 정리가 우선순위가 낮은 작업이라는 암시적인 가정이 커뮤니티에 있다고 말하면서 문제에 동의했습니다. 결과적으로 쉽게 차단됩니다. 개발자가 최신 API로 이동하도록 강제할 수 있는 방법이 필요합니다. Bergmann은 고용량 메모리를 제거하고 싶다고 언급했지만 32비트 Arm에는 여전히 그것이 필요하기 때문에 어디에서도 제거할 수 없으며 커널 전체에 상당한 비용이 부과됩니다. Chinner는 오래된 코드를 계속 작동시키기 위해 유지관리자에게 점점 더 많은 작업이 할당되고 있다고 불평했습니다. 그는 관리자들이 지금 할 수 있는 일의 한계에 도달했으며 이 길은 지속 가능하지 않다고 말했습니다.

Torvalds repeated that it is possible to deprecate old code when there is a good reason to do so. When Gleixner again said that he cannot get architecture maintainers to move to new APIs, Torvalds added that kernel developers often add new APIs alongside old ones to avoid having to fix everything at the outset. Perhaps, he said, developers should try to avoid that approach and, instead, just fix everything right away. Gleixner said that, for some changes, every subarchitecture must be fixed manually, which is a huge job.

Christian Brauner said that he had similar problems with the adoption of the new mount API; it took years to convert a majority of the important filesystems, and he had to do a lot of the work himself. A lot of his patches were rejected, creating a frustrating situation. Hellwig added that, during this conversion, two more filesystems using the old API were merged. Torvalds suggested that, in many of these cases, adding a warning might be all that is needed to put pressure on maintainers to move forward.

The above discussion was supposed to fit into a 30-minute discussion slot; readers who have gotten this far will be unsurprised to learn that it ran significantly over. At this point, the developers were in need of a break, so this topic was put aside so that the rest of the agenda could be addressed.

Torvalds는 타당한 이유가 있을 경우 오래된 코드를 폐기하는 것이 가능하다고 반복해서 말했습니다. Gleixner가 아키텍처 관리자가 새로운 API로 이동하도록 할 수 없다고 다시 말했을 때 Torvalds는 커널 개발자가 처음에 모든 것을 수정할 필요가 없도록 이전 API와 함께 새로운 API를 추가하는 경우가 많다고 덧붙였습니다. 아마도 그는 개발자들이 그러한 접근 방식을 피하고 대신 모든 것을 즉시 해결해야 한다고 말했습니다. Gleixner는 일부 변경의 경우 모든 하위 아키텍처를 수동으로 수정해야 하는데 이는 엄청난 작업이라고 말했습니다.

Christian Brauner는 새로운 마운트 API를 채택할 때 비슷한 문제가 있다고 말했습니다. 중요한 파일 시스템의 대부분을 변환하는 데 수년이 걸렸으며 많은 작업을 직접 수행해야 했습니다. 그의 패치 중 다수가 거부되어 실망스러운 상황이 발생했습니다. Hellwig는 이 변환 중에 이전 API를 사용하는 두 개의 파일 시스템이 더 병합되었다고 덧붙였습니다. Torvalds는 이러한 많은 경우에 경고를 추가하는 것만으로도 관리자가 앞으로 나아가도록 압력을 가하는 데 필요한 전부일 수 있다고 제안했습니다.

위의 토론은 30분 토론 시간에 맞춰 진행되었습니다. 여기까지 온 독자들은 그것이 상당히 지나갔다는 사실을 알고도 놀라지 않을 것입니다. 이 시점에서 개발자들은 휴식이 필요했기 때문에 나머지 안건을 다룰 수 있도록 이 주제는 옆으로 미뤄 두었습니다.

Preventing atomic-context violations in Rust code with klint

klint를 사용하여 Rust 코드에서 원자 컨텍스트 위반 방지

By Jonathan Corbet
November 17, 2023

LPCOne of the core constraints when programming in the kernel is the need to avoid sleeping when running in atomic context. For the most part, the responsibility for adherence to this rule is placed on the developer's shoulders; Rust developers, though, want the compiler to ensure that code is safe whenever possible. At the 2023 Linux Plumbers Conference, Gary Guo presented (via a remote link) the klint tool, which can find and flag many atomic-context violations before they turn into user-affecting bugs.
Rust is built on the idea that safe Rust code, as verified by the compiler, cannot cause undefined behavior. This behavior comes in a lot of forms, including dereferencing dangling or null pointers, buffer overruns, data races, or violations of the aliasing rules; code that is "safe" will not do those things. The Rust-for-Linux project is trying to create an environment where much kernel functionality can be implemented with safe code. On the other hand, some surprising behavior, including memory leaks, deadlocks, panics, and aborts, is considered "safe". This behavior is defined, thus "safe" (though still, obviously, bad).

LPC커널에서 프로그래밍할 때 핵심 제약 조건 중 하나는 원자적 컨텍스트에서 실행할 때 절전 모드를 피해야 한다는 것입니다. 대부분의 경우 이 규칙을 준수할 책임은 개발자의 어깨에 있습니다. 그러나 Rust 개발자는 컴파일러가 가능할 때마다 코드가 안전한지 확인하기를 원합니다. 2023 Linux Plumbers Conference에서 Gary Guo는 (원격 링크를 통해) klint 도구를 발표했습니다. 이 도구는 사용자에게 영향을 미치는 버그로 변하기 전에 많은 원자 컨텍스트 위반을 찾아 플래그를 지정할 수 있습니다.

Rust는 컴파일러에 의해 검증된 안전한 Rust 코드가 정의되지 않은 동작을 유발할 수 없다는 아이디어를 바탕으로 구축되었습니다. 이 동작은 댕글링 또는 널 포인터 역참조, 버퍼 오버런, 데이터 경합, 앨리어싱 규칙 위반 등 다양한 형태로 나타납니다. "안전한" 코드는 그런 일을 하지 않습니다. Rust-for-Linux 프로젝트는 안전한 코드로 많은 커널 기능을 구현할 수 있는 환경을 만들려고 노력하고 있습니다. 반면에 메모리 누수, 교착 상태, 패닉, 중단 등 일부 놀라운 동작은 "안전한" 것으로 간주됩니다. 이 동작은 정의되어 있으므로 "안전"합니다(물론 여전히 나쁘기는 하지만).

Atomic context in the kernel raises some interesting safety questions. If code, for example, executes a sequence like:

커널의 원자적 컨텍스트는 몇 가지 흥미로운 안전 문제를 제기합니다. 예를 들어 코드가 다음과 같은 시퀀스를 실행하는 경우:

    spin_lock(&lock);
    /* ... */
    mutex_lock(&mutex);   /* can schedule */
    /* ... */
    spin_unlock(&lock);



the result could be a deadlock if another thread attempts to take the same spinlock on the same CPU. That is "safe" (but "bad") code. But what about code like the following?

다른 스레드가 동일한 CPU에서 동일한 스핀록을 사용하려고 하면 결과적으로 교착 상태가 발생할 수 있습니다. 이는 "안전한"(그러나 "나쁜") 코드입니다. 하지만 다음과 같은 코드는 어떻습니까?

    rcu_read_lock();
    schedule();
    rcu_read_unlock();


In this case, the safety of this code, even in the Rust sense, is not so clear. RCU assumes that there will be no context switches in code that is running within an RCU critical section; calling into the scheduler breaks that assumption. In this case, the atomic-context violation can indeed be a safety issue, creating use-after-free bugs, data races and worse. This is "fine" for C code, where the distinction between "safety" and "correctness" is not so well defined. Rust developers, though, try to live by different rules; consequently, they cannot design a safe API that allows sleeping in atomic context.

이 경우, Rust의 관점에서도 이 코드의 안전성은 그다지 명확하지 않습니다. RCU는 RCU 중요 섹션 내에서 실행되는 코드에 컨텍스트 전환이 없다고 가정합니다. 스케줄러를 호출하면 해당 가정이 깨집니다. 이 경우 원자 컨텍스트 위반은 실제로 안전 문제가 될 수 있으며, use-after-free 버그, 데이터 경쟁 등을 야기합니다. 이는 "안전성"과 "정확성"의 구분이 잘 정의되지 않은 C 코드의 경우 "괜찮습니다". 하지만 Rust 개발자들은 다른 규칙을 따르려고 노력합니다. 결과적으로 그들은 원자적 맥락에서 잠자는 것을 허용하는 안전한 API를 설계할 수 없습니다.

Avoiding that situation is not easy, though. One possible solution would be to make all blocking operations unsafe. That, Guo acknowledged, is likely to be widely seen as a bad idea. Another approach is token types, which are commonly used in Rust to represent capabilities; functions that might sleep can require a token asserting the right to do so. That leads to complex and unwieldy APIs, though. It is possible to do runtime checking, using the preemption count maintained in some kernel configurations now. That adds runtime overhead, though, and the preempt count is not available in all kernel configurations.

The last option would be to simply ignore the problem and trust developers to get things right, perhaps using the kernel's lockdep locking checker to find some problems on development systems. That approach, though, is unsound and not the Rust way of doing things.

1. 한 가지 가능한 해결책은 모든 차단 작업을 안전하지 않게 만드는 것입니다.

하지만 그 상황을 피하는 것은 쉽지 않습니다. 한 가지 가능한 해결책은 모든 차단 작업을 안전하지 않게 만드는 것입니다. Guo는 그것이 나쁜 생각으로 널리 인식될 가능성이 높다고 인정했습니다. 또 다른 접근 방식은 토큰 유형으로, 이는 Rust에서 기능을 나타내기 위해 일반적으로 사용됩니다. 휴면 상태일 수 있는 함수에는 그렇게 할 권리를 주장하는 토큰이 필요할 수 있습니다. 하지만 이는 복잡하고 다루기 힘든 API로 이어집니다. 이제 일부 커널 구성에서 유지되는 선점 횟수를 사용하여 런타임 검사를 수행할 수 있습니다. 하지만 이로 인해 런타임 오버헤드가 추가되고 모든 커널 구성에서 선점 개수를 사용할 수 없습니다.

마지막 옵션은 단순히 문제를 무시하고 개발자가 문제를 올바르게 해결할 것이라고 신뢰하는 것입니다. 아마도 커널의 lockdep 잠금 검사기를 사용하여 개발 시스템의 일부 문제를 찾을 수 있습니다. 하지만 그러한 접근 방식은 건전하지 않으며 Rust의 작업 방식도 아닙니다.

The root of the problem, Guo said, is the need to optimize three objectives (soundness, an ergonomic API, and minimal run-time overhead) in a "choose any two" situation. Token types optimize soundness and overhead at the expense of an ergonomic API, for example, while run-time checking improves the API but sacrifices the goal of avoiding run-time overhead. Solutions that optimize all three quantities are hard to come by; the kernel's needs simply do not fit nicely into the Rust safety model.

The answer, Guo said, is to adapt the Rust compiler to this use case; that has been done in the form of a tool called "klint", which will verify at compile time the absence of atomic-context violations to the maximum extent possible. For the cases that cannot be verified, an escape hatch, in the form of a run-time check or use of unsafe, will be provided to developers so that their code can be built.

문제의 근본 원인은 "두 가지를 선택하는" 상황에서 세 가지 목표(건전성, 인체공학적 API, 최소 런타임 오버헤드)를 최적화해야 한다는 것입니다. 예를 들어 토큰 유형은 인체공학적인 API를 희생하여 건전성과 오버헤드를 최적화하는 반면, 런타임 확인은 API를 향상시키지만 런타임 오버헤드를 방지한다는 목표를 희생합니다. 세 가지 수량을 모두 최적화하는 솔루션은 찾기 어렵습니다. 커널의 요구사항은 Rust 안전 모델에 잘 들어맞지 않습니다.

Guo는 대답은 Rust 컴파일러를 이 사용 사례에 적용하는 것이라고 말했습니다. 이는 "klint"라는 도구의 형태로 수행되었으며, 컴파일 타임에 가능한 한 원자 컨텍스트 위반이 없는지 확인합니다. 검증할 수 없는 경우에는 런타임 검사 또는 unsafe 사용 형태의 탈출구를 개발자에게 제공하여 코드를 빌드할 수 있도록 합니다.

This tool was built with a number of goals in mind. It should be easy to explain and understand, of course, and provide useful diagnostics. There needs to be an escape hatch so that it does not get in the way of getting real work done. Its defaults, he said, should be sane, and there should be little need for additional annotations in the kernel. Finally, the tool needs to be fast so that it can be run every time the code is built.

Klint gives every function two properties, the first of which is an "adjustment" describing the change it makes (if any) to the preemption count (which, when non-zero, indicates that the current thread cannot be preempted). The second is the expected value of the preemption count when the call is made; this value can be a range. The klint tool tracks the possible state of the preemption count at each location, looking for situations where a function's expected preemption count is violated.

이 도구는 여러 가지 목표를 염두에 두고 제작되었습니다. 물론 설명하고 이해하기 쉬워야 하며 유용한 진단을 제공해야 합니다. 실제 작업을 수행하는 데 방해가 되지 않도록 탈출구가 있어야 합니다. 그는 기본값이 정상이어야 하며 커널에 추가 주석이 거의 필요하지 않아야 한다고 말했습니다. 마지막으로 도구는 코드가 빌드될 때마다 실행될 수 있도록 빨라야 합니다.

Klint는 모든 함수에 두 가지 속성을 제공합니다. 그 중 첫 번째는 선점 횟수(0이 아닌 경우 현재 스레드를 선점할 수 없음을 나타냄)에 대한 변경 사항을 설명하는 "조정"입니다. 두 번째는 호출이 이루어질 때 예상되는 선점 횟수입니다. 이 값은 범위일 수 있습니다. klint 도구는 각 위치에서 선점 횟수의 가능한 상태를 추적하여 함수의 예상 선점 횟수가 위반되는 상황을 찾습니다.

Thus, for example, rcu_read_lock() increments the preemption count by one, and can be called with any value. In Rust code, that would be annotated as:

따라서 예를 들어 rcu_read_lock()은 선점 횟수를 1씩 증가시키며 어떤 값으로든 호출할 수 있습니다. Rust 코드에서는 다음과 같이 주석이 추가됩니다.

    #[klint::preempt_count(adjust = 1, expect = 0.., unchecked)]
    pub fn rcu_read_lock() -> RcuReadGuard { /* ... */ }

As klint passes over the code, it tracks the possible values of the preemption count and flags an error if an expected condition is not met. For example, schedule() would be annotated as expecting the preemption count to be zero; if klint sees a call to schedule() after a call to rcu_read_lock() it will complain — unless, of course, there is a call to rcu_read_unlock() that happens first.

The compiler's type inference makes explicit annotation unnecessary much of the time. There are exceptions, naturally, including at the foreign-function interface boundary, with recursive functions, and with indirect function calls. Other limitations exist as well; there is, for example, no way to annotate functions like spin_trylock(), where the effect on the preemption count is not known in advance. Perhaps, in the future, that shortcoming could be addressed by adding some sort of match expression to the annotations, he said.

klint는 코드를 통과하면서 선점 횟수의 가능한 값을 추적하고 예상 조건이 충족되지 않으면 오류를 표시합니다. 예를 들어, Schedule()은 선점 횟수가 0이 될 것으로 예상하는 것으로 주석이 추가됩니다. klint가 rcu_read_lock() 호출 후 Schedule() 호출을 발견하면 불평을 할 것입니다. 물론 rcu_read_unlock() 호출이 먼저 발생하지 않는 한 말이죠.

컴파일러의 유형 추론은 대부분의 경우 명시적인 주석을 불필요하게 만듭니다. 당연히 외부 함수 인터페이스 경계, 재귀 함수 및 간접 함수 호출을 포함하여 예외가 있습니다. 다른 제한사항도 존재합니다. 예를 들어 선점 횟수에 대한 영향을 미리 알 수 없는 spin_trylock()과 같은 함수에 주석을 달 수 있는 방법이 없습니다. 아마도 미래에는 주석에 일종의 일치 표현을 추가하여 이러한 단점을 해결할 수 있을 것이라고 그는 말했습니다.

Data-dependent acquisition, where, for example, a function only takes a lock if a boolean parameter instructs it to, is also not handled by klint at this point. Finally, there are cases where the compiler injects code into a function that confuses klint, leading to incorrect reports. This problem is currently blocking the wider use of klint, and is thus urgent to solve. Meanwhile, he said, klint imposes a negligible compile-time overhead.

Guo concluded by saying that klint is available on GitHub for folks who want to play with it. More information can also be found in the slides from the talk.

[Thanks to the Linux Foundation, LWN's travel sponsor, for supporting our travel to this event.]

예를 들어 부울 매개변수가 지시하는 경우에만 함수가 잠금을 사용하는 데이터 종속 획득도 이 시점에서는 klint에서 처리되지 않습니다. 마지막으로, 컴파일러가 klint를 혼동시키는 코드를 함수에 삽입하여 잘못된 보고를 초래하는 경우가 있습니다. 이 문제는 현재 klint의 광범위한 사용을 가로막고 있으므로 해결이 시급합니다. 한편, 그는 klint가 컴파일 시간 오버헤드를 무시해도 된다고 말했습니다.

Guo는 Klint를 사용하고 싶은 사람들을 위해 GitHub에서 klint를 사용할 수 있다고 말하며 결론을 내렸습니다. 자세한 내용은 강연 슬라이드에서도 확인할 수 있습니다.

[이 행사에 대한 여행을 지원해준 LWN의 여행 후원자인 Linux Foundation에 감사드립니다.]


The real realtime preemption end game

실시간 실시간 선점 엔드게임

By Jonathan Corbet
November 16, 2023

The addition of realtime support to Linux is a long story; it first shows up in LWN in 2004. For much of that time, it has seemed like only a little more work was needed to get across the finish line; thus we ran headlines like the realtime preemption endgame — in 2009. At the 2023 Linux Plumbers Conference, Thomas Gleixner informed the group that, now, the end truly is near. There is really only one big problem left to be solved before all of that work can land in the mainline.

The point of realtime preemption is to ensure that the highest-priority process will always be able to run with a minimum (and predictable) delay. To that end, it makes the kernel preemptible in as many situations as possible, with the exceptions being tightly limited in scope. The basic mechanics of how that works have been established for a long time, but there have been a lot of details to resolve along the way. The realtime preemption work has resulted in the rewriting of much of the core kernel over the years, with benefits that extend far beyond the realtime use case.

Linux에 실시간 지원을 추가하는 것은 긴 이야기입니다. 2004년 LWN에 처음 등장했습니다. 그 기간 동안 결승선을 통과하는 데 약간의 작업만 더 필요한 것처럼 보였습니다. 따라서 우리는 2009년에 실시간 선점 최종 게임과 같은 헤드라인을 장식했습니다. 2023 Linux Plumbers Conference에서 Thomas Gleixner는 그룹에게 이제 정말로 끝이 가까워졌다고 알렸습니다. 모든 작업이 메인라인에 착수되기 전에 해결해야 할 큰 문제는 실제로 단 하나뿐입니다.

## "realtime preemption"

## 실시간 선점의 요점은 우선순위가 가장 높은 프로세스가 항상 최소한의(그리고 예측 가능한) 지연으로 실행될 수 있도록 보장하는 것입니다. 이를 위해 범위가 엄격하게 제한된 예외를 제외하고 가능한 한 많은 상황에서 커널을 선점 가능하게 만듭니다. 

실시간 선점의 요점은 우선순위가 가장 높은 프로세스가 항상 최소한의(그리고 예측 가능한) 지연으로 실행될 수 있도록 보장하는 것입니다. 이를 위해 범위가 엄격하게 제한된 예외를 제외하고 가능한 한 많은 상황에서 커널을 선점 가능하게 만듭니다. 작동 방식에 대한 기본 메커니즘은 오랫동안 확립되었지만 그 과정에서 해결해야 할 세부 사항이 많이 있었습니다. 실시간 선점 작업으로 인해 수년에 걸쳐 핵심 커널의 대부분이 다시 작성되었으며 실시간 사용 사례를 훨씬 뛰어넘는 이점이 있습니다.

Gleixner started by noting that, while the realtime preemption project has been underway for nearly 20 years, it is actually closer to 25 years for him — he started working on realtime support for Linux in 1999. Once it's done, he said, there will be "a big party". Is that point at hand? The answer, he said, is "yes — kind of". There is one last holdout to be dealt with: printk().

Whenever code in the kernel needs to send something to the system consoles and logs, it calls printk() or one of the numerous functions built on top of it. One might not think that printing a message would be a challenging task, but it is. A call to printk() can come from any context, including in non-maskable-interrupt handlers or other printk() calls. The information being printed may be crucial, especially in the case of a system crash, so printk() calls have to work regardless of the context. As a result, there are a lot of concurrency and locking issues, and lots of driver-related complications.

Gleixner는 실시간 선점 프로젝트가 거의 20년 동안 진행되어 왔지만 실제로는 그에게 25년에 더 가깝다는 점을 언급하면서 시작했습니다. 그는 1999년에 Linux에 대한 실시간 지원 작업을 시작했습니다. 일단 완료되면 그는 다음과 같이 말했습니다. "큰 파티". 그 시점이 다가오고 있나요? 대답은 "그렇습니다. 일종의"라고 그는 말했습니다. 처리해야 할 마지막 홀드아웃이 하나 있습니다: printk().

printk 에 대한 고찰

## 커널의 코드가 시스템 콘솔과 로그에 무언가를 보내야 할 때마다 printk() 또는 그 위에 구축된 수많은 함수 중 하나를 호출합니다. 메시지를 인쇄하는 것이 어려운 작업이라고 생각하지 않을 수도 있지만 실제로는 그렇습니다. printk()에 대한 호출은 마스크 불가능한 인터럽트 핸들러 또는 기타 printk() 호출을 포함하여 모든 컨텍스트에서 발생할 수 있습니다. 인쇄되는 정보는 특히 시스템 충돌의 경우 중요할 수 있으므로 printk() 호출은 상황에 관계없이 작동해야 합니다. 결과적으로 동시성 및 잠금 문제가 많이 발생하고 드라이버 관련 합병증도 많이 발생합니다.

printk(), Gleixner said, is fully synchronous in current kernels; a call will not return until the message has been sent to all of the configured destinations. That is "stupid"; much of what is printed is simply noise, especially during the boot process, and there is no point to waiting for it all to go out. Beyond being pointless, that waiting introduces latency, which runs counter to the goals of the realtime work, so the realtime developers have long since moved printk() output into separate threads, making it asynchronous. That code is a bunch of hacks rather than a real solution, though. A better job must be done to make this work useful for the rest of the kernel.

The printk() problem has been worked on seriously since 2018, resulting in about 300 patches that have either gone upstream or are waiting in linux-next; this work has been covered here at times. There are, he said, three final patch sets currently in the works to finish the job. A few tricky details are still being worked on. One of those is the handover mechanism; if the kernel has an emergency message to put out (it's crashing, for example), it may need to grab control of a console that is currently printing a lower-priority message. Doing that safely from any context is not an easy thing to do.

## Gleixner에 따르면 printk()는 현재 커널에서 완전히 동기화됩니다. 메시지가 구성된 모든 대상으로 전송될 때까지 통화는 반환되지 않습니다. 그건 "멍청한" 일이다. 인쇄되는 내용의 대부분은 특히 부팅 프로세스 중에 소음일 뿐이므로 소음이 모두 사라질 때까지 기다릴 필요가 없습니다. 무의미한 것 외에도 대기 시간이 발생하여 실시간 작업의 목표에 어긋나므로 실시간 개발자는 오랫동안 printk() 출력을 별도의 스레드로 이동하여 비동기식으로 만들었습니다.


하지만 해당 코드는 실제 솔루션이라기보다는 해킹 덩어리입니다. 이 작업을 커널의 나머지 부분에 유용하게 만들려면 더 나은 작업이 수행되어야 합니다.

printk() 문제는 2018년부터 심각하게 연구되어 약 300개의 패치가 업스트림으로 진행되었거나 linux-next에서 대기 중입니다. 이 작업은 때때로 여기에서 다루어졌습니다. 그는 현재 작업을 완료하기 위해 3개의 최종 패치 세트가 작업 중이라고 말했습니다. 몇 가지 까다로운 세부 사항이 아직 작업 중입니다. 그 중 하나는 핸드오버 메커니즘입니다. 커널에 내보낼 긴급 메시지가 있는 경우(예: 충돌) 현재 낮은 우선순위 메시지를 인쇄하고 있는 콘솔을 제어해야 할 수도 있습니다. 어떤 상황에서든 이를 안전하게 수행하는 것은 쉬운 일이 아닙니다.

Another ongoing task is marking console drivers that are not safe to use in some contexts; if, for example, outputting a message during a non-maskable interrupt requires doing video-mode setting, it's just not going to work.

Gleixner finished the prepared part of his talk by saying that, even though it's getting close, nobody should ask him when the work will be done. printk() is unpredictable, and he is no longer willing to even try. Even so, he expressed hopes that the rest of the realtime preemption code would be in mainline before the 20th anniversary comes late in 2024.

An audience member asked whether there had been any interesting changes in the printk() code over the last year; Gleixner answered that there have been no fundamental conceptual changes. John Ogness, who has done much of the printk() work, said that the handover code has been reduced somewhat, but that some work remains; there are 76 console drivers in the kernel that need to be fixed, and it may take a while until they are all done. The handover code has been changed to allow drivers to be updated one at a time rather than requiring that this work all be done at once. (See this article for more discussion on the recent printk() work).

또 다른 진행 중인 작업은 일부 상황에서 사용하기에 안전하지 않은 콘솔 드라이버를 표시하는 것입니다. 예를 들어, 마스크할 수 없는 인터럽트 중에 메시지를 출력하려면 비디오 모드 설정이 필요한 경우 작동하지 않을 것입니다.

Gleixner는 작업이 가까워지더라도 작업이 언제 완료될지 아무도 그에게 물어서는 안 된다고 말하며 준비된 연설 부분을 마쳤습니다. printk()는 예측할 수 없으며 더 이상 시도할 의지도 없습니다. 그럼에도 불구하고 그는 20주년이 늦어지는 2024년 이전에 나머지 실시간 선점 코드가 메인라인에 나올 것이라는 희망을 피력했습니다.

한 청중이 작년에 printk() 코드에 흥미로운 변화가 있었는지 물었습니다. Gleixner는 근본적인 개념 변화가 없다고 대답했습니다. printk() 작업의 대부분을 수행한 John Ogness는 핸드오버 코드가 다소 줄어들었지만 일부 작업이 남아 있다고 말했습니다. 커널에는 수정해야 할 76개의 콘솔 드라이버가 있으며 모두 완료될 때까지 시간이 걸릴 수 있습니다. 이 작업을 모두 한 번에 수행하도록 요구하는 대신 드라이버를 한 번에 하나씩 업데이트할 수 있도록 핸드오버 코드가 변경되었습니다. (최근 printk() 작업에 대한 자세한 내용은 이 기사를 참조하세요.)

Masami Hiramatsu asked which kernel messages need to be printed synchronously; Gleixner answered that almost everything should be made asynchronous. Beyond reducing latency associated with printk() calls, asynchronous output allows the creation of a separate kernel thread for each console, letting the faster consoles go at full speed rather than waiting for the slowest one. He also said that the code has been changed to ensure that important messages are fully copied into the message buffer before the first line is output, just in case a faulty console driver brings the whole system down in flames. Further safety is obtained by writing to the known-safe consoles first. If, for example, there is a persistent-memory store available, messages are put there before being sent to physical devices, once again preserving the output even if a faulty driver kills the system.

As the session closed, Clark Williams asked whether, once the printk() patches go upstream, Gleixner would try to push the rest of the realtime code (which wasn't discussed in this session) in the same merge window. The answer was a qualified "yes"; he might try if all of the code is staged in linux-next and seems ready to go.

[Thanks to the Linux Foundation, LWN's travel sponsor, for supporting our travel to this event.]

Masami Hiramatsu는 어떤 커널 메시지를 동기적으로 인쇄해야 하는지 물었습니다. Gleixner는 거의 모든 것이 비동기식으로 이루어져야 한다고 대답했습니다. printk() 호출과 관련된 대기 시간을 줄이는 것 외에도 비동기식 출력을 사용하면 각 콘솔에 대해 별도의 커널 스레드를 생성할 수 있으므로 가장 느린 콘솔을 기다리지 않고 더 빠른 콘솔이 최대 속도로 작동할 수 있습니다. 그는 또한 잘못된 콘솔 드라이버로 인해 전체 시스템이 불타오르는 경우를 대비해 첫 번째 줄이 출력되기 전에 중요한 메시지가 메시지 버퍼에 완전히 복사되도록 코드가 변경되었다고 말했습니다. 안전한 것으로 알려진 콘솔에 먼저 기록하면 더욱 안전해집니다. 예를 들어, 사용 가능한 영구 메모리 저장소가 있는 경우 물리적 장치로 전송되기 전에 메시지가 여기에 저장되므로 결함이 있는 드라이버로 인해 시스템이 종료되더라도 출력이 다시 한 번 보존됩니다.

세션이 종료되면서 Clark Williams는 printk() 패치가 업스트림으로 이동하면 Gleixner가 나머지 실시간 코드(이 세션에서는 논의되지 않음)를 동일한 병합 창에 푸시하려고 시도할지 물었습니다. 대답은 자격을 갖춘 "예"였습니다. 그는 모든 코드가 linux-next에 준비되어 있고 사용할 준비가 되어 있는지 시도해 볼 수도 있습니다.

[이 행사에 대한 여행을 지원해준 LWN의 여행 후원자인 Linux Foundation에 감사드립니다.]

----

printk 에 대한 생각

커널의 코드가 시스템 콘솔과 로그에 무언가를 보내야 할 때마다 printk() 또는 그 위에 구축된 수많은 함수 중 하나를 호출합니다.

1. printk()에 대한 호출은 마스크 불가능한 인터럽트 핸들러 또는 기타 printk() 호출을 포함하여 모든 컨텍스트에서 발생할 수 있습니다.
2. 인쇄되는 정보는 특히 시스템 충돌의 경우 중요할 수 있으므로 printk() 호출은 상황에 관계없이 작동해야 합니다.

결과적으로 동시성 및 잠금 문제가 많이 발생하고 드라이버 관련 합병증도 많이 발생합니다.

printk()는 현재 커널에서 완전히 동기화 - 메시지가 구성된 모든 대상으로 전송될 때까지 통화는 반환되지 않습니다.

1. 인쇄되는 내용의 대부분은 특히 부팅 프로세스 중에 소음일 뿐이므로 소음이 모두 사라질 때까지 기다릴 필요가 없습니다.
2. 무의미한 것 외에도 대기 시간이 발생하여 실시간 작업의 목표에 어긋나므로 실시간 개발자는 오랫동안 printk() 출력을 별도의 스레드로 이동하여 비동기식으로 만들었습니다.

3. 커널에 내보낼 긴급 메시지가 있는 경우(예: 충돌) 현재 낮은 우선순위 메시지를 인쇄하고 있는 콘솔을 제어해야 할 수도 있습니다.
4. 또 다른 진행 중인 작업은 일부 상황에서 사용하기에 안전하지 않은 콘솔 드라이버를 표시하는 것입니다. 예를 들어, 마스크할 수 없는 인터럽트 중에 메시지를 출력하려면 비디오 모드 설정이 필요한 경우 작동하지 않을 것입니다.

- printk() 호출과 관련된 대기 시간을 줄이는 것 외에도 비동기식 출력을 사용하면 각 콘솔에 대해 별도의 커널 스레드를 생성할 수 있으므로 가장 느린 콘솔을 기다리지 않고 더 빠른 콘솔이 최대 속도로 작동할 수 있습니다.
- 그는 또한 잘못된 콘솔 드라이버로 인해 전체 시스템이 불타오르는 경우를 대비해 첫 번째 줄이 출력되기 전에 중요한 메시지가 메시지 버퍼에 완전히 복사되도록 코드가 변경되었다고 말했습니다.
- 안전한 것으로 알려진 콘솔에 먼저 기록하면 더욱 안전해집니다.


Masami Hiramatsu는 어떤 커널 메시지를 동기적으로 인쇄해야 하는지 물었습니다. Gleixner는 거의 모든 것이 비동기식으로 이루어져야 한다고 대답했습니다. printk() 호출과 관련된 대기 시간을 줄이는 것 외에도 비동기식 출력을 사용하면 각 콘솔에 대해 별도의 커널 스레드를 생성할 수 있으므로 가장 느린 콘솔을 기다리지 않고 더 빠른 콘솔이 최대 속도로 작동할 수 있습니다. 그는 또한 잘못된 콘솔 드라이버로 인해 전체 시스템이 불타오르는 경우를 대비해 첫 번째 줄이 출력되기 전에 중요한 메시지가 메시지 버퍼에 완전히 복사되도록 코드가 변경되었다고 말했습니다. 안전한 것으로 알려진 콘솔에 먼저 기록하면 더욱 안전해집니다. 예를 들어, 사용 가능한 영구 메모리 저장소가 있는 경우 물리적 장치로 전송되기 전에 메시지가 여기에 저장되므로 결함이 있는 드라이버로 인해 시스템이 종료되더라도 출력이 다시 한 번 보존됩니다.

## 리눅스 커널 리뷰 #5 printk

커널에서 시스템 콘솔과 로그에 무엇인가를 출력해야 할 때, printk() 함수를 사용합니다. 이 함수를 구현하는 것이 쉬운 듯 하여도 여러가지 고려해야 할 사항들이 있습니다.

1. printk()에 대한 호출은 CPU가 인터럽트를 무시할 수 없는 인터럽트 핸들러(일반적으로 시스템에서 문제가 발생하였을 때의 경우)에서 발생할 수 있음
2. 모든 컨텍스트에서 발생할 수 있음
3. 출력되는 정보 중 시스템 충돌의 경우 중요할 수 있으므로 printk() 호출은 어떤 상황에서도 작동해야 합니다.

결국 동시성 및 잠금에 대한 구현이 어렵고, 그것 이외에  드라이버와 관련된 부분에서 많은 문제가 발생합니다.

현재의 printk()는 현재 커널에서 완전히 동기화하는 방식으로 메시지가 구성된 모든 대상으로 전송될 때까지 리턴되지 않습니다. 이런 구현이 위에서 설명한 긴급한 메시지 출력에 의한 것이기 때문입니다. 하지만, 이런 동기적인 구현에는 단점이 존재하는데,

1. 부팅 프로세스 중에 출력되는 내용은 많은 부분 무의미
2. 출력을 위한 대기 시간

특히 출력을 위한 대기 시간때문에, Realtime OS 개발자들은 출력을 별도의 스레드로 이동하여 비동기식으로 동작하도록 만들어서 사용하기도 합니다.

이렇기 때문에, 현재 이부분에 대한 개선작업이 진행 중이라고 합니다. 그 개선 작업 중에는

1. 핸드오버 매커니즘: 커널에서 출력할 긴급 메시지가 있는 경우 낮은 우선 순위 메시지를 출력하고 있는 콘솔을 제어하는 것 등을 할 수 있는 매커니즘
2. 










