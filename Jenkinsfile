def buildNumber = BUILD_NUMBER
pipeline {
    agent any
    environment {
        CI = 'true'
    }
    stages {
        stage('Checkout Code from GitHub') {
            steps {
                git branch: 'main', credentialsId: 'MyGitHubID', url: 'https://github.com/jagadeeshramd/Faculty-Dashboard.git'
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('Test') {
            steps {
                sh 'npm test'
            }
        }
        stage('Build Docker Image'){
            steps{
                // sh "docker system prune -f --all || true"
                sh "docker build -t jagadeeshramd/faculty-dashboard:${buildNumber} ."
            }
        }
        stage('Push Image to DockerHub') {
            steps {
                withCredentials([string(credentialsId: 'DockerHub_PWD', variable: 'DockerHub_PWD')]) {
                sh "docker login -u jagadeeshramd -p $DockerHub_PWD"
            }
            sh "docker push jagadeeshramd/faculty-dashboard:${buildNumber}"
            }
        }
        stage('Deploy Container to Production Server'){
            steps{
                sshagent(['Deployment_Server_SSH']) {
                sh "ssh -o StrictHostKeyChecking=no jagadeeshramd@10.128.0.12 docker rm -f facultydashboardcontainer || true"
                // sh "ssh -o StrictHostKeyChecking=no jagadeeshramd@10.128.0.12 sudo docker system prune -f --all || true"
                sh "ssh -o StrictHostKeyChecking=no jagadeeshramd@10.128.0.12 docker run -d -p 3000:3000 --name facultydashboardcontainer jagadeeshramd/faculty-dashboard:${buildNumber}"
                }
            }
        }
    }
    post{
        always{
            emailext attachLog: true, body: '''$PROJECT_NAME - Build # $BUILD_NUMBER - $BUILD_STATUS:
            Check console output at $BUILD_URL to view the results or alternatively check the attached log.''', subject: 'Jenkins Automated Notification - $PROJECT_NAME - Build # $BUILD_NUMBER - $BUILD_STATUS!', to: 'facultydashboardg5@gmail.com'
        }
    }
}