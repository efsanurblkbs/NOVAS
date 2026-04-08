pipeline {
    agent any

    stages {
       
        stage('Checkout') {
            steps {
                echo 'Kodlar GitHubdan çekiliyor...'
                checkout scm
            }
        }

        
        stage('Install Dependencies') {
            steps {
                echo 'Kütüphaneler yükleniyor...'
                sh 'cd backend && npm install --legacy-peer-deps'
                sh 'cd frontend && npm install --legacy-peer-deps'
            }
        }

        
        stage('Docker Build') {
            steps {
                echo 'Docker imajları hazırlanıyor...'
                sh 'docker-compose build'
            }
        }

       
        stage('Deploy') {
            steps {
                echo 'NOVAS Docker üzerinde ayağa kalkıyor...'
                sh 'docker-compose up -d'
                echo 'İşlem Başarılı! NOVAS yayında.'
            }
        }
    }

    
    post {
        always {
            echo 'İşlem tamamlandı, Jenkins görevini bitirdi.'
        }
    }
}