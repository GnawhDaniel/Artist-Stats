from modules.etl.extract import extract
from modules.etl.transform import transform
from modules.etl.load import load


def lambda_handler(event, context):
    extract()
    transform()
    load()
    return {
        "statusCode": 200,
    }


if __name__ == "__main__":
    lambda_handler("", "")
