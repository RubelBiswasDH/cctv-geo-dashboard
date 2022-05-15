pipeline {
    agent any

    tools { nodejs "node16" }

    stages { 
        stage('Test node version & npm version') {
            steps {
                sh 'node --version'
                sh 'npm --version'
            }
        }

        stage('Build') {
            steps {
                echo 'building...'
                sh 'npm install'
                sh 'CI=false npm run build'
            }
        }

        stage("test condition") {
            when {
                branch "dev"
            }
            steps{
                echo 'dev branch'
            }
        }

        stage('SSH transfer') {
            // when {
            //     branch "dev"
            // }
            steps([$class: 'BapSshPromotionPublisherPlugin']) {
                sshPublisher(
                    continueOnError: false, failOnError: true,
                    publishers: [
                        sshPublisherDesc(
                            configName: "hr_trace_staging",
                            verbose: true,
                            transfers: [
                                sshTransfer(cleanRemote: true, sourceFiles: "build/**",),
                                // sshTransfer(execCommand: "mv build/* ./"),
                                sshTransfer(execCommand: "cd /home/barikoi/hr_trace_dashboard; mv build/* ./; rm -r build; ls -l")
                            ]
                        )
                    ]
                )
            }
        }
    }

    post {
        // Send the build result to slack channel
        success {
            slackSend color: 'good', message: "${GIT_COMMIT} \n ${JOB_URL} \n ${BUILD_TAG} \n ${BUILD_DISPLAY_NAME} \n ${BRANCH_NAME}"
        }
        failure {
            slackSend color: 'warning', message: "${GIT_COMMIT} \n ${JOB_URL} \n ${BUILD_TAG} \n ${BUILD_DISPLAY_NAME} \n ${BRANCH_NAME}"
        }
    }
}