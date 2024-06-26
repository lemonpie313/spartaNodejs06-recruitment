# 채용 서비스 백엔드 서버

## API 명세서
![ex_screenshot](./API.png)
https://taropie313.notion.site/=Node-js-API-e3ec13d5f4944246a2cd1ec939c0afd2

## ERD
![ex_screenshot](./ERD_edited.png)
https://drawsql.app/teams/own-64/diagrams/spartanodejs04-resume

## 프로젝트 소개
express.js, mySQL을 이용하여 채용 서비스 백엔드 서버를 구현하여 이력서 작성, 조회, 수정, 삭제가 가능하도록 하였다.

## 코드 설명
회원가입과 로그인을 제외한 모든 기능은 로그인 된 사용자(AccessToken 보유)에 한해 접근 가능하다.
### 1. 미들웨어
- **auth.middleware.js** : AccessToken 인증 미들웨어로, 회원정보 조회, 이력서 작성, 조회, 수정, 삭제 등에 사용된다. 사용자의 id와 역할을 반환한다. 인증에 실패할 시 사용자의 토큰을 삭제한다.

- **error-handelr.middleware.js** : 에러 핸들러 미들웨어로, 예상하지 못한 에러가 발생했을 때 에러를 발생시키는 미들웨어이다.

- **role.middleware.js** : 역할 인가 미들웨어로, 이력서 상태 수정과 같이 역할이 ```RECRUITER```인 사용자만 접근 가능하거나, 혹은 이력서 작성과 같이 역할이 ```APPLICANT```인 사용자만 접근 가능한 기능을 구현할 때 사용된다. 사용자의 id를 반환한다.

- **token.middleware.js** : RefreshToken 인증 미들웨어로, AccessToken 재발급 및 로그아웃에 사용된다. 사용자의 id, 토큰, 만기일을 반환한다. 인증에 실패할 시 사용자의 토큰을 삭제한다.

### 2. 라우터
#### 1) auth.router.js
- **post - /auth/sign-up** : 이메일주소, 비밀번호, 비밀번호 확인, 이름을 전달받으면 사용자 정보가 등록되는 회원가입의 기능을 한다. 입력값이 조건에 맞을 경우에만 회원가입이 가능하며, 중복된 이메일주소는 사용할 수 없다.

- **post - /auth/sign-in** : 이메일주소, 비밀번호를 전달받으면 해당 정보가 일치하는 사용자의 id로 AccessToken과 RefreshToken을 발급받는 로그인의 기능을 한다. 

- **post - /auth/refresh** : 사용자가 보유하고 있는 RefreshToken을 전달받으면, RefreshToken과 AccessToken을 갱신할 수 있다. 갱신된 RefreshToken은 hash되어 db에 업데이트된다.

- **delete - /auth/log-out** : 사용자가 보유하고 있는 RefreshToken과 AccessToken을 삭제하여 더이상 기능을 사용할 수 없도록 하는 로그아웃 기능을 한다. 로그아웃 한 뒤 RefreshToken은 db에서도 삭제된다.

#### 2) users.router.js
- **get - /user** : 로그인 된 사용자의 상세정보를 조회할 수 있다.

#### 2) resume.router.js
- **post - /resumes** : 이력서의 제목과 내용을 전달받으면 이력서를 db에 저장하는 기능을 한다. 내용은 150자 이상 작성해야 하며, 역할이 ```APPLICANT```인 사용자만 접근할 수 있다.

- **get - /resumes** : 이력서의 목록을 조회하는 기능을 한다. 역할이 ```APPLICANT```일 경우 자신이 작성한 이력서만 조회할 수 있으며, 역할이 ```RECRUITER```일 경우 모든 사용자의 이력서를 조회할 수 있다.

- **get - /resumes/:id** : params의 id값에 해당하는 이력서의 상세 내용을 조회할 수 있다. 역할이 ```APPLICANT```일 경우 자신이 작성한 이력서만 조회할 수 있으며, 역할이 ```RECRUITER```일 경우 자신이 작성한 이력서가 아니어도 조회할 수 있다.

- **patch - /resumes/:id** : body를 통해 제목과 내용을 전달받으면 해당하는 이력서를 수정할 수 있다. 역할이 ```APPLICANT```인 사용자만 접근이 가능하며, 자신이 작성한 이력서일 경우에만 수정이 가능하다.

- **delete - /resumes/:id** : params의 id값에 해당하는 이력서를 삭제할 수 있다. 역할이 ```APPLICANT```인 사용자만 접근이 가능하며, 자신이 작성한 이력서일 경우에만 삭제가 가능하다. 

- **patch - /resumes/recruiter/:id** : 이력서의 상태와 변경사유를 전달받으면 해당 이력서의 상태를 수정하는 기능을 한다. 역할이 ```RECRUITER```인 사용자만 접근할 수 있다.
- **get - /resumes/recruiter/:id** : params의 id값에 해당하는 이력서의 상태 수정내역을 조회할 수 있다. 역할이 ```RECRUITER```인 사용자만 접근할 수 있다.


### 3. Controller / Service / Repository
- **Controller** : 클라이언트로부터 request를 받고 response를 전달한다.
- **Service** : 전달받은 request를 바탕으로 비즈니스 로직을 수행한 뒤 결과를 반환한다.
- **Repository** : Service 계층에서 Database와의 접촉이 필요할 경우 Repository에서 Database 생성, 조회, 수정, 삭제 등의 역할을 한다.

## 문제 발생 및 해결
### 1. 레이어 분리 후 에러 처리
3-Layered-Architectrue로 라우터를 분리한 후, 모든 에러처리는 Controller 계층에서 이뤄져야 한다는 점에서 어려움을 겪었다.
#### 1) Service 계층 에러처리
Service 계층에서 발생한 에러를 모두 ```throw new Error ('에러메시지')``` 방식으로 처리를 한 결과, 콘솔창에만 에러메시지가 출력되고 API Client에서는 확인이 되지 않았다.

따라서, error 폴더에 http-error.js 라는 파일에 http-status별로 에러 status와 message를 생성할 수 있는 클래스를 만들어 export하였다. 이 클래스는 service 계층에서 import 받아, ```throw new Error ('에러메시지')```로 에러를 발생시키는 것이 아닌, ```throw new HttpStatus.클래스명('에러메시지')``` 형태로 에러를 throw 하여 에러처리 미들웨어에서 에러를 처리할 수 있도록 하였다.

#### 2) 인증/인가 미들웨어 에러처리
이전에는 미들웨어에서 직접 에러를 response로 반환시켰으나, 레이어를 분리한 후 1)과 같이 에러를 throw해주어야 했다.

1)과 마찬가지로, ```res.status(상태코드).json(message: '에러메시지')``` 형식으로 에러를 발생시키는 것이 아니라, ```throw new HttpStatus.클래스명('에러메시지')``` 형태로 에러를 throw 시켰다. 또한, 미들웨어의 catch(err)에서 처리하는 예외처리 부분은 모두 지우고 ```next(err)```로 넘겨준 뒤, 이 역시 에러처리 미들웨어에서 한번에 처리할 수 있도록 하였다.