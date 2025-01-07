# coding: utf-8

# In[1]:


import sqlite3
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def load_data():
    conn = sqlite3.connect("career_path.db")
    query = "SELECT * FROM career_path"
    df = pd.read_sql_query(query, conn)
    conn.close()
    return df


def preprocess_data(df):
    df['skills_str'] = df['skills'].apply(lambda x: ' '.join(x.split(', ')))
    return df


def recommend_jobs(skills, experience_role, experience_years):
    df = load_data()
    df = preprocess_data(df)

    vectorizer = CountVectorizer()
    skills_matrix = vectorizer.fit_transform(df['skills_str'])

    user_skills_str = ' '.join(skills)
    user_skills_vec = vectorizer.transform([user_skills_str])

    sim_scores = cosine_similarity(user_skills_vec, skills_matrix).flatten()

    df['similarity'] = sim_scores

    # Adjust Pandas display options to show the entire DataFrame
    pd.set_option('display.max_rows', None)  # Show all rows
    pd.set_option('display.max_columns', None)  # Show all columns
    pd.set_option('display.width', None)  # Auto-detect width

    print(df)
    print('GOT HEHREHRHEHERHERHE')
    print(experience_role)
    print(experience_years)
    df['experience_years'] = df['experience_years'].astype(int)
    recommendations = df[
        # (df["experience_role"].apply(lambda x: x not in experience_role if x else False)) &
        (df['experience_years'] >= experience_years)
        ]

    print("RECOMMENDATIONS \n")
    print(recommendations)

    recommendations = recommendations.sort_values(by='similarity', ascending=False)

    results = []
    for idx, row in recommendations.iterrows():
        job_skills = df.iloc[idx]['skills'].split(', ')
        skills_ticked = [skill for skill in skills if skill in job_skills]
        skills_not_met = [skill for skill in job_skills if skill not in skills]
        results.append({
            'job_title': row['job_title'],
            'job_level': row['job_level'],
            'skillsTicked': skills_ticked,
            'skillsNotMet': skills_not_met,
            'experience_role': row['experience_role'],
            'experience_years': row['experience_years']
        })
    seen_titles = set()
    unique_results = []
    for rec in results:
        if rec['job_title'] not in seen_titles:
            seen_titles.add(rec['job_title'])
            unique_results.append(rec)

    print(unique_results)
    return unique_results


def generate_career_paths(skills, job_title, job_level, df, path=[], visited_jobs=set()):
    paths = []

    current_job = df[(df['job_title'] == job_title) & (df['job_level'] == job_level)]

    if current_job.empty or (job_title, job_level) in visited_jobs:
        return paths

    visited_jobs.add((job_title, job_level))

    for idx, job in current_job.iterrows():
        job_skills = df.iloc[idx]['skills'].split(', ')
        skills_ticked = [skill for skill in skills if skill in job_skills]
        skills_not_met = [skill for skill in job_skills if skill not in skills]

        current_path = path + [{
            'job_title': job['job_title'],
            'job_level': job['job_level'],
            'skillsTicked': skills_ticked,
            'skillsNotMet': skills_not_met,
            'experience_years': job['experience_years']
        }]

        next_jobs = df[(df['experience_role'].apply(lambda x: job['job_title'] in x.split(', ') if x else False)) & (
                df['experience_years'] > job['experience_years'])]

        next_jobs = next_jobs[(next_jobs['job_level'] == 'Mid') | (job_level != 'Junior')]

        if next_jobs.empty:
            paths.append(current_path)
        else:
            next_jobs = next_jobs.drop_duplicates(subset=['job_title', 'job_level'])
            for _, next_job in next_jobs.iterrows():
                next_paths = generate_career_paths(skills, next_job['job_title'], next_job['job_level'], df,
                                                   current_path, visited_jobs)
                paths.extend(next_paths)

    visited_jobs.remove((job_title, job_level))

    return paths


def generate_all_career_paths_for_recommendations(skills, recommendations, df):
    all_paths = []
    for rec in recommendations:
        job_title = rec['job_title']
        job_level = rec['job_level']
        career_paths = generate_career_paths(skills, job_title, job_level, df)
        all_paths.extend(career_paths)
    return all_paths

