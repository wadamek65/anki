pipeline {
    agent {
        label "master"
    }

    stages {
        stage("test") {
            agent {
                docker {
                    image "node:14.0.0-slim"
                    args "-v $HOME/.yarn-cache:/usr/local/share/.cache/yarn/v6"
                }
            }
            steps {
                sh "yarn --frozen-lockfile"
                sh "rm -rf `find -type d -name __generated__`"
                sh "yarn generate"
                sh "yarn lint"
            }
        }

        stage("build-frontend") {
            steps {
                script {
                    docker.withRegistry("https://registry.woj.center") {
                        def frontendImage = docker.build("anki-ui", "--build-arg TARGET=${BRANCH_NAME} -f ./docker/Dockerfile.frontend .")
                        frontendImage.push(BRANCH_NAME)
                    }
                }
            }
        }

        stage("build-backend") {
            steps {
                script {
                    def configId
                    if (BRANCH_NAME == "master") {
                        configId = "b9ba1b82-8123-4eab-874d-43359f8ddab7"
                    } else {
                        configId = "c54f33a8-f1fd-4745-b3fc-e7965d683137"
                    }

                    configFileProvider([configFile(fileId: configId, targetLocation: "./backend/config.json")]) {
                        docker.withRegistry("https://registry.woj.center") {
                            def backendImage = docker.build("anki-backend", "-f ./docker/Dockerfile.backend .")
                            backendImage.push(BRANCH_NAME)
                        }
                    }
                }
            }
        }

        stage("deploy") {
            steps {
                script {
                    def remote = [:]
                    remote.name = "woj.codes"
                    remote.host = "woj.codes"
                    remote.user = "ci"
                    remote.port = 4747
                    remote.allowAnyHosts = true

                    withCredentials([sshUserPrivateKey(credentialsId: "ci-ssh-key", keyFileVariable: "identity", passphraseVariable: "", usernameVariable: "ci")]) {
                        remote.identityFile = identity
                        sshCommand remote: remote, command: "cd /opt/ci/services/codes && TAG=${BRANCH_NAME} docker-compose -f anki.yml pull"
                        sshCommand remote: remote, command: "cd /opt/ci/services/codes && TAG=${BRANCH_NAME} HOST=${BRANCH_NAME} docker-compose -f anki.yml -p anki-${BRANCH_NAME} up -d"
                    }
                }
            }
        }
    }
}
