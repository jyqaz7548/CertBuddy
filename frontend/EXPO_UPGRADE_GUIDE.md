# Expo SDK 54 업그레이드 가이드

## 문제 해결 단계

터미널에서 다음 명령어를 순서대로 실행하세요:

### 1. 기존 node_modules 삭제
```bash
cd frontend
rmdir /s /q node_modules
del package-lock.json
```

또는 PowerShell에서:
```powershell
cd frontend
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
```

### 2. package.json 확인
`package.json`에서 `expo` 버전이 `~54.0.0`인지 확인하세요.

### 3. 의존성 재설치
```bash
npm install
```

### 4. Expo SDK 54에 맞는 패키지 버전으로 수정
```bash
npx expo install --fix
```

### 5. 서버 실행
```bash
npx expo start
```

---

## 만약 여전히 문제가 발생한다면

### 방법 1: Expo 업그레이드 명령어 사용
```bash
npx expo install expo@latest
npx expo install --fix
```

### 방법 2: 수동으로 package.json 수정 후 재설치
1. `package.json`에서 expo 버전 확인 (`~54.0.0`)
2. `node_modules` 삭제
3. `npm install` 실행
4. `npx expo install --fix` 실행
