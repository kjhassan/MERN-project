pipeline {
    agent {
        docker {
            // Combined Python + Node.js image
            image 'nikolaik/python-nodejs:python3.11-nodejs20'
            args '-u root:root'
        }
    }

    environment {
        TEST_REPO_URL = 'https://github.com/kjhassan/test_repo.git'
        TEST_REPO_DIR = 'TEST_CASES'
        TEST_RESULTS  = 'reports/results.xml'
        EMAIL_TO      = 'sidraxaidi9@gmail.com'
    }

    stages {

        stage('Checkout Application Repo') {
            steps {
                // Jenkins does an initial checkout, this keeps it explicit
                checkout scm
            }
        }

        stage('Clone Test Repo') {
            steps {
                dir(env.TEST_REPO_DIR) {
                    git branch: 'main', url: env.TEST_REPO_URL
                }
            }
        }

        // curl is usually already there, but this is cheap & safe
        stage('Install System Tools (curl)') {
            steps {
                sh '''
                  apt-get update
                  apt-get install -y curl
                '''
            }
        }

        stage('Install App Dependencies') {
            steps {
                sh '''
                  cd backend
                  npm install
                '''
            }
        }

        stage('Start Application (port 5000)') {
            steps {
                sh '''
                  cd backend

                  echo "Starting backend server..."
                  nohup npm run server > /tmp/server.log 2>&1 &

                  echo "Waiting for server on http://localhost:5000 ..."

                  # Try for ~60 seconds
                  for i in $(seq 1 30); do
                    if curl -sSf http://localhost:5000 > /dev/null 2>&1; then
                      echo "✅ Server is up!"
                      exit 0
                    fi
                    echo "⏳ Still waiting for server... ($i/30)"
                    sleep 2
                  done

                  echo "❌ ERROR: Server did not start on port 5000 in time." >&2
                  echo "---- server.log ----"
                  cat /tmp/server.log || true
                  echo "--------------------"
                  exit 1
                '''
            }
        }

        stage('Install Test Dependencies') {
            steps {
                sh """
                  cd ${env.TEST_REPO_DIR}
                  python -m pip install --upgrade pip
                  pip install -r requirements.txt
                """
            }
        }

        stage('Run Tests') {
            steps {
                sh """
                  mkdir -p reports
                  cd ${env.TEST_REPO_DIR}
                  pytest -v --junitxml=../${env.TEST_RESULTS}
                """
            }
        }

        stage('Publish Test Results') {
            steps {
                junit "${env.TEST_RESULTS}"
            }
        }
    }

    post {
        always {
            script {
                // Read testcases from XML if it exists
                def raw = ''
                try {
                    raw = sh(
                        script: "grep -h \"<testcase\" ${env.TEST_RESULTS} || true",
                        returnStdout: true
                    ).trim()
                } catch (ignored) {
                    raw = ''
                }

                int total = 0
                int passed = 0
                int failed = 0
                int skipped = 0
                String details = ""

                if (raw) {
                    raw.split('\n').each { line ->
                        if (!line.trim()) return

                        total++

                        def nameMatch = (line =~ /name=\"([^\"]+)\"/)
                        def testName = nameMatch ? nameMatch[0][1] : "UnknownTest"

                        if (line.contains("<failure")) {
                            failed++
                            details += "${testName} — FAILED\n"
                        } else if (line.contains("<skipped") || line.contains("</skipped>")) {
                            skipped++
                            details += "${testName} — SKIPPED\n"
                        } else {
                            passed++
                            details += "${testName} — PASSED\n"
                        }
                    }
                }

                def emailBody = """
Test Summary (Build #${env.BUILD_NUMBER})

Total Tests:   ${total}
Passed:        ${passed}
Failed:        ${failed}
Skipped:       ${skipped}

Detailed Results:
${details ?: "No test details available (tests may not have run)."}

"""

                emailext(
                    to: env.EMAIL_TO,
                    subject: "ChatApp CI – Build #${env.BUILD_NUMBER} Test Results",
                    body: emailBody
                )
            }
        }
    }
}










// pipeline {
//     agent any

//     environment {
//         COMPOSE_FILE = 'docker-compose.yml'
//     }

//     stages {
//         stage('Checkout') {
//             steps {
//                 echo 'Pulling code from GitHub...'
//                 git branch: 'main', url: 'https://github.com/kjhassan/Web-ChatApp.git'
//             }
//         }

//         stage('Build and Run Containers') {
//             steps {
//                 echo 'Starting containerized environment...'
//                 sh 'docker-compose down || true'
//                 sh 'docker-compose up -d'
//             }
//         }

//         stage('Verify') {
//             steps {
//                 echo 'Checking running containers...'
//                 sh 'docker ps'
//             }
//         }
//     }

//     post {
//         success {
//             echo 'Pipeline executed successfully! Environment is up.'
//         }
//         failure {
//             echo 'Pipeline failed. Please check logs.'
//         }
//     }
// }
