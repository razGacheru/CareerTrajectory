# job_analyze.py

import os
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

def analyze_jobs():
    job_skills_path = os.path.join(os.path.dirname(__file__), 'job_skills.csv')
    linkedin_job_postings_path = os.path.join(os.path.dirname(__file__), 'linkedin_job_postings.csv')

    job_skills = pd.read_csv(job_skills_path)
    linkedin_job_posting = pd.read_csv(linkedin_job_postings_path)

    linkedin_job_posting = pd.merge(linkedin_job_posting, job_skills, on='job_link', how='inner')
    linkedin_job_posting = linkedin_job_posting.dropna()
    linkedin_job_posting = linkedin_job_posting.apply(lambda col: col.map(lambda s: s.lower() if isinstance(s, str) else s))
    linkedin_job_posting = linkedin_job_posting.replace({' & ': ' and '}, regex=True)

    def itr_skills(row):
        skills = row['job_skills'].split(', ')
        return [skill for skill in skills if len(skill) >= 3]

    linkedin_job_posting['skills'] = linkedin_job_posting.apply(itr_skills, axis=1)
    linkedin_job_posting['skills_count'] = linkedin_job_posting['skills'].apply(len)
    linkedin_job_posting.drop(['job_skills'], axis=1, inplace=True)
    linkedin_job_posting = linkedin_job_posting.rename(columns={'skills': 'job_skills'})
    linkedin_job_posting['search_country'] = linkedin_job_posting['search_country'].astype('category')

    figs_dir = os.path.join(os.path.dirname(__file__), 'figs')
    if not os.path.exists(figs_dir):
        os.makedirs(figs_dir)

    # Generate plots
    plot_top_jobs(linkedin_job_posting, 'australia', 'top_10_aus_jobs.png', 'red')
    plot_job_types(linkedin_job_posting)

def plot_top_jobs(df, country, filename, color):
    jobs = df[df['search_country'] == country]
    job_counts = jobs['job_title'].value_counts()
    top_10_jobs = job_counts.head(10)
    
    top_10_jobs.plot(kind='barh', figsize=(10, 6), color=color)
    plt.xlabel('Number of Job Postings')
    plt.ylabel('Job Title')
    plt.title(f'Top 10 Most Demanded Job Titles in {country.title()}')
    plt.gca().invert_yaxis()
    plt.tight_layout()
    plt.savefig(os.path.join(os.path.dirname(__file__), 'figs', filename))
    plt.close()

def plot_job_types(df):
    counts = df['job_type'].value_counts()
    fig, ax = plt.subplots()
    wedges, _ = ax.pie(counts, startangle=90, colors=['#40E0D0', '#FFD700', '#FF6347'])

    centre_circle = plt.Circle((0, 0), 0.70, fc='white')
    fig.gca().add_artist(centre_circle)
    ax.axis('equal')

    labels = [f'{i} - {j} ({j / counts.sum() * 100:.1f}%)' for i, j in zip(counts.index, counts)]
    plt.legend(wedges, labels, title="Job Types", loc="center left", bbox_to_anchor=(1, 0, 0.5, 1))
    plt.title("Distribution of Job Types in LinkedIn Postings")
    plt.tight_layout()
    plt.savefig(os.path.join(os.path.dirname(__file__), 'figs', 'job_types.png'))
    plt.close()
