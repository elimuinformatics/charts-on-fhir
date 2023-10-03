pipeline {
  parameters {
    choice(name: 'app', choices: ['showcase', 'cardio-patient', 'cardio'], description: 'Select the app to build and deploy')
  }
  agent any
  options {
    buildDiscarder(logRotator(numToKeepStr: '30'))
  }
  environment {
    APP = "${params.app}"
    AWS_CREDENTIALS = credentials('AWS-KEYS')
    AWS_ENV = """${sh(
      returnStdout: true,
      script: 'env | awk -F= \'/^AWS/ {print "-e " $1}\''
    )}"""
    GIT_ENV = """${sh(
      returnStdout: true,
      script: 'env | awk -F= \'/^GIT/ {print "-e " $1}\''
    )}"""
  }
  stages {
    stage('Setup') {
      steps {
        sh '''
          docker pull $CICD_ECR_REGISTRY/cicd:latest
          docker tag $CICD_ECR_REGISTRY/cicd:latest cicd:latest
        '''
      }
    }
    stage('Build') {
      steps {
        echo 'Building Docker Image'
        sh 'docker build --build-arg app=' + APP + ' -t ' + APP + '-web -f Dockerfile .'
      }
    }
    stage('Push') {
      steps {
        echo 'Pushing Docker Image'
        sh 'docker run -v /var/run/docker.sock:/var/run/docker.sock $AWS_ENV $GIT_ENV cicd push ' + APP + '-web'
      }
    }
    stage('Deploy') {
      steps {
        echo 'Deploying to QA'
        sh 'docker run -v /var/run/docker.sock:/var/run/docker.sock $AWS_ENV $GIT_ENV cicd deploy ' + APP + '-web qa $GIT_COMMIT'
      }
    }
    stage('Wait') {
      steps {
        echo 'Waiting for QA service to reach steady state'
        sh 'docker run -v /var/run/docker.sock:/var/run/docker.sock $AWS_ENV cicd wait ' + APP + '-web qa'
      }
    }
    stage('Healthcheck') {
      steps {
        echo 'Checking health of QA service'
        sh "curl -m 10 https://$APP-qa.elimuinformatics.com/"
      }
    }
  }
  post {
    unsuccessful {
      slackSend color: 'danger', channel: '#product-ops-qa', message: "Pipeline Failed For App: ${APP} ${env.JOB_NAME} ${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>)"
    }
    fixed {
      slackSend color: 'good', channel: '#product-ops-qa', message: "Pipeline Ran Successfully For App: ${APP} ${env.JOB_NAME} ${env.BUILD_NUMBER} (<${env.BUILD_URL}|Open>)"
    }
  }
}
