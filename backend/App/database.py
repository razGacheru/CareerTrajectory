import sqlite3
import pandas as pd
from io import StringIO
import threading
import time


data = """
job_title,job_level,skills,experience_years,experience_role
Developer,Junior,"Problem Solving, Communication, Teamwork, Adaptability, Creativity, Work Ethic, Efficiency, Python, JavaScript",0,None
Developer,Mid,"Problem Solving, Communication, Teamwork, Adaptability, Creativity, Work Ethic, Efficiency, Leadership, Python, JavaScript, Java",2,Developer
Developer,Senior,"Problem Solving, Communication, Teamwork, Adaptability, Creativity, Work Ethic, Efficiency, Leadership, Project Management, Python, Java, C++",7,Developer
Data Engineer,Junior,"Problem Solving, Communication, Teamwork, Adaptability, Creativity, Work Ethic, Efficiency, Python, SQL",0,None
Data Engineer,Mid,"Problem Solving, Communication, Teamwork, Adaptability, Creativity, Work Ethic, Efficiency, Data Warehousing, Python, SQL, R",2,Data Engineer
Data Engineer,Senior,"Problem Solving, Communication, Teamwork, Adaptability, Creativity, Work Ethic, Efficiency, Data Warehousing, Cloud Computing, Python, SQL, R, AWS",7,Data Engineer
AI Specialist,Junior,"Problem Solving, Communication, Teamwork, Adaptability, Creativity, Work Ethic, Efficiency, Machine Learning, Python, TensorFlow",0,None
AI Specialist,Mid,"Problem Solving, Communication, Teamwork, Adaptability, Creativity, Work Ethic, Efficiency, Machine Learning, Deep Learning, Python, TensorFlow, Keras",2,AI Specialist
AI Specialist,Senior,"Problem Solving, Communication, Teamwork, Adaptability, Creativity, Work Ethic, Efficiency, Machine Learning, Deep Learning, NLP Python, TensorFlow, Keras, PyTorch",7,AI Specialist
Network Engineer,Junior,"Problem Solving, Communication, Teamwork, Adaptability, Creativity, Work Ethic, Efficiency, Python, Java",0,None
Network Engineer,Mid,"Problem Solving, Communication, Teamwork, Adaptability, Creativity, Work Ethic, Efficiency, System Administration, Python, Java, C#",2,Network Engineer
Network Engineer,Senior,"Problem Solving, Communication, Teamwork, Adaptability, Creativity, Work Ethic, Efficiency, System Administration, Cloud Computing, Python, Java, C#, AWS",7,Network Engineer
Software Engineer,Mid,"Problem Solving, Communication, Teamwork, Adaptability, Creativity, Work Ethic, Efficiency, Software Development Python, Java, C++",2,Developer
Software Engineer,Senior,"Problem Solving, Communication, Teamwork, Adaptability, Creativity, Work Ethic, Efficiency, Software Development, Project Management Python, Java, C++",5,Software Engineer
Data Analyst,Mid,"Problem Solving, Communication, Teamwork, Adaptability, Creativity, Work Ethic, Efficiency, SQL, Reporting Python, R, SQL",2,"Developer, Data Engineer, AI Specialist"
Data Analyst,Senior,"Problem Solving, Communication, Teamwork, Adaptability, Creativity, Work Ethic, Efficiency, SQL, Reporting, Data Visualization, Python, R, SQL",5,Data Analyst
Data Scientist,Mid,"Problem Solving, Communication, Teamwork, Adaptability, Creativity, Work Ethic, Efficiency, Machine Learning, Python, R, SQL",2,"Data Engineer, AI Specialist"
Data Scientist,Senior,"Problem Solving, Communication, Teamwork, Adaptability, Creativity, Work Ethic, Efficiency, Machine Learning, Deep Learning, Python, R, SQL, TensorFlow",5,Data Scientist
AI Research Scientist,Mid,"Problem Solving, Communication, Teamwork, Adaptability, Creativity, Work Ethic, Efficiency, AI Research, Machine Learning, Python, TensorFlow, PyTorch",2,AI Specialist
AI Research Scientist,Senior,"Problem Solving, Communication, Teamwork, Adaptability, Creativity, Work Ethic, Efficiency, AI Research, Machine Learning, Deep Learning, Python, TensorFlow, PyTorch, Keras",5,AI Research Scientist
System Administrator,Mid,"Problem Solving, Communication, Teamwork, Adaptability, Creativity, Work Ethic, Efficiency, System Administration, Networking, Security, Python, Bash, PowerShell",2,Network Engineer
System Administrator,Senior,"Problem Solving, Communication, Teamwork, Adaptability, Creativity, Work Ethic, Efficiency, System Administration, Networking, Security, Cloud Computing, Python, Bash, PowerShell, AWS",5,System Administrator
Network Architect,Mid,"Problem Solving, Communication, Teamwork, Adaptability, Creativity, Work Ethic, Efficiency, Networking, System Design, Security, Python, Java, C#",2,Network Engineer
Network Architect,Senior,"Problem Solving, Communication, Teamwork, Adaptability, Creativity, Work Ethic, Efficiency, Networking, System Design, Security, Cloud Architecture, Python, Java, C#, AWS",5,Network Architect
Machine Learning Engineer,Mid,"Problem Solving, Communication, Teamwork, Adaptability, Creativity, Work Ethic, Efficiency, Machine Learning, Data Analysis, Python, TensorFlow, R",2,"AI Specialist, Data Engineer"
Machine Learning Engineer,Senior,"Problem Solving, Communication, Teamwork, Adaptability, Creativity, Work Ethic, Efficiency, Machine Learning, Data Analysis, Deep Learning, Python, TensorFlow, Keras",5,Machine Learning Engineer
Computer Vision Engineer,Mid,"Problem Solving, Communication, Teamwork, Adaptability, Creativity, Work Ethic, Efficiency, Computer Vision, Machine Learning, Python, OpenCV, TensorFlow",2,AI Specialist
Computer Vision Engineer,Senior,"Problem Solving, Communication, Teamwork, Adaptability, Creativity, Work Ethic, Efficiency, Computer Vision, Machine Learning, Deep Learning, Python, OpenCV, TensorFlow, Keras",5,Computer Vision Engineer
Natural Language Processing Engineer,Mid,"Problem Solving, Communication, Teamwork, Adaptability, Creativity, Work Ethic, Efficiency, NLP, Machine Learning, Text Processing, Python, NLTK, TensorFlow",2,AI Specialist
Natural Language Processing Engineer,Senior,"Problem Solving, Communication, Teamwork, Adaptability, Creativity, Work Ethic, Efficiency, NLP, Machine Learning, Text Processing, Deep Learning, Python, NLTK, TensorFlow, Keras",5,Natural Language Processing Engineer
Robotics Engineer,Mid,"Problem Solving, Communication, Teamwork, Adaptability, Creativity, Work Ethic, Efficiency, Robotics, Machine Learning, Python, C++, ROS",2,AI Specialist
Robotics Engineer,Senior,"Problem Solving, Communication, Teamwork, Adaptability, Creativity, Work Ethic, Efficiency, Robotics, Machine Learning, AI, Python, C++, ROS, TensorFlow",5,Robotics Engineer
IT Support Specialist,Mid,"Problem Solving, Communication, Teamwork, Adaptability, Creativity, Work Ethic, Efficiency, Technical Support, System Administration, Troubleshooting, Python, Bash, PowerShell",2,"Network Engineer, Developer"
IT Support Specialist,Senior,"Problem Solving, Communication, Teamwork, Adaptability, Creativity, Work Ethic, Efficiency, Technical Support, System Administration, Troubleshooting, Project Management, Python, Bash, PowerShell, AWS",5,IT Support Specialist
Cybersecurity Analyst,Mid,"Problem Solving, Communication, Teamwork, Adaptability, Creativity, Work Ethic, Efficiency, Cybersecurity, Network Security, Threat Analysis, Python, Java, C++",2,Network Engineer
Cybersecurity Analyst,Senior,"Problem Solving, Communication, Teamwork, Adaptability, Creativity, Work Ethic, Efficiency, Cybersecurity, Network Security, Threat Analysis, Incident Response, Python, Java, C++, AWS",5,Cybersecurity Analyst
Cloud Solutions Architect,Mid,"Problem Solving, Communication, Teamwork, Adaptability, Creativity, Work Ethic, Efficiency, Cloud Computing, System Design, Security, Python, AWS, Azure",2,Network Engineer
Cloud Solutions Architect,Senior,"Problem Solving, Communication, Teamwork, Adaptability, Creativity, Work Ethic, Efficiency, Cloud Computing, System Design, Security, Cloud Architecture, Python, AWS, Azure, GCP",5,Cloud Solutions Architect
"""

df = pd.read_csv(StringIO(data))

# Create a SQLite database
conn = sqlite3.connect("Career_path.db")

# Save the dataframe to a table in the SQLite database
df.to_sql('Career_path', conn, if_exists='replace', index=False)

conn.close()

def generateDummyData(df):
    sample = df.sample(n=1)
    conn = sqlite3.connect("career_path.db")
    sample.to_sql('career_path', conn, if_exists='append', index=False)
    conn.close()

def startGeneratingDummyData(interval=600):
    def generate():
        while True:
            generateDummyData(df)
            time.sleep(interval)

    thread = threading.Thread(target=generate)
    thread.daemon = True
    thread.start()
