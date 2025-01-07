import networkx as nx
import matplotlib.pyplot as plt
import sqlite3
import pandas as pd
from flask import Flask, request, jsonify
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import base64
from io import BytesIO

app = Flask(__name__)

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

    recommendations = df[
        (df['experience_role'].apply(lambda x: experience_role in x.split(', ') if x else True)) &
        (df['experience_years'] <= experience_years)
    ]

    recommendations = recommendations.sort_values(by='similarity', ascending=False).head(10)
    
    results = []
    for idx, row in recommendations.iterrows():
        skills_ticked = [skill for skill in skills if skill in row['skills'].split(', ')]
        skills_not_met = [skill for skill in row['skills'].split(', ') if skill not in skills]
        results.append({
            'job_title': row['job_title'],
            'job_level': row['job_level'],
            'skillsTicked': skills_ticked,
            'skillsNotMet': skills_not_met,
            'experience_role': row['experience_role'],
            'experience_years': row['experience_years']
        })

    return results

def generate_career_path(job_title, job_level, df):
    career_path = []
    
    current_job = df[(df['job_title'] == job_title) & (df['job_level'] == job_level)]
    
    if current_job.empty:
        return career_path
    
    while not current_job.empty:
        job = current_job.iloc[0]
        career_path.append({
            'job_title': job['job_title'],
            'job_level': job['job_level'],
            'skills': job['skills'].split(', '),
            'programming_languages': job['programming_languages'].split(', '),
            'experience_years': job['experience_years']
        })
        
        next_level = 'Mid' if job['job_level'] == 'Junior' else 'Senior' if job['job_level'] == 'Mid' else None
        
        if next_level:
            current_job = df[(df['job_title'] == job['job_title']) & (df['job_level'] == next_level)]
        else:
            break
    
    return career_path

def generate_career_paths_for_recommendations(recommendations, df):
    career_paths = {}
    for rec in recommendations:
        job_title = rec['job_title']
        job_level = rec['job_level']
        career_path = generate_career_path(job_title, job_level, df)
        career_paths[job_title] = career_path
    return career_paths

def create_career_path_graph(career_path):
    G = nx.DiGraph()
    
    for i in range(len(career_path) - 1):
        current_job = career_path[i]
        next_job = career_path[i + 1]
        
        G.add_node(current_job['job_title'] + " (" + current_job['job_level'] + ")", **current_job)
        G.add_node(next_job['job_title'] + " (" + next_job['job_level'] + ")", **next_job)
        G.add_edge(current_job['job_title'] + " (" + current_job['job_level'] + ")", 
                   next_job['job_title'] + " (" + next_job['job_level'] + ")")
    
    pos = nx.spring_layout(G)
    plt.figure(figsize=(10, 6))
    nx.draw(G, pos, with_labels=True, node_size=3000, node_color="skyblue", font_size=10, font_weight="bold", arrowsize=20)
    plt.title("Career Path")
    
    # Save to a buffer
    buf = BytesIO()
    plt.savefig(buf, format="png")
    buf.seek(0)
    return base64.b64encode(buf.getvalue()).decode('utf-8')

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.json
    skills = data.get('skills')
    experience_role = data.get('experience_role')
    experience_years = data.get('experience_years')

    if not skills or experience_role is None or experience_years is None:
        return jsonify({"error": "Invalid input"}), 400

    recommendations = recommend_jobs(skills, experience_role, experience_years)
    df = load_data()
    career_paths = generate_career_paths_for_recommendations(recommendations, df)
    
    career_path_graphs = {}
    for job_title, path in career_paths.items():
        career_path_graphs[job_title] = create_career_path_graph(path)
    
    result = {
        "recommendations": recommendations,
        "career_paths": career_paths,
        "career_path_graphs": career_path_graphs
    }

    return jsonify(result), 200

if __name__ == '__main__':
    app.run(debug=True)
