FROM python:3.10

WORKDIR /app
COPY . .

RUN pip install grpcio grpcio-tools

# Expose gRPC port
EXPOSE 50051

CMD ["python", "server.py"]

