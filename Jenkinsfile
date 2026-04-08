pipeline {
    agent any

    stages {
        // 1. AŞAMA: Kodları GitHub'dan çek
        stage('Checkout') {
            steps {
                echo 'Kodlar GitHubdan çekiliyor...'
                checkout scm
            }
        }

        // 2. AŞAMA: Docker İmajlarını Oluştur (npm install zaten Dockerfile içinde var!)
        stage('Docker Build') {
            steps {
                echo 'Docker imajları hazırlanıyor (Kütüphaneler konteyner içinde yüklenecek)...'
                // --no-cache kullanarak her seferinde taze kurulum yapmasını garanti ederiz
                sh 'docker-compose build --no-cache'
            }
        }

        // 3. AŞAMA: Yayına Al
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