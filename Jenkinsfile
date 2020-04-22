pipeline {
    agent {
        docker {
            image 'node:14.0.0-stretch'
        }
    }
    stages {
        stage('test') {
            steps {
                sh 'yarn'
                sh 'yarn typegen'
                sh 'yarn lint'
            }
        }
    }
}
