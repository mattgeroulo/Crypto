from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import logging
import time
import requests
from pydantic import BaseModel
app = FastAPI()

logger = logging.getLogger('uvicorn')
host="0.0.0.0"
port = 8000

class TileRequest(BaseModel):
    text:str


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
def get_wallet(address: str)->list:
    
    return get_wallet_summary(address)

@app.post("/tile_click")
def tile_click(body: TileRequest):
    floors={"Floor 1":[{"text":"Test Floor 1", "isVisible":True},{"text":"F1 autostore", "isVisible":True}],
            "Floor 2":[{"text":"Test Floor 2", "isVisible":True}], 
            "Floor 3":[{"text":"Test Floor 3", "isVisible":True}],
            "Ground Floor":[{"text":"Test Ground Floor", "isVisible":True}]}
    return floors[body.text]
@app.get("/getTiles")
def get_tiles():
    return [{"text":"Floor 1", "isVisible":True},{"text":"Floor 2", "isVisible":True},{"text":"Floor 3", "isVisible":True},{"text":"Ground Floor", "isVisible":True}]

def get_wallet_summary(address: str)-> list:
    url =f'https://blockstream.info/api/address/{address}'
    data = requests.get(url)
    if data.status_code ==200:
        response = data.json()
        chain_stats = response.get('chain_stats','')
        mempool_stats = response.get('mempool_stats','')
        funded = chain_stats.get("funded_txo_sum", 0)
        spent = chain_stats.get("spent_txo_sum",0)
        balance_sats = funded - spent
        balance_bitcoin_confirmed = balance_sats /100_000_000
        logger.info(f'Confirmed bitcoin amount: {balance_bitcoin_confirmed}')
        #compute same logic for mempool
        funded_mempool = mempool_stats.get("funded_txo_sum", 0)
        spent_mempool = mempool_stats.get("spent_txo_sum",0)
        balance_sats_mempool = funded_mempool - spent_mempool
        balance_bitcoin_unconfirmed= balance_sats_mempool /100_000_000
        logger.info(f'Unconfirmed bitcoin amount: {balance_bitcoin_unconfirmed}')
        #=================#
    transaction_url = f'https://blockstream.info/api/address/{address}/txs'
    transactions = requests.get(transaction_url)
    wallet_transactions=[]
    if transactions.status_code==200:
        data = transactions.json()
        wallet_transactions = data[:10]
        #print(data[0].keys())
   # print(data[0]["vout"][0])
    #print(data[0]["vin"][0])
    #print(wallet_transactions)

    final_wallet=[] 
    for tx in wallet_transactions:
        value_for_address_vout=0
        value_for_address_vin=0
        for output in tx['vout']:
            
            if output.get('scriptpubkey_address')==address:
                value_for_address_vout +=output['value']     
        for input in tx['vin']:
            prevout = input.get('prevout')
            if prevout and prevout.get('scriptpubkey_address')==address:
                value_for_address_vin+= input['prevout']['value']
        status = tx.get('status',{})
        net = value_for_address_vout - value_for_address_vin
        final_wallet.append({'txid': tx['txid'],'incoming':value_for_address_vout,'outgoing':value_for_address_vin,'net':net, 'status':status})
    logger.info(f'Final Wallet: {final_wallet}')        
    logger.info(f'Value for address vin: {value_for_address_vin}')
    logger.info(f'Value for address vout: {value_for_address_vout}')
    return final_wallet



if __name__ == "__main__":
    uvicorn.run("app:app", host=host, port=port, reload=True)
    