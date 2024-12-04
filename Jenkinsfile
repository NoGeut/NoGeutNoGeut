pipeline {
    agent any

    stages {
        stage('Clone repository') {
            steps {
                git branch: 'main', url: 'https://github.com/yeonju000/NoGeutNoGeut.git'
            }
        }

        stage('Build image') {
            steps {
                script {
                    app = docker.build("yeonju7547/open2024")
                }
            }
        }

        stage('Test image') {
            steps {
                script {
                    app.inside {
                        sh 'npm install'  // 의존성 설치
                    }
                }
            }
        }

        stage('Push image') {
            when {
                branch 'main'  // master 브랜치일 경우에만 실행
            }
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'yeonju7547') {
                        app.push("${env.BUILD_NUMBER}") // 빌드 번호 태그
                        app.push("latest")              // latest 태그.
                    }
                }
            }
        }
    }
}

