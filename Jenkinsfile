pipeline {
    agent any

    environment {
        COMPOSE_FILE = 'docker-compose.yml'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Pulling code from GitHub...'
                git branch: 'main', url: 'https://github.com/kjhassan/Web-ChatApp.git'
            }
        }

        stage('Build and Run Containers') {
            steps {
                echo 'Starting containerized environment...'
                sh 'docker-compose down || true'
                sh 'docker-compose up -d'
            }
        }

        stage('Verify') {
            steps {
                echo 'Checking running containers...'
                sh 'docker ps'
            }
        }
    }

    post {
        success {
            echo 'Pipeline executed successfully! Environment is up.'
        }
        failure {
            echo 'Pipeline failed. Please check logs.'
        }
    }
}
