import requests
import json
address = "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
url = f'https://blockstream.info/api/address/{address}'
url_txs = f'https://blockstream.info/api/address/{address}/txs'
response = requests.get(url)

if response.status_code==200:
    data = response.json()
    address = data.get("address", "")
    chain_stats = data.get('chain_stats',"")
    mempool_stats = data.get("mempool_stats","")
    if chain_stats:
        for stats in chain_stats:
            print(f'Data for chain stats: {stats} and its value: {chain_stats.get(stats,"")}')
    if mempool_stats:
        for stats in mempool_stats:
            print(f'Data for mempool: {stats} and its value: {mempool_stats.get(stats,"")}')
    #print(data)
    funded = chain_stats.get("funded_txo_sum", 0)
    spent = chain_stats.get("spent_txo_sum",0)
    if isinstance(funded,int) and isinstance(spent,int):
        balance_sats = funded - spent
        balance_bitcoin = balance_sats /100_000_000
        print(f"Balance in bitcoin: {balance_bitcoin}")
    else:
        print(f'Error recieving funded or spent data types')
    #print(json.dumps(data,indent=2))
else:
    print("Error getting test data")
    
 
response = requests.get(url_txs)
if response.status_code==200:
    txs = response.json()
    #print(json.dumps(txs[0], indent=2))
    bitcoin_value = txs[0].get("vout",{})[0].get("value",0) / 100_000_000 * 70_000
    #print(bitcoin_value)
    
    
    
def get_wallet_summary(address: str)-> dict:
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
        print(f'Confirmed bitcoin amount: {balance_bitcoin_confirmed}')
        #compute same logic for mempool
        funded_mempool = mempool_stats.get("funded_txo_sum", 0)
        spent_mempool = mempool_stats.get("spent_txo_sum",0)
        balance_sats_mempool = funded_mempool - spent_mempool
        balance_bitcoin_unconfirmed= balance_sats_mempool /100_000_000
        print(f'Unconfirmed bitcoin amount: {balance_bitcoin_unconfirmed}')
        #=================#
    transaction_url = f'https://blockstream.info/api/address/{address}/txs'
    transactions = requests.get(transaction_url)
    wallet_transactions=[]
    if transactions.status_code==200:
        data = transactions.json()
        wallet_transactions = data[:10]
        print(data[0].keys())
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
            
            if input.get('prevout').get('scriptpubkey_address')==address:
                value_for_address_vin+= input['prevout']['value']
        net = value_for_address_vout - value_for_address_vin
        final_wallet.append({'txid': tx['txid'],'incoming':value_for_address_vout,'outgoing':value_for_address_vin,'net':net,})
    print(final_wallet)        
    print(value_for_address_vin)
    print(value_for_address_vout)
get_wallet_summary(address)  
    