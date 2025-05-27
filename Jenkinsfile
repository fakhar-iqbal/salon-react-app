// pipeline {
//     agent any // Run on any available Jenkins agent

    
//     environment {
//         PROJECT_NAME_CI = "salon"
//         COMPOSE_FILE_CI = "docker-compose-ci.yaml"
//     }

//     tools {
//         git 'Default' // Ensure Git is configured in Jenkins Global Tool Configuration
//     }

//     stages {
//         stage('Checkout Code') {
//             steps {
//                 echo 'Checking out code from GitHub...'
//                 git branch: 'main', url: 'https://github.com/fakhar-iqbal/salon-react-app.git' // Replace with your repo URL
//             }
//         }

//         stage('Build Images (using CI compose file)') {
//     steps {
//         dir("${env.WORKSPACE}") {
//             echo "Building Docker images using docker-compose-ci.yaml for project: salon"
//             sh 'docker-compose -p salon -f docker-compose-ci.yaml build --no-cache frontend_ci'
//         }
//     }
// }


        

//         stage('Run Containerized Application (from CI compose file)') {
//             steps {
//                 echo "Starting containers using ${COMPOSE_FILE_CI} for project ${PROJECT_NAME_CI}..."
//                 sh "docker-compose -p ${PROJECT_NAME_CI} -f ${COMPOSE_FILE_CI} up -d"
                
//                 sh "sleep 15" // Give services time to start
//                 sh "docker-compose -p ${PROJECT_NAME_CI} -f ${COMPOSE_FILE_CI} ps"
                
//             }
//         }

//     }

//     post {
//         always {
//             echo 'Pipeline finished.'
            
//         }
//         success {
//             echo 'Pipeline successful!'
//         }
//         failure {
//             echo 'Pipeline failed.'
//         }
//     }
// }

pipeline {
    agent any

    environment {
        PROJECT_NAME_CI = "salon"
        COMPOSE_FILE_CI = "docker-compose-ci.yaml"
    }

    tools {
        git 'Default'
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo 'Checking out code from GitHub...'
                git branch: 'main', url: 'https://github.com/fakhar-iqbal/salon-react-app.git'
            }
        }

        stage('Stop Previous Containers') {
            steps {
                script {
                    echo 'Stopping any existing containers for this project...'
                    sh """
                        docker-compose -p ${PROJECT_NAME_CI} -f ${COMPOSE_FILE_CI} down || true
                        docker system prune -f
                    """
                }
            }
        }

        stage('Build Images (using CI compose file)') {
            steps {
                dir("${env.WORKSPACE}") {
                    echo "Building Docker images using ${COMPOSE_FILE_CI} for project: ${PROJECT_NAME_CI}"
                    echo "This will use Dockerfile.jenkins for full npm build process"
                    sh "docker-compose -p ${PROJECT_NAME_CI} -f ${COMPOSE_FILE_CI} build --no-cache frontend_ci"
                }
            }
        }

        stage('Run Containerized Application') {
            steps {
                echo "Starting containers using ${COMPOSE_FILE_CI} for project ${PROJECT_NAME_CI}..."
                sh "docker-compose -p ${PROJECT_NAME_CI} -f ${COMPOSE_FILE_CI} up -d"
                
                echo "Waiting for services to start..."
                sh "sleep 20"
                
                echo "Checking container status..."
                sh "docker-compose -p ${PROJECT_NAME_CI} -f ${COMPOSE_FILE_CI} ps"
                
                echo "Application should be available at: http://51.21.139.120:8081/"
            }
        }

        stage('Health Check') {
            steps {
                script {
                    echo 'Performing health check...'
                    sh """
                        sleep 10
                        curl -f http://localhost:8081/ || exit 1
                        echo "Health check passed!"
                    """
                }
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished.'
            sh "docker-compose -p ${PROJECT_NAME_CI} -f ${COMPOSE_FILE_CI} logs --tail=50"
        }
        success {
            echo 'Pipeline successful! Application is running at http://51.21.139.120:8081/'
        }
        failure {
            echo 'Pipeline failed. Cleaning up...'
            sh "docker-compose -p ${PROJECT_NAME_CI} -f ${COMPOSE_FILE_CI} down || true"
        }
    }
}