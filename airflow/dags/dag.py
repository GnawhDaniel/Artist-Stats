import os
import glob
from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python import PythonOperator
from custom_modules.etl.extract import extract
from custom_modules.etl.transform import transform
from custom_modules.etl.load import load
import pendulum


default_args = {
    'owner': 'Daniel',
    'retries': 5,
    'retry_delay': timedelta(seconds=5)
}

def remove_csv_files():
    files = glob.glob('csv/*')
    for f in files:
        os.remove(f)


with DAG(
    dag_id='artist_dag',
    description='ETL for artist',
    start_date=pendulum.datetime(2024, 6, 1, tz="US/Central"),
    default_args=default_args,
    schedule='@daily'
) as dag:

    task1 = PythonOperator(
        task_id='extract_artist',
        python_callable=extract,
        op_kwargs={"artist_list_paths": [
            "artists/korean_artists.txt", 
            'artists/jap_artists.txt']
            }
    )

    task2 = PythonOperator(
        task_id="transform_artist",
        python_callable=transform
    )

    task3 = PythonOperator(
        task_id='load_artist',
        python_callable=load
    )

    # task4 = PythonOperator(
    #     task_id='remove_csv_files',
    #     python_callable=remove_csv_files
    # )

    task1 >> task2 >> task3 # >> task4