pipeline {
    agent any

    environment {
        DOCKER_USER = credentials('dockerhub-username')
        DOCKER_PASS = credentials('dockerhub-password')
        TEST_REPO = "https://github.com/kjhassan/Web-ChatApp-Tests.git"
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '5'))
        timestamps()
    }

    stages {
        stage('Checkout App Code') {
            steps {
                checkout scm
                sh 'rm -rf tests || true'
            }
        }

        stage('Clone Test Repo') {
            steps {
                sh '''
                git clone ${TEST_REPO} tests
                '''
            }
        }

        stage('Build Test Image & Run Selenium') {
            steps {
                sh '''
                cd tests
                docker build -t chat-tests .
                docker run --rm chat-tests
                '''
            }
            post {
                always {
                    junit 'tests/report.xml'
                }
            }
        }

        stage('Build App Docker Image') {
            steps {
                sh '''
                docker build -t chatapp:latest -f backend/Dockerfile .
                '''
            }
        }

        stage('Push to DockerHub') {
            steps {
                sh '''
                echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                docker tag chatapp:latest $DOCKER_USER/chatapp:latest
                docker push $DOCKER_USER/chatapp:latest
                '''
            }
        }

        stage('Deploy to EC2') {
            steps {
                sh '''
                ssh -o StrictHostKeyChecking=no ubuntu@YOUR_EC2_PUBLIC_IP "
                  docker pull $DOCKER_USER/chatapp:latest &&
                  docker stop chatapp || true &&
                  docker rm chatapp || true &&
                  docker run -d --name chatapp -p 5000:5000 $DOCKER_USER/chatapp:latest &&
                  docker system prune -af
                "
                '''
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}













// pipeline {
//     agent any

//     environment {
//         COMPOSE_FILE = 'docker-compose.yml'
//     }

//     stages {
//         stage('Checkout') {
//             steps {
//                 echo 'Pulling code from GitHub...'
//                 git branch: 'main', url: 'https://github.com/kjhassan/Web-ChatApp.git'
//             }
//         }

//         stage('Build and Run Containers') {
//             steps {
//                 echo 'Starting containerized environment...'
//                 sh 'docker-compose down || true'
//                 sh 'docker-compose up -d'
//             }
//         }

//         stage('Verify') {
//             steps {
//                 echo 'Checking running containers...'
//                 sh 'docker ps'
//             }
//         }
//     }

//     post {
//         success {
//             echo 'Pipeline executed successfully! Environment is up.'
//         }
//         failure {
//             echo 'Pipeline failed. Please check logs.'
//         }
//     }
// }
