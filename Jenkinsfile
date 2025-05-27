pipeline {
    agent any // Run on any available Jenkins agent

    
    environment {
        // DOCKER_HUB_CREDENTIALS_ID = 'your-dockerhub-credentials-id' // Set in Jenkins Credentials
        PROJECT_NAME_CI = "SALON"
        COMPOSE_FILE_CI = "docker-compose-ci.yaml"
        // DOCKERHUB_USERNAME = "yourdockerhubusername" // Define your Docker Hub username
    }

    tools {
        git 'Default' // Ensure Git is configured in Jenkins Global Tool Configuration
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo 'Checking out code from GitHub...'
                git branch: 'main', url: 'https://github.com/fakhar-iqbal/salon-react-app.git' // Replace with your repo URL
                // Example: git branch: 'main', url: 'https://github.com/yourusername/my-react-project.git'
            }
        }

        stage('Build Images (using CI compose file)') {
            steps {
                echo "Building Docker images using ${COMPOSE_FILE_CI} for project: ${PROJECT_NAME_CI}"
                // The 'build' directive in docker-compose-ci.yml will handle building
                // both frontend_ci and backend_ci services based on their Dockerfiles.
                sh "docker-compose -p ${PROJECT_NAME_CI} -f ${COMPOSE_FILE_CI} build --no-cache frontend_ci backend_ci"
            }
        }

        // Optional Stage: Push images to Docker Hub (if required for your workflow)
        // stage('Push Images to Docker Hub') {
        //     when {
        //         branch 'main' // Only push for main branch builds, for example
        //     }
        //     steps {
        //         echo "Logging into Docker Hub and pushing images..."
        //         withCredentials([usernamePassword(credentialsId: DOCKER_HUB_CREDENTIALS_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
        //             sh "docker login -u ${DOCKER_USER} -p ${DOCKER_PASS}"
        //             // Tag images before pushing if your compose build doesn't tag them with your username
        //             sh "docker tag ${PROJECT_NAME_CI}_frontend_ci ${DOCKERHUB_USERNAME}/my-react-app-frontend-ci:latest"
        //             sh "docker tag ${PROJECT_NAME_CI}_backend_ci ${DOCKERHUB_USERNAME}/my-react-app-backend-ci:latest"
        //             sh "docker push ${DOCKERHUB_USERNAME}/my-react-app-frontend-ci:latest"
        //             sh "docker push ${DOCKERHUB_USERNAME}/my-react-app-backend-ci:latest"
        //         }
        //     }
        // }

        stage('Run Containerized Application (from CI compose file)') {
            steps {
                echo "Starting containers using ${COMPOSE_FILE_CI} for project ${PROJECT_NAME_CI}..."
                // This command will use the images built in the previous stage (or pull if not built locally)
                sh "docker-compose -p ${PROJECT_NAME_CI} -f ${COMPOSE_FILE_CI} up -d"
                
                // Optional: Add a small delay or health check
                sh "sleep 15" // Give services time to start
                sh "docker-compose -p ${PROJECT_NAME_CI} -f ${COMPOSE_FILE_CI} ps"
                // echo "Frontend CI should be accessible on EC2_IP:${env.CI_FRONTEND_PORT:-8081}" // Assuming you set CI_FRONTEND_PORT
                // echo "Backend CI should be accessible on EC2_IP:${env.CI_BACKEND_PORT:-3002}"
            }
        }

        // Optional Stage: Run Tests (Example)
        // stage('Test Application') {
        //     steps {
        //         echo 'Running backend tests...'
        //         // Example: sh "docker-compose -p ${PROJECT_NAME_CI} -f ${COMPOSE_FILE_CI} exec -T backend_ci npm test"
        //         // For frontend tests, you might run them during the frontend Docker build stage or separately.
        //     }
        // }
    }

    post {
        always {
            echo 'Pipeline finished.'
            // Optional: Clean up CI containers and networks
            // Be cautious with 'down -v' if you want to inspect data/logs from CI runs.
            // sh "docker-compose -p ${PROJECT_NAME_CI} -f ${COMPOSE_FILE_CI} down --remove-orphans"
        }
        success {
            echo 'Pipeline successful!'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}