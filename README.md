# 블록체인 시각화 프로젝트
---
> 프로젝트 기간 : 2022-01-05 ~ 2021-01-19

## 팀원 / [김동욱](https://github.com/pier101) , [이동녘](https://github.com/dongnycklee)
 
## 1. 기획 의도
 - 마이닝, 지갑 생성, UTXO 등의 기능을 구현해봄으로써 POW (proof of work) 방식에 대한 이해도 향상

## 2. 프로젝트 목표
 - 노드(서버) 생성시 지갑 생성
 - 노드간 websocket 통신
 - POW 합의 알고리즘을 통해 노드간 체인 길이에 따른 체인교체,삭제 구현
 - unspent transaction output 의 역할을 이해하고 트랜잭션 흐름 파악.

## 3. 개발 환경
  #### 3-1. Front-end / `React`, `NextJS`, `Javascript`
  #### 3-2. Back-end / `NodeJS`, `Express`, `MySQL`, `MariaDB`
  #### 3-3. For Development / `Ubuntu`, `VScode`


## 4. 주요기능
# 3. 페이지 구성
| 페이지 | 화면 | 설명 |
| --- | --- | --- |
| **전체페이지** | ![ProjectMain2](https://user-images.githubusercontent.com/85658044/167235863-14d5a000-e8ad-4271-b38a-b03eda416bc7.png) | 전체 페이지 |
| **노드현황** | ![노드현황](https://user-images.githubusercontent.com/85658044/167235913-5b4f903a-c683-4115-94fd-10e3a394dbdf.png) | node 표시 |
| **지갑연결 & 채굴** | ![지갑주소,채굴버튼](https://user-images.githubusercontent.com/85658044/167235953-f4a71703-27e9-4761-8761-f46d091640cd.png) | 생성된 지갑 주소 확인 <br/> & mining 버튼 |
| **블록넘버 & node 연결** | ![블록넘버,접속노드](https://user-images.githubusercontent.com/85658044/167235936-7233a774-e4e3-4b89-9533-d54bbcfbfec1.png) | 현재 node의 블록 길이 <br/> & 연결된 node |
| **블록 채굴 현황** |![실시간 블록현황](https://user-images.githubusercontent.com/85658044/167235944-0a92a0ff-e525-4498-b97e-9b1711fa7e7c.png) |실시간 블록 채굴 현황
| **채굴 보상 전송** | ![채굴보상 전송](https://user-images.githubusercontent.com/85658044/167236175-810f9c8e-5c5f-43f2-8945-cb324d6fb11c.png) | 채굴 보상 특정 지갑에 전송 |
| **트랜잭션풀** | ![트랜잭션 풀](https://user-images.githubusercontent.com/85658044/167235959-4aaa369d-daa1-48fb-9096-362916b90af9.png) | 채굴 되지 않은 트랜잭션 풀에 저장 |
