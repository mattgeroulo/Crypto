from fastapi import FastAPI, Request
import uvicorn
import logging
import time

app = FastAPI()

logger = logging.getLogger('uvicorn')
host="0.0.0.0"
port = 8000


@app.middleware("http")
async def log_requests(request:Request, call_next):
    logger.info(f'[NETWORK] Server: {request.scope.get('server',"")[0]}:{request.scope.get('server','')[1]}')
    logger.info(f'[NETWORK] Client: {request.scope.get('client',"")[0]}:{request.scope.get('client','')[1]}')
    start_time=time.perf_counter()
    logger.info(f'[MIDDLWARE] {request.method} {request.url.path}')
    
    response = await call_next(request)
    process_time = (time.perf_counter() - start_time) *1000
    logger.info(f'[MIDDLWARE] Method={request.method} | Url Path= {request.url.path} | '
                f'Status Code= {response.status_code} | '
                f'Time elapsed (ms)= {process_time}')
    return response


@app.get("/")
def help():
    #logger.info("User hit api endpoint of '/'")
    return(r"Here are the available endpoints: '/', 'wallet/{address}'")



@app.get("/wallet/{address}")
def get_wallet(address: str)->str:
    
    return address


if __name__ == "__main__":
    uvicorn.run("wallet:app", host=host, port=port, reload=True)
    