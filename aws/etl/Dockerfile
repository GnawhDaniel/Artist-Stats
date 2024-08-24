FROM public.ecr.aws/lambda/python:3.12

# Copy just the requirements.txt first to leverage Docker cache
COPY requirements.txt ${LAMBDA_TASK_ROOT}

# Install Python dependencies
RUN pip install -r ${LAMBDA_TASK_ROOT}/requirements.txt

# Copy the rest of your code
COPY . ${LAMBDA_TASK_ROOT}

CMD ["lambda_function.lambda_handler"]