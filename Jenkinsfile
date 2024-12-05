pipeline {
    agent any
    environment {
        PROJECT_ID = 'open-440917'       // GCP 프로젝트 ID
        CLUSTER_NAME = 'k8s'                  // GKE 클러스터 이름
        LOCATION = 'asia-northeast3-a'         // 클러스터 위치
        CREDENTIALS_ID = '56c1a024-6364-4e52-9008-344ed61ff6bf'     // GCP 인증 정보 (Jenkins에서 설정한 Google 서비스 계정 키 파일)
        DOCKER_IMAGE = 'yeonju7547/open2024:${BUILD_ID}'  // Docker 이미지 이름
    }
    stages {
        stage("Checkout code") {
            steps {
                script {
                    // Git 리포지토리에서 코드를 체크아웃합니다.
                    git url: 'https://github.com/yeonju000/NoGeutNoGeut.git', branch: 'main'
                }
            }
        }

        stage("Build image") {
            steps {
                script {
                    // Docker 이미지를 빌드합니다.
                    sh "docker build -t yeonju7547/open2024:${BUILD_ID} ."
                }
            }
        }

        stage("Push Docker image") {
            steps {
                script {
                    // Docker Hub에 이미지를 푸시합니다.
                    withDockerRegistry([credentialsId: 'yeonju7547', url: 'https://index.docker.io/v1/']) {
                        sh "docker push yeonju7547/open2024:${BUILD_ID}"
                    }
                }
            }
        }

        stage('Deploy to GKE') {
            steps {
                script {
                    // 배포 전에 deployment.yaml 파일의 이미지를 최신 빌드 ID로 교체합니다.
                    sh "sed -i 's/yeonju7547\\/open2024:latest/yeonju7547\\/open2024:${BUILD_ID}/g' deployment.yaml"

                    // Kubernetes Engine에 배포합니다.
                    step([$class: 'KubernetesEngineBuilder',
                          projectId: env.PROJECT_ID,
                          clusterName: env.CLUSTER_NAME,
                          location: env.LOCATION,
                          manifestPattern: 'deployment.yaml',
                          credentialsId: env.CREDENTIALS_ID,
                          verifyDeployments: true])
                }
            }
        }
    }
    post {
        always {
            // 항상 실행되는 부분
            echo "Pipeline completed."
        }
        success {
            // 성공 시 실행되는 부분
            echo "Pipeline succeeded!"
        }
        failure {
            // 실패 시 실행되는 부분
            echo "Pipeline failed."
        }
    }
}
