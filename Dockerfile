# Base image 선택
FROM node:18

# 작업 디렉토리 생성
WORKDIR /nogeut

# 필수 패키지 설치
RUN apt-get update && apt-get install -y \
    curl \
    git \
    && apt-get clean

# 'NogeutNoGeut' 폴더에서 package.json 파일 복사 후 의존성 설치
COPY ./package*.json /nogeut/

# 의존성 설치
RUN npm install

# 'NogeutNoGeut' 폴더의 모든 파일 복사
COPY . /nogeut

# 포트 3030에서 애플리케이션 실행
EXPOSE 3030

# 애플리케이션 실행
CMD ["node", "main.js"]

