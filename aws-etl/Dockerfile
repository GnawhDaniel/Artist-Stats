FROM public.ecr.aws/lambda/python:3.12

COPY . ${LAMBDA_TASK_ROOT}

RUN pip install -r requirements.txt

CMD ["lambda_function.lambda_handler"]
