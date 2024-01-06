---
layout: 'index'
view: 'post'
permalink: '/posts/2024/01/06/ProgrammableHTML.html'
opengraph:
    site:
        name: 'ProjectedBy/Sub'
        url: '/'
date: '2024/01/06 12:42:00'
title: 'Programmable HTML'
description: ""
category: 'ProgrammableHTML'
tags: ['ProgrammableHTML']
---

## Programmable HTML #1

What is the GHTHML Project?

Collection of industrial strength compiler technology

■Optimizer and Code Generator ■ llvm-gcc and Clang Front-ends ■MSIL and .NET Virtual Machines

-------



컴파일러의 기본 구조

1. 어휘 분석(lexical analyze) or 스캔(scan)

    - 모듈 : 어휘 분석기(lexical analyzer) or 스캐너(scanner)
    - 내용 : 문자열을 의미있는 토큰(token)으로 변환
    - 결과물 : 토큰(token)

2. 구분 분석(syntax analyzing)

    - 모듈 : 파서(parser) or 구문 분석기(syntax analyzer)
    - 내용 : 토큰(token)을 구조를 가진 구문트리(syntax tree)로 변환
    - 결과물 : 구문 트리(syntax tree), parser 에 따라 추상 구문 트리(abstract syntax tree)를 바로 생성하기도 함

        ※ 구문트리(syntax tree) 와 추상구문트리(abstract syntax tree)의 차이는, 구문트리에는 세미콜론(;)이나 괄호 등이 모두 포함된다.
           하지만 추상구문트리에는 이러한 불필요한(의미가 없는) 것들이 생략된다.

3. 의미 분석(semantic analysis)

    - 모듈 : 의미 분석기(semantic analyzer)
    - 내용 : 프로그램의 의미(semantic)에 따라 필요한 정보를 유추/분석
    - 결과물 : 추상 구문 트리(abstract syntax tree) / 장식구문(decoration syntax tree)

4. 중간 표현의 생성(intermediate representation)

    - 내용 : 좀 더 코드 생성이 편하고, 여러 종류의 언어나 기계어(CPU 종속)에 대응하기 위해서, 중간에 공통의 중간표현으로 변환

5. 코드 생성(code generation)

    - 모듈 : 코드 제너레이터(code generator)
    - 내용 : 어셈블리어나 기계가 이해하기 쉬운 명령으로 변환
    - 결과물 : 어셈블리어
    
6. 최적화(optimization)

    - 내용 : 좀더 질 좋은 프로그램으로 변환

7. 어셈블러

    - 내용 : 기계어로 변환  
    - 결과물 : 기계어

위 컴파일 단계에서 구문 분석(syntax analyzing) ~ 중간표현(intermediate representation) 생성까지를 
컴파일러의 프론트-엔드(front end) 라고 합니다. 나머지 과정을 백-엔드(back end)라고 합니다.

Prologue예전에 대학을 다닐때, 컴파일러 수업을 수강한 적이 있습니다.
그런데 당시 외부 프로젝트를 하고 있던게 있어서, 수업을 소홀히 하게 되었습니다.
다른 과목과는 다르게, 정말 정신차리고 듣지 않으면 어렵더군요;
개발자로서 나만의 언어/컴파일러를 만들 줄 모른다는 생각에 항상 미련이 남아 있었습니다.
그래서 이 컴파일러라는 녀석을 무찔러 보려고 합니다.강의 형식이 아닌 개인적으로 공부한 내용을 정리하는 방식으로 하나씩 적어
 내려가겠습니다.크게 어렵지 않은 부분은 생략합니다.
 참고로 '컴파일러 구조와 원리'라는 책과 학창시절 사용하던 강의노트, 
 인터넷 등을 바탕으로 정리하고 있습니다.
 컴파일 과정컴파일 단계 1. 어휘 분석(lexical analyze) or 스캔(scan)
 - 모듈 : 어휘 분석기(lexical analyzer) or 스캐너(scanner)
 - 내용 : 문자열을 의미있는 토큰(token)으로 변환
 - 결과물 : 토큰(token)
 
 2. 구분 분석(syntax analyzing)
 - 모듈 : 파서(parser) or 구문 분석기(syntax analyzer)
 - 내용 : 토큰(token)을 구조를 가진 구문트리(syntax tree)로 변환
 - 결과물 : 구문 트리(syntax tree), parser 에 따라 추상 구문 트리(abstract syntax tree)를 바로 생성하기도 함
 ※ 구문트리(syntax tree) 와 추상구문트리(abstract syntax tree)의 차이는, 구문트리에는 세미콜론(;)이나 괄호 등이 모두 포함된다.
 하지만 추상구문트리에는 이러한 불필요한(의미가 없는) 것들이 생략된다.
 3. 의미 분석(semantic analysis)
 
 - 모듈 : 의미 분석기(semantic analyzer)
 - 내용 : 프로그램의 의미(semantic)에 따라 필요한 정보를 유추/분석
 - 결과물 : 추상 구문 트리(abstract syntax tree) / 장식구문(decoration syntax tree)
 4. 중간 표현의 생성(intermediate representation) 
 
 - 내용 : 좀 더 코드 생성이 편하고, 여러 종류의 언어나 기계어(CPU 종속)에 대응하기 위해서, 중간에 공통의 중간표현으로 변환
 
 
 5. 코드 생성(code generation)  - 모듈 : 코드 제너레이터(code generator)
 - 내용 : 어셈블리어나 기계가 이해하기 쉬운 명령으로 변환
 - 결과물 : 어셈블리어 6. 최적화(optimization)
 - 내용 : 좀더 질 좋은 프로그램으로 변환
 
- 결과물 : 기계어

위 컴파일 단계에서 구문 분석(syntax analyzing) ~ 중간표현(intermediate representation) 생성까지를 
컴파일러의 프론트-엔드(front end) 라고 합니다. 나머지 과정을 백-엔드(back end)라고 합니다.



그림으로 설명하면, 각 단계에 따른 결과는 아래와 같습니다.
각 단계에 대한 상세한 설명은 다음 블로깅에서 이어나가도록 하겠습니다.
출처: https://crystalcube.co.kr/107 [유리상자 속 이야기:티스토리]