# Instructions to Run the Program using Docker

1. Clone the repository to your local machine.
2. Download the dataset from [Kaggle](https://www.kaggle.com/datasets/asaniczka/1-3m-linkedin-jobs-and-skills-2024#:~:text=job_skills.csv(672.72%20MB)) and save the `job_skills.csv` and `linkedin_job_postings.csv` file to the `backend/App` of the cloned repository.
3. Navigate to the root directory of the repository.
4. Run the following command to start the application using Docker Compose:
   ```bash
   docker-compose up
5. Open your web browser and go to `http://localhost:3333/`

***Note:*** Due to the huge size of the csv files that are going to be analyzed on the initial run, docker might take 3-5 minutes to set up.

## Background

With the rapid development of technologies such as AI, GenAI, and IoT, the job market is dynamic, requiring continuous upskilling and reskilling of the workforce. This project aims to analyze data from job postings and user profiles to understand career pathways and recommend future job opportunities.

## Features
- Explore Graduate Career Paths
- Manage Personal Career Plan
- Find out about latest Career Trends and Advice

## Acknowledgement

This project was developed entirely by the students from scratch, including the design choices and implementation of features. The university course provided us with a real client and required us to engage directly with them to gather requirements. The role of the university staff was to collaborate with us, approve our ideas, and grade our work based on the final outcome.

