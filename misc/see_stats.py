from sqlalchemy import create_engine, text
import matplotlib.pyplot as plt 
import pandas as pd
import os
from dotenv import load_dotenv

load_dotenv()

conf ={
    'host':os.environ['DB_CONNECTION'],
    'port':'5432',
    'database':"artist_analysis",
    'user':"postgres",
    'password': os.environ["DB_PASSWORD"]
}

def query_mode(con, multi=False):
    plt.ion()
    plt.show()
    fig, ax = plt.subplots()  # Create a figure and axis instance

    artist_data = {}
    
    while True:
        user_input = input("Artist: ").lower().strip()
        if user_input == 'q':
            break
        
        ax.cla()
        artist_table = pd.read_sql(f"SELECT date, followers FROM artist_master WHERE artist_name ILIKE '{user_input}';", con=con)
        artist_table["followers"] = artist_table['followers'].astype(int)
        artist_table["date"] = pd.to_datetime(artist_table['date'])
        
        if multi and user_input not in artist_data:
            artist_data[user_input] = artist_table
            for name, table in artist_data.items():
                table.plot(x='date', y='followers', ax=ax, label=name)
        elif not multi:
            artist_table.plot(x='date', y='followers', ax=ax, label=user_input)
            
        plt.legend()
        plt.draw()
        plt.pause(0.001)

        
def main():
    engine = create_engine(
        "postgresql+psycopg2://{user}:{password}@{host}:{port}/{database}".format(**conf), 
        future=True
        )
    
    conn = engine.connect()

    try:
        query = None
        while query != 'q':
            print()
            print("Commands:")
            print("---------------------")
            print("1. See all artists")
            print("2. Query Mode")
            print("3. Multi-Query Mode")
            print()
            query = input("Option: ").strip().lower()
            
            if query == '1':
                artist_names = pd.read_sql("SELECT DISTINCT artist_name FROM artist_master", con=conn)
                for i in artist_names['artist_name'].tolist():
                    print(i)
            elif query == '2':
                query_mode(conn)
            elif query == '3':
                query_mode(conn, True)
                
    except Exception as e:
        print(e)
        conn.close()
    else:
        conn.close()
    
    
if __name__ == "__main__":
    main()