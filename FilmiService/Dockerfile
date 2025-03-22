FROM python:3.10

WORKDIR /app
COPY . .

RUN pip install grpcio grpcio-tools sqlite3
CMD ["python", "server.py"]

