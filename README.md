# 📑 DocMate
<img width="350" alt="Image" src="https://github.com/user-attachments/assets/7e3004e9-35df-47e4-8193-4162b19d63ec" /> </br>
### 할 일 관리, 프로젝트 관리, 협업까지 한 곳에서! 독메이트로 효율적인 업무를 경험하세요.
</br>




## 🛠️ Tech Stack

### Node.js Version

`v23.11.0`

| 역할                       | 종류                                                                                                                                                                                                                                                                                                                    |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`Programming Language`** | ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) |                                                                                                                                                                                              |                         |
| **`Data Fetching`**        | ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=Axios&logoColor=white)                                                                                              |
| **`Formatting`**           | ![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white) ![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=white)  |
| **`Version Control`**      | ![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white) ![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)                                                                                                        |

<br />

## 🚶🚶‍♀️ 팀원 소개 

| 남윤서 | 김은지 | 송지은 | 유강민 | 이준수 | 이준호 |
|:--:|:--:|:--:|:--:|:--:|:--:|
| <img width="130px" src="https://avatars.githubusercontent.com/u/158164219?v=4" /> | <img width="130px" src="https://github.com/user-attachments/assets/4f803409-8979-454d-97f3-df8171225aaf" /> | <img width="130px" src="https://github.com/user-attachments/assets/1e8272aa-8254-40b3-bd30-a37bbf1db577" /> | <img width="130px" src="https://avatars.githubusercontent.com/u/145523906?v=4" /> | <img width="130px" src="https://avatars.githubusercontent.com/u/75468984?v=4" /> | <img width="130px" src="https://github.com/user-attachments/assets/ab18c001-6f75-4c10-80e5-2436544fb543" /> |
| [@nam yoonseo](https://github.com/ysnam0123) | [@keemeunji](https://github.com/keemeunji) | [@jieun22222](https://github.com/jieun22222) | [@dkawoindsa](https://github.com/dkawoindsa) | [@dlakrp123](https://github.com/dlakrp123) | [](https://github.com/) |


<br>





## 📭 Git Convention

### Git Flow

```
# 메인 브랜치(Main branch)
main(master)
`main` 브랜치는 배포 가능한 상태만을 관리해요.

# develop
`develop` 브랜치는 통합 브랜치 역할을 하며, 평소에는 해당 브랜치를 기반으로 개발을 진행해요.
모든 기능이 정상적으로 동작할 수 있는 안정적인 상태를 유지하고,
배포가 가능한 상태라면 `main`브랜치에 `merge` 해요.

# 피쳐 브랜치(Feature branch)
develop 브랜치에서 분기
develop 브랜치로 merge
```

### Commit Convention

| 커밋 유형   | 깃모지 | 의미                                         |
| :---------- | :-----: | :-------------------------------------------- |
| `feat`     | ✨      | 새로운 기능 추가                             |
| `refactor` | 🔨      | 코드 리팩토링                                |
| `fix`      | 🐛      | 버그 수정                                    |
| `chore`    | 📦      | 패키지 매니저, 설정 세팅                     |
| `init`     | 🌱      | 초기 세팅 및 종속성 추가 관련                |
| `docs`     | 📝      | 문서 수정                                    |
| `design`   | 🎨      | CSS 및 UI 변경                               |
| `style`    | 💄      | 코드 포맷팅, 세미콜론 누락 등 코드 변경 없음 |
| `test`     | ✅      | 테스트 코드, 리팩토링 테스트 코드 추가       |

**커밋 메시지 예시:**

*   `feat: ✨ 사용자 인증 기능 추가`
*   `fix: 🐛 잘못된 날짜 형식 문제 해결`
*   `docs: 📝 README 설치 방법 업데이트`



<br />



## 🗂️ Foldering

```
📂 DocMate
├── 📂 assets
│   ├── 📂 css
│   │   ├── 📜 reset.css      # 기본 리셋 스타일
│   │   ├── 📜 style.css      # 전체 스타일
│   │   └── 📜 theme.css      # 다크/라이트 모드 스타일
│   ├── 📂 js
│   │   ├── 📜 app.js         # 메인 애플리케이션 로직
│   │   ├── 📜 router.js      # 라우팅 처리
│   │   ├── 📜 view.js        # UI 업데이트 및 렌더링
│   │   ├── 📜 api.js         # API 호출
│   │   └── 📜 utils.js       # 유틸리티 함수
│   └── 📂 images           # 이미지 파일
│       ├── 🖼️ logo.png
│       ├── 🖼️ background.jpg
│       └── 📂 icons
├── 📂 components       # 재사용 가능한 HTML 조각
│   ├── 📜 button.html
│   ├── 📜 input.html
│   └── ...
├── 📂 views            # 페이지별 HTML 템플릿 (라우팅 대상)
│   ├── 📜 home.html       # 메인 페이지
│   ├── 📜 dashboard.html
│   ├── 📜 settings.html
│   └── 📜 about.html
├── 📜 index.html         # 메인 페이지 (SPA 진입점)
└── 📜 README.md          # 프로젝트 설명 파일

