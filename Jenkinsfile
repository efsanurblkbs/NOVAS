pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                echo 'Kodlar çekiliyor...'
                checkout scm
            }
        }
        stage('Docker Build') {
            steps {
                echo 'Docker imajları hazırlanıyor...'
                // Hem 'docker-compose' hem 'docker compose' deniyoruz hangisi varsa o çalışır
                sh 'docker-compose build --no-cache || docker compose build --no-cache'
            }
        }
        stage('Deploy') {
            steps {
                echo 'NOVAS ayağa kalkıyor...'
                sh 'docker-compose up -d || docker compose up -d'
            }
        }
    }
    post {
        always { echo 'İşlem bitti.' }
    }
}