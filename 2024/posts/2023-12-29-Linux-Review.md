---
layout: 'index'
view: 'post'
permalink: '/posts/2023/12/29/Linux-Review.html'
opengraph:
    site:
        name: 'ProjectedBy/Sub'
        url: '/'
date: '2023/12/29 11:36:00'
title: 'Linux Review'
description: ""
category: 'LinuxReview'
tags: ['Linux', 'Review']
---

A discussion on kernel-maintainer pain points

커널 유지 관리 문제에 대한 토론

By Jonathan Corbet
November 27, 2023


Maintainers SummitA regular feature of the Kernel Maintainers Summit is a session where Linus Torvalds discusses the problems that he has been encountering. In recent years, though, there have been relatively few of those problems, so this year he turned things around a bit by asking the community what problems it was seeing instead. He then addressed them at the Summit in a session covering aspects of the development community, including feedback to maintainers, diversity (or the lack thereof), and more.

The first question he mentioned was a suggestion that, because he does test builds after acting on pull requests, he is showing a distrust of his maintainers. These builds slowed the process down during the 6.7 merge window, when Torvalds was traveling and doing the builds on a laptop. He answered that he normally does a build after each pull just as a part of his normal workflow. It is not a matter of not trusting maintainers — though he does also like to verify that everything is OK. He also does builds to confirm any conflict resolutions he may have had to do.

메인테이너 서밋(Maintainers Summit) 커널 메인테이너 서밋의 정규 기능은 Linus Torvalds가 자신이 직면한 문제를 논의하는 세션입니다. 하지만 최근 몇 년 동안에는 이러한 문제가 상대적으로 적었기 때문에 올해 그는 커뮤니티에 어떤 문제가 있는지 물어봄으로써 상황을 조금 전환했습니다. 그런 다음 그는 유지 관리 담당자에 대한 피드백, 다양성(또는 다양성의 부족) 등을 포함하여 개발 커뮤니티의 측면을 다루는 세션에서 Summit에서 이에 대해 언급했습니다.

1. 첫 번째 질문은 풀 리퀘스트를 수행한 후 테스트 빌드를 하기 때문에 관리자에 대한 불신을 보이고 있다는 제안

그가 언급한 첫 번째 질문은 풀 리퀘스트를 수행한 후 테스트 빌드를 하기 때문에 관리자에 대한 불신을 보이고 있다는 제안이었습니다. 이러한 빌드는 Torvalds가 노트북으로 이동하여 빌드를 수행하는 6.7 병합 기간 동안 프로세스 속도를 늦췄습니다. 그는 일반적으로 일반적인 작업 흐름의 일부로 각 풀 후에 빌드를 수행한다고 대답했습니다. 유지관리자를 신뢰하지 않는다는 것은 문제가 아닙니다. 하지만 그는 또한 모든 것이 괜찮은지 확인하는 것을 좋아합니다. 그는 또한 자신이 수행해야 했던 모든 충돌 해결 방법을 확인하기 위한 빌드도 수행합니다.

Another question had to do with Torvalds's tendency to give mostly negative feedback. Maintainers quickly learn that, if Torvalds responds to a pull-request email, it is usually bad news. He acknowledged that he tends to operate that way, and said that he is not proud of it. In general, he tries to avoid answering email if he doesn't have to. So if a pull happens without problems, he is happy and wants "to say 'I love you'", but he doesn't act on that. As a result, most of his emails are about problems. He did not say that he would try to change that pattern.

The session was interrupted by a break at this point; on return, Torvalds said that he is quite happy in general. He was in Hawaii for the first week of the merge window, which might ordinarily make things harder. But he got a lot of pull requests early and, despite the 6.7 merge window bringing in the most commits of any merge window in the project's history, it was "pain-free". There was not a single case of a change breaking his machine, which is rare.

Another question to Torvalds mentioned that the maintainer tree is quite flat, meaning that he pulls directly from a large number of trees rather than from intermediate maintainers who coalesce pulls from multiple subsystems. He agreed that the tree is quite flat. Sometimes that is by his request; there have been cases where having code go through intermediate maintainers has made things more complicated. But the flatness also, he said, suggests that some maintainers don't have the support that they should and are solely responsible for getting work from contributors into the mainline. Some top-level maintainers do far too much work, he said; they should find ways to delegate some of that work to others.

2. 또 다른 질문은 대부분 부정적인 피드백을 제공하는 Torvalds의 경향과 관련

유지관리자는 Torvalds가 풀 요청 이메일에 응답하면 일반적으로 나쁜 소식이라는 것을 빨리 알게 됩니다. 그는 자신이 그런 식으로 행동하는 경향이 있음을 인정하고 그것이 자랑스럽지 않다고 말했습니다. 일반적으로 그는 꼭 필요한 경우가 아니면 이메일에 응답하지 않으려고 노력합니다.



또 다른 질문은 대부분 부정적인 피드백을 제공하는 Torvalds의 경향과 관련이 있었습니다. 유지관리자는 Torvalds가 풀 요청 이메일에 응답하면 일반적으로 나쁜 소식이라는 것을 빨리 알게 됩니다. 그는 자신이 그런 식으로 행동하는 경향이 있음을 인정하고 그것이 자랑스럽지 않다고 말했습니다. 일반적으로 그는 꼭 필요한 경우가 아니면 이메일에 응답하지 않으려고 노력합니다. 그래서 문제 없이 당김이 일어나면 그는 기뻐하며 "'사랑해'라고 말하고 싶어"하지만 그에 따라 행동하지 않습니다. 결과적으로 그의 이메일 대부분은 문제에 관한 것입니다. 그는 그러한 패턴을 바꾸려고 노력할 것이라고 말하지 않았습니다.

이 시점에서 휴식 시간으로 인해 세션이 중단되었습니다. 돌아왔을 때 Torvalds는 전반적으로 매우 행복하다고 말했습니다. 그는 병합 기간의 첫 주 동안 하와이에 있었는데, 이는 일반적으로 상황을 더 어렵게 만들 수 있습니다. 그러나 그는 초기에 많은 풀 요청을 받았으며 6.7 병합 창에서 프로젝트 역사상 병합 창 중 가장 많은 커밋을 가져왔음에도 불구하고 "통증이 없었습니다". 그의 기계를 깨뜨리는 변화가 단 한 건도 없었는데, 이는 드문 일이다.

3. Torvalds에 대한 또 다른 질문은 메인테이너 트리가 매우 평평하다는 점을 언급

Torvalds에 대한 또 다른 질문은 메인테이너 트리가 매우 평평하다는 점을 언급했습니다. 즉, 여러 하위 시스템에서 끌어오기를 통합하는 중간 유지보수자가 아닌 많은 수의 트리에서 직접 끌어온다는 의미입니다. 그는 나무가 꽤 평평하다는 데 동의했습니다. 때때로 그것은 그의 요청에 의한 것입니다. 코드가 중간 관리자를 거치게 되어 상황이 더욱 복잡해지는 경우가 있었습니다. 그러나 평탄함은 또한 일부 유지관리자가 지원을 받지 못하고 기여자의 작업을 메인라인으로 가져오는 데 전적인 책임이 있음을 암시한다고 그는 말했습니다. 일부 최고 수준의 유지관리자는 너무 많은 작업을 수행한다고 그는 말했습니다. 그들은 그 일의 일부를 다른 사람에게 위임할 방법을 찾아야 합니다.

There was, he said, a complaint that Thorsten Leemhuis, who has taken on the task of tracking regressions, is pushing maintainers to get those regressions fixed. Torvalds found that surprising; he loves having somebody staying on top of problems that way. He can see that it can be annoying to some maintainers, he said, but if Leemhuis weren't doing that job, he would be doing it himself instead.

Another question had to do with the "bus factor" of having Torvalds in charge of the whole community; what would happen if he were suddenly unable or unwilling to do that work? Torvalds said that things are working so well in the kernel community that his disappearance would be "a momentary distraction"; there would be "some infighting" as the new order was worked out, then work would continue as always. He said that maintainers should talk to him, though, if they think he should be doing his work differently.

He noted that the kernel community as a whole has hit a plateau in the last five years; the patch volume and number of developers are not growing as they once did. That may suggest, he said, that the community has hit the limits of how far it can scale. Adding more layers of maintainers would help, he said, but it also would not solve all of the issues that are impeding further growth.

4. 그는 회귀 추적 작업을 맡은 Thorsten Leemhuis가 관리자에게 이러한 회귀를 수정하도록 압력을 가하고 있다는 불만이 있다고 말했습니다.

그는 회귀 추적 작업을 맡은 Thorsten Leemhuis가 관리자에게 이러한 회귀를 수정하도록 압력을 가하고 있다는 불만이 있다고 말했습니다. Torvalds는 이것이 놀랍다는 사실을 발견했습니다. 그는 누군가가 그런 식으로 문제를 해결하는 것을 좋아합니다. 그는 이것이 일부 유지관리자들에게 짜증스러울 수 있다는 것을 알지만 Leemhuis가 그 일을 하지 않았다면 대신 스스로 그 일을 했을 것이라고 그는 말했습니다.

또 다른 질문은 Torvalds가 전체 커뮤니티를 담당하게 되는 "버스 요소"와 관련이 있었습니다. 만약 그가 갑자기 그 일을 할 수 없거나 할 의향이 없다면 어떻게 될까요? Torvalds는 커널 커뮤니티에서 일이 너무 잘 진행되고 있어서 그의 실종이 "일시적인 방해"가 될 것이라고 말했습니다. 새로운 질서가 확립되면서 "일부 내분"이 있을 것이고, 그 후에도 작업은 언제나처럼 계속될 것입니다. 하지만 그는 자신이 자신의 작업을 다르게 수행해야 한다고 생각한다면 관리자가 그와 대화해야 한다고 말했습니다.

그는 커널 커뮤니티 전체가 지난 5년 동안 정체기를 겪었다고 지적했습니다. 패치 규모와 개발자 수는 예전처럼 증가하지 않습니다. 이는 커뮤니티가 확장할 수 있는 한계에 도달했음을 시사할 수 있다고 그는 말했습니다. 그는 더 많은 관리자 계층을 추가하면 도움이 될 수 있지만 추가 성장을 방해하는 모든 문제가 해결되지는 않을 것이라고 말했습니다.


Diversity

The last question to be addressed had to do with the gender imbalance in the community and at the Maintainers Summit (which was 100% male) specifically. Torvalds agreed that the situation was not good and "not going in the right direction", then quickly moved on. Dan Williams returned the discussion to this topic a bit later, noting that he had recently had a discussion with the head of the OpenJS Foundation. When she joined, she was the only female member of the board; now it is much more balanced. She told Williams that the change was effected through direct outreach to potential members; hoping that the problem would get better on its own was not good enough.

Williams noted that the 2023 election for members of the Linux Foundation Technical Advisory Board was uncontested; only the incumbents ran to keep their seats. That suggests, he said, that the community is missing chances to reach out to people. Torvalds said that Greg Kroah-Hartman used to do that sort of outreach; Kroah-Hartman, in turn, said that Shuah Khan at the Linux foundation is doing a good job of bringing in interns. The problem is that, after learning how to do kernel development, they disappear into companies and are never seen again.

Williams said that he went to a recent Black Is Tech conference, which featured a slate of all black developers. This would have been a good event for outreach, but nobody was there to recruit for Linux. Torvalds said that the maintainers in the room were not the best people to be doing outreach. Kroah-Hartman again mentioned programs like Outreachy and the Google Summer of Code, which do well at reaching out to potential developers, but which mostly end up providing employees that disappear into companies. Dave Airlie said that he has been able to get a couple of Outreachy interns working on graphics into community-oriented jobs, and they are still contributing.

다양성

5. 해결해야 할 마지막 질문은 특히 커뮤니티와 메인테이너 서밋(100% 남성)의 성별 불균형과 관련

해결해야 할 마지막 질문은 특히 커뮤니티와 메인테이너 서밋(100% 남성)의 성별 불균형과 관련이 있었습니다. Torvalds는 상황이 좋지 않고 "올바른 방향으로 가고 있지 않다"는 데 동의한 후 신속하게 진행했습니다. Dan Williams는 최근 OpenJS Foundation의 수장과 토론을 했다는 점을 언급하면서 잠시 후 이 주제에 대한 토론을 다시 시작했습니다. 그녀가 합류했을 때 그녀는 이사회의 유일한 여성 회원이었습니다. 이제 훨씬 더 균형이 잡혔습니다. 그녀는 Williams에게 잠재적인 회원들에게 직접적인 연락을 통해 변화가 이루어졌다고 말했습니다. 문제가 저절로 좋아지길 바라는 것만으로는 충분하지 않았습니다.

Williams는 2023년 Linux Foundation 기술 자문 위원회 구성원 선거에 경쟁이 없었다고 언급했습니다. 현직자들만이 자리를 지키기 위해 달려갔다. 이는 지역사회가 사람들에게 다가갈 기회를 놓치고 있음을 의미한다고 그는 말했습니다. Torvalds는 Greg Kroah-Hartman이 그런 종류의 홍보 활동을 했었다고 말했습니다. Kroah-Hartman은 Linux 재단의 Shuah Khan이 인턴을 잘 채용하고 있다고 말했습니다. 문제는 커널 개발 방법을 배운 뒤 회사로 사라져 다시는 볼 수 없다는 점이다.

Williams는 최근 흑인 개발자들이 모두 모인 Black Is Tech 컨퍼런스에 참석했다고 말했습니다. 이것은 홍보를 위한 좋은 행사였을 것이지만 Linux를 위해 모집할 사람은 아무도 없었습니다. Torvalds는 방에 있는 유지관리자들이 홍보 활동을 수행하기에 가장 적합한 사람들이 아니라고 말했습니다. Kroah-Hartman은 Outreachy 및 Google Summer of Code와 같은 프로그램을 다시 언급했습니다. 이 프로그램은 잠재 개발자에게 다가가는 데 효과적이지만 대부분 직원이 회사로 사라지게 됩니다. Dave Airlie는 그래픽 작업을 하는 두 명의 Outreachy 인턴을 지역 사회 지향적인 직업으로 데려갈 수 있었고 그들은 여전히 ​​공헌하고 있다고 말했습니다.

Steve Rostedt said that one problem has to do with the demands on women who are successful in the kernel community; they are quickly "asked to join everything" and it burns them out. Ted Ts'o suggested thinking about the different points in the pipeline; people invited to join panels tend to be mid-level developers, but people are dropping out at all levels, suggesting that there is a wider problem. Developers at different levels have different needs, he said. Josef Bacik agreed that the community relies too heavily on the few women that it has; he cited one developer who got burned out and now prefers to just focus on one area and avoids the community.

Thomas Gleixner pointed to one end of the pipeline by saying that there are few women in computer-science programs; Airlie said that is true of undergraduate programs, but there are more women doing postgraduate work. Christoph Hellwig says that he sees more women at academic events than at community events.

Bacik said that he does a lot of recruiting for his employer; he goes to events like the Grace Hopper Celebration as a way of finding good candidates. The Linux Foundation, he said, could send people to events like this to let developers know that the Linux community exists.

6. Steve Rostedt는 한 가지 문제는 커널 커뮤니티에서 성공한 여성에 대한 요구와 관련이 있다고 말했습니다.

Steve Rostedt는 한 가지 문제는 커널 커뮤니티에서 성공한 여성에 대한 요구와 관련이 있다고 말했습니다. 그들은 신속하게 "모든 것에 참여하라는 요청"을 받고 소진됩니다. Ted Ts'o는 파이프라인의 다양한 지점에 대해 생각해 볼 것을 제안했습니다. 패널에 초대된 사람들은 중간 수준의 개발자인 경향이 있지만 모든 수준에서 탈락하는 사람들이 늘어나고 있어 더 큰 문제가 있음을 시사합니다. 그는 다양한 수준의 개발자마다 요구 사항이 다르다고 말했습니다. Josef Bacik은 지역 사회가 소수의 여성에게 너무 많이 의존한다는 데 동의했습니다. 그는 지쳐서 이제는 한 영역에만 집중하고 커뮤니티를 피하는 것을 선호하는 한 개발자를 언급했습니다.

7. Thomas Gleixner는 컴퓨터 과학 프로그램에 여성이 거의 없다고 말함으로써 파이프라인의 한쪽 끝을 지적했습니다.

Thomas Gleixner는 컴퓨터 과학 프로그램에 여성이 거의 없다고 말함으로써 파이프라인의 한쪽 끝을 지적했습니다. Airlie는 그것이 학부 프로그램에도 해당되지만 대학원에서 일하는 여성이 더 많다고 말했습니다. Christoph Hellwig는 지역 사회 행사보다 학술 행사에서 더 많은 여성을 본다고 말합니다.

Bacik은 고용주를 위해 채용을 많이 한다고 말했습니다. 그는 좋은 후보자를 찾는 방법으로 Grace Hopper Celebration과 같은 행사에 참석합니다. 그는 리눅스 재단이 이런 행사에 사람들을 보내 개발자들에게 리눅스 커뮤니티가 존재한다는 사실을 알릴 수 있다고 말했습니다.

Konstantin Ryabitsev said that there are good reasons why developers disappear into companies. It is often the only path available; the Linux Foundation is unable to hire them (it employs few developers in general). Not everybody is able to sacrifice their evenings and weekends to do community work, he said. Hellwig suggested looking harder outside of the US and Europe; there are far more women in engineering elsewhere. Discussion on this topic ended with a suggestion from Ts'o to survey Outreachy interns a couple of years after they complete the program and see if they are still working in tech. If not, it would be good to know why; for now, he said, we are only guessing.

With that, the session (and the Maintainers Summit as a whole) came to an end; the attendees filed off for the obligatory group photo before taking some much-needed rest.

Konstantin Ryabitsev는 개발자가 회사로 사라지는 데에는 타당한 이유가 있다고 말했습니다. 이는 종종 사용 가능한 유일한 경로입니다. Linux Foundation은 그들을 고용할 수 없습니다(일반적으로 소수의 개발자를 고용합니다). 모든 사람이 저녁 시간과 주말을 희생하여 지역 사회 활동을 할 수는 없다고 그는 말했습니다. Hellwig는 미국과 유럽 이외의 지역에서는 더 열심히 볼 것을 제안했습니다. 다른 곳에서는 엔지니어링 분야에 훨씬 더 많은 여성이 있습니다. 이 주제에 대한 토론은 Ts'o가 프로그램을 마친 후 몇 년 후에 Outreachy 인턴을 대상으로 설문조사를 실시하고 그들이 여전히 기술 분야에서 일하고 있는지 확인하라는 제안으로 끝났습니다. 그렇지 않다면 그 이유를 아는 것이 좋을 것입니다. 그는 지금은 추측만 할 뿐이라고 말했습니다.

이것으로 세션(및 전체 메인테이너 서밋)이 끝났습니다. 참석자들은 꼭 필요한 휴식을 취하기 전에 의무적인 단체 사진 촬영을 위해 출발했습니다.

----

Reducing kernel-maintainer burnout

By Jonathan Corbet
November 24, 2023

Maintainers SummitOverstressed maintainers are a constant topic of conversation throughout the open-source community. Kernel maintainers have been complaining more loudly than usual recently about overwork and stress. The problems that maintainers are facing are clear; what to do about them is rather less so. A session at the 2023 Maintainers Summit took up the topic yet again with the hope of finding some solutions; there may be answers, perhaps even within the kernel community, but a general solution still seems distant.

Ted Ts'o started off the session by saying that kernel maintainers end up having to do all of the tasks that nobody else working on a given subsystem wants to take on. These can include patch review, release engineering, testing, and responding to security reports. The expectations placed on maintainers have gone up over time, and kernel maintainers are feeling the pressure as a result.

Darrick Wong, Ts'o continued, broke down the aspects of the maintainer job nicely when he stepped down as the XFS maintainer. Ts'o is uncertain, though, about how well that has worked to get others to step up and tackle some of those jobs.

1. 커널 관리자들은 최근 과로와 스트레스에 대해 평소보다 더 크게 불평하고 있습니다.

유지관리자 서밋오픈 소스 커뮤니티 전체에서 스트레스를 많이 받는 유지관리자는 끊임없는 대화 주제입니다. 커널 관리자들은 최근 과로와 스트레스에 대해 평소보다 더 크게 불평하고 있습니다. 유지관리자가 직면하고 있는 문제는 분명합니다. 그들에 대해 무엇을 해야 할지가 오히려 덜 그렇습니다. 2023년 메인테이너 서밋 세션에서는 몇 가지 해결책을 찾기 위해 이 주제를 다시 다루었습니다. 아마도 커널 커뮤니티 내에서도 답이 있을 수 있지만 일반적인 해결책은 여전히 멀어 보입니다.

Ted Ts'o는 커널 유지관리자가 특정 하위 시스템에서 작업하는 다른 누구도 수행하고 싶어하지 않는 모든 작업을 결국 수행해야 한다고 말하면서 세션을 시작했습니다. 여기에는 패치 검토, 릴리스 엔지니어링, 테스트 및 보안 보고서 대응이 포함될 수 있습니다. 유지관리자에 대한 기대치는 시간이 지남에 따라 높아졌으며 결과적으로 커널 유지관리자는 압박감을 느끼고 있습니다.

Ts'o는 Darrick Wong이 XFS 관리자직에서 물러났을 때 관리자 업무의 측면을 훌륭하게 세분화했습니다. 하지만 Ts'o는 다른 사람들이 나서서 이러한 일 중 일부를 처리하는 데 얼마나 효과가 있었는지는 불확실합니다.



Martin Petersen asserted that the real problem is that people are sending too many patches, but Dave Airlie strongly disagreed. As the DRM subsystem maintainer, he is "processing more changes than anybody" without having to touch a single patch. The way to handle this problem is to build up a structure with people who are able to take on the various tasks needed. The filesystem layer, he said, is more important than graphics; why doesn't it have more people than the DRM layer does?

Josef Bacik answered that building up that structure is hard; he has been trying with various people for the last three years. One developer simply couldn't do the work, another was unable to bring things to a conclusion. The filesystem problem space is complicated, he said, and finding people who can work in that area is hard.

Steve Rostedt said that part of the problem may be documentation; when he runs into bugs, he can't find documents describing how things work. Christoph Hellwig suggested writing down problems as they are encountered. Christian Brauner said that there is extensive documentation about the filesystem layers, but it tends to be hard to understand.

Airlie said that the trick is for maintainers to leave voids for others to fill. Thomas Gleixner, though, brought up the example of the generic interrupt subsystem. There is currently one person maintaining it, even though "if it breaks, the whole world breaks". There are a lot of people sending patches, but nobody showing any desire to maintain it. Airlie said that, if there are 100 people sending patches, there may be five who can be convinced to help maintain the subsystem; Gleixner answered that he sees a lot of "random drive-by names" that clearly have no intention of sticking around.

2. Martin Petersen은 진짜 문제는 사람들이 너무 많은 패치를 보내는 것이라고 주장했지만 Dave Airlie는 이에 크게 동의하지 않았습니다.

Martin Petersen은 진짜 문제는 사람들이 너무 많은 패치를 보내는 것이라고 주장했지만 Dave Airlie는 이에 크게 동의하지 않았습니다. DRM 하위 시스템 관리자로서 그는 단일 패치를 건드릴 필요 없이 "누구보다 더 많은 변경 사항을 처리"하고 있습니다. 이 문제를 처리하는 방법은 필요한 다양한 작업을 수행할 수 있는 사람들로 구조를 구축하는 것입니다. 그는 파일 시스템 계층이 그래픽보다 더 중요하다고 말했습니다. 왜 DRM 레이어보다 사람이 더 많지 않습니까?

Josef Bacik은 그러한 구조를 구축하는 것이 어렵다고 대답했습니다. 그는 지난 3년 동안 다양한 사람들과 함께 노력해왔습니다. 한 개발자는 작업을 수행할 수 없었고, 다른 개발자는 결론을 내릴 수 없었습니다. 파일 시스템 문제 공간은 복잡하고 그 분야에서 일할 수 있는 사람을 찾는 것이 어렵다고 그는 말했습니다.

Steve Rostedt는 문제의 일부가 문서화일 수 있다고 말했습니다. 버그가 발생하면 작동 방식을 설명하는 문서를 찾을 수 없습니다. Christoph Hellwig는 문제가 발생하면 이를 기록해 둘 것을 제안했습니다. Christian Brauner는 파일 시스템 계층에 대한 광범위한 문서가 있지만 이해하기 어려운 경향이 있다고 말했습니다.

Airlie는 관리자가 다른 사람들이 채울 수 있도록 공백을 남겨두는 것이 비결이라고 말했습니다. 하지만 Thomas Gleixner는 일반적인 인터럽트 하위 시스템의 예를 제시했습니다. "깨지면 온 세상이 무너진다"는 사실에도 불구하고 현재 그것을 유지하는 사람은 한 명 있습니다. 패치를 보내는 사람은 많지만 패치를 유지하려는 사람은 아무도 없습니다. Airlie는 패치를 보내는 사람이 100명이라면 하위 시스템 유지 관리에 도움을 줄 수 있는 사람은 5명일 것이라고 말했습니다. Gleixner는 분명히 남을 의도가 전혀 없는 "임의의 드라이브 바이 이름"을 많이 본다고 대답했습니다.

The need for reviewer help in particular came up; Linus Torvalds jumped in to say that reviewing is boring, so it is unsurprising that people don't want to do it. He keeps seeing huge patch sets being sent out once each week with little seeming to happen with them. A few tweaks, perhaps, before the next version is sent, but no real resolution. What is really needed, he said, is to find ways to get away from the email patch model, which is not really working anymore. He feels that way now, even though he is "an old-school email person".

Bacik said that the Btrfs developers are using GitHub to track things; it is good at showing the work that is outstanding, so he can see what has been languishing. That has improved the subsystem's throughput significantly. There are, he said, tools out there that "make the tasks we hate easier", and that every other project uses to get their work done. Gleixner, though, expressed skepticism that adopting another tool would solve the problem. He has a patch-tracking system that works well enough, he said; the real solution is to teach managers that, with proper engineering, work gets done sooner (and life for maintainers is easier).

Ts'o said that he never knows how long a patch submitter will be around, so it's never clear whether time spent to educate them will be worthwhile. He also said that, while asking submitters to fix existing technical debt in order to get their work merged is asking too much, maintainers can take a stand against adding more debt. Hellwig said that a developer trying to contribute code is often the best opportunity to get some cleanup done. Bacik said that the Btrfs community has been guiding developers that way for a long time and has learned how to do it well; he admitted that he should be writing their approach down. Maintainers should, he said, take a bigger role in teaching others.

Gleixner said that a lot of useful information for contributors has indeed been written down. Dave Chinner, though, worried that pointing contributors to that documentation can come across as an impersonal brush-off. That is why he often takes the time to write a long response to contributors needing guidance. Rostedt said that today's developers have different needs. He asked how many in the room had started kernel work because their employers had told them to; no hands were raised. That is not the case for many of today's new developers, he said.

특히 리뷰어의 도움이 필요했습니다. Linus Torvalds는 검토가 지루하므로 사람들이 검토를 원하지 않는 것은 놀라운 일이 아니라고 말했습니다. 그는 매주 한 번씩 거대한 패치 세트가 전송되는 것을 계속 보고 있는데, 그 세트에서는 거의 아무 일도 일어나지 않는 것 같습니다. 아마도 다음 버전이 전송되기 전에 몇 가지 조정이 있을 수 있지만 실제 해결 방법은 없습니다. 정말로 필요한 것은 더 이상 작동하지 않는 이메일 패치 모델에서 벗어날 수 있는 방법을 찾는 것이라고 그는 말했습니다. 비록 그가 "구식 이메일 사용자"임에도 불구하고 그는 지금 그렇게 느끼고 있습니다.

Bacik은 Btrfs 개발자가 GitHub를 사용하여 사물을 추적하고 있다고 말했습니다. 뛰어난 작품을 보여주는데 능숙해서 그동안 쇠퇴해왔던 것이 무엇인지도 알 수 있다. 이는 하위 시스템의 처리량을 크게 향상시켰습니다. 그는 "우리가 싫어하는 작업을 더 쉽게 만들고" 다른 모든 프로젝트에서 작업을 완료하는 데 사용하는 도구가 있다고 말했습니다. 하지만 Gleixner는 다른 도구를 채택하면 문제가 해결될 것이라는 회의적인 입장을 표명했습니다. 그는 충분히 잘 작동하는 패치 추적 시스템을 가지고 있다고 말했습니다. 진정한 해결책은 적절한 엔지니어링을 통해 작업이 더 빨리 완료되고 유지관리자의 삶이 더 쉬워진다는 점을 관리자에게 가르치는 것입니다.

Ts'o는 패치 제출자가 얼마나 오랫동안 곁에 있을지 모르기 때문에 이들을 교육하는 데 소요되는 시간이 가치가 있을지 확실하지 않다고 말했습니다. 그는 또한 제출자에게 작업을 병합하기 위해 기존 기술 부채를 수정하도록 요구하는 것은 너무 많은 요구이지만 유지관리자는 부채를 추가하는 것에 반대하는 입장을 취할 수 있다고 말했습니다. Hellwig는 코드를 기여하려는 개발자가 정리 작업을 완료할 수 있는 가장 좋은 기회인 경우가 많다고 말했습니다. Bacik은 Btrfs 커뮤니티가 오랫동안 개발자들을 그런 식으로 안내해 왔으며 이를 잘 수행하는 방법을 배웠다고 말했습니다. 그는 그들의 접근 방식을 적어야 한다고 인정했습니다. 그는 유지관리자가 다른 사람들을 가르치는 데 더 큰 역할을 맡아야 한다고 말했습니다.

Gleixner는 실제로 기여자에게 유용한 정보가 많이 기록되어 있다고 말했습니다. 하지만 Dave Chinner는 해당 문서에 기여자를 가리키는 것이 비인격적인 솔직함으로 비쳐질 수 있다고 걱정했습니다. 그렇기 때문에 그는 지도가 필요한 기여자들에게 긴 답변을 작성하는 데 종종 시간을 투자합니다. Rostedt는 오늘날 개발자들의 요구 사항이 서로 다르다고 말했습니다. 그는 그 방에 있는 고용주의 지시에 따라 커널 작업을 시작한 사람이 몇 명인지 물었습니다. 손을 들지 않았습니다. 오늘날의 많은 신규 개발자에게는 그렇지 않다고 그는 말했습니다.

"Being a maintainer is a part of our identity", Airlie said; it is likely how we got our current job and is not something that we readily let go of. Brauner added that people tend to hold onto power for dear life. Wolfram Sang said that he likes reviewing, but can get no support for doing that work; Dan Williams said that developers tend not to understand just how much social capital they can get from doing good reviews. Bacik said that the group was taking an overly simple view of the reviewing task; many developers hesitate to do reviews because they don't want to be seen as having missed something if a bug turns up. It was widely agreed that nobody should feel that way, since no one can be expected to catch everything. How to communicate that to the community as a whole is unclear, though.

Torvalds said that a Reviewed-by tag mainly means that the reviewer will be copied on any bug reports; developers should add those tags liberally, he said. Gleixner added that maintainers make fools of themselves every other day. Hellwig said that he has been trying to review code outside of his comfort area; it takes a couple of times before he feels that he understands well enough to offer a Reviewed-by tag. Rostedt, though, raised the issue of bare Reviewed-by tags offered without any discussion, which can be a sign of somebody trying to game the system and get into the statistics. Bacik said that, if the maintainer does not know the reviewer, their Reviewed-by tag means nothing.

Torvalds said that some subsystems are setting their requirements for contributors too high, making it hard for new developers to come in. Chinner added that the kernel's culture can be off-putting and not inclusive, making people fight to get their changes in. Bacik agreed, saying that there is no arbiter in the community; he said that Torvalds wants developers to figure things out for themselves, so disagreements over changes often end up as big battles. He would like to move to a system that is more encouraging of efforts to find solutions.

"관리자가 되는 것은 우리 정체성의 일부입니다"라고 Airlie는 말했습니다. 그것은 우리가 현재의 직업을 갖게 된 방법일 가능성이 높으며 우리가 쉽게 버릴 수 있는 것이 아닙니다. Brauner는 사람들이 소중한 삶을 위해 권력을 붙잡는 경향이 있다고 덧붙였습니다. Wolfram Sang은 리뷰하는 것을 좋아하지만 그 작업을 수행하는 데 대한 지원을 받을 수 없다고 말했습니다. Dan Williams는 개발자들이 좋은 리뷰를 통해 얼마나 많은 사회적 자본을 얻을 수 있는지 이해하지 못하는 경향이 있다고 말했습니다. Bacik은 그룹이 검토 작업에 대해 지나치게 단순한 관점을 취하고 있다고 말했습니다. 많은 개발자들은 버그가 발견될 경우 뭔가를 놓친 것으로 비쳐지는 것을 원하지 않기 때문에 리뷰를 주저합니다. 누구도 모든 것을 다 잡을 것이라고 기대할 수 없기 때문에 누구도 그렇게 느껴서는 안 된다는 데 널리 동의했습니다. 하지만 이를 커뮤니티 전체에 어떻게 전달하는지는 불분명합니다.

Torvalds는 Reviewed-by 태그는 주로 리뷰어가 모든 버그 보고서에 복사된다는 것을 의미한다고 말했습니다. 개발자들은 이러한 태그를 자유롭게 추가해야 한다고 그는 말했습니다. Gleixner는 관리자들이 매일 바보짓을 하고 있다고 덧붙였습니다. Hellwig는 자신이 익숙한 영역 밖에서 코드를 검토하려고 노력해 왔다고 말했습니다. 그가 검토자 태그를 제공할 만큼 충분히 이해했다고 느끼기까지는 몇 번이 걸립니다. 그러나 Rostedt는 논의 없이 제공되는 리뷰 작성자 태그 문제를 제기했는데, 이는 누군가가 시스템을 조작하고 통계에 들어가려는 신호일 수 있습니다. Bacik은 관리자가 리뷰어를 모른다면 리뷰 작성자 태그는 아무 의미가 없다고 말했습니다.

Torvalds는 일부 하위 시스템이 기여자에 대한 요구 사항을 너무 높게 설정하여 새로운 개발자가 참여하기 어렵게 만들고 있다고 말했습니다. Chinner는 커널의 문화가 불쾌하고 포용적이지 않아 사람들이 변경 사항을 적용하기 위해 싸울 수 있다고 덧붙였습니다. Bacik은 동의했습니다. , 커뮤니티에 중재자가 없다고 말합니다. 그는 Torvalds는 개발자가 스스로 문제를 해결하기를 원하므로 변경 사항에 대한 의견 불일치가 종종 큰 싸움으로 끝난다고 말했습니다. 그는 해결책을 찾는 노력을 더욱 장려하는 시스템으로 전환하고 싶습니다.

Torvalds said that, while the community gets a lot of new contributors, it doesn't tend to get many new maintainers. The contributor and maintainer roles should be separated, he said. Chinner said that becoming a maintainer is often seen as a promotion for developers who do good work; Torvalds answered that people often see maintainers as some sort of "super developer", but they are really just managers. He took a moment to thank Konstantin Ryabitsev for the b4 tool, which has made life much easier for maintainers; the attendees responded with applause.

As this part of the session came to a close, Williams said that part of the pay for reviewing work is autonomy within a subsystem, but that the community doesn't actually provide that autonomy. Instead, maintainers hold onto all of the decision power. Airlie answered that the DRM subsystem has done well with distributing that power among a number of developers.

Torvalds는 커뮤니티가 새로운 기여자를 많이 확보하는 반면, 새로운 관리자를 많이 확보하는 경향이 없다고 말했습니다. 그는 기여자와 관리자 역할을 분리해야 한다고 말했습니다. Chinner는 메인테이너가 되는 것이 좋은 일을 하는 개발자를 위한 승진으로 간주되는 경우가 많다고 말했습니다. Torvalds는 사람들이 관리자를 일종의 "슈퍼 개발자"로 보는 경우가 많지만 실제로는 관리자일 뿐이라고 대답했습니다. 그는 잠시 시간을 내어 b4 도구를 제공한 Konstantin Ryabitsev에게 감사를 표했습니다. 덕분에 관리자의 삶이 훨씬 쉬워졌습니다. 참석자들은 박수로 화답했다.

세션의 이 부분이 끝나자 Williams는 작업 검토에 대한 급여의 일부가 하위 시스템 내 자율성이지만 커뮤니티가 실제로 그러한 자율성을 제공하지는 않는다고 말했습니다. 대신, 관리자는 모든 결정권을 보유합니다. Airlie는 DRM 하위 시스템이 여러 개발자에게 그 힘을 잘 분배했다고 대답했습니다.

A support group

A related session was run by Rostedt, who started by saying that he has heard a lot of maintainers and developers complaining about burnout. There are many things that could be done about this problem, but often all that a tired developer really needs is somebody to talk to. He is proposing the creation of a list of developers who are willing to lend an ear when the need arises. These developers would have no power, they would just be there to provide support and advice when a problem arises.

Torvalds answered that if he wanted to talk to somebody, he wouldn't go to a kernel developer. Bacik, though, said that he is willing to do some basic support work. He can talk well with developers who are at the same level in the community, but his ability to get others to listen to him is not great. He suggested that Torvalds should take less of a laissez-faire approach to the development community and help solve problems more often.

Chinner asked what problem Rostedt was trying to solve; Rostedt answered that many developers feel isolated and that they could benefit from a support group, but they don't know who to talk to. Bacik said that, with the developers he works with, he knows that problems can be worked out. But perhaps developers who lack that assurance could use some support.

Williams asked whether the inability for developers to see each other for a couple of years contributed to problems; many people seemed to think that it did.

지원 그룹

관련 세션은 Rostedt가 진행했는데, 그는 많은 유지관리자와 개발자가 번아웃에 대해 불평하는 것을 들었다고 말하면서 시작했습니다. 이 문제에 대해 할 수 있는 일은 많지만 피곤한 개발자에게 정말로 필요한 것은 대화할 사람뿐입니다. 그는 필요할 때 기꺼이 귀를 기울일 개발자 목록을 만들 것을 제안하고 있습니다. 이러한 개발자에게는 권한이 없으며 문제가 발생할 때 지원과 조언을 제공하기 위해 존재합니다.

Torvalds는 누군가와 이야기하고 싶다면 커널 개발자에게 가지 않을 것이라고 대답했습니다. 하지만 Bacik은 기본적인 지원 작업을 수행할 의향이 있다고 말했습니다. 커뮤니티에서 같은 수준의 개발자들과 대화를 잘 할 수 있지만, 다른 사람들이 자신의 말을 듣게 만드는 능력은 좋지 않습니다. 그는 Torvalds가 개발 커뮤니티에 대해 자유방임적 접근 방식을 덜 취하고 문제 해결을 더 자주 도와야 한다고 제안했습니다.

Chinner는 Rostedt가 해결하려고 하는 문제가 무엇인지 물었습니다. Rostedt는 많은 개발자들이 고립감을 느끼고 지원 그룹의 혜택을 누릴 수 있지만 누구와 대화해야 할지 모른다고 대답했습니다. Bacik은 자신과 함께 일하는 개발자들과 함께 문제를 해결할 수 있다는 것을 알고 있다고 말했습니다. 그러나 그러한 확신이 부족한 개발자는 일부 지원을 사용할 수 있습니다.

Williams는 개발자들이 몇 년 동안 서로 만날 수 없는 것이 문제의 원인이 되었는지 물었습니다. 많은 사람들이 그렇다고 생각하는 것 같았습니다.

At the end of this session, Torvalds said that about half of the emails he receives are private, rather than copied to the mailing lists. Developers are always welcome to send him a note when they are having problems; he has often had long discussions with developers about conflicts. Ts'o said that individual subsystems often have a decision maker who can bring conflicts to an end, resolving disputes by decree if they have to. The community lacks that resource for cross-subsystem issues, though.

The next step will be for Rostedt to propose an addition to the kernel's process documentation describing this support group.

이 세션이 끝날 무렵 Torvalds는 자신이 받은 이메일의 약 절반이 메일링 리스트에 복사된 것이 아니라 비공개라고 말했습니다. 개발자는 문제가 있을 때 언제든지 그에게 메모를 보낼 수 있습니다. 그는 종종 개발자들과 갈등에 관해 오랫동안 논의해 왔습니다. Ts'o는 개별 하위 시스템에는 갈등을 종식시키고 필요한 경우 법령을 통해 분쟁을 해결할 수 있는 의사결정자가 있는 경우가 많다고 말했습니다. 하지만 커뮤니티에는 하위 시스템 간 문제에 대한 리소스가 부족합니다.

다음 단계는 Rostedt가 이 지원 그룹을 설명하는 커널 프로세스 문서에 추가를 제안하는 것입니다.

---


Committing to Rust for kernel code

By Jonathan Corbet
November 22, 2023

Maintainers SummitRust has been a prominent topic at the Kernel Maintainers Summit for the last couple of years, and the 2023 meeting continued that tradition. As Rust-for-Linux developer Miguel Ojeda noted at the beginning of the session dedicated to the topic, the level of interest in using Rust for kernel development has increased significantly over the last year. But Rust was explicitly added to Linux as an experiment; is the kernel community now ready to say that the experiment has succeeded?

The Rust-for-Linux project has added a full-time engineer in the last year, Ojeda said, and a student developer as well. Various companies have joined in to support this work. There is also work underway to get the Coccinelle tool working with Rust code. A priority at the moment is bringing in more reviewers for the code that is being posted.

커널 코드를 Rust에 적용하기

조나단 코벳
2023년 11월 22일

1. Rust는 실험적으로 Linux에 명시적으로 추가

메인테이너 서밋러스트(Maintainers SummitRust)는 지난 몇 년 동안 커널 메인테이너 서밋에서 중요한 주제였으며, 2023년 회의에서도 이러한 전통이 이어졌습니다. Linux용 Rust 개발자 Miguel Ojeda가 해당 주제에 대한 세션 시작 부분에서 언급했듯이 커널 개발에 Rust를 사용하는 것에 대한 관심 수준이 지난 한 해 동안 크게 증가했습니다. 그러나 Rust는 실험적으로 Linux에 명시적으로 추가되었습니다. 이제 커널 커뮤니티는 실험이 성공했다고 말할 준비가 되었습니까?

Rust-for-Linux 프로젝트에는 작년에 정규 엔지니어가 추가되었고 학생 개발자도 추가되었다고 Ojeda는 말했습니다. 이 작업을 지원하기 위해 다양한 회사가 참여했습니다. Coccinelle 도구를 Rust 코드와 함께 작동시키려는 작업도 진행 중입니다. 현재 우선순위는 게시되는 코드에 대해 더 많은 검토자를 확보하는 것입니다.

On the toolchain front, work on gccrs, the GCC-based Rust compiler, has slowed significantly. The GCC code generator for rustc is showing better progress; it can compile kernel code now and has been merged into the compiler. This GCC-based backend will enable the expansion of Rust support to architectures that are not supported by the LLVM-based rustc. Meanwhile, the Rust project itself is increasing its involvement in this work; this is good, since the kernel has some unique requirements and will need guarantees that language changes won't break kernel code in the future.

Within the kernel, work is proceeding in a number of subsystems. The Rust implementation of Android's binder is working well and its performance is on a par with the C implementation. The amount of unsafe code that was needed to get there was pleasingly small. Filesystem bindings are the subject of work by Wedson Almeida Filho, who is targeting read-only support for now. The object there is to make it possible to implement a filesystem in 100% safe Rust.

In general, he is finding an increasing number of maintainers who are open to the idea of using Rust. That leads to an issue the Rust developers have run up against, though. It would be good to have some reference drivers in the kernel as an example of how drivers can be written and to make it possible to compare Rust and C drivers. The best way to do that often seems to be to merge a Rust driver that duplicates the functionality of an existing C driver — but that sort of duplicate functionality is not welcomed by maintainers. Perhaps, he said, it would be good to allow a few duplicate drivers that are not meant for actual use, but only as examples for other developers to use.

There are some other challenges; upstreaming the block-layer abstractions has run into some resistance. Virtual filesystem layer maintainer Christian Brauner said that he is not opposed to merging those abstractions, but he would rather not do that and see filesystems built on it right away. He would prefer to see an implementation of something relatively simple, along the lines of the binder driver, to show that things work as expected.

2. 툴체인 측면에서는 GCC 기반 Rust 컴파일러인 gccrs 작업 속도가 크게 느려졌습니다. Rustc용 GCC 코드 생성기가 더 나은 발전을 보이고 있습니다. 이제 커널 코드를 컴파일할 수 있으며 컴파일러에 병합되었습니다. 이 GCC 기반 백엔드는 LLVM 기반 Rustc에서 지원하지 않는 아키텍처에 대한 Rust 지원 확장을 가능하게 합니다. 한편, Rust 프로젝트 자체는 이 작업에 대한 참여를 늘리고 있습니다. 커널에는 몇 가지 고유한 요구 사항이 있고 앞으로 언어 변경으로 인해 커널 코드가 손상되지 않는다는 보장이 필요하기 때문에 이는 좋습니다.

툴체인 측면에서는 GCC 기반 Rust 컴파일러인 gccrs 작업 속도가 크게 느려졌습니다. Rustc용 GCC 코드 생성기가 더 나은 발전을 보이고 있습니다. 이제 커널 코드를 컴파일할 수 있으며 컴파일러에 병합되었습니다. 이 GCC 기반 백엔드는 LLVM 기반 Rustc에서 지원하지 않는 아키텍처에 대한 Rust 지원 확장을 가능하게 합니다. 한편, Rust 프로젝트 자체는 이 작업에 대한 참여를 늘리고 있습니다. 커널에는 몇 가지 고유한 요구 사항이 있고 앞으로 언어 변경으로 인해 커널 코드가 손상되지 않는다는 보장이 필요하기 때문에 이는 좋습니다.

3. 커널 내에서는 여러 하위 시스템에서 작업이 진행됩니다. Android 바인더의 Rust 구현은 잘 작동하며 성능은 C 구현과 동일합니다. 거기에 도달하는 데 필요한 안전하지 않은 코드의 양은 기분 좋게 적었습니다.

4. 파일 시스템 바인딩은 현재 읽기 전용 지원을 목표

커널 내에서는 여러 하위 시스템에서 작업이 진행됩니다. Android 바인더의 Rust 구현은 잘 작동하며 성능은 C 구현과 동일합니다. 거기에 도달하는 데 필요한 안전하지 않은 코드의 양은 기분 좋게 적었습니다. 파일 시스템 바인딩은 현재 읽기 전용 지원을 목표로 하고 있는 Wedson Almeida Filho의 작업 주제입니다. 거기의 목표는 100% 안전한 Rust에서 파일 시스템을 구현하는 것을 가능하게 하는 것입니다.

일반적으로 그는 Rust 사용 아이디어에 열려 있는 관리자의 수가 점점 늘어나고 있습니다. 하지만 이는 Rust 개발자가 직면한 문제로 이어집니다. 드라이버 작성 방법의 예로서 커널에 몇 가지 참조 드라이버가 있고 Rust와 C 드라이버를 비교할 수 있도록 하는 것이 좋을 것입니다. 이를 수행하는 가장 좋은 방법은 기존 C 드라이버의 기능을 복제하는 Rust 드라이버를 병합하는 것인 경우가 많습니다. 그러나 그런 종류의 중복 기능은 관리자가 환영하지 않습니다. 아마도 실제 사용이 아닌 다른 개발자가 사용할 수 있는 예시로만 몇 가지 중복 드라이버를 허용하는 것이 좋을 것이라고 그는 말했습니다.

다른 과제도 있습니다. 블록 계층 추상화를 업스트림하는 데 약간의 저항이 발생했습니다. 가상 파일 시스템 계층 관리자인 Christian Brauner는 이러한 추상화를 병합하는 데 반대하지는 않지만 그렇게 하지 않고 바로 그 위에 파일 시스템이 구축되는 것을 보고 싶다고 말했습니다. 그는 모든 것이 예상대로 작동한다는 것을 보여주기 위해 바인더 드라이버 라인을 따라 상대적으로 간단한 구현을 보고 싶어합니다.

A driver soon?

Dave Airlie, the maintainer of the DRM (graphics) subsystem, said that, if he has his way, there will be a Rust DRM driver merged within the next couple of releases. Christoph Hellwig shot back that Airlie was willing to "make everybody's life hell" so that he could play with his favorite toy. Merging Rust, Hellwig said, would force others to deal with a second language, new toolchains, and "wrappers with weird semantics". Dan Williams said that the current situation "is what success looks like", and that the kernel community was already committed to Rust.

Airlie continued that a lot of the Rust work is currently blocked in a sort of chicken-and-egg problem. Abstractions cannot be merged until there is a user for them, but the code needing those abstractions is blocked waiting for code to land in multiple subsystems. As a result, developers working on Rust are dragging around large stacks of patches that they need to get their code to work. Breaking that roadblock will require letting in some abstractions without immediate users. Ojeda agreed that this problem has been slowing progress, but said he has tried not to put pressure on maintainers to merge code quickly. In the case of networking, ironically, the Rust developers had to ask the networking maintainers to slow down merging Rust code.

The conversation took several directions from there. Greg Kroah-Hartman said that merging the binder driver would be a good next step; it is self-contained, has a single user that is committed to its maintenance, and doesn't touch the rest of the kernel. Kees Cook disputed the description of Rust as a "toy", saying that there is a lot of pressure to not use C for new code; Hellwig responded that the developers would have to rewrite everything in Rust, otherwise the resulting dual-language code base would be worse than what exists now.

Dave Chinner worried that maintainers lack the expertise to properly review the abstractions that are being merged. Airlie replied that maintainers merge a lot of C APIs now without really understanding how they work. A lot of mistakes have been made in the process, but "we're still here". When things turn out to be broken, they can be fixed, and that will happen more quickly if the code goes upstream.

곧 드라이버?

3. DRM(그래픽) 하위 시스템의 관리자인 Dave Airlie는 자신이 원하는 대로 다음 릴리스에 Rust DRM 드라이버가 병합될 것이라고 말했습니다.

DRM(그래픽) 하위 시스템의 관리자인 Dave Airlie는 자신이 원하는 대로 다음 릴리스에 Rust DRM 드라이버가 병합될 것이라고 말했습니다. Christoph Hellwig는 Airlie가 자신이 가장 좋아하는 장난감을 가지고 놀 수 있도록 "모든 사람의 삶을 지옥으로 만들겠다"고 반격했습니다. Hellwig는 Rust를 병합하면 다른 사람들이 제2 언어, 새로운 툴체인, "이상한 의미를 가진 래퍼"를 다루도록 강요할 것이라고 말했습니다. Dan Williams는 현재 상황이 "성공의 모습"이며 커널 커뮤니티는 이미 Rust에 전념하고 있다고 말했습니다.

Airlie는 현재 많은 Rust 작업이 일종의 닭과 달걀 문제로 인해 막혀 있다고 계속 말했습니다. 추상화는 사용자가 있을 때까지 병합할 수 없지만 이러한 추상화가 필요한 코드는 코드가 여러 하위 시스템에 배치될 때까지 기다리면서 차단됩니다. 결과적으로 Rust를 작업하는 개발자들은 코드가 작동하도록 하는 데 필요한 대규모 패치 스택을 끌어다 놓고 있습니다. 이러한 장애물을 깨려면 즉각적인 사용자 없이 일부 추상화를 허용해야 합니다. Ojeda는 이 문제로 인해 진행 속도가 느려지고 있다는 데 동의했지만 관리자에게 코드를 신속하게 병합하라는 압력을 가하지 않으려고 노력했다고 말했습니다. 네트워킹의 경우 아이러니하게도 Rust 개발자는 네트워킹 관리자에게 Rust 코드 병합 속도를 늦추도록 요청해야 했습니다.

대화는 거기에서 여러 방향으로 진행되었습니다. Greg Kroah-Hartman은 바인더 드라이버를 병합하는 것이 좋은 다음 단계가 될 것이라고 말했습니다. 이는 독립적이고 유지 관리에 전념하는 단일 사용자를 가지며 커널의 나머지 부분을 건드리지 않습니다. Kees Cook은 Rust를 "장난감"으로 묘사하는 것에 대해 이의를 제기하면서 새로운 코드에 C를 사용하지 말라는 압력이 많다고 말했습니다. Hellwig는 개발자가 Rust로 모든 것을 다시 작성해야 한다고 응답했습니다. 그렇지 않으면 결과적인 이중 언어 코드 기반이 현재 존재하는 것보다 더 나빠질 것입니다.

Dave Chinner는 관리자가 병합되는 추상화를 적절하게 검토할 전문 지식이 부족하다고 걱정했습니다. Airlie는 관리자들이 현재 작동 방식을 실제로 이해하지 못한 채 많은 C API를 병합한다고 답했습니다. 그 과정에서 많은 실수가 있었지만 '우리는 아직 여기에 있다'. 문제가 있는 것으로 판명되면 수정할 수 있으며 코드가 업스트림으로 올라가면 문제가 더 빨리 해결됩니다.

Ted Ts'o expressed concern about the burden that adding Rust code will place on maintainers. The Rust developers are setting higher standards than have been set in the past, he said. Getting good abstractions merged is one thing, but who is responsible for reviewing drivers, and how will tree-wide changes be handled? The Rust effort, he said, is getting to a point where it is impacting a growing part of the community.

Williams pointed out that the previous session had discussed how hard it is to get kernel subsystems to move to new APIs; now, he said, there is talk of moving to a whole new language. Hellwig said that the real problem is that the Rust bindings tend to work differently than the C APIs they provide abstractions for; the new APIs may well be better, but they are still completely new APIs. What should be done, he said, is to first fix the C APIs so that they are directly usable by Rust code. He proposed that, for each subsystem that is considering bringing in Rust code, a year or two should first be spent on cleaning up its APIs along those lines. Ojeda said that this kind of API improvement has already happened in some subsystems.

Linus Torvalds said that he was seeing a divide between the filesystem and driver maintainers. Developers on the filesystem side tend to be more conservative, while the driver world "is the wild west". Driver authors tend not to understand concurrency, he said, and a lot of the code there is broken and unfixable. So it is unsurprising that there is interest in bringing in a language that better supports the writing of correct and safe code.

Ted Ts'o는 Rust 코드를 추가하는 것이 관리자에게 부담이 된다는 우려를 표명했습니다. Rust 개발자들은 과거에 설정했던 것보다 더 높은 표준을 설정하고 있다고 그는 말했습니다. 좋은 추상화를 병합하는 것도 중요하지만 드라이버 검토는 누가 담당하며 트리 전체 변경 사항은 어떻게 처리됩니까? Rust의 노력은 커뮤니티의 점점 더 많은 부분에 영향을 미치는 지점에 도달하고 있다고 그는 말했습니다.

Williams는 이전 세션에서 커널 하위 시스템을 새로운 API로 이동하는 것이 얼마나 어려운지 논의했다고 지적했습니다. 이제 그는 완전히 새로운 언어로 전환하는 이야기가 있다고 말했습니다. Hellwig는 진짜 문제는 Rust 바인딩이 추상화를 제공하는 C API와 다르게 작동하는 경향이 있다는 것이라고 말했습니다. 새로운 API가 더 좋을 수도 있지만 여전히 완전히 새로운 API입니다. 그는 먼저 해야 할 일은 C API를 Rust 코드에서 직접 사용할 수 있도록 수정하는 것이라고 말했습니다. 그는 Rust 코드 도입을 고려 중인 각 하위 시스템에 대해 먼저 해당 라인에 따라 API를 정리하는 데 1~2년을 투자해야 한다고 제안했습니다. Ojeda는 이러한 종류의 API 개선이 이미 일부 하위 시스템에서 발생했다고 말했습니다.

Linus Torvalds는 파일 시스템과 드라이버 관리자 사이에 격차가 있다고 말했습니다. 파일 시스템 측면의 개발자는 보다 보수적인 경향이 있는 반면 드라이버 세계는 "미개척지"입니다. 드라이버 작성자는 동시성을 이해하지 못하는 경향이 있으며, 거기에 있는 코드 중 많은 부분이 손상되어 수정할 수 없다고 그는 말했습니다. 따라서 정확하고 안전한 코드 작성을 더 잘 지원하는 언어를 도입하는 데 관심이 있다는 것은 놀라운 일이 아닙니다.

Brauner said that Rust can help with a lot of problems, since the compiler can keep a lot of bugs from making it into the kernel. But he worried about whether there would be maintainer and development support for it a few years from now. Airlie again mentioned developers with out-of-tree code needed by Rust code; Cook answered that the people shepherding that code are maintainers, and that bringing it in would bring the maintainers with it. Airlie added that those maintainers are the sort of younger developers that the kernel community would like to attract.

Chinner said that he would like to see a reimplementation of the ext2 filesystem in Rust. It is a complete filesystem that makes wide use of the kernel's APIs, but it is still small enough to read and understand. If the Rust APIs can support an ext2 implementation, they will be enough to implement others as well. Meanwhile, the ext2 implementation would be good reference for maintainers, who could compare it to the C version.

Brauner는 컴파일러가 많은 버그가 커널에 들어가는 것을 막을 수 있기 때문에 Rust가 많은 문제를 해결하는 데 도움이 될 수 있다고 말했습니다. 하지만 그는 앞으로 몇 년 후에는 이에 대한 유지관리자와 개발 지원이 있을지 걱정했습니다. Airlie는 Rust 코드에 필요한 트리 외부 코드를 가진 개발자를 다시 언급했습니다. Cook은 그 코드를 관리하는 사람들이 관리자이고, 코드를 가져오면 관리자도 함께 따라오게 될 것이라고 대답했습니다. Airlie는 이러한 관리자가 커널 커뮤니티가 유치하고 싶어하는 일종의 젊은 개발자라고 덧붙였습니다.

4. Chinner는 Rust에서 ext2 파일 시스템이 다시 구현되는 것을 보고 싶다고 말했습니다.

Chinner는 Rust에서 ext2 파일 시스템이 다시 구현되는 것을 보고 싶다고 말했습니다. 이는 커널의 API를 광범위하게 사용하는 완전한 파일 시스템이지만 여전히 읽고 이해할 수 있을 만큼 작습니다. Rust API가 ext2 구현을 지원할 수 있다면 다른 API도 구현하기에 충분할 것입니다. 한편, ext2 구현은 C 버전과 비교할 수 있는 관리자에게 좋은 참고 자료가 될 것입니다.

Confidence

Ts'o asked when the community would feel enough confidence that it could have modules where the only implementation is in Rust. Binder could be a good start, he said, perhaps followed by a driver that sees wider use. Airlie said that he is considering a virtual graphics driver that reimplements an existing C driver. There is also the driver for Apple M1 GPUs. He is feeling a fair amount of pressure to get it upstream and is wondering if there is any reason why he should keep it out. After that, he would love to see a rewrite of the Nouveau driver for NVIDIA GPUs.

Arnd Bergmann said those drivers could be OK, but that it will be quite a bit longer before something like a keyboard driver could be merged; the toolchain just isn't ready, he said, for a driver what would be widely used. That led to a question about the frequent version upgrades being seen in the kernel, which moved to Rust 1.73.0 for 6.7. That upgrade process will eventually stop and a minimum Rust version will be set once the important features that the kernel depends on have stabilized. He said that he has been working to get the kernel code into the Rust continuous-integration tests to help ensure that it continues working as the compiler and language evolve.

Bergmann said that he didn't plan to look seriously at the language until it could be compiled with GCC. Torvalds answered that, while he used to find problems in the LLVM Clang compiler, now he's more likely to find problems with GCC instead; he now builds with Clang. Ojeda said that he is working on finding developer resources for gccrs; the project is currently sitting on over 800 out-of-tree patches and still has a lot of work to do on top of that. GCC support will be a while, he said.

Ts'o complained that the language still isn't entirely stable. This could be a particular problem for the confidential-computing community; they are concerned about security and, as a consequence, about backports to long-term-support kernels. But if those kernels are on different Rust versions, those backports will be problematic. Ojeda said that, while it is a "crazy idea", backporting the version upgrades could be considered. He doesn't think that the change rate will be high enough to be a problem, though.

신뢰

Ts'o는 커뮤니티가 Rust로만 구현된 모듈을 가질 수 있다는 충분한 자신감을 언제 느낄 수 있는지 물었습니다. 그는 바인더가 좋은 시작이 될 수 있으며 아마도 더 폭넓게 사용할 수 있는 드라이버가 뒤따를 것이라고 말했습니다. Airlie는 기존 C 드라이버를 재구현하는 가상 그래픽 드라이버를 고려하고 있다고 말했습니다. Apple M1 GPU용 드라이버도 있습니다. 그는 상류로 가져가야 한다는 상당한 압박감을 느끼고 있으며, 이를 유지해야 할 이유가 있는지 궁금합니다. 그 후 그는 NVIDIA GPU용 Nouveau 드라이버가 다시 작성되는 것을 보고 싶어합니다.

Arnd Bergmann은 이러한 드라이버는 괜찮을 수 있지만 키보드 드라이버와 같은 것이 병합되기까지는 꽤 오랜 시간이 걸릴 것이라고 말했습니다. 그는 툴체인이 드라이버에 널리 사용될 준비가 되어 있지 않다고 말했습니다. 이로 인해 6.7용 Rust 1.73.0으로 이동한 커널에서 자주 나타나는 버전 업그레이드에 대한 질문이 생겼습니다. 커널이 의존하는 중요한 기능이 안정화되면 업그레이드 프로세스가 결국 중단되고 최소 Rust 버전이 설정됩니다. 그는 컴파일러와 언어가 발전함에 따라 커널 코드가 계속 작동하는지 확인하기 위해 커널 코드를 Rust 연속 통합 테스트에 포함시키기 위해 노력해 왔다고 말했습니다.

Bergmann은 GCC로 컴파일될 때까지 언어를 진지하게 검토할 계획이 없다고 말했습니다. Torvalds는 이전에는 LLVM Clang 컴파일러에서 문제를 찾았지만 이제는 대신 GCC에서 문제를 찾을 가능성이 더 높다고 대답했습니다. 이제 그는 Clang으로 빌드합니다. Ojeda는 gccrs를 위한 개발자 리소스를 찾기 위해 노력하고 있다고 말했습니다. 이 프로젝트는 현재 800개 이상의 트리 외부 패치에 착수하고 있으며 그 외에도 여전히 해야 할 일이 많습니다. GCC 지원은 시간이 좀 걸릴 것이라고 그는 말했다.

Ts'o는 언어가 아직 완전히 안정적이지 않다고 불평했습니다. 이는 기밀 컴퓨팅 커뮤니티에 특별한 문제가 될 수 있습니다. 그들은 보안과 결과적으로 장기 지원 커널에 대한 백포트에 대해 우려하고 있습니다. 그러나 해당 커널이 다른 Rust 버전에 있는 경우 해당 백포트는 문제가 됩니다. Ojeda는 "미친 생각"이지만 버전 업그레이드를 백포트하는 것도 고려할 수 있다고 말했습니다. 하지만 그는 변화율이 문제가 될 만큼 높을 것이라고 생각하지 않습니다.

At the conclusion, Torvalds pointed out that there have been problems over the years with GCC changes breaking the kernel; the same will surely happen with Rust, but it will be the same thing in the end. The session, well over time, was brought to a halt at this point. Whether the kernel community has truly concluded that it is committed to Rust remains to be seen; there will almost certainly be pull requests adding significant Rust code in the near future.

결론적으로 Torvalds는 GCC 변경으로 인해 커널이 손상되는 문제가 수년에 걸쳐 발생했음을 지적했습니다. Rust에서도 똑같은 일이 일어날 것입니다. 그러나 결국에는 똑같은 일이 일어날 것입니다. 시간이 흘러 이 세션은 이 시점에서 중단되었습니다. 커널 커뮤니티가 Rust에 전념하고 있다고 진정으로 결론을 내렸는지 여부는 아직 밝혀지지 않았습니다. 가까운 미래에 상당한 Rust 코드를 추가하는 풀 요청이 있을 것이 거의 확실합니다.

가까운 미래에 상당한 Rust 코드를 추가하는 풀 요청이 있을 것이 거의 확실합니다.

----

리눅스와 러스트

리눅스에서의 러스트 업데이트: 버지니아 주 리치몬드에서 열린 리눅스 플럼버스 컨퍼런스에서 개발자 미겔 오제다가 리눅스 커널에서 러스트의 통합 상태에 대해 발표. 러스트는 시스코, 삼성, 캐노니컬과 같은 개발자 및 회사들의 지원을 받고 있음.


리눅스에 포함된 러스트: 러스트는 리누스 토발즈가 리눅스 6.1 릴리스에 승인한 이후 리눅스의 일부가 됐음. 이제 C 언어와 함께 리눅스 언어 툴체인의 중요한 부분이 되고 있음.


러스트의 장점: 러스트는 커널 구현을 위한 실용적인 언어로 여겨지며, 특히 C와 C++에서 발생하는 메모리 안전성 문제와 관련된 버그 및 보안 취약점을 줄일 수 있음.


도전과 진전: 러스트를 완전히 통합하기 위한 도전이 있으며, 리눅스에서 러스트 프로그래밍 도구 개발이 진행 중. 일부 리눅스 배포판은 이미 러스트를 지원하고 있음.


리눅스용 러스트 툴체인: 이에는 GCC codegen for rustc, GCC Front-End for Rust, Coccinelle for Rust 등이 포함됨. 각 툴체인은 개발의 다른 단계에 있으며, 일부는 아직 알파 단계.


러스트 포 리눅스 이니셔티브: 공식 웹사이트인 Rust for Linux는 리눅스에서 러스트와 관련된 모든 것을 위한 중심지가 됐음. 기존의 러스트 코드 브랜치는 사용 중지되었으며, rust-next와 rust-fixes와 같은 새로운 브랜치가 개발에 사용.


개발 중의 도전: 개발자들은 리눅스 커널 내에서 러스트의 데드락 문제와 러스트 버전의 리눅스 호환성 문제를 해결하고 있음.


LTS 리눅스 버전에 대한 러스트 관심: LTS(장기 지원) 버전의 리눅스에 러스트 지원을 백포팅하는 데 대한 관심이 증가하고 있지만, LTS 버전에서 백포트를 허용하지 않는 리눅스의 정책으로 인해 도전이 있음.


러스트 드라이버 실험: 일부 관리자들은 드라이버를 개발함으로써 러스트로 실험하는 것에 열려 있으며, 이는 중복 드라이버에 대한 규칙을 깨는 것을 의미할 수 있음.


녹
커널 내 Rust와 관련된 문서입니다. 커널에서 Rust를 사용하려면 빠른 시작 가이드를 읽어보세요.

러스트 실험
Rust 지원은 언어로서의 Rust가 커널에 적합한지, 즉 절충할 가치가 있는지 결정하는 데 도움을 주기 위해 v6.1에서 메인라인으로 병합되었습니다.

현재 Rust 지원은 주로 Rust 지원에 관심이 있는 커널 개발자와 유지관리자를 대상으로 합니다. 이를 통해 이들이 추상화 및 드라이버 작업을 시작할 수 있을 뿐만 아니라 인프라 및 도구 개발을 지원할 수 있습니다.

최종 사용자라면 현재 프로덕션 용도로 적합하거나 의도된 트리 내 드라이버/모듈이 없으며 특히 특정 커널 구성에 대한 Rust 지원이 아직 개발/실험 단계에 있다는 점을 참고하세요.

이 문서에는 Rustdoc에서 생성된 정보가 포함되어 있지 않습니다.





Rust 지원은 언어로서의 Rust가 커널에 적합한지, 즉 절충할 가치가 있는지 결정하는 데 도움을 주기 위해 v6.1에서 메인라인으로 병합되었습니다.

## 리눅스를 위한 러스트

Rust 지원은 언어로서의 Rust가 커널에 적합한지, 즉 절충할 가치가 있는지 결정하는 데 도움을 주기 위해 v6.1에서 메인라인으로 병합되었습니다. 다만, 현재 프로덕션 용도로 적합하거나 특정 커널 구성에 대한 러스트 지원이 아직 개발/실험 단계에 있다는 것을 유의해야 합니다.

최근에 새롭게 나온 많은 언어들에는 공통점이 몇 가지 존재하는데,

간결함과 표현력
널체크
타입추론 캐스팅
함수형 프로그래밍

지원이라는 유사한 공통 분모를 가집니다. 거기에 더하여 러스트는 

Memory Safety: 컴파일되는 모든 코드는 메모리 버그를 일으키지 않음, 가비지 컬렉터가 필요 없음

에 대한 장점을 가지고 있으며, 강력한 타입 시스템을 가지고 있습니다. 러스트의 탄생은 C의 대체재라기 보다는 C++의 대체제로 등장했는데, 어느 순간 커널을 빌드하기 위한 C의 자리까지 넘보는 것 같습니다. C/C++을 구현하다가 보면, 언제나 버그는 메모리와 관련이 있습니다. 상용의 큰 시스템들에 놓치기 쉬운 메모리 관련 버그를 컴파일 타임에 잡아 준다는 것은 매우 매력적이랍니다.

어찌, 가까운 미래에 러스트 언어로 가득한 커널 코드를 보게 될 듯 한데, 아기자기하게 메모리 버그도 내놓고, 명시적으로 자원 해제하는 즐거움이 사라지는 듯 해서 기쁜 소식인 듯, 아닌 듯 하네요.

프로그래밍의 묘미는 버그를 내고 그 버그를 찾아서 고치는 것 같았는데, 🤪

https://docs.kernel.org/rust/index.html












러스트 재단에서 개발되고 있는 메모리 안전성과 성능 및 편의성에 중점을 둔 프로그래밍 언어. 가비지 컬렉터 없이 메모리 안전성을 제공하는 대표적인 언어다. C++의 대체재로써 등장했다.

모질라 재단에서 2010년 7월 7일에 처음 발표했으며, 2015년 5월 15일에 안정 버전이 정식 발표된 이후, 2021년 2월부터는 러스트 재단으로 분리되어 AWS, Google, 화웨이, MS, 모질라 재단을 초기 회원사로 발족했다.

이 언어를 대표하는 키워드 몇 개를 나열해보면 안전성, 속도, 병렬 프로그래밍, 함수형 프로그래밍, 시스템 프로그래밍이 있다. Go보다는 반 년 늦게 나왔지만[1] 그나마 비슷한 시기에 등장했다는 점과 두 언어 모두 C/C++를 서로 다른 방향에서 대체하려 한다는 점 때문에 라이벌 관계로 엮이기도 한다.

온라인상으로 표준 라이브러리 기반의 코드를 실행해볼 수 있다. #

Rust의 비공식 마스코트[2]도 있는데, 이름은 페리스(Ferris)다. 밝은 주황색의 게 모양을 하고 있으며, 러스트 관련 커뮤니티나 미디어에서 자주 등장한다.[3] 또한 이 페리스 때문에 Rust 개발자는 스스로를 Rustacean[4][5]이라고 자칭한다.




가비지 수집 및 관련 기능이 C++23에서 제거됩니다. C++ 표준이 GC를 지원한다는 사실에 놀랐다면 여러분만 그런 것이 아닙니다. 구현되지 않았고 혼란스럽고 꽤 쓸모가 없었으므로 제거되었습니다. 대부분 다른 언어의 런타임으로 C++로 작성된 VM용 기존 가비지 수집기가 있지만 제거되는 이유 때문에 표준에 의존하지 않기 때문에 영향을 받지 않습니다.

표준에 대한 약간의 단순화는 결코 나쁠 것이 없습니다.



https://rust-for-linux.com/

